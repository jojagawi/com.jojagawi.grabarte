/* eslint-disable @typescript-eslint/no-require-imports -- next-sitemap carga este archivo como CommonJS. */
const fs = require("node:fs");
const path = require("node:path");

const OUT_DIR = path.join(__dirname, "out");
// Lo escribe scripts/build-sitemap-lastmod.ts (postbuild, antes de este paso).
const LASTMOD_FILE = path.join(__dirname, ".next", "sitemap-lastmod.json");

function readLastmodByPath() {
  if (!fs.existsSync(LASTMOD_FILE)) {
    console.warn(`[next-sitemap] Sin ${LASTMOD_FILE}: el sitemap sale sin lastmod. Corre pnpm run build:sitemap-lastmod.`);
    return {};
  }
  return JSON.parse(fs.readFileSync(LASTMOD_FILE, "utf8"));
}

const lastmodByPath = readLastmodByPath();

function stripTrailingSlash(value) {
  return value.length > 1 ? value.replace(/\/+$/u, "") : value;
}

// Rutas cuyo HTML del build lleva <meta name="robots" content="noindex…">: categorías y temporadas
// con poco catálogo, formularios, 404. Mismo criterio que scripts/build-llms.ts.
function findNoIndexPaths(directory = OUT_DIR, prefix = "") {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      return entry.name.startsWith("_") ? [] : findNoIndexPaths(path.join(directory, entry.name), `${prefix}/${entry.name}`);
    }

    if (entry.name !== "index.html") {
      return [];
    }

    const html = fs.readFileSync(path.join(directory, entry.name), "utf8");
    const isNoIndex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/iu.test(html);
    // Con y sin slash final: next-sitemap compara antes de aplicar trailingSlash.
    return isNoIndex && prefix ? [prefix, `${prefix}/`] : [];
  });
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  sitemapSize: 100,
  // lastmod real por ruta, no la hora del build; sin changefreq ni priority (Google los ignora).
  autoLastmod: false,
  transform: async (config, loc) => ({
    loc,
    lastmod: lastmodByPath[stripTrailingSlash(loc)],
  }),
  outDir: "out/",
  // Solo páginas públicas indexables: el panel (noindex), los formularios de calificación (noindex),
  // los endpoints MCP y los archivos de ruta (ícono, manifest, og.png) no van al sitemap.
  exclude: async () => [
    "/agregar*",
    "/catalogos*",
    "/calificaciones*",
    "/productos/editar*",
    "/api/*",
    "/icon.png*",
    "/manifest.webmanifest*",
    "/llms.txt*",
    // Tarjetas Open Graph de categorías y temporadas (og.png/route.tsx).
    "*/og.png",
    ...findNoIndexPaths(),
  ],
};
