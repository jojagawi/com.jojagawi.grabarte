import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

type CategoryPayload = {
  id: number;
  name: string;
  created: boolean;
};

type ErrorPayload = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CategoryPayload | ErrorPayload>,
) {
  if (process.env.NODE_ENV !== "development") {
    return res.status(404).json({ error: "Not found" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const name = String(req.body?.name ?? "").trim();
  if (!name) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  const existing = await prisma.catCategories.findFirst({
    where: { name },
    select: { id: true, name: true },
  });

  if (existing) {
    return res.status(200).json({
      id: existing.id,
      name: existing.name ?? name,
      created: false,
    });
  }

  const created = await prisma.catCategories.create({
    data: {
      name,
      status: 1,
    },
    select: { id: true, name: true },
  });

  return res.status(201).json({
    id: created.id,
    name: created.name ?? name,
    created: true,
  });
}

