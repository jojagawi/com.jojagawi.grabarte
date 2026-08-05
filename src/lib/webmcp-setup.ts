type ToolResponse<TData> = {
  success: boolean;
  data?: TData;
  message?: string;
};

type MpcToolResult = {
  content: Array<{ type: "text"; text: string }>;
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
  material: string | null;
  minimumPrice: number | null;
  suggestedPrice: number | null;
  image: string | null;
  gallery: string[];
  url: string;
};

type FaqItem = {
  question: string;
  answer: string;
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
  };
};

type ModelContextCarrier = {
  modelContext?: unknown;
};

type WebMcpContext = {
  registerTool: (toolConfig: unknown) => () => void;
};

const fallbackCache = new Map<string, unknown>();

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function parseLimit(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    return fallback;
  }

  return Math.min(20, Math.max(1, parsed));
}

async function fetchToolData<TData>(path: string): Promise<ToolResponse<TData>> {
  try {
    const response = await fetch(path, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Error HTTP ${response.status} al consultar ${path}.`,
      };
    }

    return (await response.json()) as ToolResponse<TData>;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "No fue posible completar la solicitud.",
    };
  }
}

async function loadFallbackData<TData>(fileName: string): Promise<TData | null> {
  if (fallbackCache.has(fileName)) {
    return fallbackCache.get(fileName) as TData;
  }

  try {
    const response = await fetch(`/mcp/${fileName}`);
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as TData;
    fallbackCache.set(fileName, data);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function buildTextResult(text: string): MpcToolResult {
  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
  };
}

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
  // WebMCP movio modelContext a document; navigator queda como fallback temporal.
  const documentContext = getModelContext(document);
  const navigatorContext = documentContext ? null : getModelContext(navigator);
  const ctx = documentContext || navigatorContext;

  if (!hasRegisterTool(ctx)) {
    console.warn("WebMCP no está soportado en este entorno.");
    return;
  }

  const unregisterTools: Array<() => void> = [];

  unregisterTools.push(
    ctx.registerTool({
      name: "list_categories",
      description: "Obtiene las categorías públicas del catálogo de InspiraArte.",
      parameters: {
        type: "object",
        properties: {},
      },
      execute: async () => {
        const result = await fetchToolData<Array<{ id: number; name: string | null }>>(
          "/api/mcp/list-categories",
        );

        const categories = result.success && result.data
          ? result.data
          : await loadFallbackData<CategoryItem[]>("categories.json");

        if (!categories) {
          return buildTextResult(result.message || "No se pudieron obtener categorías.");
        }

        const categoryList = categories
          .map((category) => `- ${category.name || "Sin nombre"} (id: ${category.id})`)
          .join("\n");

        return buildTextResult(`Categorías disponibles:\n${categoryList || "Sin categorías publicadas."}`);
      },
    }),
  );

  unregisterTools.push(
    ctx.registerTool({
      name: "search_products",
      description: "Busca productos por texto libre y/o categoría.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Texto para buscar por nombre, descripción o categoría.",
          },
          category: {
            type: "string",
            description: "Nombre de categoría para filtrar resultados.",
          },
          limit: {
            type: "number",
            description: "Cantidad máxima de resultados (1 a 20).",
          },
        },
      },
      execute: async ({ query, category, limit }: { query?: string; category?: string; limit?: number }) => {
        const safeLimit = parseLimit(limit, 8);
        const searchParams = new URLSearchParams();
        if (query?.trim()) {
          searchParams.set("q", query.trim());
        }
        if (category?.trim()) {
          searchParams.set("category", category.trim());
        }
        searchParams.set("limit", String(safeLimit));

        const result = await fetchToolData<
          Array<{
            id: number;
            name: string;
            description: string;
            categories: string[];
            url: string;
          }>
        >(`/api/mcp/search-products?${searchParams.toString()}`);

        let items = result.success && result.data ? result.data : null;

        if (!items) {
          const fallbackProducts =
            await loadFallbackData<ProductItem[]>("products.json");
          if (!fallbackProducts) {
            return buildTextResult(
              result.message ||
                "No se pudo completar la búsqueda de productos.",
            );
          }

          const normalizedQuery = query?.trim()
            ? normalizeText(query.trim())
            : "";
          const normalizedCategory = category?.trim()
            ? normalizeText(category.trim())
            : "";

          items = fallbackProducts
            .filter((product) => {
              const byQuery =
                !normalizedQuery ||
                [
                  product.name,
                  product.description,
                  product.categories.join(" "),
                ].some((value) =>
                  normalizeText(value).includes(normalizedQuery),
                );

              const byCategory =
                !normalizedCategory ||
                product.categories.some((name) =>
                  normalizeText(name).includes(normalizedCategory),
                );

              return byQuery && byCategory;
            })
            .slice(0, safeLimit)
            .map((product) => ({
              id: product.id,
              name: product.name,
              description: product.description,
              categories: product.categories,
              url: product.url,
            }));
        }

        if (items.length === 0) {
          return buildTextResult(
            "No se encontraron productos con esos criterios.",
          );
        }

        const lines = items.map(
          (item) =>
            `- ${item.name} | Categorías: ${item.categories.join(", ") || "Sin categoría"} | URL: ${item.url}`,
        );

        return buildTextResult(
          `Resultados de productos (${items.length}):\n${lines.join("\n")}`,
        );
      },
    }),
  );

  unregisterTools.push(
    ctx.registerTool({
      name: "get_product_detail",
      description: "Obtiene el detalle de un producto por id o idSlug.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID numérico del producto.",
          },
          idSlug: {
            type: "string",
            description: "Identificador completo con formato id-slug.",
          },
        },
      },
      execute: async ({ id, idSlug }: { id?: number; idSlug?: string }) => {
        const searchParams = new URLSearchParams();

        if (Number.isInteger(id) && Number(id) > 0) {
          searchParams.set("id", String(id));
        }

        if (idSlug?.trim()) {
          searchParams.set("idSlug", idSlug.trim());
        }

        const result = await fetchToolData<{
          id: number;
          name: string;
          description: string;
          categories: string[];
          material: string | null;
          minimumPrice: number | null;
          suggestedPrice: number | null;
          url: string;
        }>(`/api/mcp/get-product-detail?${searchParams.toString()}`);

        let item = result.success && result.data ? result.data : null;

        if (!item) {
          const fallbackProducts = await loadFallbackData<ProductItem[]>("products.json");
          if (!fallbackProducts) {
            return buildTextResult(result.message || "No se pudo obtener el detalle del producto.");
          }

          const itemFromFallback = fallbackProducts.find((product) => {
            if (Number.isInteger(id) && Number(id) > 0) {
              return product.id === Number(id);
            }

            if (idSlug?.trim()) {
              return product.idSlug === idSlug.trim();
            }

            return false;
          });

          if (!itemFromFallback) {
            return buildTextResult("No se encontró el producto solicitado.");
          }

          item = {
            id: itemFromFallback.id,
            name: itemFromFallback.name,
            description: itemFromFallback.description,
            categories: itemFromFallback.categories,
            material: itemFromFallback.material,
            minimumPrice: itemFromFallback.minimumPrice,
            suggestedPrice: itemFromFallback.suggestedPrice,
            url: itemFromFallback.url,
          };
        }

        return buildTextResult(
          `Producto: ${item.name}\nDescripción: ${item.description}\nMaterial: ${item.material || "No especificado"}\nCategorías: ${item.categories.join(", ") || "Sin categoría"}\nPrecio mínimo: ${item.minimumPrice ?? "No disponible"}\nPrecio sugerido: ${item.suggestedPrice ?? "No disponible"}\nURL: ${item.url}`,
        );
      },
    }),
  );

  unregisterTools.push(
    ctx.registerTool({
      name: "search_faq",
      description: "Busca respuestas en preguntas frecuentes del sitio.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Texto para buscar dentro de preguntas y respuestas.",
          },
          limit: {
            type: "number",
            description: "Cantidad máxima de respuestas (1 a 20).",
          },
        },
      },
      execute: async ({ query, limit }: { query?: string; limit?: number }) => {
        const safeLimit = parseLimit(limit, 5);
        const searchParams = new URLSearchParams();
        if (query?.trim()) {
          searchParams.set("q", query.trim());
        }
        searchParams.set("limit", String(safeLimit));

        const result = await fetchToolData<Array<{ question: string; answer: string }>>(
          `/api/mcp/search-faq?${searchParams.toString()}`,
        );

        let items = result.success && result.data ? result.data : null;

        if (!items) {
          const fallbackFaqs = await loadFallbackData<FaqItem[]>("faqs.json");
          if (!fallbackFaqs) {
            return buildTextResult(result.message || "No se pudieron consultar las preguntas frecuentes.");
          }

          const normalizedQuery = query?.trim() ? normalizeText(query.trim()) : "";
          items = fallbackFaqs
            .filter((faq) => {
              if (!normalizedQuery) {
                return true;
              }

              return (
                normalizeText(faq.question).includes(normalizedQuery) ||
                normalizeText(faq.answer).includes(normalizedQuery)
              );
            })
            .slice(0, safeLimit)
            .map((faq) => ({
              question: faq.question,
              answer: faq.answer,
            }));
        }

        if (items.length === 0) {
          return buildTextResult("No se encontraron respuestas de FAQ para esa consulta.");
        }

        const lines = items.map((item) => `- ${item.question}\n  ${item.answer}`);
        return buildTextResult(`FAQ relacionadas:\n${lines.join("\n")}`);
      },
    }),
  );

  unregisterTools.push(
    ctx.registerTool({
      name: "get_business_info",
      description: "Obtiene datos de contacto y horarios del negocio.",
      parameters: {
        type: "object",
        properties: {},
      },
      execute: async () => {
        const result = await fetchToolData<{
          businessName: string;
          email: string;
          whatsapp: string;
          address: string;
          contactUrl: string;
          schedules: Array<{ dayRange: string; hours: string }>;
        }>("/api/mcp/get-business-info");

        const info = result.success && result.data
          ? result.data
          : await loadFallbackData<BusinessInfoItem>("business-info.json");

        if (!info) {
          return buildTextResult(result.message || "No se pudo obtener la información de contacto.");
        }

        const schedulesText =
          info.schedules.length > 0
            ? info.schedules.map((item) => `- ${item.dayRange}: ${item.hours}`).join("\n")
            : "No disponible";

        return buildTextResult(
          `Negocio: ${info.businessName}\nEmail: ${info.email}\nWhatsApp: ${info.whatsapp || "No disponible"}\nDirección: ${info.address}\nContacto: ${info.contactUrl}\nHorarios:\n${schedulesText}`,
        );
      },
    }),
  );

  return () => {
    unregisterTools.forEach((unregister) => unregister());
  };
}
