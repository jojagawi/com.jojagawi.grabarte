import { createLLmsTxt, type LLMsTxtConfig, type PageInfo } from "next-llms-txt";
import { NextRequest } from "next/server";
import { getCategoryPages, getCategoryPath, isCategoryIndexable, type CategoryPage } from "@/lib/categories.server";

export const dynamic = "force-static";
export const revalidate = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.inspiraarte.com";
const llmsUrl = new URL("/llms.txt", siteUrl).toString();

// Archivos estáticos que genera `pnpm run build:mcp` en public/mcp/.
const agentDataFiles = [
  { title: "Información del negocio", path: "/mcp/business-info.json", description: "Contacto, ubicación, horarios y redes sociales." },
  { title: "Categorías", path: "/mcp/categories.json", description: "Categorías del catálogo." },
  { title: "Productos", path: "/mcp/products.json", description: "Diseños publicados con descripción, categorías, precio de referencia y enlace a su ficha." },
  { title: "Preguntas frecuentes", path: "/mcp/faqs.json", description: "Preguntas y respuestas sobre pedidos, envíos y pagos." },
];

function toAbsolutePageUrl(route: string): string {
  // Mismo formato que el canonical: con slash final.
  return new URL(route === "/" ? "/" : `${route.replace(/\/+$/u, "")}/`, siteUrl).toString();
}

function toListItem(title: string, url: string, description?: string): string {
  return `- [${title}](${url})${description ? `: ${description}` : ""}`;
}

// Solo páginas con `export const llmstxt`: así quedan fuera el panel, los formularios y las
// rutas dinámicas ([idSlug], [slug]), que la autodetección listaba como "undefined". Las
// categorías, que sí son rutas dinámicas, se pasan aparte desde la base.
function generateSiteLlmsTxt(config: LLMsTxtConfig, pages: PageInfo[], categoryPages: CategoryPage[]): string {
  const publicPages = pages
    .filter((page) => page.hasLLMsTxtExport && page.config?.title && !page.route.includes("["))
    .sort((a, b) => (a.route === "/" ? -1 : b.route === "/" ? 1 : a.route.localeCompare(b.route)));

  return [
    `# ${config.title}`,
    `> ${config.description}`,
    [
      "InspiraArte es un taller de corte y grabado láser en Ciudad de México, fundado en 2026, que diseña y produce",
      "piezas personalizadas en MDF, acrílico, metal y más. Atiende pedidos desde una pieza hasta pedidos",
      "corporativos y envía a todo México. Cada pedido se cotiza y se aprueba con una propuesta de diseño antes de producir.",
    ].join(" "),
    ["## Páginas", ...publicPages.map((page) => toListItem(page.config!.title, toAbsolutePageUrl(page.route), page.config?.description))].join("\n"),
    [
      "## Categorías del catálogo",
      ...categoryPages.map((category) =>
        toListItem(
          category.name,
          toAbsolutePageUrl(getCategoryPath(category.slug)),
          `${category.designs.length} ${category.designs.length === 1 ? "diseño" : "diseños"}`,
        ),
      ),
    ].join("\n"),
    ["## Datos para agentes", ...agentDataFiles.map((file) => toListItem(file.title, new URL(file.path, siteUrl).toString(), file.description))].join("\n"),
    ["## Optional", toListItem("Contenido completo del sitio", new URL("/llms-full.txt", siteUrl).toString(), "Texto íntegro de las páginas públicas.")].join("\n"),
  ].join("\n\n");
}

export async function GET() {
  const categoryPages = (await getCategoryPages()).filter(isCategoryIndexable);
  const { GET: handleLLmsTxt } = createLLmsTxt({
    baseUrl: siteUrl,
    showWarnings: process.env.NODE_ENV === "development",
    defaultConfig: {
      title: process.env.NEXT_PUBLIC_SITENAME || "InspiraArte",
      description:
        "Regalos y productos personalizados con corte y grabado láser en México: termos, llaveros, figuras de MDF, recuerdos para eventos y artículos con logo para empresas.",
    },
    autoDiscovery: {
      appDir: "src/app",
      rootDir: process.cwd(),
    },
    generator: (config, pages = []) => generateSiteLlmsTxt(config, pages, categoryPages),
  });

  // Evita request.url para mantener compatibilidad con static prerender.
  return handleLLmsTxt(new NextRequest(llmsUrl));
}
