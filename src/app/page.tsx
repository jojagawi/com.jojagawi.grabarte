import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/custom/hero";
import { Process } from "@/components/custom/process";
import { Testimonials } from "@/components/custom/testimonials";
import { getRandomHomeTestimonialsFromAthena } from "@/lib/rates-athena.server";
import { selectDesignImagePath } from "@/lib/preview-thumbnails";
import { getPreviewThumbnailUrl } from "@/lib/preview-thumbnails.server";
import { slugify } from "@/lib/slug";
import {
  FALLBACK_CATEGORY_ALIASES,
  getActiveSeasons,
  joinSpanishList,
  MIN_SEASON_DESIGNS,
  normalizeCategoryName,
} from "@/lib/seasons";
import { buildQuoteSubject } from "@/components/custom/product-quote-actions";
import { QuoteDoors } from "@/components/custom/quote-doors";
import {
  SeasonShowcase,
  type SeasonShowcaseItem,
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

const defaultImage = "/dam/dafault-image-product.webp";

// Solo se muestra un plazo concreto ("2 a 4 días hábiles"); los textos tipo
// "A confirmar" o "Consultar" no le dicen nada al visitante en la portada.
function toDisplayProductionTime(value: string | null): string | null {
  const text = value?.trim() ?? "";
  return /^\d+\s*(a|-)\s*\d+\s*días hábiles$/i.test(text) ? text : null;
}

type SiteDesign = Awaited<ReturnType<typeof getSiteDesigns>>[number];

function getSiteDesigns() {
  return prisma.designs.findMany({
    where: {
      status: 1,
      showInSite: 1,
      name: { not: null },
    },
    select: {
      id: true,
      name: true,
      description: true,
      isCustomizable: true,
      isTested: true,
      showInHome: true,
      productionTime: true,
      relDesignsCategories: {
        where: {
          status: 1,
          category: {
            status: 1,
            name: { not: null },
          },
        },
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      relDesignsFiles: {
        where: {
          status: 1,
          file: {
            status: 1,
            filePath: { not: null },
          },
        },
        select: {
          file: {
            select: {
              filePath: true,
              fileType: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

const mediaBaseUrl = (process.env.NEXT_PUBLIC_S3_PROTOCOL || "https")
  .concat("://")
  .concat(process.env.NEXT_PUBLIC_S3 || "/dam/files/");

function getDesignImagePath(design: SiteDesign): string | null {
  return selectDesignImagePath(design.relDesignsFiles);
}

function getDesignImageUrl(imagePath: string | null): string {
  return imagePath
    ? `${mediaBaseUrl}/${imagePath.replace(/^\/+/, "")}`
    : defaultImage;
}

function getDesignCategoryNames(design: SiteDesign): string[] {
  return Array.from(
    new Set(
      design.relDesignsCategories
        .map((relation) => relation.category?.name)
        .filter((name): name is string => Boolean(name?.trim())),
    ),
  );
}

function getDesignHref(design: SiteDesign): string {
  return `/productos/${design.id}-${slugify(design.name ?? "Diseño sin nombre")}`;
}

// Probados y elegidos para la portada primero; el resto conserva el orden de más reciente.
function byShowcasePriority(a: SiteDesign, b: SiteDesign): number {
  return (
    (b.isTested ?? 0) - (a.isTested ?? 0) ||
    (b.showInHome ?? 0) - (a.showInHome ?? 0)
  );
}

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

interface ShowcaseContent {
  isSeasonal: boolean;
  eyebrow: string;
  title: string;
  description: string;
  items: SeasonShowcaseItem[];
}

function buildShowcase(designs: SiteDesign[]): ShowcaseContent {
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

  function toItem(
    design: SiteDesign,
    occasion: string | null,
  ): SeasonShowcaseItem {
    return {
      id: design.id,
      name: design.name ?? "Diseño sin nombre",
      href: getDesignHref(design),
      image: getPreviewThumbnailUrl(
        design.id,
        480,
        getDesignImageUrl(getDesignImagePath(design)),
      ),
      occasion,
      isCustomizable: design.isCustomizable === 1,
      productionTime: toDisplayProductionTime(design.productionTime),
    };
  }

  const seenIds = new Set<number>();
  const seasonItems: SeasonShowcaseItem[] = [];
  const shownSeasons: string[] = [];

  for (const season of getActiveSeasons()) {
    const seasonDesigns = matching(season.categoryAliases)
      .filter((design) => !seenIds.has(design.id))
      .sort(byShowcasePriority);
    if (seasonDesigns.length === 0) {
      continue;
    }
    shownSeasons.push(season.label);
    for (const design of seasonDesigns) {
      seenIds.add(design.id);
      seasonItems.push(toItem(design, season.label));
    }
  }

  if (seasonItems.length >= MIN_SEASON_DESIGNS) {
    return {
      isSeasonal: true,
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
    eyebrow: "Nuestro catálogo",
    title: "Diseños del catálogo",
    description:
      "Piezas reales que ya producimos. Ábrelas para ver qué se puede personalizar y cuánto tardan.",
    items: fallbackItems.slice(0, MAX_SHOWCASE_DESIGNS),
  };
}

export default async function Home() {
  const siteDesigns = await getSiteDesigns();

  const showcase = buildShowcase(siteDesigns);

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
    const imageUrl = getDesignImageUrl(getDesignImagePath(design));
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
      featuredImage: getPreviewThumbnailUrl(design.id, 960, imageUrl),
      secondaryImage: getPreviewThumbnailUrl(design.id, 480, imageUrl),
      categories: getDesignCategoryNames(design),
    };
  });

  // Las piezas del hero no se repiten en la vitrina.
  const heroIds = new Set(heroDesigns.map((design) => design.id));
  const showcaseItems = showcase.items.filter((item) => !heroIds.has(item.id));

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
        />
      )}
      <QuoteDoors />
      <Process />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
