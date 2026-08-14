import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { normalizeCategoryIcon } from "@/lib/category-icon-definitions";

type CategoryPayload = {
  id: number;
  name: string;
  status: number;
  icon: string | null;
  createdAt: string;
  created: boolean;
};

type CategoryListItem = {
  id: number;
  name: string;
  status: number;
  icon: string | null;
  createdAt: string;
};

type CategoryListPayload = {
  data: CategoryListItem[];
};

type ErrorPayload = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CategoryPayload | CategoryListPayload | ErrorPayload>,
) {
  if (process.env.NODE_ENV !== "development") {
    return res.status(404).json({ error: "Not found" });
  }

  if (req.method === "GET") {
    const categories = await prisma.catCategories.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
        status: true,
        createdAt: true,
      },
      orderBy: [{ name: "asc" }, { id: "asc" }],
    });

    return res.status(200).json({
      data: categories.map((category) => ({
        id: category.id,
        name: category.name?.trim() || "Sin nombre",
        status: Number(category.status ?? 0),
        icon: category.icon?.trim() || null,
        createdAt: category.createdAt.toISOString(),
      })),
    });
  }

  if (req.method === "POST") {
    const name = String(req.body?.name ?? "").trim();
    if (!name) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const status = Number(req.body?.status) === 0 ? 0 : 1;
    const icon = normalizeCategoryIcon(req.body?.icon);

    const existing = await prisma.catCategories.findFirst({
      where: { name },
      select: { id: true, name: true, icon: true, status: true, createdAt: true },
    });

    if (existing) {
      return res.status(200).json({
        id: existing.id,
        name: existing.name?.trim() || name,
        status: Number(existing.status ?? 0),
        icon: existing.icon?.trim() || null,
        createdAt: existing.createdAt.toISOString(),
        created: false,
      });
    }

    const created = await prisma.catCategories.create({
      data: {
        name,
        status,
        icon,
      },
      select: { id: true, name: true, icon: true, status: true, createdAt: true },
    });

    return res.status(201).json({
      id: created.id,
      name: created.name?.trim() || name,
      status: Number(created.status ?? 0),
      icon: created.icon?.trim() || null,
      createdAt: created.createdAt.toISOString(),
      created: true,
    });
  }

  if (req.method === "PUT") {
    const id = Number(req.body?.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "El id es obligatorio" });
    }

    const name = String(req.body?.name ?? "").trim();
    if (!name) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const status = Number(req.body?.status) === 0 ? 0 : 1;
    const icon = normalizeCategoryIcon(req.body?.icon);

    const duplicate = await prisma.catCategories.findFirst({
      where: {
        name,
        id: { not: id },
      },
      select: { id: true },
    });

    if (duplicate) {
      return res.status(409).json({ error: "Ya existe una categoria con ese nombre" });
    }

    const updated = await prisma.catCategories.update({
      where: { id },
      data: {
        name,
        status,
        icon,
      },
      select: { id: true, name: true, icon: true, status: true, createdAt: true },
    });

    return res.status(200).json({
      id: updated.id,
      name: updated.name?.trim() || name,
      status: Number(updated.status ?? 0),
      icon: updated.icon?.trim() || null,
      createdAt: updated.createdAt.toISOString(),
      created: false,
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

