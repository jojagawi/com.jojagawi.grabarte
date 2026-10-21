import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  API_CATALOG_PATH,
  API_STATUS_PATH,
  OPENAPI_PATH,
  buildApiCatalog,
  buildApiStatus,
  buildOpenApiSpec,
} from "@/lib/public-api";

// Publica el catálogo de APIs (RFC 9727) y la descripción de los JSON de /mcp/:
//   public/.well-known/api-catalog   linkset que apunta a la especificación, la documentación y el estado
//   public/mcp/openapi.json          OpenAPI 3.1 de los JSON de /mcp/
//   public/mcp/status.json           estado de la API
// S3 no deduce el tipo de api-catalog (no tiene extensión): build.yml lo vuelve a subir como
// application/linkset+json y next.config.ts lo sirve así en dev.

const PUBLIC_DIR = resolve(process.cwd(), "public");
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.inspiraarte.com").replace(/\/+$/u, "");

async function writeJson(path: string, value: unknown): Promise<void> {
  const file = resolve(PUBLIC_DIR, path.replace(/^\/+/u, ""));
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function main(): Promise<void> {
  await Promise.all([
    writeJson(API_CATALOG_PATH, buildApiCatalog(siteUrl)),
    writeJson(OPENAPI_PATH, buildOpenApiSpec(siteUrl)),
    writeJson(API_STATUS_PATH, buildApiStatus()),
  ]);
  console.log(`build:api-catalog: ${API_CATALOG_PATH}, ${OPENAPI_PATH} y ${API_STATUS_PATH} para ${siteUrl}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
