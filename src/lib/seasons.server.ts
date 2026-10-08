import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { SEASON_PAGE_STATUSES, SEASON_STATUS, type Season } from "@/lib/seasons";
import { byShowcasePriority, getSiteDesigns, type SiteDesign } from "@/lib/site-designs.server";

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

export interface SeasonDesign {
  design: SiteDesign;
  // Categoría que trajo el diseño a la temporada, para el chip de la tarjeta.
  categoryName: string | null;
}

export function getSeasonPath(slug: string): string {
  return `/temporada/${slug}`;
}

export function describeSeason(season: SeasonPage): string {
  return (
    season.description?.replace(/\s+/gu, " ").trim() ||
    `Diseños personalizados de InspiraArte para ${season.label}. Cotiza el tuyo y te enviamos una propuesta antes de producir.`
  );
}

// Diseños publicados de las categorías de la temporada.
export async function getSeasonDesigns(season: SeasonPage): Promise<SeasonDesign[]> {
  const designs = await getSiteDesigns();
  return designs
    .filter((design) =>
      design.relDesignsCategories.some(
        (relation) => relation.category && season.categoryIds.includes(relation.category.id),
      ),
    )
    .sort(byShowcasePriority)
    .map((design) => ({
      design,
      categoryName:
        design.relDesignsCategories.find(
          (relation) => relation.category && season.categoryIds.includes(relation.category.id),
        )?.category?.name ?? null,
    }));
}

// Temporadas con al menos un diseño publicado: las únicas indexables (sin piezas, la página
// /temporada/[slug] sale con noindex). Las usan /temporada y el footer.
// cache(): el footer y la página la piden en el mismo render.
export const getSeasonPagesWithDesigns = cache(async (): Promise<Array<SeasonPage & { designs: SeasonDesign[] }>> => {
  const seasons = await getSeasonPages();
  const withDesigns = await Promise.all(
    seasons.map(async (season) => ({ ...season, designs: await getSeasonDesigns(season) })),
  );
  return withDesigns.filter((season) => season.designs.length > 0);
});
