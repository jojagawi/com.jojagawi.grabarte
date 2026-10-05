import { prisma } from "@/lib/prisma";
import { SEASON_PAGE_STATUSES, SEASON_STATUS, type Season } from "@/lib/seasons";

// Temporadas con sus categorías activas, en el orden del panel. Por defecto solo las
// activas: son las que entran a la vitrina de la portada.
export async function getSeasons(statuses: number[] = [SEASON_STATUS.active]): Promise<Season[]> {
  const seasons = await prisma.catSeasons.findMany({
    where: { status: { in: statuses } },
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

// Temporadas que generan página /temporada/[slug]: activas y "solo página".
export async function getSeasonPages(): Promise<SeasonPage[]> {
  const [seasons, descriptions] = await Promise.all([
    getSeasons(SEASON_PAGE_STATUSES),
    prisma.catSeasons.findMany({
      where: { status: { in: SEASON_PAGE_STATUSES } },
      select: { id: true, description: true },
    }),
  ]);
  const descriptionById = new Map(descriptions.map((season) => [season.id, season.description?.trim() || null]));
  return seasons.map((season) => ({ ...season, description: descriptionById.get(season.id) ?? null }));
}

export async function getSeasonPage(slug: string): Promise<SeasonPage | null> {
  return (await getSeasonPages()).find((season) => season.slug === slug) ?? null;
}
