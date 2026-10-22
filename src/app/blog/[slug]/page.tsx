import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { GuideContent } from "@/components/custom/guide-content";
import { ShowcaseCard } from "@/components/custom/showcase-card";
import { formatUpdatedDate } from "@/components/custom/updated-date";
import { countWords } from "@/lib/blog";
import { BLOG_PATH, getBlogPost, getBlogPosts } from "@/lib/blog.server";
import { buildPageMetadata, fitTitle, toMetaDescription } from "@/lib/metadata";
import { OG_IMAGE_SIZE } from "@/lib/og-image";
import { getSeasonPage, getSeasonPath } from "@/lib/seasons.server";
import { buildBlogPostingJsonLd, buildFaqPageJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { getDesignImagePath, getDesignImageUrl, toShowcaseItem } from "@/lib/site-designs.server";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Export estático: una página por artículo publicado de content/blog.
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await getBlogPosts();
  // Next exige al menos una ruta en el export estático; sin artículos queda un 404 noindex.
  return posts.length > 0 ? posts.map((post) => ({ slug: post.slug })) : [{ slug: "sin-articulos" }];
}

const WORDS_PER_MINUTE = 200;

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) {
    return buildPageMetadata({
      title: "Artículo no encontrado | InspiraArte",
      description: "Este artículo no está disponible.",
      path: `${BLOG_PATH}/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: fitTitle(post.title),
    description: toMetaDescription(post.description),
    path: post.path,
    type: "article",
    imagePath: `${post.path}/og.png`,
    imageAlt: post.title,
    imageWidth: OG_IMAGE_SIZE.width,
    imageHeight: OG_IMAGE_SIZE.height,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) {
    notFound();
  }

  const season = post.season ? await getSeasonPage(post.season) : null;
  const postPath = `${post.path}/`;
  const wordCount = countWords(post.markdown);
  const readingMinutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
  const cover = post.designs[0];
  const quoteHref = `/contacto?producto=${encodeURIComponent(`Blog: ${post.title}`)}`;
  const articleJsonLd = buildBlogPostingJsonLd({
    path: postPath,
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt,
    image: cover ? getDesignImageUrl(getDesignImagePath(cover)) : null,
    authorName: post.author,
    wordCount,
    about: season?.label ?? null,
    breadcrumbs: [
      { name: "Inicio", path: "/" },
      { name: "Blog", path: `${BLOG_PATH}/` },
      { name: post.title, path: postPath },
    ],
  });

  return (
    <section className="py-16 lg:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }} />
      {post.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildFaqPageJsonLd(postPath, post.faq)) }}
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
              <Link href={BLOG_PATH} className="hover:text-primary hover:underline underline-offset-4">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="text-foreground">
              {post.title}
            </li>
          </ol>
        </nav>

        <article className="max-w-3xl">
          <header className="mb-10">
            {season && (
              <Link
                href={getSeasonPath(season.slug)}
                className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary hover:bg-primary/15"
              >
                {season.label}
              </Link>
            )}
            <h1 className="font-serif text-4xl font-bold text-foreground text-balance sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{post.description}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              {post.author ? `${post.author} · ` : ""}
              Publicado el <time dateTime={post.publishedAt.toISOString()}>{formatUpdatedDate(post.publishedAt)}</time>
              {post.modifiedAt > post.publishedAt && (
                <>
                  {" · "}Actualizado el{" "}
                  <time dateTime={post.modifiedAt.toISOString()}>{formatUpdatedDate(post.modifiedAt)}</time>
                </>
              )}
              {` · ${readingMinutes} min de lectura`}
            </p>
          </header>

          <GuideContent markdown={post.markdown} />
        </article>

        {post.designs.length > 0 && (
          <div className="mt-16" data-llms-skip>
            <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">Productos de este artículo</h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {post.designs.map((design) => (
                <li key={design.id}>
                  <ShowcaseCard item={toShowcaseItem(design, null)} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-16 flex flex-col gap-6 rounded-2xl bg-primary p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">¿Tienes otra idea en mente?</h2>
            <p className="mt-2 text-white">
              Cuéntanos qué buscas y te enviamos una propuesta de diseño antes de producir.
              {season && (
                <>
                  {" "}O revisa todo lo de{" "}
                  <Link href={getSeasonPath(season.slug)} className="font-semibold underline underline-offset-4">
                    {season.label}
                  </Link>
                  .
                </>
              )}
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
