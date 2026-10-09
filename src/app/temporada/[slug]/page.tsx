import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/components/custom/faq";
import { ShowcaseCard } from "@/components/custom/showcase-card";
import { buildCollectionFaq } from "@/lib/collection-faq";
import { buildPageMetadata, toMetaDescription } from "@/lib/metadata";
import { OG_IMAGE_SIZE } from "@/lib/og-image";
import { formatSeasonMonths } from "@/lib/seasons";
import {
  describeSeason,
  getSeasonDesigns,
  getSeasonPage,
  getSeasonPages,
  getSeasonPath,
} from "@/lib/seasons.server";
import { buildCollectionPageJsonLd, buildFaqPageJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { getDesignHref, getDesignImagePath, getDesignImageUrl, toShowcaseItem } from "@/lib/site-designs.server";

interface SeasonPageProps {
  params: Promise<{ slug: string }>;
}

// Export estático: una página por temporada activa de /catalogos/temporadas.
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return (await getSeasonPages()).map((season) => ({ slug: season.slug }));
}


const MAX_TITLE_LENGTH = 60;

// Etiquetas largas ("Día de muertos y Halloween") desbordan el title: se recorta en este orden.
function buildSeasonTitle(label: string): string {
  const candidates = [
    `${label}: regalos y decoración personalizados | InspiraArte`,
    `${label}: regalos personalizados | InspiraArte`,
    `${label}: regalos personalizados`,
  ];
  return candidates.find((title) => title.length <= MAX_TITLE_LENGTH) ?? `${label} | InspiraArte`;
}


export async function generateMetadata({ params }: SeasonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const season = await getSeasonPage(slug);
  if (!season) {
    return buildPageMetadata({
      title: "Temporada no encontrada | InspiraArte",
      description: "Esta temporada no está disponible.",
      path: `/temporada/${slug}`,
      noIndex: true,
    });
  }

  const designs = await getSeasonDesigns(season);
  return buildPageMetadata({
    title: buildSeasonTitle(season.label),
    description: toMetaDescription(describeSeason(season)),
    path: getSeasonPath(season.slug),
    // Tarjeta 1200×630 generada en el build (og.png/route.tsx).
    imagePath: `${getSeasonPath(season.slug)}/og.png`,
    imageAlt: `${season.label}: regalos personalizados de InspiraArte`,
    imageWidth: OG_IMAGE_SIZE.width,
    imageHeight: OG_IMAGE_SIZE.height,
    keywords: [season.label, "regalos personalizados", "grabado láser", "InspiraArte", "México"],
    // Sin piezas publicadas la página es delgada: no se indexa hasta tener catálogo.
    noIndex: designs.length === 0,
  });
}

export default async function SeasonDesignsPage({ params }: SeasonPageProps) {
  const { slug } = await params;
  const season = await getSeasonPage(slug);
  if (!season) {
    notFound();
  }

  const designs = await getSeasonDesigns(season);
  const quoteHref = `/contacto?producto=${encodeURIComponent(`Temporada: ${season.label}`)}`;
  const seasonPath = `${getSeasonPath(season.slug)}/`;
  const collectionJsonLd = buildCollectionPageJsonLd({
    path: seasonPath,
    name: season.label,
    description: describeSeason(season),
    breadcrumbs: [
      { name: "Inicio", path: "/" },
      { name: "Temporadas", path: "/temporada/" },
      { name: season.label, path: seasonPath },
    ],
    items: designs.map(({ design }) => ({
      name: design.name ?? "Diseño sin nombre",
      path: `${getDesignHref(design)}/`,
      image: getDesignImageUrl(getDesignImagePath(design)),
    })),
  });
  const faqs = buildCollectionFaq({
    name: season.label,
    designs: designs.map(({ design }) => design),
    leadDays: season.leadDays,
  });

  return (
    <section className="py-16 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionJsonLd) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildFaqPageJsonLd(seasonPath, faqs)) }}
        />
      )}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Ruta de navegación" className="mb-8 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-primary hover:underline underline-offset-4">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link href="/temporada" className="hover:text-primary hover:underline underline-offset-4">
                Temporadas
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="text-foreground">
              {season.label}
            </li>
          </ol>
        </nav>

        <header className="mb-12 max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Temporada · {formatSeasonMonths(season.startMonth, season.endMonth)}
          </span>
          <h1 className="font-serif text-4xl font-bold text-foreground text-balance sm:text-5xl">{season.label}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{describeSeason(season)}</p>
          {designs.length > 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
              {designs.length} {designs.length === 1 ? "diseño" : "diseños"} de nuestro catálogo
            </p>
          )}
        </header>

        {designs.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {designs.map(({ design, categoryName }) => (
              <li key={design.id}>
                <ShowcaseCard item={toShowcaseItem(design, categoryName)} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Aún no tenemos diseños publicados para {season.label}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Mientras tanto, revisa el catálogo completo o cuéntanos tu idea y la diseñamos contigo.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="outline" className="h-11 border-primary text-primary hover:bg-primary/10">
                <Link href="/productos">Ver el catálogo</Link>
              </Button>
              <Button asChild className="h-11 bg-primary text-primary-foreground hover:bg-inspirarte-petroleum-deep">
                <Link href={quoteHref}>Cotizar mi idea</Link>
              </Button>
            </div>
          </div>
        )}

        {faqs.length > 0 && (
          <div className="mt-16">
            <FAQ faqs={faqs} embedded />
          </div>
        )}

        {designs.length > 0 && (
          <div className="mt-16 flex flex-col gap-6 rounded-2xl bg-primary p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">
                ¿Buscas algo distinto para {season.label}?
              </h2>
              <p className="mt-2 text-white">
                Cuéntanos tu idea y te enviamos una propuesta de diseño antes de producir.
              </p>
            </div>
            <Link
              href={quoteHref}
              className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-6 font-semibold text-primary transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Cotizar mi idea
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
