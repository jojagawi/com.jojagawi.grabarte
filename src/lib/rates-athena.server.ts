import {
  AthenaClient,
  GetQueryExecutionCommand,
  GetQueryResultsCommand,
  QueryExecutionState,
  StartQueryExecutionCommand,
} from "@aws-sdk/client-athena";
import { getRateImageUrl } from "@/lib/rate-image";

type PublicTestimonialItem = {
  id: string;
  name: string;
  product: string;
  content: string;
  rating: number;
  role: string;
  hasImage: boolean;
  image: string | null;
};

export type SiteRateItem = {
  id: string;
  name: string;
  product: string;
  description: string;
  rating: number;
  designId: number | null;
  hasImage: boolean;
  image: string | null;
  createdAt: string;
  status: number;
  source: string;
  s3Path: string;
  s3Key: string;
};

export type ProductRateItem = {
  id: string;
  name: string;
  description: string;
  rating: number;
  hasImage: boolean;
  image: string | null;
  createdAt: string;
};

const POLL_INTERVAL_MS = 750;
const MAX_POLL_ATTEMPTS = 30;
const DEV_TESTIMONIALS_TTL_MS = 1000 * 60 * 10;

const devTestimonialsCache = {
  expiresAt: 0,
  data: [] as PublicTestimonialItem[],
};

type AthenaRow = {
  Data?: Array<{ VarCharValue?: string }>;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseNumber(value: string | undefined) {
  const parsed = Number(value ?? "");
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeRating(value: number) {
  return Math.max(1, Math.min(5, Math.round(value || 0)));
}

function toFieldValue(value: string | undefined) {
  return String(value ?? "").trim();
}

// Athena devuelve los booleanos como "true"/"false"; nulo (calificaciones anteriores) es false.
function parseBoolean(value: string | undefined) {
  return toFieldValue(value).toLowerCase() === "true";
}

function toRateImage(id: string, hasImage: boolean) {
  return hasImage && id ? getRateImageUrl(id) : null;
}

function parseDesignId(value: string | undefined) {
  const designId = Number(toFieldValue(value));
  return Number.isInteger(designId) && designId > 0 ? designId : null;
}

function getRatesTableName() {
  const database = process.env.NEXT_AWS_ATHENA_RATES_DATABASE || "inspiraarte_rates";
  const table = process.env.NEXT_AWS_ATHENA_RATES_TABLE || "rates";
  return `${database}.${table}`;
}

function s3KeyFromPath(path: string) {
  const normalizedPath = path.trim();
  if (!normalizedPath.startsWith("s3://")) return "";

  const firstSlash = normalizedPath.indexOf("/", 5);
  if (firstSlash < 0) return "";
  return normalizedPath.slice(firstSlash + 1);
}

function createAthenaClient() {
  const region = process.env.NEXT_AWS_REGION || process.env.AWS_REGION;
  const accessKeyId = process.env.NEXT_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_AWS_SECRET_ACCESS_KEY;

  if (!region) {
    throw new Error("Missing AWS region for Athena queries.");
  }

  if (accessKeyId && secretAccessKey) {
    return new AthenaClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return new AthenaClient({
    region,
  });
}

// También la usa contacts-athena.server.ts: comparten workgroup y base de datos.
export async function executeAthenaQuery(query: string) {
  const client = createAthenaClient();
  const workGroup = process.env.NEXT_AWS_ATHENA_WORKGROUP || "inspiraarte-prod-rates";

  const startResponse = await client.send(
    new StartQueryExecutionCommand({
      WorkGroup: workGroup,
      QueryString: query,
    }),
  );

  const queryExecutionId = startResponse.QueryExecutionId;
  if (!queryExecutionId) {
    throw new Error("Athena did not return a QueryExecutionId.");
  }

  let queryState: QueryExecutionState | undefined;

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const executionResponse = await client.send(
      new GetQueryExecutionCommand({ QueryExecutionId: queryExecutionId }),
    );

    queryState = executionResponse.QueryExecution?.Status?.State;

    if (queryState === QueryExecutionState.SUCCEEDED) {
      break;
    }

    if (
      queryState === QueryExecutionState.FAILED ||
      queryState === QueryExecutionState.CANCELLED
    ) {
      const reason =
        executionResponse.QueryExecution?.Status?.StateChangeReason ||
        "Athena query failed.";
      throw new Error(reason);
    }

    await wait(POLL_INTERVAL_MS);
  }

  if (queryState !== QueryExecutionState.SUCCEEDED) {
    throw new Error("Athena query timeout.");
  }

  const resultsResponse = await client.send(
    new GetQueryResultsCommand({ QueryExecutionId: queryExecutionId }),
  );

  return (resultsResponse.ResultSet?.Rows ?? []).slice(1) as AthenaRow[];
}

export async function getLatestRatesFromAthena(limit = 100): Promise<SiteRateItem[]> {
  const query = [
    "SELECT id, name, product, description, rating, createdat, coalesce(status, 0) AS status, source, \"$path\" AS s3_path, designid, hasimage",
    `FROM ${getRatesTableName()}`,
    "ORDER BY from_iso8601_timestamp(createdat) DESC",
    `LIMIT ${Math.max(1, Math.min(500, Math.floor(limit)))}`,
  ].join(" ");

  const dataRows = await executeAthenaQuery(query);

  return dataRows.map((row) => {
    const cols = row.Data ?? [];
    const path = toFieldValue(cols[8]?.VarCharValue);
    const id = toFieldValue(cols[0]?.VarCharValue);
    const hasImage = parseBoolean(cols[10]?.VarCharValue);

    return {
      id,
      name: toFieldValue(cols[1]?.VarCharValue),
      product: toFieldValue(cols[2]?.VarCharValue),
      description: toFieldValue(cols[3]?.VarCharValue),
      rating: parseNumber(cols[4]?.VarCharValue),
      designId: parseDesignId(cols[9]?.VarCharValue),
      hasImage,
      image: toRateImage(id, hasImage),
      createdAt: toFieldValue(cols[5]?.VarCharValue),
      status: parseNumber(cols[6]?.VarCharValue),
      source: toFieldValue(cols[7]?.VarCharValue),
      s3Path: path,
      s3Key: s3KeyFromPath(path),
    };
  });
}

export async function getRandomHomeTestimonialsFromAthena(limit = 4): Promise<PublicTestimonialItem[]> {
  if (process.env.NODE_ENV === "development") {
    const now = Date.now();
    if (devTestimonialsCache.expiresAt > now && devTestimonialsCache.data.length > 0) {
      return devTestimonialsCache.data;
    }
  }

  const query = [
    "SELECT id, name, product, description, rating, hasimage",
    `FROM ${getRatesTableName()}`,
    "WHERE coalesce(status, 0) = 1",
    "  AND trim(coalesce(name, '')) <> ''",
    "  AND trim(coalesce(description, '')) <> ''",
    "ORDER BY rand()",
    `LIMIT ${Math.max(1, Math.min(4, Math.floor(limit)))}`,
  ].join(" ");

  const rows = await executeAthenaQuery(query);
  const mapped = rows.map((row) => {
    const cols = row.Data ?? [];
    const id = toFieldValue(cols[0]?.VarCharValue);
    const hasImage = parseBoolean(cols[5]?.VarCharValue);
    return {
      id,
      name: toFieldValue(cols[1]?.VarCharValue),
      product: toFieldValue(cols[2]?.VarCharValue),
      content: toFieldValue(cols[3]?.VarCharValue),
      rating: normalizeRating(parseNumber(cols[4]?.VarCharValue)),
      role: "Cliente",
      hasImage,
      image: toRateImage(id, hasImage),
    };
  });

  if (process.env.NODE_ENV === "development") {
    devTestimonialsCache.data = mapped;
    devTestimonialsCache.expiresAt = Date.now() + DEV_TESTIMONIALS_TTL_MS;
  }

  return mapped;
}



// Una sola consulta cada 10 minutos (y por build): todas las fichas de producto la comparten.
// Los errores también se guardan, para no esperar a Athena en cada ficha mientras falle.
const PRODUCT_RATES_TTL_MS = 1000 * 60 * 10;
const productRatesCache = {
  expiresAt: 0,
  promise: null as Promise<Map<number, ProductRateItem[]>> | null,
};

// Calificaciones aprobadas (status 1) ligadas a un diseño con ?id= en el formulario, por designId.
export function getApprovedProductRatesFromAthena(): Promise<Map<number, ProductRateItem[]>> {
  if (productRatesCache.promise && productRatesCache.expiresAt > Date.now()) {
    return productRatesCache.promise;
  }

  productRatesCache.expiresAt = Date.now() + PRODUCT_RATES_TTL_MS;
  productRatesCache.promise = (async () => {
    const query = [
      "SELECT id, name, description, rating, createdat, designid, hasimage",
      `FROM ${getRatesTableName()}`,
      "WHERE coalesce(status, 0) = 1",
      "  AND designid IS NOT NULL",
      "  AND trim(coalesce(name, '')) <> ''",
      "  AND trim(coalesce(description, '')) <> ''",
      "ORDER BY from_iso8601_timestamp(createdat) DESC",
      "LIMIT 1000",
    ].join(" ");

    const ratesByDesign = new Map<number, ProductRateItem[]>();
    for (const row of await executeAthenaQuery(query)) {
      const cols = row.Data ?? [];
      const designId = parseDesignId(cols[5]?.VarCharValue);
      if (!designId) continue;

      const rates = ratesByDesign.get(designId) ?? [];
      const id = toFieldValue(cols[0]?.VarCharValue);
      const hasImage = parseBoolean(cols[6]?.VarCharValue);
      rates.push({
        id,
        name: toFieldValue(cols[1]?.VarCharValue),
        description: toFieldValue(cols[2]?.VarCharValue),
        rating: normalizeRating(parseNumber(cols[3]?.VarCharValue)),
        hasImage,
        image: toRateImage(id, hasImage),
        createdAt: toFieldValue(cols[4]?.VarCharValue),
      });
      ratesByDesign.set(designId, rates);
    }
    return ratesByDesign;
  })();

  // Sin la columna designid en Athena (o sin credenciales) las fichas salen sin opiniones.
  return productRatesCache.promise;
}
