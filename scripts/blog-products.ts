import { getSeasonDesigns, getSeasonPage } from "@/lib/seasons.server";
import { getDesignCategoryNames, getSiteDesigns, toDisplayProductionTime } from "@/lib/site-designs.server";
import { prisma } from "@/lib/prisma";

// Productos publicados con los datos que un artículo puede citar (ID para producto:ID y {{precio:ID}}).
// Lo usa la rutina de borradores (docs/blog-rutina.md) para no inventar productos ni precios.
//
//   pnpm run blog:products               todos los productos publicados
//   pnpm run blog:products -- navidad    solo los de esa temporada

async function main() {
  const seasonSlug = process.argv[2];
  const season = seasonSlug ? await getSeasonPage(seasonSlug) : null;
  if (seasonSlug && !season) {
    throw new Error(`No existe la temporada "${seasonSlug}"`);
  }

  const designs = season ? (await getSeasonDesigns(season)).map(({ design }) => design) : await getSiteDesigns();
  const rows = designs.map((design) => ({
    id: design.id,
    nombre: design.name,
    precio: design.suggestedPrice,
    material: design.material?.name ?? null,
    medidas: design.dimensions,
    produccion: toDisplayProductionTime(design.productionTime),
    personalizable: design.isCustomizable === 1,
    categorias: getDesignCategoryNames(design).join(", "),
  }));

  console.log(JSON.stringify({ temporada: season?.label ?? null, productos: rows }, null, 2));
}

main()
  .catch((error: unknown) => {
    console.error("[blog:products]", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
