import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { type HTMLElement, parse } from "node-html-parser";

// Genera llms.txt (índice) y llms-full.txt (texto completo) a partir de las páginas ya renderizadas,
// así ambos reflejan exactamente lo que publica el sitio.
//
//   pnpm run build:llms                                  lee out/ (postbuild, después del sitemap)
//   pnpm run build:llms -- --base-url=http://localhost:3000   consulta un servidor (dev o start)
//   --out-dir=<carpeta>   escribe solo ahí (por ejemplo, para revisar el resultado)
//   --site-url=<url>      dominio de los enlaces (por defecto NEXT_PUBLIC_SITE_URL o el de producción)
//
// Las páginas se descubren siguiendo los enlaces internos desde "/". Se omiten las que llevan
// noindex (panel, formularios, categorías delgadas, 404), así que no hace falta mantener una lista.
// Escribe en public/ (para dev y para el repositorio) y, al leer out/, también ahí (para el deploy).
// Con --base-url no toca out/: ese contenido no viene de ese build. Genera desde el build para
// producción: en dev las páginas muestran extras de desarrollo (por ejemplo, filtros del catálogo).

const SITE_NAME = "InspiraArte";
const MAX_PAGES = 1000;
const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, "out");
const PUBLIC_DIR = resolve(ROOT, "public");

// Mismos archivos que publica `pnpm run build:mcp` en public/mcp/.
const AGENT_DATA_FILES = [
  { title: "Información del negocio", path: "/mcp/business-info.json", description: "Contacto, ubicación, horarios y redes sociales." },
  { title: "Categorías", path: "/mcp/categories.json", description: "Categorías del catálogo." },
  { title: "Productos", path: "/mcp/products.json", description: "Diseños publicados con descripción, categorías, precio de referencia y enlace a su ficha." },
  { title: "Preguntas frecuentes", path: "/mcp/faqs.json", description: "Preguntas y respuestas sobre pedidos, envíos y pagos." },
];

const SITE_SUMMARY = [
  "InspiraArte es un taller de corte y grabado láser en Ciudad de México, fundado en 2026, que diseña y produce",
  "piezas personalizadas en MDF, acrílico, metal y más. Atiende pedidos desde una pieza hasta pedidos",
  "corporativos y envía a todo México. Cada pedido se cotiza y se aprueba con una propuesta de diseño antes de producir.",
].join(" ");

// Rutas que no son páginas: recursos, endpoints y archivos generados.
const SKIPPED_PATH_PREFIXES = ["/_next/", "/api/", "/dam/", "/mcp/", "/cdn-cgi/"];
const LEGAL_PATHS = new Set(["/aviso-de-privacidad/", "/terminos-y-condiciones/"]);

// Fuera del contenido: navegación, pie, formularios y elementos sin texto útil.
const REMOVED_SELECTORS = [
  "header",
  "footer",
  "nav",
  "form",
  "script",
  "style",
  "noscript",
  "template",
  "svg",
  "img",
  "picture",
  "video",
  "iframe",
  "[aria-hidden=true]",
  // Bloques que se repiten en muchas páginas (botones, pasos, tarjetas de otros diseños).
  "[data-llms-skip]",
];

type PageKind = "home" | "page" | "category" | "season" | "product" | "legal";

interface PageEntry {
  path: string;
  url: string;
  kind: PageKind;
  title: string;
  description: string;
  markdown: string;
}

interface Options {
  baseUrl: string | null;
  siteUrl: string;
  outDir: string | null;
}

function parseOptions(): Options {
  const readArg = (name: string) =>
    process.argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3).trim() || null;

  const siteUrl = (readArg("site-url") || process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.inspiraarte.com").replace(/\/+$/u, "");
  const baseUrl = readArg("base-url")?.replace(/\/+$/u, "") ?? null;
  const outDir = readArg("out-dir");
  return { baseUrl, siteUrl, outDir: outDir ? resolve(ROOT, outDir) : null };
}

// "/productos?x=1#a" → "/productos/"; null si no es una página interna.
function normalizePagePath(href: string, currentPath: string): string | null {
  if (!href || href.startsWith("#") || /^(mailto|tel|javascript|data):/iu.test(href)) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(href, `http://local${currentPath}`);
  } catch {
    return null;
  }

  if (url.host !== "local") {
    return null;
  }

  const path = decodeURIComponent(url.pathname);
  if (SKIPPED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix)) || /\.[a-z0-9]+$/iu.test(path)) {
    return null;
  }

  return path.endsWith("/") ? path : `${path}/`;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function loadHtml(path: string, options: Options): Promise<string | null> {
  if (options.baseUrl) {
    const response = await fetch(`${options.baseUrl}${encodeURI(path)}`, { redirect: "follow" });
    return response.ok && (response.headers.get("content-type") ?? "").includes("text/html") ? response.text() : null;
  }

  const file = resolve(OUT_DIR, `.${path}`, "index.html");
  return (await fileExists(file)) ? readFile(file, "utf8") : null;
}

function getPageKind(path: string): PageKind {
  if (path === "/") return "home";
  if (LEGAL_PATHS.has(path)) return "legal";
  if (path.startsWith("/productos/categoria/")) return "category";
  if (/^\/temporada\/[^/]+\/$/u.test(path)) return "season";
  if (/^\/productos\/\d+-/u.test(path)) return "product";
  return "page";
}

function cleanTitle(title: string): string {
  return title.replace(new RegExp(`\\s*\\|\\s*${SITE_NAME}\\s*$`, "u"), "").replace(new RegExp(`^${SITE_NAME}\\s*\\|\\s*`, "u"), "").trim();
}

function isNoIndex(root: HTMLElement): boolean {
  return root
    .querySelectorAll('meta[name="robots"]')
    .some((meta) => /noindex/iu.test(meta.getAttribute("content") ?? ""));
}

// En llms-full.txt cada página va bajo su propio "##": su h1 pasa a "###" y así sucesivamente.
function demoteHeadings(markdown: string): string {
  return markdown.replace(/^(#{1,4}) /gmu, "##$1 ");
}

function escapeHtml(value: string): string {
  return value.replace(/&/gu, "&amp;").replace(/</gu, "&lt;").replace(/>/gu, "&gt;");
}

function toMarkdown(main: HTMLElement, options: Options): string {
  for (const selector of REMOVED_SELECTORS) {
    main.querySelectorAll(selector).forEach((element) => element.remove());
  }

  // Fichas técnicas (<dl>): "Material" / "MDF" en párrafos sueltos → "**Material:** MDF".
  main.querySelectorAll("dl").forEach((list) => {
    const lines = list.querySelectorAll("dt").map((term) => {
      const value = term.nextElementSibling?.tagName === "DD" ? term.nextElementSibling.text.trim() : "";
      return `<li><strong>${escapeHtml(term.text.trim())}:</strong> ${escapeHtml(value)}</li>`;
    });
    list.replaceWith(`<ul>${lines.join("")}</ul>`);
  });

  // Enlaces internos absolutos con el dominio público (no el del servidor consultado),
  // conservando el query (?id=, ?producto=) que lleva contexto.
  main.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href") ?? "";
    const path = normalizePagePath(href, "/");
    if (path) {
      const query = href.includes("?") ? href.slice(href.indexOf("?")).split("#")[0] : "";
      anchor.setAttribute("href", `${options.siteUrl}${path}${query}`);
    }
  });

  return NodeHtmlMarkdown.translate(main.toString(), { bulletMarker: "-", maxConsecutiveNewlines: 2 })
    .replace(/\[\]\([^)]*\)/gu, "") // enlaces sin texto (íconos)
    .replace(/\)\[/gu, ") · [") // enlaces contiguos (chips de categoría)
    .replace(/[ \t]+$/gmu, "")
    .replace(/\n{3,}/gu, "\n\n")
    .trim();
}

async function readText(file: string, options: Options): Promise<string | null> {
  if (options.baseUrl) {
    const response = await fetch(`${options.baseUrl}${file}`);
    return response.ok ? response.text() : null;
  }
  const local = resolve(OUT_DIR, `.${file}`);
  return (await fileExists(local)) ? readFile(local, "utf8") : null;
}

// Rutas del sitemap (índice y sus partes): así entran páginas sin enlaces internos, como las
// temporadas que no están en la portada. En dev no hay sitemap y solo se siguen enlaces.
async function readSitemapPaths(options: Options): Promise<string[]> {
  const index = await readText("/sitemap.xml", options);
  if (!index) {
    return [];
  }

  const locs = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1].trim());
  const parts = locs(index).filter((loc) => loc.endsWith(".xml"));
  const documents = parts.length > 0 ? await Promise.all(parts.map((loc) => readText(new URL(loc).pathname, options))) : [index];

  return documents
    .flatMap((xml) => (xml ? locs(xml) : []))
    .map((loc) => normalizePagePath(new URL(loc).pathname, "/"))
    .filter((path): path is string => Boolean(path));
}

async function crawl(options: Options): Promise<PageEntry[]> {
  const queue = [...new Set(["/", ...(await readSitemapPaths(options))])];
  const seen = new Set(queue);
  const pages: PageEntry[] = [];

  while (queue.length > 0 && seen.size <= MAX_PAGES) {
    const path = queue.shift()!;
    const html = await loadHtml(path, options);
    if (!html) {
      continue;
    }

    const root = parse(html);
    // Los enlaces se siguen aunque la página sea noindex (como robots "noindex, follow").
    for (const anchor of root.querySelectorAll("a[href]")) {
      const next = normalizePagePath(anchor.getAttribute("href") ?? "", path);
      if (next && !seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }

    const main = root.querySelector("main");
    if (isNoIndex(root) || !main) {
      continue;
    }

    pages.push({
      path,
      url: `${options.siteUrl}${path}`,
      kind: getPageKind(path),
      title: cleanTitle(root.querySelector("title")?.text ?? path),
      description: root.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? "",
      markdown: toMarkdown(main, options),
    });
  }

  return pages;
}

function listItem(title: string, url: string, description?: string): string {
  return `- [${title}](${url})${description ? `: ${description}` : ""}`;
}

function section(title: string, items: string[]): string | null {
  return items.length > 0 ? [`## ${title}`, ...items].join("\n") : null;
}

function byKind(pages: PageEntry[], ...kinds: PageKind[]): PageEntry[] {
  return pages
    .filter((page) => kinds.includes(page.kind))
    .sort((a, b) => (a.kind === "home" ? -1 : b.kind === "home" ? 1 : a.title.localeCompare(b.title, "es")));
}

function buildHeader(pages: PageEntry[]): string {
  const home = pages.find((page) => page.kind === "home");
  return [`# ${SITE_NAME}`, `> ${home?.description || SITE_SUMMARY}`, SITE_SUMMARY].join("\n\n");
}

function buildLlmsTxt(pages: PageEntry[], options: Options): string {
  const toItems = (entries: PageEntry[]) => entries.map((page) => listItem(page.title, page.url, page.description));

  return [
    buildHeader(pages),
    section("Páginas", toItems(byKind(pages, "home", "page"))),
    section("Categorías del catálogo", toItems(byKind(pages, "category"))),
    section("Temporadas", toItems(byKind(pages, "season"))),
    section("Productos", toItems(byKind(pages, "product"))),
    section(
      "Datos para agentes",
      AGENT_DATA_FILES.map((file) => listItem(file.title, `${options.siteUrl}${file.path}`, file.description)),
    ),
    section("Optional", [
      ...toItems(byKind(pages, "legal")),
      listItem("Contenido completo del sitio", `${options.siteUrl}/llms-full.txt`, "Texto íntegro de las páginas públicas."),
    ]),
  ]
    .filter(Boolean)
    .join("\n\n")
    .concat("\n");
}

function buildLlmsFullTxt(pages: PageEntry[]): string {
  const ordered = [
    ...byKind(pages, "home", "page"),
    ...byKind(pages, "category"),
    ...byKind(pages, "season"),
    ...byKind(pages, "product"),
    ...byKind(pages, "legal"),
  ];

  return [
    buildHeader(pages),
    ...ordered.map((page) =>
      [`## ${page.title}`, `Source: ${page.url}`, page.description ? `> ${page.description}` : "", demoteHeadings(page.markdown)]
        .filter(Boolean)
        .join("\n\n"),
    ),
  ]
    .join("\n\n---\n\n")
    .concat("\n");
}

async function writeOutputs(files: Record<string, string>, options: Options): Promise<string[]> {
  const targets = options.outDir ? [options.outDir] : [PUBLIC_DIR, ...(options.baseUrl ? [] : [OUT_DIR])];
  const written: string[] = [];
  for (const directory of targets) {
    for (const [name, content] of Object.entries(files)) {
      const file = resolve(directory, name);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, content, "utf8");
      written.push(file);
    }
  }
  return written;
}

async function main() {
  const options = parseOptions();
  if (!options.baseUrl && !(await fileExists(resolve(OUT_DIR, "index.html")))) {
    throw new Error("No existe out/index.html: corre el build primero o usa --base-url=http://localhost:3000.");
  }

  const pages = await crawl(options);
  if (!pages.some((page) => page.kind === "home")) {
    throw new Error("No se pudo leer la portada: revisa el build o el --base-url.");
  }

  const written = await writeOutputs({
    "llms.txt": buildLlmsTxt(pages, options),
    "llms-full.txt": buildLlmsFullTxt(pages),
  }, options);

  const counts = Object.entries(
    pages.reduce<Record<string, number>>((acc, page) => ({ ...acc, [page.kind]: (acc[page.kind] ?? 0) + 1 }), {}),
  )
    .map(([kind, count]) => `${kind}: ${count}`)
    .join(", ");
  console.log(`llms: ${pages.length} páginas (${counts}) desde ${options.baseUrl ?? "out/"}`);
  written.forEach((file) => console.log(`  escrito ${file}`));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
