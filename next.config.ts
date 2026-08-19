import type { NextConfig } from "next";

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
            {
              source: "/",
              headers: [
                {
                  key: "Link",
                  value: `<${siteUrl}/>; rel=\"canonical\"`,
                },
              ],
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
          ];
        },
      }),
};

export default nextConfig;
