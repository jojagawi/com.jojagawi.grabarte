import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import {
  extractFaq,
  findProductReferences,
  isBlogPostLive,
  parseFrontmatter,
  resolveProductReferences,
  toBlogDate,
  type BlogFaqItem,
  type BlogFrontmatter,
  type BlogProductRef,
} from "@/lib/blog";
import { getDesignHref, getSiteDesigns, type SiteDesign } from "@/lib/site-designs.server";

export const BLOG_DIR = join(process.cwd(), "content", "blog");
export const BLOG_PATH = "/blog";

export interface BlogPost extends BlogFrontmatter {
  slug: string;
  path: string;
  // Cuerpo con enlaces y precios de productos ya resueltos.
  markdown: string;
  faq: BlogFaqItem[];
  publishedAt: Date;
  modifiedAt: Date;
  // Productos del encabezado que siguen publicados, en el mismo orden.
  designs: SiteDesign[];
}

export function getBlogPostPath(slug: string): string {
  return `${BLOG_PATH}/${slug}`;
}

// BLOG_PREVIEW=true incluye borradores y fechas futuras, para revisar un PR en local.
function includeAll(): boolean {
  return process.env.BLOG_PREVIEW === "true";
}

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const files = (await readdir(BLOG_DIR).catch(() => [] as string[])).filter((file) => file.endsWith(".md"));
  const designs = await getSiteDesigns();
  const designsById = new Map(designs.map((design) => [design.id, design]));
  const productRefs = new Map<number, BlogProductRef>(
    designs.map((design) => [design.id, { href: getDesignHref(design), price: design.suggestedPrice }]),
  );
  const now = new Date();

  const posts = await Promise.all(
    files.map(async (file): Promise<BlogPost | null> => {
      const { data, body } = parseFrontmatter(await readFile(join(BLOG_DIR, file), "utf8"), file);
      if (!includeAll() && !isBlogPostLive(data, now)) {
        return null;
      }

      for (const id of findProductReferences(body)) {
        if (!productRefs.has(id)) {
          console.warn(`[blog] ${file}: el producto ${id} no está publicado; se muestra sin enlace ni precio.`);
        }
      }

      const slug = file.replace(/\.md$/u, "");
      const markdown = resolveProductReferences(body, productRefs);
      return {
        ...data,
        slug,
        path: getBlogPostPath(slug),
        markdown,
        faq: extractFaq(markdown),
        publishedAt: toBlogDate(data.publishAt),
        modifiedAt: toBlogDate(data.updatedAt),
        designs: data.products
          .map((id) => designsById.get(id))
          .filter((design): design is SiteDesign => Boolean(design)),
      };
    }),
  );

  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
});

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return (await getBlogPosts()).find((post) => post.slug === slug) ?? null;
}

export async function getBlogPostsBySeason(seasonSlug: string): Promise<BlogPost[]> {
  return (await getBlogPosts()).filter((post) => post.season === seasonSlug);
}
