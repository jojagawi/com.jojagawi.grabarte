import type { NextApiRequest, NextApiResponse } from "next";
import { CATEGORY_ICON_PACK_IDS } from "@/lib/category-icon-packs";
import { getCategoryIconOptionsByPack } from "@/lib/category-icon-options.server";

type SuccessPayload = {
  data: Array<{ value: string; label: string }>;
};

type ErrorPayload = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessPayload | ErrorPayload>,
) {
  if (process.env.NODE_ENV !== "development") {
    return res.status(404).json({ error: "Not found" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const pack = String(req.query.pack ?? "").trim();
  if (!CATEGORY_ICON_PACK_IDS.has(pack)) {
    return res.status(400).json({ error: "Paquete de iconos no valido" });
  }

  const options = await getCategoryIconOptionsByPack(pack);
  return res.status(200).json({ data: options });
}

