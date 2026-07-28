"use server"

import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/slug"

type CategoryResult = {
  id: number
  name: string
  created: boolean
}

type MaterialResult = {
  id: number
  name: string
  slug: string
  created: boolean
}


async function getUniqueSlug(baseSlug: string) {
  let slug = baseSlug || "material"
  let counter = 2

  while (true) {
    const exists = await prisma.catMaterials.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!exists) return slug

    slug = `${baseSlug || "material"}-${counter}`
    counter += 1
  }
}

export async function createCategory(name: string): Promise<CategoryResult> {
  const normalized = name.trim()

  if (!normalized) {
    throw new Error("El nombre de la categoría es obligatorio")
  }

  const existing = await prisma.catCategories.findFirst({
    where: { name: normalized },
    select: { id: true, name: true },
  })

  if (existing) {
    return {
      id: existing.id,
      name: existing.name ?? normalized,
      created: false,
    }
  }

  const created = await prisma.catCategories.create({
    data: {
      name: normalized,
      status: 1,
    },
    select: { id: true, name: true },
  })

  return {
    id: created.id,
    name: created.name ?? normalized,
    created: true,
  }
}

export async function createMaterial(name: string): Promise<MaterialResult> {
  const normalized = name.trim()

  if (!normalized) {
    throw new Error("El nombre del material es obligatorio")
  }

  const existing = await prisma.catMaterials.findFirst({
    where: { name: normalized },
    select: { id: true, name: true, slug: true },
  })

  if (existing) {
    return {
      id: existing.id,
      name: existing.name ?? normalized,
      slug: existing.slug ?? slugify(normalized),
      created: false,
    }
  }

  const uniqueSlug = await getUniqueSlug(slugify(normalized))

  const created = await prisma.catMaterials.create({
    data: {
      name: normalized,
      slug: uniqueSlug,
      status: 1,
    },
    select: { id: true, name: true, slug: true },
  })

  return {
    id: created.id,
    name: created.name ?? normalized,
    slug: created.slug ?? uniqueSlug,
    created: true,
  }
}

