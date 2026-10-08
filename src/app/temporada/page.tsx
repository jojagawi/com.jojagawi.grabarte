import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildPageMetadata, toMetaDescription } from "@/lib/metadata";
import { formatSeasonMonths, getActiveSeasons } from "@/lib/seasons";
import { describeSeason, getSeasonPagesWithDesigns, getSeasonPath } from "@/lib/seasons.server";
import { toShowcaseItem } from "@/lib/site-designs.server";
import { buildCollectionPageJsonLd, serializeJsonLd } from "@/lib/structured-data";

const description =
  "Regalos y decoración personalizados para cada fecha del año: Día de muertos, Navidad, fiestas patrias, regreso a clases y más. Cotiza con tiempo.";

export const metadata: Metadata = buildPageMetadata({
  title: "Regalos personalizados por temporada | InspiraArte",
  description,
  path: "/temporada",
  keywords: ["regalos por temporada", "regalos personalizados", "decoración de temporada", "InspiraArte", "México"],
  imageAlt: "Regalos personalizados de InspiraArte para cada temporada del año",
});

// Meses que faltan para que empiece la temporada (0 = empieza este mes), para listar
// primero las próximas. En el export estático la fecha es la del build.
function monthsUntil(startMonth: number, now: Date): number {
  return (startMonth - (now.getMonth() + 1) + 12) % 12;
}

export default async function SeasonsPage() {
  const now = new Date();
  const seasons = await getSeasonPagesWithDesigns();
  const activeIds = new Set(getActiveSeasons(seasons, now).map((season) => season.id));
  const ordered = [...seasons].sort(
    (a, b) =>
      Number(activeIds.has(b.id)) - Number(activeIds.has(a.id)) ||
      monthsUntil(a.startMonth, now) - monthsUntil(b.startMonth, now),
  );

  const collectionJsonLd = buildCollectionPageJsonLd({
    path: "/temporada/",
    name: "Regalos personalizados por temporada",
    description,
    breadcrumbs: [
      { name: "Inicio", path: "/" },
      { name: "Temporadas", path: "/temporada/" },
    ],
    items: ordered.map((season) => ({
      name: season.label,
      path: `${getSeasonPath(season.slug)}/`,
      image: toShowcaseItem(season.designs[0].design, null).image,
    })),
  });

  return (
    <section className="py-16 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Ruta de navegación" className="mb-8 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-primary hover:underline underline-offset-4">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="text-foreground">
              Temporadas
            </li>
          </ol>
        </nav>

        <header className="mb-12 max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Temporadas
          </span>
          <h1 className="font-serif text-4xl font-bold text-foreground text-balance sm:text-5xl">
            Regalos personalizados para cada temporada
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Diseños de nuestro catálogo agrupados por fecha. Pide con tiempo: cada pieza se produce
            sobre pedido y te enviamos una propuesta de diseño antes de fabricarla.
          </p>
        </header>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((season) => {
            const cover = toShowcaseItem(season.designs[0].design, null);
            const isActive = activeIds.has(season.id);
            return (
              <li key={season.id}>
                <Link
                  href={getSeasonPath(season.slug)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-muted">
                    <Image
                      src={cover.image}
                      alt={`${cover.name}, diseño de ${season.label}`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    {isActive && (
                      <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        En temporada
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm font-medium text-primary">
                      {formatSeasonMonths(season.startMonth, season.endMonth)}
                    </p>
                    <h2 className="mt-1 font-serif text-2xl font-bold text-foreground text-balance">{season.label}</h2>
                    <p className="mt-3 flex-1 text-muted-foreground">{toMetaDescription(describeSeason(season), 150)}</p>
                    <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Ver {season.designs.length} {season.designs.length === 1 ? "diseño" : "diseños"}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
