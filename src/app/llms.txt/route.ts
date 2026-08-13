import { createLLmsTxt } from "next-llms-txt";
import { NextRequest } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.inspiraarte.com";
const llmsUrl = new URL("/llms.txt", siteUrl).toString();

const { GET: handleLLmsTxt } = createLLmsTxt({
  baseUrl: siteUrl,
  showWarnings: process.env.NODE_ENV === "development",
  defaultConfig: {
    title: process.env.NEXT_PUBLIC_SITENAME || "InspiraArte",
    description: "Proceso de descubrimiento automático del sitio web",
  },
  autoDiscovery: {
    appDir: "src/app",
    rootDir: process.cwd(),
  },
});

export async function GET() {
  // Evita request.url para mantener compatibilidad con static prerender.
  return handleLLmsTxt(new NextRequest(llmsUrl));
}

