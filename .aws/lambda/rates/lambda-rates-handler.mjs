import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { randomUUID } from "node:crypto";

// Calificaciones del sitio (/agregar-calificacion). Dos acciones en la misma Function URL:
//   - rate_upload: reserva el id de la calificación y entrega un POST firmado para subir la
//     foto del cliente a imagenes-usuarios/<id>.webp (el navegador ya la convierte a WebP).
//   - add_client_rate: guarda rates/<id>.json. Si trae rateId, confirma que la foto existe y
//     usa ese mismo id, así la foto y la fila de Athena comparten identificador.

// El bucket lleva puntos (dam.inspiraarte.com): con estilo "virtual host" el certificado
// HTTPS no coincide, así que las URLs firmadas usan estilo de ruta.
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  forcePathStyle: true,
});

const ratesBucket = process.env.RATES_BUCKET || "dam.inspiraarte.com";
const ratesPrefix = (process.env.RATES_PREFIX || "rates/").replace(/^\/+/, "");
const imagesPrefix = (process.env.RATES_IMAGES_PREFIX || "imagenes-usuarios/").replace(/^\/+/, "");
const ratesApiKey = String(process.env.RATES_API_KEY || "").trim();
const googleRecaptchaSecretKey = String(process.env.NEXT_GOOGLE_SECRET_KEY || "").trim();

const UPLOAD_ACTION = "rate_upload";
const SUBMIT_ACTION = "add_client_rate";
const RECAPTCHA_MIN_SCORE = 0.5;

// Debe coincidir con MAX_RATE_IMAGE_BYTES de src/components/custom/rate-site-form.tsx.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_CONTENT_TYPE = "image/webp";
const UPLOAD_URL_TTL_SECONDS = 600;
const VERSION_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TERMS_REQUIRED_MESSAGE =
  "Para enviar tu calificacion debes aceptar los terminos y condiciones y el aviso de privacidad.";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function parseEventBody(event) {
  const rawBody = event?.body;
  if (!rawBody) {
    return null;
  }

  if (typeof rawBody === "string") {
    try {
      return JSON.parse(event?.isBase64Encoded ? Buffer.from(rawBody, "base64").toString("utf-8") : rawBody);
    } catch {
      return null;
    }
  }

  if (typeof rawBody === "object") {
    return rawBody;
  }

  return null;
}

function readApiKeyFromHeaders(event) {
  const headers = event?.headers;
  if (!headers || typeof headers !== "object") {
    return "";
  }

  const raw = headers["x-api-key"] ?? headers["X-Api-Key"] ?? headers["X-API-KEY"];
  return String(raw || "").trim();
}

function imageKey(rateId) {
  return `${imagesPrefix}${rateId}.webp`;
}

function rateKey(rateId) {
  return `${ratesPrefix}${rateId}.json`;
}

// Sin s3:ListBucket, S3 responde 403 (no 404) a un objeto inexistente: ambos cuentan como "no existe".
async function objectExists(key) {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: ratesBucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function verifyRecaptchaToken(token, action) {
  if (!googleRecaptchaSecretKey || !token) {
    return false;
  }

  const params = new URLSearchParams({
    secret: googleRecaptchaSecretKey,
    response: token,
  });

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    return false;
  }

  const payload = await response.json().catch(() => null);
  if (!payload || payload.success !== true) {
    return false;
  }

  if (payload.action !== action) {
    return false;
  }

  const score = Number(payload.score ?? 0);
  return Number.isFinite(score) && score >= RECAPTCHA_MIN_SCORE;
}

// --- rate_upload ------------------------------------------------------------

async function handleUpload(payload) {
  if (payload?.acceptedTerms !== true) {
    return createResponse(400, { message: TERMS_REQUIRED_MESSAGE });
  }

  const size = Number(payload?.size);
  const type = String(payload?.type || "").trim();
  if (type !== IMAGE_CONTENT_TYPE || !Number.isInteger(size) || size <= 0 || size > MAX_IMAGE_BYTES) {
    return createResponse(400, {
      message: "La foto debe ser una imagen de 5 MB como máximo.",
    });
  }

  if (!(await verifyRecaptchaToken(String(payload.recaptchaToken || "").trim(), UPLOAD_ACTION))) {
    return createResponse(400, {
      message: "La validacion de reCAPTCHA no fue exitosa.",
    });
  }

  const rateId = randomUUID();
  const key = imageKey(rateId);
  // La política firmada fija llave, tipo y tamaño: S3 rechaza lo que no coincida.
  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: ratesBucket,
    Key: key,
    Conditions: [
      ["content-length-range", 1, MAX_IMAGE_BYTES],
      ["eq", "$Content-Type", IMAGE_CONTENT_TYPE],
    ],
    Fields: { "Content-Type": IMAGE_CONTENT_TYPE },
    Expires: UPLOAD_URL_TTL_SECONDS,
  });

  return createResponse(200, { rateId, key, url, fields });
}

// --- add_client_rate --------------------------------------------------------

// Id del diseño calificado (Designs.id). Opcional: sin él la calificación es del sitio.
function normalizeDesignId(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const designId = Number(value);
  return Number.isInteger(designId) && designId > 0 && designId <= 2147483647 ? designId : undefined;
}

function normalizeSubmitInput(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const name = String(payload.name || "").trim();
  const product = String(payload.product || "").trim();
  const description = String(payload.description || "").trim();
  const rating = Number(payload.rating);
  const designId = normalizeDesignId(payload.designId);
  const rateId = String(payload.rateId || "").trim();
  const privacyNoticeVersion = String(payload.privacyNoticeVersion || "").trim();
  const termsVersion = String(payload.termsVersion || "").trim();

  if (!name || !product || !description) {
    return null;
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return null;
  }

  if (designId === undefined || (rateId && !UUID_PATTERN.test(rateId))) {
    return null;
  }

  return {
    name,
    product,
    description,
    rating,
    designId,
    rateId: rateId || null,
    acceptedTerms: payload.acceptedTerms === true,
    privacyNoticeVersion: VERSION_PATTERN.test(privacyNoticeVersion) ? privacyNoticeVersion : null,
    termsVersion: VERSION_PATTERN.test(termsVersion) ? termsVersion : null,
    recaptchaToken: String(payload.recaptchaToken || "").trim(),
  };
}

async function handleSubmit(payload) {
  const input = normalizeSubmitInput(payload);
  if (!input) {
    return createResponse(400, {
      message:
        "Payload invalido. Se requiere name, product, description y rating (1-5); designId y rateId son opcionales.",
    });
  }

  // Consentimiento obligatorio: términos y aviso de privacidad (casilla del formulario).
  if (!input.acceptedTerms) {
    return createResponse(400, { message: TERMS_REQUIRED_MESSAGE });
  }

  if (!(await verifyRecaptchaToken(input.recaptchaToken, SUBMIT_ACTION))) {
    return createResponse(400, {
      message: "La validacion de reCAPTCHA no fue exitosa.",
    });
  }

  // Con rateId, la foto ya debe estar en S3 y el id no puede pisar otra calificación.
  if (input.rateId) {
    const [hasImage, alreadySaved] = await Promise.all([
      objectExists(imageKey(input.rateId)),
      objectExists(rateKey(input.rateId)),
    ]);

    if (!hasImage) {
      return createResponse(400, {
        message: "No encontramos tu foto. Vuelve a subirla e intenta de nuevo.",
      });
    }

    if (alreadySaved) {
      return createResponse(409, {
        message: "Esta calificacion ya fue registrada.",
      });
    }
  }

  const id = input.rateId || randomUUID();
  const objectKey = rateKey(id);
  const createdAt = new Date().toISOString();
  const record = {
    id,
    name: input.name,
    product: input.product,
    description: input.description,
    rating: input.rating,
    ...(input.designId ? { designId: input.designId } : {}),
    hasImage: Boolean(input.rateId),
    // Constancia del consentimiento (aviso de privacidad, sección 4).
    acceptedTerms: true,
    acceptedTermsAt: createdAt,
    privacyNoticeVersion: input.privacyNoticeVersion,
    termsVersion: input.termsVersion,
    createdAt,
    status: 0,
    source: "web",
  };

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: ratesBucket,
        Key: objectKey,
        Body: JSON.stringify(record),
        ContentType: "application/json",
        CacheControl: "no-store",
      }),
    );
  } catch {
    return createResponse(500, {
      message: "No fue posible guardar la calificacion en S3.",
    });
  }

  return createResponse(201, {
    message: "Calificacion guardada",
    id,
    bucket: ratesBucket,
    key: objectKey,
    hasImage: record.hasImage,
  });
}

export async function handler(event) {
  if (ratesApiKey) {
    const requestApiKey = readApiKeyFromHeaders(event);
    if (!requestApiKey || requestApiKey !== ratesApiKey) {
      return createResponse(403, {
        message: "Forbidden",
      });
    }
  }

  const payload = parseEventBody(event);
  const action = String(payload?.action || "").trim();

  if (action === UPLOAD_ACTION) {
    return handleUpload(payload);
  }

  if (action === SUBMIT_ACTION) {
    return handleSubmit(payload);
  }

  return createResponse(400, {
    message: "Accion invalida.",
  });
}
