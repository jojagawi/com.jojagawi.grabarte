import { createLLmsTxt } from "next-llms-txt";
import { NextRequest } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

const { GET: handleLLmsTxt } = createLLmsTxt({
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
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

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Con trailingSlash=true, Next puede resolver esta ruta como /llms.txt/.
  // next-llms-txt espera pathname exacto /llms.txt para generar el manifest.
  if (url.pathname === "/llms.txt/") {
    url.pathname = "/llms.txt";
  }

  return handleLLmsTxt(new NextRequest(url.toString()));
}

