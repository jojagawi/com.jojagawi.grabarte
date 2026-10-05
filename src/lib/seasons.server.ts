import { prisma } from "@/lib/prisma";
import type { Season } from "@/lib/seasons";

// Temporadas activas con sus categorías activas, en el orden del panel.
export async function getSeasons(): Promise<Season[]> {
  const seasons = await prisma.catSeasons.findMany({
    where: { status: 1 },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      startMonth: true,
      endMonth: true,
      leadDays: true,
      relSeasonsCategories: {
        where: { category: { status: 1 } },
        select: { categoryId: true },
      },
    },
  });

  return seasons.map((season) => ({
    id: season.id,
    slug: season.slug,
    label: season.name,
    startMonth: season.startMonth,
    endMonth: season.endMonth,
    leadDays: season.leadDays,
    categoryIds: season.relSeasonsCategories.map((relation) => relation.categoryId),
  }));
}

export interface SeasonPage extends Season {
  description: string | null;
}

// Temporadas activas que generan página /temporada/[slug].
export async function getSeasonPages(): Promise<SeasonPage[]> {
  const [seasons, descriptions] = await Promise.all([
    getSeasons(),
    prisma.catSeasons.findMany({
      where: { status: 1 },
      select: { id: true, description: true },
    }),
  ]);
  const descriptionById = new Map(descriptions.map((season) => [season.id, season.description?.trim() || null]));
  return seasons.map((season) => ({ ...season, description: descriptionById.get(season.id) ?? null }));
}

export async function getSeasonPage(slug: string): Promise<SeasonPage | null> {
  return (await getSeasonPages()).find((season) => season.slug === slug) ?? null;
}
