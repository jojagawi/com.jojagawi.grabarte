// API pública de solo lectura: los JSON de /mcp/ que genera `pnpm run build:mcp` (los mismos que
// leen las herramientas WebMCP). De aquí salen el catálogo de APIs (/.well-known/api-catalog,
// RFC 9727), la especificación OpenAPI, /auth.md, la página /datos-para-agentes y la sección de llms.txt.
// Si agregas un JSON en scripts/build-mcp-fallback.ts, agrégalo también aquí.

export const API_CATALOG_PATH = "/.well-known/api-catalog";
export const API_BASE_PATH = "/mcp/";
export const OPENAPI_PATH = "/mcp/openapi.json";
export const API_STATUS_PATH = "/mcp/status.json";
export const API_DOCS_PATH = "/datos-para-agentes/";
export const TOOLS_MANIFEST_PATH = "/mcp/tools.json";
export const AGENT_CARD_PATH = "/.well-known/agent-card.json";
export const AUTH_MD_PATH = "/auth.md";
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

// Agent Card de A2A (https://a2a-protocol.org/latest/specification/) para el descubrimiento entre
// agentes. El sitio es estático: no hay un servicio A2A que reciba mensajes (message:send). La
// interfaz que se anuncia son los JSON de /mcp/ por HTTP GET, y cada habilidad dice qué archivo leer.
type AgentSkill = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  examples: string[];
};

const AGENT_SKILLS: AgentSkill[] = [
  {
    id: "catalog-search",
    name: "Buscar en el catálogo",
    description:
      "Productos de corte y grabado láser con descripción, material, medidas, precio de referencia en MXN, " +
      "tiempos de producción y envío. Lee /mcp/products.json y /mcp/categories.json.",
    tags: ["catálogo", "productos", "grabado láser", "corte láser", "regalos personalizados"],
    examples: ["¿Tienen termos grabados con nombre?", "Muéstrame los recuerdos para boda en MDF."],
  },
  {
    id: "season-guides",
    name: "Guías de temporada",
    description: "Temporadas del año con su guía de compra, fechas para pedir a tiempo y piezas recomendadas. Lee /mcp/seasons.json.",
    tags: ["temporadas", "navidad", "día de muertos", "regreso a clases"],
    examples: ["¿Qué me recomiendan para Navidad y cuándo debo pedir?"],
  },
  {
    id: "materials-guide",
    name: "Materiales y técnicas",
    description: "MDF, acrílico, metal y termos; corte y grabado láser; medidas y precios de referencia. Lee /mcp/materials.json.",
    tags: ["materiales", "MDF", "acrílico", "técnicas"],
    examples: ["¿Qué diferencia hay entre MDF y acrílico?"],
  },
  {
    id: "faq",
    name: "Preguntas frecuentes",
    description: "Pedido mínimo, tiempos, envíos, pagos y garantía. Lee /mcp/faqs.json.",
    tags: ["preguntas frecuentes", "envíos", "pagos"],
    examples: ["¿Hacen envíos a todo México?", "¿Cuál es el pedido mínimo?"],
  },
  {
    id: "reviews",
    name: "Calificaciones de clientes",
    description: "Opiniones aprobadas de clientes, del sitio o de un producto. Lee /mcp/reviews.json.",
    tags: ["opiniones", "calificaciones"],
    examples: ["¿Qué opinan los clientes de InspiraArte?"],
  },
  {
    id: "business-info",
    name: "Contacto del taller",
    description: "Correo, WhatsApp, ubicación en Ciudad de México, horarios y redes sociales. Lee /mcp/business-info.json.",
    tags: ["contacto", "horarios", "ubicación"],
    examples: ["¿Cómo contacto a InspiraArte?"],
  },
  {
    id: "quote-request",
    name: "Preparar una cotización",
    description:
      "Arma el enlace al formulario de cotización con el producto, la cantidad, la fecha y los detalles " +
      "(/contacto/?producto=&cantidad=&fecha=AAAA-MM-DD&detalles=). El agente no envía la solicitud: la persona revisa y envía el formulario.",
    tags: ["cotización", "pedido"],
    examples: ["Quiero cotizar 50 llaveros grabados para el 15 de diciembre."],
  },
];

export function buildAgentCard(siteUrl: string) {
  return {
    name: "InspiraArte",
    description:
      "Taller de corte y grabado láser en Ciudad de México. Este agente expone en JSON de solo lectura el catálogo, " +
      "las temporadas, los materiales, las preguntas frecuentes, las calificaciones y el contacto del taller. " +
      `Cada habilidad indica el archivo de ${API_BASE_PATH} que hay que pedir con GET (esquemas en ${OPENAPI_PATH}). ` +
      "No hay endpoint para enviar mensajes ni tareas: para cotizar, la persona envía el formulario de /contacto/.",
    version: "1.0.0",
    provider: { organization: "InspiraArte", url: siteUrl },
    documentationUrl: `${siteUrl}${API_DOCS_PATH}`,
    iconUrl: `${siteUrl}/logo.png`,
    supportedInterfaces: [{ url: `${siteUrl}${API_BASE_PATH}`, protocolBinding: "HTTP+JSON", protocolVersion: "1.0" }],
    capabilities: { streaming: false, pushNotifications: false, extendedAgentCard: false },
    defaultInputModes: ["text/plain"],
    defaultOutputModes: ["application/json"],
    skills: AGENT_SKILLS,
  };
}

// /auth.md para agentes. El sitio es estático (S3 + Cloudflare): no hay servidor OAuth ni endpoint
// de registro, así que el documento es autocontenido y declara acceso anónimo de solo lectura.
// Si algún día hay API con cuenta, publica aquí /.well-known/oauth-protected-resource y su bloque agent_auth.
export function buildAuthMd(siteUrl: string): string {
  const endpoints = [
    ...PUBLIC_DATA_FILES.map((file) => `- \`GET ${siteUrl}${file.path}\`: ${file.description}`),
    `- \`GET ${siteUrl}${TOOLS_MANIFEST_PATH}\`: definiciones de las herramientas WebMCP del sitio.`,
    `- \`GET ${siteUrl}${API_STATUS_PATH}\`: estado de la API.`,
  ];

  return [
    "# InspiraArte auth.md",
    "",
    "Cómo se autentican los agentes de IA (asistentes, buscadores y automatizaciones) ante la API pública de InspiraArte.",
    "",
    "## Resumen",
    "",
    "- Audiencia: cualquier agente o desarrollador que quiera leer el catálogo, las temporadas, los materiales, las preguntas frecuentes, las calificaciones o los datos de contacto.",
    "- Tipo de identidad: `anonymous`. No hay cuentas, registro ni aprovisionamiento de agentes.",
    "- Credenciales: ninguna. No envíes cabecera `Authorization`, API key, cookies ni tokens; se ignoran.",
    "- Permisos: solo lectura (`GET`). La API no acepta escrituras ni crea pedidos.",
    "- Endpoint de registro: no existe. No hagas `POST /agent/auth` ni intentes registrarte: el sitio es estático y no tiene ese endpoint.",
    "- OAuth: no se publica `/.well-known/oauth-protected-resource` ni `/.well-known/oauth-authorization-server` porque no hay recursos protegidos.",
    "",
    "## Métodos admitidos",
    "",
    "| Método | Estado | Uso |",
    "| --- | --- | --- |",
    "| Anónimo | Admitido | Lectura de los JSON públicos y uso de las herramientas WebMCP. |",
    "| ID-JAG (`urn:ietf:params:oauth:token-type:id-jag`) | No admitido | No hay servidor de autorización. |",
    "| Correo verificado (`verified_email`) | No admitido | No hay cuentas de cliente para agentes. |",
    "",
    "## Cómo usar la API",
    "",
    "Pide cada recurso con `GET` sin credenciales. Las respuestas son `application/json` y se regeneran en cada publicación del sitio.",
    "",
    ...endpoints,
    "",
    "Descubrimiento:",
    "",
    `- Catálogo de APIs (RFC 9727): ${siteUrl}${API_CATALOG_PATH}`,
    `- Especificación OpenAPI 3.1: ${siteUrl}${OPENAPI_PATH} (\`security: []\`, sin esquemas de seguridad)`,
    `- Documentación: ${siteUrl}${API_DOCS_PATH}`,
    `- Índice para modelos de lenguaje: ${siteUrl}/llms.txt`,
    "",
    "## Acciones que requieren a una persona",
    "",
    `Cotizar o hacer un pedido no se hace por API. La herramienta WebMCP \`prepare_quote\` solo llena el formulario de ${siteUrl}/contacto/ y la persona decide si lo envía. No envíes formularios ni mensajes en nombre del usuario sin su confirmación.`,
    "",
    "## Contacto",
    "",
    `- Dudas sobre la API: contacto@inspiraarte.com o ${siteUrl}/contacto/`,
    `- Seguridad: ${siteUrl}/.well-known/security.txt`,
    "",
  ].join("\n");
}
