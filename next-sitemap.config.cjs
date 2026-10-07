/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  sitemapSize: 100,
  outDir: "out/",
  // Solo páginas públicas indexables: el panel (noindex), los formularios de calificación (noindex),
  // los endpoints MCP y los archivos de ruta (ícono, manifest, llms.txt) no van al sitemap.
  exclude: [
    "/agregar*",
    "/catalogos*",
    "/calificaciones*",
    "/productos/editar*",
    "/api/*",
    "/icon.png*",
    "/manifest.webmanifest*",
    "/llms.txt*",
  ],
};
