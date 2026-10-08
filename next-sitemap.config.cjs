/* eslint-disable @typescript-eslint/no-require-imports -- next-sitemap carga este archivo como CommonJS. */
const fs = require("node:fs");
const path = require("node:path");

const OUT_DIR = path.join(__dirname, "out");

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
  outDir: "out/",
  // Solo páginas públicas indexables: el panel (noindex), los formularios de calificación (noindex),
  // los endpoints MCP y los archivos de ruta (ícono, manifest) no van al sitemap.
  exclude: async () => [
    "/agregar*",
    "/catalogos*",
    "/calificaciones*",
    "/productos/editar*",
    "/api/*",
    "/icon.png*",
    "/manifest.webmanifest*",
    "/llms.txt*",
    ...findNoIndexPaths(),
  ],
};
