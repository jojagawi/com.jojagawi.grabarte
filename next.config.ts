import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  ...(isStaticExport ? { output: "export" as const } : {}),
  trailingSlash: true,
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      new URL("http://dam.inspiraarte.com/preview/**"),
      new URL("https://dam.inspiraarte.com/preview/**")
    ],
  },
};

export default nextConfig;
