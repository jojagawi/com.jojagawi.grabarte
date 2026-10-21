// Herramientas WebMCP del sitio (document.modelContext). El sitio es un export estático: todas
// leen los JSON que genera `pnpm run build:mcp` en public/mcp/ (scripts/build-mcp-fallback.ts).
// Las de solo lectura llevan readOnlyHint; navigate_to y prepare_quote solo cambian de página,
// y la cotización la envía siempre el visitante desde /contacto.

type ToolResult = {
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: unknown;
  isError?: boolean;
};

type JsonSchema = {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
};

// Anotaciones completas: los validadores de WebMCP piden declarar si la herramienta cambia algo.
type ToolAnnotations = {
  readOnlyHint: boolean;
  destructiveHint: boolean;
  idempotentHint: boolean;
  openWorldHint: boolean;
};

type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: JsonSchema;
  // structuredContent de cada respuesta correcta; los errores (isError) no lo llevan.
  outputSchema: JsonSchema;
  annotations: ToolAnnotations;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- cada herramienta valida sus argumentos.
  execute: (args: any) => Promise<ToolResult>;
};

type CategoryItem = {
  id: number;
  name: string;
};

type ProductItem = {
  id: number;
  idSlug: string;
  name: string;
  description: string;
  categories: string[];
  reference: string;
  material: string | null;
  suggestedPrice: number | null;
  productionTime: string | null;
  shippingTime: string | null;
  dimensions: string | null;
  isCustomizable: boolean;
  image: string | null;
  gallery: string[];
  url: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type SeasonItem = {
  slug: string;
  name: string;
  months: string;
  url: string;
  description: string | null;
  guide: string | null;
  categories: string[];
  products: Array<{ id: number; name: string; url: string }>;
};

type MaterialsGuide = {
  definitions: string[];
  materials: Array<{
    name: string;
    definition: string;
    technique: string;
    bestFor: string;
    catalogCount: number;
  }>;
  sizeReferences: Array<{ name: string; url: string; dimensions: string; suggestedPrice: number | null }>;
};

type ReviewItem = {
  name: string;
  product: string;
  rating: number;
  comment: string;
  productId: number | null;
  createdAt: string;
};

type BusinessInfoItem = {
  businessName: string;
  email: string;
  whatsapp: string;
  address: string;
  contactUrl: string;
  schedules: Array<{ dayRange: string; hours: string }>;
  social?: {
    instagram?: string | null;
    facebook?: string | null;
    tiktok?: string | null;
    googleBusiness?: string | null;
  };
};

type ModelContextCarrier = {
  modelContext?: unknown;
};

type WebMcpContext = {
  registerTool: (tool: ToolDefinition, options?: { signal?: AbortSignal }) => unknown;
};

const WEBMCP_TOOLS_GUARD_KEY = "__grabarte_webmcp_tools_initialized__";

type WebMcpToolsGuardHost = typeof globalThis & {
  [WEBMCP_TOOLS_GUARD_KEY]?: boolean;
};

// Palabras que no ayudan a buscar ("esferas de navidad" = "esferas navidad").
const STOP_WORDS = new Set([
  "a", "al", "con", "de", "del", "el", "en", "la", "las", "lo", "los", "para", "por", "que", "un", "una", "y",
]);

// Mismo formato que valida /contacto (src/components/custom/contact.tsx).
const PREVIEW_PATH_PATTERN = /^preview\/[A-Za-z0-9._-]+\.(webp|png|jpe?g)$/u;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;
const MAX_DETAILS_LENGTH = 2000;
// Tiempo para que el agente reciba la respuesta antes de que la página cambie.
const NAVIGATION_DELAY_MS = 300;

const dataCache = new Map<string, Promise<unknown>>();

function loadData<TData>(fileName: string): Promise<TData | null> {
  if (!dataCache.has(fileName)) {
    const request = fetch(`/mcp/${fileName}`, { headers: { Accept: "application/json" } })
      .then((response) => (response.ok ? response.json() : null))
      .catch((error: unknown) => {
        console.error(error);
        return null;
      });
    // Si falla, el siguiente intento vuelve a pedir el archivo.
    request.then((data) => {
      if (data === null) {
        dataCache.delete(fileName);
      }
    });
    dataCache.set(fileName, request);
  }

  return dataCache.get(fileName) as Promise<TData | null>;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function toSearchWords(value: string | null | undefined): string[] {
  return normalizeText(value ?? "")
    .split(/[^a-z0-9ñ]+/u)
    .filter((word) => word && !STOP_WORDS.has(word));
}

// Una palabra de la búsqueda coincide con el inicio de una palabra del texto ("llavero" →
// "llaveros"); un plural también encuentra el singular exacto ("esferas" → "esfera").
function matchesWord(word: string, textWords: string[]): boolean {
  const singular = word.length > 3 ? word.replace(/(es|s)$/u, "") : word;
  return textWords.some((textWord) => textWord.startsWith(word) || textWord === singular);
}

// Ordena por cuántas palabras de la búsqueda coinciden. Si alguno las tiene todas, solo se
// devuelven esos (exact); si no, los que tienen más coincidencias.
function rankByWords<TItem>(
  query: string | undefined,
  items: TItem[],
  getValues: (item: TItem) => Array<string | null | undefined>,
): { exact: boolean; items: TItem[] } {
  const words = toSearchWords(query);
  if (words.length === 0) {
    return { exact: true, items };
  }

  const scored = items.map((item) => {
    const textWords = getValues(item).flatMap(toSearchWords);
    return { item, score: words.filter((word) => matchesWord(word, textWords)).length };
  });
  const best = Math.max(0, ...scored.map((entry) => entry.score));
  return {
    exact: best === words.length,
    items: best === 0 ? [] : scored.filter((entry) => entry.score === best).map((entry) => entry.item),
  };
}

function matchesAllWords(query: string | undefined, values: Array<string | null | undefined>): boolean {
  return rankByWords(query, [values], (item) => item).exact;
}

function parseLimit(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    return fallback;
  }

  return Math.min(20, Math.max(1, parsed));
}

function textResult(text: string, structuredContent?: unknown): ToolResult {
  return {
    content: [{ type: "text", text }],
    ...(structuredContent === undefined ? {} : { structuredContent }),
  };
}

function errorResult(text: string): ToolResult {
  return { content: [{ type: "text", text }], isError: true };
}

const unavailable = (what: string) => errorResult(`No fue posible consultar ${what}. Intenta de nuevo más tarde.`);

function formatPrice(value: number | null): string {
  return value && value > 0 ? `$${value} MXN por pieza` : "Bajo cotización";
}

function absoluteUrl(path: string): string {
  return new URL(path, window.location.origin).toString();
}

function findProduct(products: ProductItem[], id?: number, idSlug?: string): ProductItem | undefined {
  if (Number.isInteger(id) && Number(id) > 0) {
    return products.find((product) => product.id === Number(id));
  }

  const slug = idSlug?.trim().replace(/^\/?productos\//u, "").replace(/\/$/u, "");
  if (slug) {
    return products.find((product) => product.idSlug === slug)
      ?? products.find((product) => String(product.id) === slug.split("-")[0]);
  }

  return undefined;
}

function describeProduct(product: ProductItem, reviews: ReviewItem[]): string {
  const lines = [
    `Producto: ${product.name} (${product.reference})`,
    `Descripción: ${product.description}`,
    `Material: ${product.material || "No especificado"}`,
    `Medidas: ${product.dimensions || "No especificadas"}`,
    `Categorías: ${product.categories.join(", ") || "Sin categoría"}`,
    `Precio de referencia: ${formatPrice(product.suggestedPrice)}`,
    `Producción: ${product.productionTime || "Se confirma al cotizar"}`,
    `Envío: ${product.shippingTime || "Se confirma al cotizar"}`,
    `Personalizable: ${product.isCustomizable ? "Sí" : "Se puede consultar"}`,
    `URL: ${absoluteUrl(`${product.url}/`)}`,
  ];
  if (reviews.length > 0) {
    const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    lines.push(`Calificaciones: ${average.toFixed(1)} de 5 (${reviews.length})`);
  }

  return lines.join("\n");
}

function toProductSummary(product: ProductItem) {
  return {
    id: product.id,
    idSlug: product.idSlug,
    reference: product.reference,
    name: product.name,
    categories: product.categories,
    suggestedPrice: product.suggestedPrice,
    image: product.image,
    url: absoluteUrl(`${product.url}/`),
  };
}

// Lo que pide /contacto en ?imagen=: la ruta dentro del bucket, no la URL completa.
function toPreviewPath(imageUrl: string | null): string | null {
  if (!imageUrl) {
    return null;
  }

  try {
    const path = new URL(imageUrl).pathname.replace(/^\/+/u, "");
    return PREVIEW_PATH_PATTERN.test(path) ? path : null;
  } catch {
    return null;
  }
}

function navigateSoon(path: string) {
  window.setTimeout(() => window.location.assign(path), NAVIGATION_DELAY_MS);
}

// Solo rutas del mismo sitio: "/productos/", nunca "//otro-sitio" ni "https://…".
function toSitePath(value: string | undefined): string | null {
  const path = value?.trim();
  if (!path || !path.startsWith("/") || path.startsWith("//") || /[\s\\]/u.test(path)) {
    return null;
  }

  const [pathname, rest = ""] = path.split(/(?=[?#])/u);
  return `${pathname.endsWith("/") ? pathname : `${pathname}/`}${rest}`;
}

// Solo consulta los JSON del sitio: no cambia nada ni sale del dominio.
const READ_ONLY: ToolAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

// Cambia de página dentro del sitio; no envía datos ni borra nada.
const NAVIGATION: ToolAnnotations = {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

const NO_INPUT: JsonSchema = { type: "object", properties: {}, additionalProperties: false };

const nullableString = (description: string) => ({ type: ["string", "null"], description });
const nullableNumber = (description: string) => ({ type: ["number", "null"], description });
const stringList = (description: string) => ({ type: "array", items: { type: "string" }, description });

const PRODUCT_SUMMARY_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "integer", description: "ID del producto." },
    idSlug: { type: "string", description: "Identificador id-slug de la ficha." },
    reference: { type: "string", description: "Referencia IA-0000." },
    name: { type: "string" },
    categories: stringList("Categorías del producto."),
    suggestedPrice: nullableNumber("Precio de referencia por pieza en MXN; null = bajo cotización."),
    image: nullableString("URL de la imagen principal."),
    url: { type: "string", description: "URL absoluta de la ficha." },
  },
  required: ["id", "reference", "name", "url"],
};

const REVIEW_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", description: "Nombre del cliente." },
    product: { type: "string", description: "Producto que calificó." },
    rating: { type: "integer", minimum: 1, maximum: 5 },
    comment: { type: "string" },
    productId: { type: ["integer", "null"], description: "ID del producto, si la calificación está ligada a uno." },
    createdAt: { type: "string", description: "Fecha ISO de la calificación." },
  },
  required: ["name", "rating", "comment"],
};

const PRODUCT_DETAIL_SCHEMA = {
  type: "object",
  properties: {
    ...PRODUCT_SUMMARY_SCHEMA.properties,
    description: { type: "string" },
    material: nullableString("MDF, Acrílico, Metal, Termo…"),
    productionTime: nullableString("Tiempo de producción, por ejemplo \"3 a 4 días hábiles\"."),
    shippingTime: nullableString("Tiempo de envío."),
    dimensions: nullableString("Medidas de la pieza."),
    isCustomizable: { type: "boolean", description: "Si se personaliza con nombre, fecha o logo." },
    gallery: stringList("URLs de imágenes adicionales."),
    reviews: { type: "array", items: REVIEW_SCHEMA, description: "Calificaciones aprobadas del producto." },
  },
  required: ["id", "reference", "name", "description", "url", "reviews"],
};

const OPENED_PAGE_SCHEMA: JsonSchema = {
  type: "object",
  properties: { url: { type: "string", description: "URL absoluta de la página que se abre." } },
  required: ["url"],
};

const TOOLS: ToolDefinition[] = [
  {
    name: "list_categories",
    description: "Lista las categorías públicas del catálogo de InspiraArte (taller de corte y grabado láser en CDMX).",
    inputSchema: NO_INPUT,
    outputSchema: {
      type: "object",
      properties: {
        categories: {
          type: "array",
          items: {
            type: "object",
            properties: { id: { type: "integer" }, name: { type: "string" } },
            required: ["id", "name"],
          },
        },
      },
      required: ["categories"],
    },
    annotations: READ_ONLY,
    execute: async () => {
      const categories = await loadData<CategoryItem[]>("categories.json");
      if (!categories) {
        return unavailable("las categorías");
      }

      const list = categories.map((category) => `- ${category.name} (id: ${category.id})`).join("\n");
      return textResult(`Categorías disponibles (${categories.length}):\n${list}`, { categories });
    },
  },
  {
    name: "search_products",
    description:
      "Busca productos del catálogo por palabras (nombre, descripción, material o categoría) y/o por categoría. Devuelve nombre, referencia, precio de referencia y enlace.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        query: { type: "string", description: "Palabras a buscar, por ejemplo \"esferas navidad\" o \"llavero metal\"." },
        category: { type: "string", description: "Nombre de una categoría (ver list_categories)." },
        customizable: { type: "boolean", description: "true para mostrar solo piezas personalizables con nombre, fecha o logo." },
        limit: { type: "integer", minimum: 1, maximum: 20, description: "Máximo de resultados (1 a 20, 8 por defecto)." },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        total: { type: "integer", description: "Productos que coinciden (antes de aplicar limit)." },
        exact: { type: "boolean", description: "false si ninguno tiene todas las palabras y se devuelven los más parecidos." },
        products: { type: "array", items: PRODUCT_SUMMARY_SCHEMA },
      },
      required: ["total", "exact", "products"],
    },
    annotations: READ_ONLY,
    execute: async ({ query, category, customizable, limit }: {
      query?: string;
      category?: string;
      customizable?: boolean;
      limit?: number;
    }) => {
      const products = await loadData<ProductItem[]>("products.json");
      if (!products) {
        return unavailable("el catálogo");
      }

      const normalizedCategory = category?.trim() ? normalizeText(category.trim()) : "";
      const candidates = products.filter(
        (product) =>
          (!normalizedCategory ||
            product.categories.some((name) => normalizeText(name).includes(normalizedCategory))) &&
          (customizable !== true || product.isCustomizable),
      );
      const { exact, items: matches } = rankByWords(query, candidates, (product) => [
        product.name,
        product.description,
        product.material,
        ...product.categories,
      ]);
      const items = matches.slice(0, parseLimit(limit, 8)).map(toProductSummary);

      if (items.length === 0) {
        return textResult(
          "No se encontraron productos con esos criterios. Prueba con menos palabras o revisa las categorías con list_categories. También se hacen diseños a la medida: usa prepare_quote.",
          { total: 0, exact: false, products: [] },
        );
      }

      const lines = items.map(
        (item) =>
          `- ${item.name} (${item.reference}) | ${formatPrice(item.suggestedPrice)} | Categorías: ${item.categories.join(", ") || "Sin categoría"} | ${item.url}`,
      );
      const heading = exact
        ? `Productos encontrados (${items.length} de ${matches.length})`
        : `Ningún producto tiene todas las palabras; los más parecidos (${items.length} de ${matches.length})`;
      return textResult(`${heading}:\n${lines.join("\n")}`, { total: matches.length, exact, products: items });
    },
  },
  {
    name: "get_product_detail",
    description:
      "Detalle de un producto: descripción, material, medidas, precio de referencia, tiempos de producción y envío, imágenes y calificaciones.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        id: { type: "integer", minimum: 1, description: "ID numérico del producto (también aparece como IA-0000)." },
        idSlug: { type: "string", description: "Identificador id-slug o ruta de la ficha, por ejemplo \"242-trajinera-decorativa\"." },
      },
    },
    outputSchema: PRODUCT_DETAIL_SCHEMA as JsonSchema,
    annotations: READ_ONLY,
    execute: async ({ id, idSlug }: { id?: number; idSlug?: string }) => {
      const [products, reviews] = await Promise.all([
        loadData<ProductItem[]>("products.json"),
        loadData<ReviewItem[]>("reviews.json"),
      ]);
      if (!products) {
        return unavailable("el catálogo");
      }

      const product = findProduct(products, id, idSlug);
      if (!product) {
        return errorResult("No se encontró el producto. Usa search_products para obtener su id.");
      }

      const productReviews = (reviews ?? []).filter((review) => review.productId === product.id);
      return textResult(describeProduct(product, productReviews), {
        ...product,
        url: absoluteUrl(`${product.url}/`),
        reviews: productReviews,
      });
    },
  },
  {
    name: "get_current_product",
    description: "Devuelve el producto que el visitante está viendo, si está en una ficha de producto.",
    inputSchema: NO_INPUT,
    outputSchema: {
      type: "object",
      properties: {
        product: { anyOf: [PRODUCT_DETAIL_SCHEMA, { type: "null" }], description: "null si no está en una ficha." },
        path: { type: "string", description: "Ruta de la página actual." },
      },
      required: ["product", "path"],
    },
    annotations: READ_ONLY,
    execute: async () => {
      const match = /^\/productos\/(\d+-[^/]+)\/?$/u.exec(window.location.pathname);
      if (!match) {
        return textResult(`El visitante no está en una ficha de producto (página actual: ${window.location.pathname}).`, {
          product: null,
          path: window.location.pathname,
        });
      }

      const [products, reviews] = await Promise.all([
        loadData<ProductItem[]>("products.json"),
        loadData<ReviewItem[]>("reviews.json"),
      ]);
      const product = products ? findProduct(products, undefined, match[1]) : undefined;
      if (!product) {
        return unavailable("el producto de esta página");
      }

      const productReviews = (reviews ?? []).filter((review) => review.productId === product.id);
      return textResult(describeProduct(product, productReviews), {
        product: { ...product, url: absoluteUrl(`${product.url}/`), reviews: productReviews },
        path: window.location.pathname,
      });
    },
  },
  {
    name: "list_seasons",
    description:
      "Lista las temporadas del año (Navidad, Día de muertos, regreso a clases…) con sus meses, categorías y número de piezas.",
    inputSchema: NO_INPUT,
    outputSchema: {
      type: "object",
      properties: {
        seasons: {
          type: "array",
          items: {
            type: "object",
            properties: {
              slug: { type: "string" },
              name: { type: "string" },
              months: { type: "string", description: "Meses de la temporada, por ejemplo \"Noviembre – Diciembre\"." },
              categories: stringList("Categorías de la temporada."),
              productCount: { type: "integer" },
              hasGuide: { type: "boolean" },
              url: { type: "string" },
            },
            required: ["slug", "name", "months", "productCount", "url"],
          },
        },
      },
      required: ["seasons"],
    },
    annotations: READ_ONLY,
    execute: async () => {
      const seasons = await loadData<SeasonItem[]>("seasons.json");
      if (!seasons) {
        return unavailable("las temporadas");
      }

      const items = seasons.map((season) => ({
        slug: season.slug,
        name: season.name,
        months: season.months,
        categories: season.categories,
        productCount: season.products.length,
        hasGuide: Boolean(season.guide),
        url: absoluteUrl(season.url),
      }));
      const lines = items.map(
        (item) =>
          `- ${item.name} (${item.months}) | ${item.productCount} piezas${item.hasGuide ? " | con guía" : ""} | slug: ${item.slug} | ${item.url}`,
      );
      return textResult(`Temporadas (${items.length}):\n${lines.join("\n")}`, { seasons: items });
    },
  },
  {
    name: "get_season_guide",
    description:
      "Guía de compra de una temporada (ideas, tiempos para pedir a tiempo, piezas recomendadas) y sus productos.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        season: { type: "string", description: "Slug o nombre de la temporada, por ejemplo \"navidad\" o \"Día de muertos\"." },
        limit: { type: "integer", minimum: 1, maximum: 20, description: "Máximo de productos a listar (1 a 20, 10 por defecto)." },
      },
      required: ["season"],
    },
    outputSchema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        name: { type: "string" },
        months: { type: "string" },
        url: { type: "string" },
        description: nullableString("Texto introductorio."),
        guide: nullableString("Guía en Markdown; null si la temporada no tiene."),
        categories: stringList("Categorías de la temporada."),
        products: {
          type: "array",
          items: {
            type: "object",
            properties: { id: { type: "integer" }, name: { type: "string" }, url: { type: "string" } },
            required: ["id", "name", "url"],
          },
        },
      },
      required: ["slug", "name", "months", "url", "products"],
    },
    annotations: READ_ONLY,
    execute: async ({ season, limit }: { season?: string; limit?: number }) => {
      const seasons = await loadData<SeasonItem[]>("seasons.json");
      if (!seasons) {
        return unavailable("las temporadas");
      }

      const wanted = normalizeText(season?.trim() ?? "");
      const found =
        seasons.find((item) => item.slug === wanted) ??
        seasons.find((item) => normalizeText(item.name).includes(wanted)) ??
        seasons.find((item) => matchesAllWords(season, [item.name, item.slug]));
      if (!wanted || !found) {
        return errorResult(
          `No se encontró esa temporada. Disponibles: ${seasons.map((item) => item.name).join(", ")}.`,
        );
      }

      const products = found.products.slice(0, parseLimit(limit, 10)).map((product) => ({
        ...product,
        url: absoluteUrl(product.url),
      }));
      const text = [
        `${found.name} (${found.months}) | ${absoluteUrl(found.url)}`,
        found.description ?? "",
        found.guide ?? "Esta temporada aún no tiene guía.",
        `Productos (${products.length} de ${found.products.length}):`,
        ...products.map((product) => `- ${product.name} | ${product.url}`),
      ]
        .filter(Boolean)
        .join("\n\n");

      return textResult(text, { ...found, url: absoluteUrl(found.url), products });
    },
  },
  {
    name: "get_materials_guide",
    description:
      "Explica los materiales y técnicas (MDF, acrílico, metal, termos; corte y grabado láser) con medidas y precios de referencia.",
    inputSchema: NO_INPUT,
    outputSchema: {
      type: "object",
      properties: {
        definitions: stringList("Definiciones de corte láser, grabado láser y MDF."),
        materials: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              definition: { type: "string" },
              technique: { type: "string" },
              bestFor: { type: "string" },
              catalogCount: { type: "integer", description: "Diseños de ese material en el catálogo." },
            },
            required: ["name", "definition", "technique", "bestFor", "catalogCount"],
          },
        },
        sizeReferences: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              url: { type: "string" },
              dimensions: { type: "string" },
              suggestedPrice: nullableNumber("Precio por pieza en MXN."),
            },
            required: ["name", "url", "dimensions"],
          },
        },
      },
      required: ["definitions", "materials", "sizeReferences"],
    },
    annotations: READ_ONLY,
    execute: async () => {
      const guide = await loadData<MaterialsGuide>("materials.json");
      if (!guide) {
        return unavailable("la guía de materiales");
      }

      const sizeReferences = guide.sizeReferences.map((item) => ({ ...item, url: absoluteUrl(item.url) }));
      const text = [
        ...guide.definitions,
        "Materiales:",
        ...guide.materials.map(
          (item) =>
            `- ${item.name}: ${item.definition}. Técnica: ${item.technique}. Ideal para: ${item.bestFor}. ${item.catalogCount > 0 ? `${item.catalogCount} diseños en el catálogo.` : "Bajo pedido."}`,
        ),
        "Tamaños y precios de referencia:",
        ...sizeReferences.map((item) => `- ${item.name}: ${item.dimensions} | ${formatPrice(item.suggestedPrice)} | ${item.url}`),
      ].join("\n");

      return textResult(text, { ...guide, sizeReferences });
    },
  },
  {
    name: "search_faq",
    description: "Busca respuestas en las preguntas frecuentes: tiempos, pedido mínimo, envíos, pagos, garantía.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        query: { type: "string", description: "Palabras a buscar, por ejemplo \"envío Monterrey\" o \"formas de pago\". Vacío devuelve todas." },
        limit: { type: "integer", minimum: 1, maximum: 20, description: "Máximo de respuestas (1 a 20, 5 por defecto)." },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        faqs: {
          type: "array",
          items: {
            type: "object",
            properties: { question: { type: "string" }, answer: { type: "string" } },
            required: ["question", "answer"],
          },
        },
      },
      required: ["faqs"],
    },
    annotations: READ_ONLY,
    execute: async ({ query, limit }: { query?: string; limit?: number }) => {
      const faqs = await loadData<FaqItem[]>("faqs.json");
      if (!faqs) {
        return unavailable("las preguntas frecuentes");
      }

      // Si ninguna respuesta tiene todas las palabras ("envío a Monterrey"), se dan las más cercanas.
      const items = rankByWords(query, faqs, (faq) => [faq.question, faq.answer]).items.slice(0, parseLimit(limit, 5));

      if (items.length === 0) {
        return textResult("No se encontraron respuestas para esa consulta. Para dudas puntuales usa get_business_info.", {
          faqs: [],
        });
      }

      const lines = items.map((item) => `- ${item.question}\n  ${item.answer}`);
      return textResult(`Preguntas frecuentes:\n${lines.join("\n")}`, { faqs: items });
    },
  },
  {
    name: "get_reviews",
    description: "Calificaciones y opiniones aprobadas de clientes, de todo el sitio o de un producto.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productId: { type: "integer", minimum: 1, description: "ID del producto para ver solo sus opiniones." },
        limit: { type: "integer", minimum: 1, maximum: 20, description: "Máximo de opiniones (1 a 20, 5 por defecto)." },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        average: nullableNumber("Promedio de 1 a 5; null si no hay calificaciones."),
        total: { type: "integer" },
        reviews: { type: "array", items: REVIEW_SCHEMA },
      },
      required: ["average", "total", "reviews"],
    },
    annotations: READ_ONLY,
    execute: async ({ productId, limit }: { productId?: number; limit?: number }) => {
      const reviews = await loadData<ReviewItem[]>("reviews.json");
      if (!reviews) {
        return unavailable("las calificaciones");
      }

      const matches = Number.isInteger(productId) ? reviews.filter((review) => review.productId === productId) : reviews;
      if (matches.length === 0) {
        return textResult("Aún no hay calificaciones publicadas para esa consulta.", { average: null, total: 0, reviews: [] });
      }

      const average = Number((matches.reduce((sum, review) => sum + review.rating, 0) / matches.length).toFixed(1));
      const items = matches.slice(0, parseLimit(limit, 5));
      const lines = items.map(
        (review) => `- ${review.rating}/5 · ${review.name}${review.product ? ` · ${review.product}` : ""}: ${review.comment}`,
      );
      return textResult(`Promedio ${average} de 5 (${matches.length} calificaciones):\n${lines.join("\n")}`, {
        average,
        total: matches.length,
        reviews: items,
      });
    },
  },
  {
    name: "get_business_info",
    description: "Datos de contacto, ubicación, horarios y redes sociales de InspiraArte.",
    inputSchema: NO_INPUT,
    outputSchema: {
      type: "object",
      properties: {
        businessName: { type: "string" },
        email: { type: "string" },
        whatsapp: { type: "string", description: "Vacío si no hay WhatsApp publicado." },
        address: { type: "string" },
        contactUrl: { type: "string", description: "URL absoluta del formulario de cotización." },
        schedules: {
          type: "array",
          items: {
            type: "object",
            properties: { dayRange: { type: "string" }, hours: { type: "string" } },
            required: ["dayRange", "hours"],
          },
        },
        social: {
          type: "object",
          description: "URLs de redes (instagram, facebook, tiktok, googleBusiness); null si no hay.",
          additionalProperties: { type: ["string", "null"] },
        },
      },
      required: ["businessName", "email", "contactUrl", "schedules"],
    },
    annotations: READ_ONLY,
    execute: async () => {
      const info = await loadData<BusinessInfoItem>("business-info.json");
      if (!info) {
        return unavailable("la información de contacto");
      }

      const schedulesText =
        info.schedules.length > 0
          ? info.schedules.map((item) => `- ${item.dayRange}: ${item.hours}`).join("\n")
          : "No disponible";
      const social = Object.entries(info.social ?? {})
        .filter((entry): entry is [string, string] => Boolean(entry[1]))
        .map(([network, url]) => `- ${network}: ${url}`)
        .join("\n");
      const contactUrl = absoluteUrl(`${info.contactUrl.replace(/\/$/u, "")}/`);

      return textResult(
        [
          `Negocio: ${info.businessName}`,
          `Email: ${info.email}`,
          `WhatsApp: ${info.whatsapp || "No disponible"}`,
          `Dirección: ${info.address}`,
          `Cotizaciones: ${contactUrl}`,
          `Horarios:\n${schedulesText}`,
          ...(social ? [`Redes:\n${social}`] : []),
        ].join("\n"),
        { ...info, contactUrl },
      );
    },
  },
  {
    name: "navigate_to",
    description:
      "Lleva al visitante a una página del sitio: la ficha de un producto (productId), una temporada (seasonSlug) o una ruta como \"/productos/\" o \"/faq/\".",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productId: { type: "integer", minimum: 1, description: "ID del producto cuya ficha se abre." },
        seasonSlug: { type: "string", description: "Slug de la temporada (ver list_seasons)." },
        path: { type: "string", description: "Ruta del sitio que empieza con \"/\", por ejemplo \"/proceso/\"." },
      },
    },
    outputSchema: OPENED_PAGE_SCHEMA,
    annotations: NAVIGATION,
    execute: async ({ productId, seasonSlug, path }: { productId?: number; seasonSlug?: string; path?: string }) => {
      let target: string | null = null;

      if (Number.isInteger(productId)) {
        const products = await loadData<ProductItem[]>("products.json");
        const product = products ? findProduct(products, productId) : undefined;
        if (!product) {
          return errorResult("No se encontró ese producto.");
        }
        target = `${product.url}/`;
      } else if (seasonSlug?.trim()) {
        const seasons = await loadData<SeasonItem[]>("seasons.json");
        const found = seasons?.find((item) => item.slug === seasonSlug.trim());
        if (!found) {
          return errorResult("No se encontró esa temporada. Usa list_seasons para ver los slugs.");
        }
        target = found.url;
      } else {
        target = toSitePath(path);
      }

      if (!target) {
        return errorResult("Indica productId, seasonSlug o una ruta del sitio que empiece con \"/\".");
      }

      navigateSoon(target);
      return textResult(`Abriendo ${absoluteUrl(target)}`, { url: absoluteUrl(target) });
    },
  },
  {
    name: "prepare_quote",
    description:
      "Abre el formulario de cotización (/contacto) con el producto, la cantidad, la fecha y los detalles ya escritos. No envía nada: el visitante revisa, agrega su nombre y correo y pulsa Enviar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productId: { type: "integer", minimum: 1, description: "ID del producto a cotizar. Omitir para un diseño a la medida." },
        quantity: { type: "integer", minimum: 1, maximum: 100000, description: "Número de piezas." },
        neededBy: { type: "string", description: "Fecha en que se necesitan, en formato AAAA-MM-DD." },
        details: { type: "string", description: "Qué se quiere personalizar: nombres, textos, colores, logo, ocasión." },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "URL de /contacto con los campos prellenados." },
        submitted: { type: "boolean", const: false, description: "Siempre false: el visitante envía la solicitud." },
      },
      required: ["url", "submitted"],
    },
    annotations: NAVIGATION,
    execute: async ({ productId, quantity, neededBy, details }: {
      productId?: number;
      quantity?: number;
      neededBy?: string;
      details?: string;
    }) => {
      const params = new URLSearchParams();

      if (Number.isInteger(productId)) {
        const products = await loadData<ProductItem[]>("products.json");
        const product = products ? findProduct(products, productId) : undefined;
        if (!product) {
          return errorResult("No se encontró ese producto. Usa search_products para obtener su id.");
        }

        // Mismos parámetros que el botón "Cotizar" de la ficha (product-quote-actions.tsx).
        params.set("producto", `${product.reference} · ${product.name}`.slice(0, 200));
        if (product.productionTime) params.set("produccion", product.productionTime.slice(0, 80));
        if (product.shippingTime) params.set("envio", product.shippingTime.slice(0, 80));
        const previewPath = toPreviewPath(product.image);
        if (previewPath) params.set("imagen", previewPath);
        params.set("ficha", `${product.url}/`);
      }

      if (quantity !== undefined) {
        if (!Number.isInteger(quantity) || quantity < 1) {
          return errorResult("La cantidad debe ser un número entero mayor que cero.");
        }
        params.set("cantidad", String(quantity));
      }

      if (neededBy?.trim()) {
        const date = neededBy.trim();
        const today = new Date().toISOString().slice(0, 10);
        if (!ISO_DATE_PATTERN.test(date) || Number.isNaN(Date.parse(date))) {
          return errorResult("La fecha debe tener el formato AAAA-MM-DD.");
        }
        if (date < today) {
          return errorResult("Esa fecha ya pasó. Indica una a partir de hoy.");
        }
        params.set("fecha", date);
      }

      if (details?.trim()) {
        params.set("detalles", details.trim().slice(0, MAX_DETAILS_LENGTH));
      }

      const query = params.toString();
      const target = `/contacto/${query ? `?${query}` : ""}`;
      navigateSoon(target);

      return textResult(
        "Abriendo el formulario de cotización con los datos indicados. El visitante debe revisar, escribir su nombre y correo y pulsar Enviar; la respuesta llega en menos de 24 horas.",
        { url: absoluteUrl(target), submitted: false },
      );
    },
  },
];

function getModelContext(source: unknown): unknown {
  if (source && typeof source === "object" && "modelContext" in source) {
    return (source as ModelContextCarrier).modelContext;
  }

  return undefined;
}

function hasRegisterTool(context: unknown): context is WebMcpContext {
  return Boolean(
    context
      && typeof context === "object"
      && "registerTool" in context
      && typeof (context as { registerTool?: unknown }).registerTool === "function",
  );
}

export function setupAiTools() {
  const guardHost = globalThis as WebMcpToolsGuardHost;
  if (guardHost[WEBMCP_TOOLS_GUARD_KEY]) {
    return;
  }

  // WebMCP movio modelContext a document; navigator queda como fallback temporal.
  const ctx = getModelContext(document) || getModelContext(navigator);

  if (!hasRegisterTool(ctx)) {
    console.warn("WebMCP no está soportado en este entorno.");
    return;
  }

  // Evita re-registros en Strict Mode/HMR para el mismo documento.
  guardHost[WEBMCP_TOOLS_GUARD_KEY] = true;

  // El borrador de abril de 2026 quitó unregisterTool: se da de baja abortando la señal.
  const controller = new AbortController();
  for (const tool of TOOLS) {
    try {
      Promise.resolve(ctx.registerTool(tool, { signal: controller.signal })).catch((error: unknown) => {
        console.error(`WebMCP: no se pudo registrar ${tool.name}.`, error);
      });
    } catch (error) {
      console.error(`WebMCP: no se pudo registrar ${tool.name}.`, error);
    }
  }

  return () => {
    controller.abort();
    guardHost[WEBMCP_TOOLS_GUARD_KEY] = false;
  };
}
