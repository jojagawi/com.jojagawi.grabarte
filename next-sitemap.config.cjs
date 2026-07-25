/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.inspirarte.com",
  generateRobotsTxt: true,
  sitemapSize: 100,
  outDir: "out/",
};
