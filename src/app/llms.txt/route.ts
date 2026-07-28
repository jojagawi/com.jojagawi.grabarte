import { createLLmsTxt } from "next-llms-txt";

export const { GET } = createLLmsTxt({
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
  showWarnings: process.env.NODE_ENV === "development",
  defaultConfig: {
    title: process.env.NEXT_PUBLIC_SITENAME || "InspiraArte",
    description: "Proceso de descubrimiento automático del sitio web",
  },
  autoDiscovery: {
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    appDir: "src/app",
    rootDir: process.cwd(),
  },
});
