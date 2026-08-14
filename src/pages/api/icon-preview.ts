import type { NextApiRequest, NextApiResponse } from "next";
import { normalizeCategoryIcon } from "@/lib/category-icon-definitions";

function buildSvgResponse(svg: string, res: NextApiResponse) {
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
  res.status(200).send(svg);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<string | { error: string }>) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const normalizedIcon = normalizeCategoryIcon(req.query.icon);
  if (!normalizedIcon) {
    return buildSvgResponse("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'></svg>", res);
  }

  // Endpoint legacy: mantenemos una respuesta SVG simple sin cargar paquetes de iconos en server routes.
  return buildSvgResponse("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='8' fill='currentColor'/></svg>", res);
}

