import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { CatalogSeasonsAdmin } from "@/components/custom/CatalogSeasonsAdmin";

export const metadata: Metadata = buildPageMetadata({
  title: "Temporadas de la portada | InspiraArte",
  description: "Panel interno para administrar las temporadas de la vitrina de la portada.",
  path: "/catalogos/temporadas",
  noIndex: true,
});

// Fecha de referencia para la vista previa "hoy la portada muestra…".
function getTodayIso(): string {
  return new Date().toISOString();
}

export default async function CatalogSeasonsPage() {
  const canEditDesigns = process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
  if (!canEditDesigns || process.env.NODE_ENV !== "development") {
    notFound();
  }

  const [seasons, categories] = await Promise.all([
    prisma.catSeasons.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      include: { relSeasonsCategories: { select: { categoryId: true } } },
    }),
    prisma.catCategories.findMany({
      where: { status: 1 },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
        // Mismas piezas que puede usar la vitrina: publicadas en el sitio.
        relDesignsCategories: {
          where: { status: 1, design: { status: 1, showInSite: 1 } },
          select: { designId: true },
        },
      },
    }),
  ]);

  return (
    <CatalogSeasonsAdmin
      todayIso={getTodayIso()}
      initialSeasons={seasons.map((season) => ({
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
      }))}
      categories={categories.map((category) => ({
        id: category.id,
        name: category.name?.trim() || "Sin nombre",
        designIds: [
          ...new Set(
            category.relDesignsCategories
              .map((relation) => relation.designId)
              .filter((designId): designId is number => designId !== null),
          ),
        ],
      }))}
    />
  );
}
