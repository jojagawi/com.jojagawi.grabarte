import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { randomUUID } from "node:crypto";

// Solicitudes de cotización del sitio (/contacto).
// Dos acciones en la misma Function URL:
//   - contact_upload: entrega URLs firmadas (POST) para subir adjuntos directo a S3.
//   - contact_submit: guarda la solicitud en S3 y avisa en HubSpot y Slack.
// S3 es la fuente de verdad: si HubSpot o Slack fallan, la solicitud ya quedó guardada.

const region = process.env.AWS_REGION;
// El bucket lleva puntos (dam.inspiraarte.com): con estilo "virtual host" el certificado
// HTTPS no coincide, así que las URLs firmadas usan estilo de ruta.
const s3Client = new S3Client({ region, forcePathStyle: true });

const contactBucket = process.env.CONTACT_BUCKET || "dam.inspiraarte.com";
const contactPrefix = (process.env.CONTACT_PREFIX || "contact/").replace(/^\/+/, "");
const contactApiKey = String(process.env.CONTACT_API_KEY || "").trim();
const googleRecaptchaSecretKey = String(process.env.NEXT_GOOGLE_SECRET_KEY || "").trim();
const hubspotToken = String(process.env.HUBSPOT_API || "").trim();
const slackWebhookUrl = String(process.env.SLACK_WEBHOOK_URL || "").trim();

const RECAPTCHA_MIN_SCORE = 0.5;
const UPLOAD_ACTION = "contact_upload";
const SUBMIT_ACTION = "contact_submit";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);
const UPLOAD_URL_TTL_SECONDS = 600;

const OCCASIONS = new Set(["Cumpleaños", "Aniversario", "Boda", "Graduación", "Corporación", "Otra"]);
const PRODUCT_TYPES = new Set(["Termos", "Llaveros", "Placas", "Objetos MDF", "Otro"]);

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

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
      const text = event.isBase64Encoded ? Buffer.from(rawBody, "base64").toString("utf8") : rawBody;
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  return typeof rawBody === "object" ? rawBody : null;
}

function readApiKeyFromHeaders(event) {
  const headers = event?.headers;
  if (!headers || typeof headers !== "object") {
    return "";
  }

  const raw = headers["x-api-key"] ?? headers["X-Api-Key"] ?? headers["X-API-KEY"];
  return String(raw || "").trim();
}

function text(value, maxLength) {
  return String(value ?? "").trim().slice(0, maxLength);
}

async function verifyRecaptchaToken(token, action) {
  if (!googleRecaptchaSecretKey || !token) {
    return false;
  }

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ secret: googleRecaptchaSecretKey, response: token }).toString(),
  });

  if (!response.ok) {
    return false;
  }

  const payload = await response.json().catch(() => null);
  if (!payload || payload.success !== true || payload.action !== action) {
    return false;
  }

  const score = Number(payload.score ?? 0);
  return Number.isFinite(score) && score >= RECAPTCHA_MIN_SCORE;
}

// Nombre de archivo seguro para la llave de S3; conserva la extensión.
function safeFileName(name) {
  const cleaned = String(name || "archivo")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+/, "")
    .slice(-80);
  return cleaned || "archivo";
}

function uploadsPrefix(requestId) {
  return `${contactPrefix}uploads/${requestId}/`;
}

// --- contact_upload ---------------------------------------------------------

function normalizeUploadInput(payload) {
  const files = Array.isArray(payload?.files) ? payload.files : null;
  if (!files || files.length === 0 || files.length > MAX_FILES) {
    return null;
  }

  const normalized = files.map((file) => ({
    name: text(file?.name, 200),
    type: text(file?.type, 100),
    size: Number(file?.size),
  }));

  const valid = normalized.every(
    (file) =>
      file.name &&
      ALLOWED_FILE_TYPES.has(file.type) &&
      Number.isInteger(file.size) &&
      file.size > 0 &&
      file.size <= MAX_FILE_BYTES,
  );

  return valid ? normalized : null;
}

async function handleUpload(payload) {
  const files = normalizeUploadInput(payload);
  if (!files) {
    return createResponse(400, {
      message: `Archivos invalidos. Se permiten hasta ${MAX_FILES} archivos JPG, PNG o PDF de 10 MB como maximo.`,
    });
  }

  if (!(await verifyRecaptchaToken(text(payload.recaptchaToken, 4000), UPLOAD_ACTION))) {
    return createResponse(400, { message: "La validacion de reCAPTCHA no fue exitosa." });
  }

  const requestId = randomUUID();
  const uploads = await Promise.all(
    files.map(async (file, index) => {
      const key = `${uploadsPrefix(requestId)}${index + 1}-${safeFileName(file.name)}`;
      // La política firmada limita tamaño y tipo: S3 rechaza lo que no coincida.
      const { url, fields } = await createPresignedPost(s3Client, {
        Bucket: contactBucket,
        Key: key,
        Conditions: [
          ["content-length-range", 1, MAX_FILE_BYTES],
          ["eq", "$Content-Type", file.type],
        ],
        Fields: { "Content-Type": file.type },
        Expires: UPLOAD_URL_TTL_SECONDS,
      });
      return { key, url, fields };
    }),
  );

  return createResponse(200, { requestId, uploads });
}

// --- contact_submit ---------------------------------------------------------

function normalizeSubmitInput(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const name = text(payload.name, 120);
  const email = text(payload.email, 254).toLowerCase();
  const details = text(payload.details, 2000);

  if (!name || !EMAIL_PATTERN.test(email) || !details) {
    return null;
  }

  const occasion = text(payload.occasion, 40);
  const productType = text(payload.productType, 40);
  const neededBy = text(payload.neededBy, 10);
  const requestId = text(payload.requestId, 36);

  return {
    requestId: UUID_PATTERN.test(requestId) ? requestId : null,
    name,
    email,
    phone: text(payload.phone, 40),
    occasion: OCCASIONS.has(occasion) ? occasion : "",
    productType: PRODUCT_TYPES.has(productType) ? productType : "",
    requestedProduct: text(payload.requestedProduct, 200),
    quantity: text(payload.quantity, 40),
    neededBy: DATE_PATTERN.test(neededBy) ? neededBy : "",
    details,
    attachmentKeys: Array.isArray(payload.attachmentKeys)
      ? payload.attachmentKeys.map((key) => text(key, 400)).slice(0, MAX_FILES)
      : [],
    pageUrl: text(payload.pageUrl, 500),
  };
}

// Solo se aceptan llaves bajo el prefijo de esta solicitud y que de verdad se subieron.
async function confirmAttachments(requestId, keys) {
  if (!requestId || keys.length === 0) {
    return [];
  }

  const prefix = uploadsPrefix(requestId);
  const candidates = [...new Set(keys)].filter((key) => key.startsWith(prefix) && !key.includes(".."));
  const checks = await Promise.all(
    candidates.map(async (key) => {
      try {
        await s3Client.send(new HeadObjectCommand({ Bucket: contactBucket, Key: key }));
        return key;
      } catch {
        return null;
      }
    }),
  );
  return checks.filter(Boolean);
}

function s3ConsoleUrl(key) {
  return `https://s3.console.aws.amazon.com/s3/object/${contactBucket}?region=${region}&prefix=${encodeURIComponent(key)}`;
}

function fileNameFromKey(key) {
  return key.split("/").pop() || key;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Slack mrkdwn solo requiere escapar &, < y >.
function escapeSlack(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function summaryRows(request) {
  return [
    ["Producto", request.requestedProduct],
    ["Tipo de producto", request.productType],
    ["Ocasión", request.occasion],
    ["Cantidad", request.quantity],
    ["Lo necesita para", request.neededBy],
    ["Teléfono / WhatsApp", request.phone],
  ].filter(([, value]) => value);
}

async function upsertHubspotContact(request) {
  const [firstname, ...rest] = request.name.split(/\s+/);
  const properties = { email: request.email, firstname };
  if (rest.length > 0) {
    properties.lastname = rest.join(" ");
  }
  if (request.phone) {
    properties.phone = request.phone;
  }

  const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${hubspotToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: [{ idProperty: "email", id: request.email, properties }] }),
  });

  if (!response.ok) {
    throw new Error(`HubSpot contacto ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json();
  const contactId = payload?.results?.[0]?.id;
  if (!contactId) {
    throw new Error("HubSpot no devolvio el id del contacto.");
  }
  return contactId;
}

async function createHubspotNote(contactId, request, record) {
  const rows = summaryRows(request)
    .map(([label, value]) => `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`)
    .join("");
  const attachments = record.attachments
    .map((key) => `<li><a href="${escapeHtml(s3ConsoleUrl(key))}">${escapeHtml(fileNameFromKey(key))}</a></li>`)
    .join("");

  const body = [
    "<p><strong>Solicitud de cotización desde el sitio</strong></p>",
    rows ? `<ul>${rows}</ul>` : "",
    `<p>${escapeHtml(request.details).replace(/\n/g, "<br>")}</p>`,
    attachments ? `<p><strong>Archivos de referencia (S3):</strong></p><ul>${attachments}</ul>` : "",
    `<p>ID: ${escapeHtml(record.id)}</p>`,
  ].join("");

  const response = await fetch("https://api.hubapi.com/crm/v3/objects/notes", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${hubspotToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: { hs_timestamp: record.createdAt, hs_note_body: body },
      associations: [
        {
          to: { id: contactId },
          // 202 = nota → contacto (asociación predeterminada de HubSpot).
          types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`HubSpot nota ${response.status}: ${await response.text()}`);
  }
}

async function notifyHubspot(request, record) {
  if (!hubspotToken) {
    return "omitido (sin HUBSPOT_API)";
  }
  const contactId = await upsertHubspotContact(request);
  await createHubspotNote(contactId, request, record);
  return `contacto ${contactId}`;
}

async function notifySlack(request, record) {
  if (!slackWebhookUrl) {
    return "omitido (sin SLACK_WEBHOOK_URL)";
  }

  const fields = [
    `*Nombre:*\n${escapeSlack(request.name)}`,
    `*Email:*\n${escapeSlack(request.email)}`,
    ...summaryRows(request).map(([label, value]) => `*${label}:*\n${escapeSlack(value)}`),
  ].map((textValue) => ({ type: "mrkdwn", text: textValue }));

  const blocks = [
    { type: "header", text: { type: "plain_text", text: "Nueva solicitud de cotización" } },
    // Slack admite hasta 10 campos por sección.
    { type: "section", fields: fields.slice(0, 10) },
    { type: "section", text: { type: "mrkdwn", text: `*Detalles:*\n${escapeSlack(request.details).slice(0, 2900)}` } },
  ];

  if (record.attachments.length > 0) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Archivos (${record.attachments.length}):*\n${record.attachments
          .map((key) => `• <${s3ConsoleUrl(key)}|${escapeSlack(fileNameFromKey(key))}>`)
          .join("\n")}`,
      },
    });
  }

  blocks.push({
    type: "context",
    elements: [{ type: "mrkdwn", text: `ID ${record.id} · ${escapeSlack(request.pageUrl || "sitio web")}` }],
  });

  const response = await fetch(slackWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: `Nueva solicitud de cotización de ${request.name}`, blocks }),
  });

  if (!response.ok) {
    throw new Error(`Slack ${response.status}: ${await response.text()}`);
  }
  return "enviado";
}

async function handleSubmit(payload) {
  const request = normalizeSubmitInput(payload);
  if (!request) {
    return createResponse(400, {
      message: "Datos invalidos. Revisa nombre, email y detalles de tu solicitud.",
    });
  }

  if (!(await verifyRecaptchaToken(text(payload.recaptchaToken, 4000), SUBMIT_ACTION))) {
    return createResponse(400, { message: "La validacion de reCAPTCHA no fue exitosa." });
  }

  const id = request.requestId ?? randomUUID();
  const attachments = await confirmAttachments(request.requestId, request.attachmentKeys);

  const record = {
    id,
    name: request.name,
    email: request.email,
    phone: request.phone,
    occasion: request.occasion,
    productType: request.productType,
    requestedProduct: request.requestedProduct,
    quantity: request.quantity,
    neededBy: request.neededBy,
    details: request.details,
    pageUrl: request.pageUrl,
    attachments,
    createdAt: new Date().toISOString(),
    status: 0,
    source: "web",
  };

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: contactBucket,
        Key: `${contactPrefix}requests/${id}.json`,
        Body: JSON.stringify(record),
        ContentType: "application/json",
        CacheControl: "no-store",
      }),
    );
  } catch (error) {
    console.error("No fue posible guardar la solicitud en S3", error);
    return createResponse(500, { message: "No fue posible guardar tu solicitud. Intenta de nuevo." });
  }

  // Los avisos no bloquean la respuesta al cliente: la solicitud ya quedó en S3.
  const [hubspot, slack] = await Promise.allSettled([notifyHubspot(request, record), notifySlack(request, record)]);
  for (const [service, result] of [
    ["HubSpot", hubspot],
    ["Slack", slack],
  ]) {
    if (result.status === "rejected") {
      console.error(`Aviso a ${service} fallido para la solicitud ${id}`, result.reason);
    } else {
      console.log(`Aviso a ${service} para la solicitud ${id}: ${result.value}`);
    }
  }

  return createResponse(201, { message: "Solicitud recibida", id });
}

export async function handler(event) {
  if (contactApiKey) {
    const requestApiKey = readApiKeyFromHeaders(event);
    if (!requestApiKey || requestApiKey !== contactApiKey) {
      return createResponse(403, { message: "Forbidden" });
    }
  }

  const payload = parseEventBody(event);
  switch (payload?.action) {
    case UPLOAD_ACTION:
      return handleUpload(payload);
    case SUBMIT_ACTION:
      return handleSubmit(payload);
    default:
      return createResponse(400, { message: "Accion invalida." });
  }
}
