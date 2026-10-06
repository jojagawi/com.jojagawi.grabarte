import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { Hero } from "@/components/custom/hero";
import { Process } from "@/components/custom/process";
import { Testimonials } from "@/components/custom/testimonials";
import { getRandomHomeTestimonialsFromAthena } from "@/lib/rates-athena.server";
import { getPreviewThumbnailUrl } from "@/lib/preview-thumbnails.server";
import {
  FALLBACK_CATEGORY_ALIASES,
  getActiveSeasons,
  joinSpanishList,
  MIN_SEASON_DESIGNS,
  normalizeCategoryName,
  type Season,
} from "@/lib/seasons";
import { getSeasons } from "@/lib/seasons.server";
import {
  byShowcasePriority,
  getDesignCategoryNames,
  getDesignHref,
  getDesignImagePath,
  getDesignImageUrl,
  getSiteDesigns,
  type SiteDesign,
  toDisplayProductionTime,
  toShowcaseItem,
} from "@/lib/site-designs.server";
import { buildQuoteSubject } from "@/components/custom/product-quote-actions";
import { QuoteDoors } from "@/components/custom/quote-doors";
import { DesignGridSection } from "@/components/custom/design-grid-section";
import {
  SeasonShowcase,
  type SeasonShowcaseItem,
  type SeasonShowcaseLink,
} from "@/components/custom/season-showcase";

export const metadata: Metadata = buildPageMetadata({
  title: "InspiraArte | Regalos y productos personalizados en México",
  description:
    "Creamos termos, llaveros, figuras MDF y más con grabado y corte láser. Cotiza tu diseño personalizado para regalos, eventos y marcas.",
  path: "/",
  keywords: [
    "productos personalizados",
    "regalos personalizados",
    "grabado láser",
    "corte láser",
    "InspiraArte",
    "termos personalizados",
    "México",
  ],
  imagePath: "/dam/logos/hero.webp",
  imageAlt: "Catalogo de productos personalizados de InspiraArte",
});

export const llmstxt = {
  title: "Inicio",
  description: "Presentación general de InspiraArte y acceso al catálogo.",
};

// Fisher-Yates. En el export estático el orden queda fijo hasta el siguiente build.
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
  }
  return result;
}

const MAX_SHOWCASE_DESIGNS = 20;

// "Los más pedidos": diseños publicados con pedidos ganados (Designs.requests), hasta
// MAX_TOP_REQUESTED. Con menos de MIN_TOP_REQUESTED la sección no se muestra.
const MAX_TOP_REQUESTED = 4;
const MIN_TOP_REQUESTED = 2;

function getTopRequested(designs: SiteDesign[]): SeasonShowcaseItem[] {
  return designs
    .filter((design) => design.requests > 0)
    .sort(
      (a, b) =>
        b.requests - a.requests || byShowcasePriority(a, b) || a.id - b.id,
    )
    .slice(0, MAX_TOP_REQUESTED)
    .map((design) =>
      toShowcaseItem(design, getDesignCategoryNames(design)[0] ?? null),
    );
}

// "Lo más nuevo": los últimos diseños publicados según la fecha en que se agregaron.
const MAX_NEWEST = 4;

function getNewest(designs: SiteDesign[]): SeasonShowcaseItem[] {
  return [...designs]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id - a.id)
    .slice(0, MAX_NEWEST)
    .map((design) =>
      toShowcaseItem(design, getDesignCategoryNames(design)[0] ?? null),
    );
}

interface ShowcaseContent {
  isSeasonal: boolean;
  seasonLinks: SeasonShowcaseLink[];
  eyebrow: string;
  title: string;
  description: string;
  items: SeasonShowcaseItem[];
}

function buildShowcase(
  designs: SiteDesign[],
  seasons: Season[],
): ShowcaseContent {
  const designCategories = new Map(
    designs.map((design) => [
      design.id,
      getDesignCategoryNames(design).map(normalizeCategoryName),
    ]),
  );

  function matching(aliases: string[]): SiteDesign[] {
    return designs.filter((design) =>
      designCategories.get(design.id)?.some((name) => aliases.includes(name)),
    );
  }

  // Temporadas: por id de categoría, tal como se asignan en /catalogos/temporadas.
  function inCategories(categoryIds: number[]): SiteDesign[] {
    return designs.filter((design) =>
      design.relDesignsCategories.some(
        (relation) =>
          relation.category && categoryIds.includes(relation.category.id),
      ),
    );
  }

  function toItem(
    design: SiteDesign,
    occasion: string | null,
  ): SeasonShowcaseItem {
    return toShowcaseItem(design, occasion);
  }

  const seenIds = new Set<number>();
  const seasonItems: SeasonShowcaseItem[] = [];
  const shownSeasons: string[] = [];
  const seasonLinks: SeasonShowcaseLink[] = [];

  for (const season of getActiveSeasons(seasons)) {
    const seasonDesigns = inCategories(season.categoryIds)
      .filter((design) => !seenIds.has(design.id))
      .sort(byShowcasePriority);
    if (seasonDesigns.length === 0) {
      continue;
    }
    shownSeasons.push(season.label);
    // El conteo es de toda la temporada, no solo de lo que cabe en el carrusel.
    seasonLinks.push({
      slug: season.slug,
      label: season.label,
      count: inCategories(season.categoryIds).length,
    });
    for (const design of seasonDesigns) {
      seenIds.add(design.id);
      seasonItems.push(toItem(design, season.label));
    }
  }

  if (seasonItems.length >= MIN_SEASON_DESIGNS) {
    return {
      isSeasonal: true,
      seasonLinks,
      eyebrow: "De temporada",
      title: `Para ${joinSpanishList(shownSeasons)}`,
      description:
        "Diseños de nuestro catálogo para estas fechas. Pide el tuyo con tiempo para que llegue antes del día.",
      items: seasonItems.slice(0, MAX_SHOWCASE_DESIGNS),
    };
  }

  // Sin temporada con piezas suficientes: regalos y adornos, completando con el resto del catálogo.
  const fallbackDesigns = [
    ...matching(FALLBACK_CATEGORY_ALIASES).sort(byShowcasePriority),
    ...[...designs].sort(byShowcasePriority),
  ];
  const fallbackIds = new Set<number>();
  const fallbackItems: SeasonShowcaseItem[] = [];
  for (const design of fallbackDesigns) {
    if (fallbackIds.has(design.id)) {
      continue;
    }
    fallbackIds.add(design.id);
    fallbackItems.push(
      toItem(design, getDesignCategoryNames(design)[0] ?? null),
    );
  }

  return {
    isSeasonal: false,
    seasonLinks: [],
    eyebrow: "Nuestro catálogo",
    title: "Diseños del catálogo",
    description:
      "Piezas reales que ya producimos. Ábrelas para ver qué se puede personalizar y cuánto tardan.",
    items: fallbackItems.slice(0, MAX_SHOWCASE_DESIGNS),
  };
}

export default async function Home() {
  const [siteDesigns, seasons] = await Promise.all([
    getSiteDesigns(),
    getSeasons(),
  ]);

  const showcase = buildShowcase(siteDesigns, seasons);

  // Con temporada activa, el hero abre con sus piezas (probadas primero) para que
  // portada y vitrina hablen de la misma fecha; sin temporada, una selección de portada.
  const designsById = new Map(siteDesigns.map((design) => [design.id, design]));
  const designs = showcase.isSeasonal
    ? showcase.items
        .map((item) => designsById.get(item.id))
        .filter((design): design is SiteDesign => Boolean(design))
    : shuffle(siteDesigns.filter((design) => design.showInHome === 1));

  // Miniaturas generadas en el prebuild (no base64: viajaban dos veces, en el HTML y en el payload RSC).
  const heroDesigns = designs.slice(0, 3).map((design) => {
    // Miniatura de IA si existe (o la vista previa original).
    const imagePath = getDesignImagePath(design);
    const imageUrl = getDesignImageUrl(imagePath);
    const name = design.name ?? "Diseño sin nombre";
    const productReference = `IA-${String(design.id).padStart(4, "0")}`;

    return {
      id: design.id,
      name,
      description:
        design.description?.trim() ||
        "Diseño personalizado disponible bajo cotización.",
      href: getDesignHref(design),
      quoteHref: `/contacto?producto=${encodeURIComponent(buildQuoteSubject(name, productReference))}`,
      isCustomizable: design.isCustomizable === 1,
      productionTime: toDisplayProductionTime(design.productionTime),
      image: imageUrl,
      featuredImage: getPreviewThumbnailUrl(design.id, 960, imageUrl, imagePath),
      secondaryImage: getPreviewThumbnailUrl(design.id, 480, imageUrl, imagePath),
      categories: getDesignCategoryNames(design),
    };
  });

  // Las piezas del hero no se repiten en la vitrina.
  const heroIds = new Set(heroDesigns.map((design) => design.id));
  const showcaseItems = showcase.items.filter((item) => !heroIds.has(item.id));

  const topRequested = getTopRequested(siteDesigns);
  const newest = getNewest(siteDesigns);

  const testimonials = await getRandomHomeTestimonialsFromAthena(4).catch(
    (error: unknown) => {
      console.error("No se pudieron cargar los testimonios de Athena", error);
      return [];
    },
  );

  return (
    <>
      <Hero designs={heroDesigns} />
      {showcaseItems.length > 0 && (
        <SeasonShowcase
          eyebrow={showcase.eyebrow}
          title={showcase.title}
          description={showcase.description}
          items={showcaseItems}
          totalDesigns={siteDesigns.length}
          seasonLinks={showcase.seasonLinks}
        />
      )}
      {topRequested.length >= MIN_TOP_REQUESTED && (
        <DesignGridSection
          id="mas-pedidos"
          eyebrow="Los más pedidos"
          title="Lo que más nos piden"
          description="Los diseños con más pedidos de nuestros clientes. Ábrelos para ver qué puedes personalizar."
          items={topRequested}
        />
      )}
      {newest.length === MAX_NEWEST && (
        <DesignGridSection
          id="lo-mas-nuevo"
          eyebrow="Lo más nuevo"
          title="Recién agregados al catálogo"
          description="Los últimos diseños que sumamos al catálogo."
          items={newest}
        />
      )}
      <QuoteDoors />
      <Process />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
