import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { type AdminSeason, isValidMonth, isValidSeasonStatus, SEASON_STATUS } from "@/lib/seasons";

export const dynamic = "force-static";
export const revalidate = false;

const MAX_LEAD_DAYS = 90;

const MAX_DESCRIPTION_LENGTH = 600;

type SeasonInput = {
  name: string;
  description: string | null;
  startMonth: number;
  endMonth: number;
  leadDays: number;
  sortOrder: number;
  status: number;
  categoryIds: number[];
};

function notAvailable() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

function isAdminEnabled(): boolean {
  return process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
}

function parseInput(body: unknown): SeasonInput | string {
  const data = (body ?? {}) as Record<string, unknown>;
  const name = String(data.name ?? "").trim();
  const description = String(data.description ?? "").trim();
  const startMonth = Number(data.startMonth);
  const endMonth = Number(data.endMonth);
  const leadDays = Number(data.leadDays);
  const sortOrder = Number(data.sortOrder ?? 0);
  const requestedStatus = Number(data.status);
  const status = isValidSeasonStatus(requestedStatus) ? requestedStatus : SEASON_STATUS.active;
  const categoryIds = Array.isArray(data.categoryIds)
    ? [...new Set(data.categoryIds.map(Number).filter((id) => Number.isInteger(id) && id > 0))]
    : [];

  if (!name || name.length > 60) {
    return "El nombre es obligatorio (máximo 60 caracteres).";
  }
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return `La descripción admite hasta ${MAX_DESCRIPTION_LENGTH} caracteres.`;
  }
  if (!isValidMonth(startMonth) || !isValidMonth(endMonth)) {
    return "Los meses deben estar entre enero y diciembre.";
  }
  if (!Number.isInteger(leadDays) || leadDays < 0 || leadDays > MAX_LEAD_DAYS) {
    return `Los días de adelanto deben estar entre 0 y ${MAX_LEAD_DAYS}.`;
  }
  if (!Number.isInteger(sortOrder)) {
    return "El orden debe ser un número entero.";
  }

  return { name, description: description || null, startMonth, endMonth, leadDays, sortOrder, status, categoryIds };
}

// Descarta ids que no existan para no fallar por una categoría borrada.
async function existingCategoryIds(categoryIds: number[]): Promise<number[]> {
  if (categoryIds.length === 0) {
    return [];
  }
  const categories = await prisma.catCategories.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true },
  });
  return categories.map((category) => category.id);
}

async function uniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || "temporada";
  let candidate = base;
  for (let suffix = 2; await prisma.catSeasons.findUnique({ where: { slug: candidate } }); suffix += 1) {
    candidate = `${base}-${suffix}`;
  }
  return candidate;
}

async function loadSeason(id: number): Promise<AdminSeason | null> {
  const season = await prisma.catSeasons.findUnique({
    where: { id },
    include: { relSeasonsCategories: { select: { categoryId: true } } },
  });
  if (!season) {
    return null;
  }
  return {
    id: season.id,
    slug: season.slug,
    name: season.name,
    description: season.description,
    startMonth: season.startMonth,
    endMonth: season.endMonth,
    leadDays: season.leadDays,
    sortOrder: season.sortOrder,
    status: season.status,
    categoryIds: season.relSeasonsCategories.map((relation) => relation.categoryId),
  };
}

export async function POST(request: Request) {
  if (!isAdminEnabled()) {
    return notAvailable();
  }

  const input = parseInput(await request.json().catch(() => null));
  if (typeof input === "string") {
    return NextResponse.json({ error: input }, { status: 400 });
  }

  const categoryIds = await existingCategoryIds(input.categoryIds);
  const created = await prisma.catSeasons.create({
    data: {
      slug: await uniqueSlug(input.name),
      name: input.name,
      description: input.description,
      startMonth: input.startMonth,
      endMonth: input.endMonth,
      leadDays: input.leadDays,
      sortOrder: input.sortOrder,
      status: input.status,
      relSeasonsCategories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
    },
  });

  return NextResponse.json(await loadSeason(created.id), { status: 201 });
}

export async function PUT(request: Request) {
  if (!isAdminEnabled()) {
    return notAvailable();
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const id = Number(body?.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Temporada no válida." }, { status: 400 });
  }

  const input = parseInput(body);
  if (typeof input === "string") {
    return NextResponse.json({ error: input }, { status: 400 });
  }

  const existing = await prisma.catSeasons.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "La temporada ya no existe." }, { status: 404 });
  }

  const categoryIds = await existingCategoryIds(input.categoryIds);
  // El slug no cambia al renombrar: es el identificador estable de la temporada.
  await prisma.$transaction([
    prisma.relSeasonsCategories.deleteMany({ where: { seasonId: id } }),
    prisma.catSeasons.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        startMonth: input.startMonth,
        endMonth: input.endMonth,
        leadDays: input.leadDays,
        sortOrder: input.sortOrder,
        status: input.status,
        relSeasonsCategories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
      },
    }),
  ]);

  return NextResponse.json(await loadSeason(id));
}
