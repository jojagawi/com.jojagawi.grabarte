import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { FAQ } from "@/components/custom/faq";
import { ShowcaseCard } from "@/components/custom/showcase-card";
import { buildCollectionFaq } from "@/lib/collection-faq";
import { buildPageMetadata, toMetaDescription } from "@/lib/metadata";
import { OG_IMAGE_SIZE } from "@/lib/og-image";
import {
  type CategoryPage,
  getCategoryPage,
  getCategoryPages,
  getCategoryPath,
  isCategoryIndexable,
} from "@/lib/categories.server";
import {
  getDesignHref,
  getDesignImagePath,
  getDesignImageUrl,
  toShowcaseItem,
} from "@/lib/site-designs.server";
import { buildCollectionPageJsonLd, buildFaqPageJsonLd, serializeJsonLd } from "@/lib/structured-data";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// Export estático: una página por categoría activa con diseños publicados.
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return (await getCategoryPages()).map((category) => ({ slug: category.slug }));
}

const MAX_TITLE_LENGTH = 60;

function buildCategoryTitle(name: string): string {
  const candidates = [
    `${name}: diseños personalizados | InspiraArte`,
    `${name} personalizados | InspiraArte`,
    `${name} | InspiraArte`,
  ];
  return candidates.find((title) => title.length <= MAX_TITLE_LENGTH) ?? name;
}

function describeCategory(category: CategoryPage): string {
  if (category.description) {
    return category.description;
  }

  const count = category.designs.length;
  return `${count} ${count === 1 ? "diseño" : "diseños"} de ${category.name} en nuestro catálogo, hechos en nuestro taller de Ciudad de México. Personalízalos con nombres, fechas o tu logo y cotiza sin compromiso: te enviamos una propuesta antes de producir.`;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryPage(slug);
  if (!category) {
    return buildPageMetadata({
      title: "Categoría no encontrada | InspiraArte",
      description: "Esta categoría no está disponible.",
      path: getCategoryPath(slug),
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: buildCategoryTitle(category.name),
    description: toMetaDescription(describeCategory(category)),
    path: getCategoryPath(category.slug),
    keywords: [category.name, "productos personalizados", "grabado láser", "InspiraArte", "México"],
    // Tarjeta 1200×630 generada en el build (og.png/route.tsx).
    imagePath: `${getCategoryPath(category.slug)}/og.png`,
    imageAlt: `${category.name}: productos personalizados de InspiraArte`,
    imageWidth: OG_IMAGE_SIZE.width,
    imageHeight: OG_IMAGE_SIZE.height,
    noIndex: !isCategoryIndexable(category),
    followLinks: true,
  });
}

export default async function CategoryDesignsPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryPage(slug);
  if (!category) {
    notFound();
  }

  const categoryPath = `${getCategoryPath(category.slug)}/`;
  const quoteHref = `/contacto?producto=${encodeURIComponent(`Categoría: ${category.name}`)}`;
  const collectionJsonLd = buildCollectionPageJsonLd({
    path: categoryPath,
    name: category.name,
    description: describeCategory(category),
    breadcrumbs: [
      { name: "Inicio", path: "/" },
      { name: "Productos", path: "/productos/" },
      { name: category.name, path: categoryPath },
    ],
    items: category.designs.map((design) => ({
      name: design.name ?? "Diseño sin nombre",
      path: `${getDesignHref(design)}/`,
      image: getDesignImageUrl(getDesignImagePath(design)),
    })),
  });
  const faqs = buildCollectionFaq({ name: category.name, designs: category.designs });

  return (
    <section className="py-16 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionJsonLd) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildFaqPageJsonLd(categoryPath, faqs)) }}
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
              <Link href="/productos" className="hover:text-primary hover:underline underline-offset-4">
                Productos
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="text-foreground">
              {category.name}
            </li>
          </ol>
        </nav>

        <header className="mb-12 max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Categoría
          </span>
          <h1 className="font-serif text-4xl font-bold text-foreground text-balance sm:text-5xl">{category.name}</h1>
          <div className="mt-4 max-w-2xl space-y-4 text-lg leading-relaxed text-muted-foreground">
            {describeCategory(category)
              .split("\n\n")
              .map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
          </div>
          {category.description && (
            <p className="mt-4 text-sm text-muted-foreground">
              {category.designs.length} {category.designs.length === 1 ? "diseño" : "diseños"} de nuestro catálogo
            </p>
          )}
        </header>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {category.designs.map((design) => (
            <li key={design.id}>
              <ShowcaseCard item={toShowcaseItem(design, null)} />
            </li>
          ))}
        </ul>

        {faqs.length > 0 && (
          <div className="mt-16">
            <FAQ faqs={faqs} embedded />
          </div>
        )}

        <div className="mt-16 flex flex-col gap-6 rounded-2xl bg-primary p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">
              ¿No encuentras lo que buscas en {category.name}?
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
      </div>
    </section>
  );
}
