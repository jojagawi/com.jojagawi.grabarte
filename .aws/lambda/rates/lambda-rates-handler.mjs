import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

const ratesBucket = process.env.RATES_BUCKET || "dam.inspiraarte.com";
const ratesPrefix = (process.env.RATES_PREFIX || "rates/").replace(/^\/+/, "");
const ratesApiKey = String(process.env.RATES_API_KEY || "").trim();
const googleRecaptchaSecretKey = String(process.env.NEXT_GOOGLE_SECRET_KEY || "").trim();
const recaptchaExpectedAction = "add_client_rate";

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
      return JSON.parse(rawBody);
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

function normalizeInput(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const name = String(payload.name || "").trim();
  const product = String(payload.product || "").trim();
  const description = String(payload.description || "").trim();
  const rating = Number(payload.rating);
  const recaptchaToken = String(payload.recaptchaToken || "").trim();
  const action = String(payload.action || "").trim();

  if (!name || !product || !description) {
    return null;
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return null;
  }

  if (!recaptchaToken || action !== recaptchaExpectedAction) {
    return null;
  }

  return {
    name,
    product,
    description,
    rating,
    recaptchaToken,
    action,
  };
}

async function verifyRecaptchaToken(token, action) {
  if (!googleRecaptchaSecretKey) {
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
  return Number.isFinite(score) && score >= 0.5;
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

  const parsedBody = parseEventBody(event);
  const input = normalizeInput(parsedBody);

  if (!input) {
    return createResponse(400, {
      message: "Payload invalido. Se requiere name, product, description y rating (1-5).",
    });
  }

  const recaptchaValid = await verifyRecaptchaToken(input.recaptchaToken, input.action);
  if (!recaptchaValid) {
    return createResponse(400, {
      message: "La validacion de reCAPTCHA no fue exitosa.",
    });
  }

  const uuid = randomUUID();
  const objectKey = `${ratesPrefix}${uuid}.json`;
  const payload = {
    id: uuid,
    ...input,
    createdAt: new Date().toISOString(),
    status: 0,
    source: "web",
  };

  delete payload.recaptchaToken;
  delete payload.action;

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: ratesBucket,
        Key: objectKey,
          Body: JSON.stringify(payload),
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
    id: uuid,
    bucket: ratesBucket,
    key: objectKey,
  });
}

