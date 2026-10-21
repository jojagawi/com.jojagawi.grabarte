// API pública de solo lectura: los JSON de /mcp/ que genera `pnpm run build:mcp` (los mismos que
// leen las herramientas WebMCP). De aquí salen el catálogo de APIs (/.well-known/api-catalog,
// RFC 9727), la especificación OpenAPI, la página /datos-para-agentes y la sección de llms.txt.
// Si agregas un JSON en scripts/build-mcp-fallback.ts, agrégalo también aquí.

export const API_CATALOG_PATH = "/.well-known/api-catalog";
export const API_BASE_PATH = "/mcp/";
export const OPENAPI_PATH = "/mcp/openapi.json";
export const API_STATUS_PATH = "/mcp/status.json";
export const API_DOCS_PATH = "/datos-para-agentes/";
export const TOOLS_MANIFEST_PATH = "/mcp/tools.json";
export const API_CATALOG_CONTENT_TYPE = 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"';

type JsonSchema = Record<string, unknown>;

export type PublicDataFile = {
  title: string;
  path: string;
  description: string;
  operationId: string;
  schema: JsonSchema;
};

const nullable = (type: string): JsonSchema => ({ type: [type, "null"] });
const string: JsonSchema = { type: "string" };
const integer: JsonSchema = { type: "integer" };
const stringList: JsonSchema = { type: "array", items: string };

const objectOf = (properties: Record<string, JsonSchema>, required = Object.keys(properties)): JsonSchema => ({
  type: "object",
  properties,
  required,
});

const listOf = (item: JsonSchema): JsonSchema => ({ type: "array", items: item });

export const PUBLIC_DATA_FILES: PublicDataFile[] = [
  {
    title: "Información del negocio",
    path: "/mcp/business-info.json",
    description: "Contacto, ubicación, horarios y redes sociales.",
    operationId: "getBusinessInfo",
    schema: objectOf({
      businessName: string,
      email: string,
      whatsapp: string,
      address: string,
      contactUrl: string,
      schedules: listOf(objectOf({ dayRange: string, hours: string })),
      social: {
        type: "object",
        additionalProperties: nullable("string"),
        description: "Enlaces a redes sociales (instagram, facebook, tiktok, googleBusiness); null si no hay.",
      },
    }),
  },
  {
    title: "Categorías",
    path: "/mcp/categories.json",
    description: "Categorías del catálogo.",
    operationId: "listCategories",
    schema: listOf(objectOf({ id: integer, name: string })),
  },
  {
    title: "Productos",
    path: "/mcp/products.json",
    description: "Diseños publicados con descripción, categorías, precio de referencia y enlace a su ficha.",
    operationId: "listProducts",
    schema: listOf(
      objectOf({
        id: integer,
        idSlug: string,
        name: string,
        description: string,
        categories: stringList,
        reference: string,
        material: nullable("string"),
        suggestedPrice: { type: ["number", "null"], description: "Precio de referencia en MXN." },
        productionTime: nullable("string"),
        shippingTime: nullable("string"),
        dimensions: nullable("string"),
        isCustomizable: { type: "boolean" },
        image: nullable("string"),
        gallery: stringList,
        url: { type: "string", description: "Ruta de la ficha del producto en el sitio." },
      }),
    ),
  },
  {
    title: "Preguntas frecuentes",
    path: "/mcp/faqs.json",
    description: "Preguntas y respuestas sobre pedidos, envíos y pagos.",
    operationId: "listFaqs",
    schema: listOf(objectOf({ question: string, answer: string })),
  },
  {
    title: "Temporadas",
    path: "/mcp/seasons.json",
    description: "Temporadas del año con su guía, categorías y piezas.",
    operationId: "listSeasons",
    schema: listOf(
      objectOf({
        slug: string,
        name: string,
        months: string,
        url: string,
        description: nullable("string"),
        guide: { type: ["string", "null"], description: "Guía de la temporada en Markdown." },
        categories: stringList,
        products: listOf(objectOf({ id: integer, name: string, url: string })),
      }),
    ),
  },
  {
    title: "Materiales",
    path: "/mcp/materials.json",
    description: "Materiales y técnicas, con medidas y precios de referencia.",
    operationId: "getMaterialsGuide",
    schema: objectOf({
      definitions: stringList,
      materials: listOf(
        objectOf({ name: string, definition: string, technique: string, bestFor: string, catalogCount: integer }),
      ),
      sizeReferences: listOf(
        objectOf({ name: string, url: string, dimensions: string, suggestedPrice: { type: ["number", "null"] } }),
      ),
    }),
  },
  {
    title: "Calificaciones",
    path: "/mcp/reviews.json",
    description: "Opiniones aprobadas de clientes.",
    operationId: "listReviews",
    schema: listOf(
      objectOf({
        name: string,
        product: string,
        rating: { type: "integer", minimum: 1, maximum: 5 },
        comment: string,
        productId: nullable("integer"),
        createdAt: { type: "string", format: "date-time" },
      }),
    ),
  },
];

const API_TITLE = "API pública de InspiraArte";
const API_DESCRIPTION =
  "Datos públicos del taller InspiraArte (corte y grabado láser en Ciudad de México) en JSON de solo lectura: " +
  "catálogo, temporadas, materiales, preguntas frecuentes, calificaciones y contacto. Son archivos estáticos que " +
  "se regeneran en cada publicación del sitio; no requieren autenticación. Para cotizar, usa el formulario de /contacto/.";

export function buildApiStatus() {
  return { status: "pass", description: "Los JSON de la API pública se publicaron con el sitio." };
}

export function buildOpenApiSpec(siteUrl: string) {
  const paths = Object.fromEntries(
    [
      ...PUBLIC_DATA_FILES,
      {
        title: "Herramientas WebMCP",
        path: TOOLS_MANIFEST_PATH,
        description: "Definiciones de las herramientas que el sitio registra en document.modelContext (WebMCP).",
        operationId: "getWebMcpTools",
        schema: { type: "object" },
      },
    ].map((file) => [
      file.path,
      {
        get: {
          operationId: file.operationId,
          summary: file.title,
          description: file.description,
          responses: {
            "200": {
              description: file.title,
              content: { "application/json": { schema: file.schema } },
            },
          },
        },
      },
    ]),
  );

  paths[API_STATUS_PATH] = {
    get: {
      operationId: "getStatus",
      summary: "Estado",
      description: "Responde 200 con status \"pass\" cuando la API está publicada.",
      responses: {
        "200": {
          description: "Estado de la API",
          content: {
            "application/json": {
              schema: objectOf({ status: { type: "string", enum: ["pass", "warn", "fail"] }, description: string }, ["status"]),
            },
          },
        },
      },
    },
  };

  return {
    openapi: "3.1.0",
    info: {
      title: API_TITLE,
      version: "1.0.0",
      description: API_DESCRIPTION,
      contact: { name: "InspiraArte", url: `${siteUrl}/contacto/`, email: "contacto@inspiraarte.com" },
    },
    externalDocs: { description: "Documentación", url: `${siteUrl}${API_DOCS_PATH}` },
    servers: [{ url: siteUrl }],
    // Pública: sin autenticación.
    security: [],
    paths,
  };
}

// Cabecera Link (RFC 8288, RFC 9727 §3) de la home. En producción la pone una regla de
// Cloudflare (scripts/cloudflare-link-headers.ts); en dev, next.config.ts.
export function buildHomeLinkHeader(siteUrl: string): string {
  return [
    `<${siteUrl}${API_CATALOG_PATH}>; rel="api-catalog"; type="application/linkset+json"`,
    `<${siteUrl}${OPENAPI_PATH}>; rel="service-desc"; type="application/vnd.oai.openapi+json"`,
    `<${siteUrl}${API_DOCS_PATH}>; rel="service-doc"; type="text/html"`,
    `<${siteUrl}/llms.txt>; rel="describedby"; type="text/plain"`,
  ].join(", ");
}

// Formato Linkset (RFC 9264) con las relaciones que pide RFC 9727.
export function buildApiCatalog(siteUrl: string) {
  return {
    linkset: [
      {
        anchor: `${siteUrl}${API_BASE_PATH}`,
        "service-desc": [{ href: `${siteUrl}${OPENAPI_PATH}`, type: "application/vnd.oai.openapi+json;version=3.1" }],
        "service-doc": [{ href: `${siteUrl}${API_DOCS_PATH}`, type: "text/html", hreflang: ["es"] }],
        status: [{ href: `${siteUrl}${API_STATUS_PATH}`, type: "application/json" }],
      },
    ],
  };
}
