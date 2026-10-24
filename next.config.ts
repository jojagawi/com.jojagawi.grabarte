import type { NextConfig } from "next";
import { API_CATALOG_CONTENT_TYPE, API_CATALOG_PATH, buildHomeLinkHeader } from "./src/lib/public-api";

const isStaticExport = process.env.STATIC_EXPORT === "true";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const siteUrl =
  configuredSiteUrl && /^https?:\/\//u.test(configuredSiteUrl)
    ? configuredSiteUrl.replace(/\/+$/u, "")
    : "https://www.inspiraarte.com";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  ...(isStaticExport ? { output: "export" as const } : {}),
  trailingSlash: true,
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      new URL("http://dam.inspiraarte.com/**"),
      new URL("https://dam.inspiraarte.com/**")
    ],
  },
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [
            // En producción lo pone build.yml al subir el archivo a S3.
            {
              source: API_CATALOG_PATH,
              headers: [{ key: "Content-Type", value: API_CATALOG_CONTENT_TYPE }],
            },
            {
              source: "/:path*",
              headers: [
                {
                  key: "Link",
                  value: `<${siteUrl}/:path*>; rel=\"canonical\"`,
                },
              ],
            },
            // Después de "/:path*" (que también coincide con "/"): con la misma clave gana la última.
            // En producción la cabecera de descubrimiento la pone una Transform Rule de Cloudflare configurada a mano.
            {
              source: "/",
              headers: [
                {
                  key: "Link",
                  value: `<${siteUrl}/>; rel=\"canonical\", ${buildHomeLinkHeader(siteUrl)}`,
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
