import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatUpdatedDate } from "@/components/custom/updated-date";
import { BLOG_PATH, getBlogPosts } from "@/lib/blog.server";
import { buildPageMetadata } from "@/lib/metadata";
import { buildCollectionPageJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { toShowcaseItem } from "@/lib/site-designs.server";

const description =
  "Ideas de regalos personalizados por fecha y presupuesto, cómo pintar y armar piezas de MDF, y cuándo pedir para llegar a tiempo.";

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getBlogPosts();
  return buildPageMetadata({
    title: "Blog: ideas de regalos personalizados | InspiraArte",
    description,
    path: BLOG_PATH,
    keywords: ["ideas de regalos personalizados", "regalos grabados láser", "manualidades MDF", "InspiraArte", "México"],
    imageAlt: "Blog de InspiraArte: ideas de regalos personalizados",
    // Sin artículos publicados la página está vacía: no se indexa todavía.
    noIndex: posts.length === 0,
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const collectionJsonLd = buildCollectionPageJsonLd({
    path: `${BLOG_PATH}/`,
    name: "Blog de InspiraArte",
    description,
    breadcrumbs: [
      { name: "Inicio", path: "/" },
      { name: "Blog", path: `${BLOG_PATH}/` },
    ],
    items: posts.map((post) => ({ name: post.title, path: `${post.path}/` })),
  });

  return (
    <section className="py-16 lg:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionJsonLd) }} />
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
              Blog
            </li>
          </ol>
        </nav>

        <header className="mb-12 max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Blog
          </span>
          <h1 className="font-serif text-4xl font-bold text-foreground text-balance sm:text-5xl">
            Ideas para regalar y decorar con piezas personalizadas
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>
        </header>

        {posts.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const cover = post.designs[0] ? toShowcaseItem(post.designs[0], null) : null;
              return (
                <li key={post.slug}>
                  <Link
                    href={post.path}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {cover && (
                      <div className="relative aspect-4/3 overflow-hidden bg-muted">
                        <Image
                          src={cover.image}
                          alt={`${cover.name}, del artículo ${post.title}`}
                          fill
                          loading="lazy"
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-sm font-medium text-primary">
                        <time dateTime={post.publishedAt.toISOString()}>{formatUpdatedDate(post.publishedAt)}</time>
                      </p>
                      <h2 className="mt-1 font-serif text-2xl font-bold text-foreground text-balance">{post.title}</h2>
                      <p className="mt-3 flex-1 text-muted-foreground">{post.description}</p>
                      <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        Leer el artículo
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
        ) : (
          <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            Pronto publicaremos el primer artículo. Mientras tanto, revisa las{" "}
            <Link href="/temporada" className="font-medium text-primary underline underline-offset-4">
              temporadas
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
