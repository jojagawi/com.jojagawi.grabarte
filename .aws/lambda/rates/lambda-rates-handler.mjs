import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

const ratesBucket = process.env.RATES_BUCKET || "dam.inspiraarte.com";
const ratesPrefix = (process.env.RATES_PREFIX || "rates/").replace(/^\/+/, "");
const ratesApiKey = String(process.env.RATES_API_KEY || "").trim();

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

  if (!name || !product || !description) {
    return null;
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return null;
  }

  return {
    name,
    product,
    description,
    rating,
  };
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

  const uuid = randomUUID();
  const objectKey = `${ratesPrefix}${uuid}.json`;
  const payload = {
    id: uuid,
    ...input,
    createdAt: new Date().toISOString(),
    source: "web",
  };

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: ratesBucket,
        Key: objectKey,
        Body: JSON.stringify(payload, null, 2),
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

