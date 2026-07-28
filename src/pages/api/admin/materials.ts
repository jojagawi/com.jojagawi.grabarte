import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

type MaterialPayload = {
  id: number;
  name: string;
  slug: string;
  created: boolean;
};

type ErrorPayload = {
  error: string;
};


async function uniqueSlug(base: string) {
  const baseSlug = base || "material";
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const exists = await prisma.catMaterials.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!exists) return candidate;

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MaterialPayload | ErrorPayload>,
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

  const existing = await prisma.catMaterials.findFirst({
    where: { name },
    select: { id: true, name: true, slug: true },
  });

  if (existing) {
    return res.status(200).json({
      id: existing.id,
      name: existing.name ?? name,
      slug: existing.slug ?? slugify(name),
      created: false,
    });
  }

  const slug = await uniqueSlug(slugify(name));
  const created = await prisma.catMaterials.create({
    data: {
      name,
      slug,
      status: 1,
    },
    select: { id: true, name: true, slug: true },
  });

  return res.status(201).json({
    id: created.id,
    name: created.name ?? name,
    slug: created.slug ?? slug,
    created: true,
  });
}

