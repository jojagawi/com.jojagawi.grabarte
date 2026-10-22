import { renderOgCard } from "@/lib/og-image";
import { getBlogPost, getBlogPosts } from "@/lib/blog.server";
import { getDesignImagePath, getDesignImageUrl } from "@/lib/site-designs.server";

// Tarjeta Open Graph del artículo como og.png (ver temporada/[slug]/og.png).
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await getBlogPosts();
  return posts.length > 0 ? posts.map((post) => ({ slug: post.slug })) : [{ slug: "sin-articulos" }];
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const post = await getBlogPost((await params).slug);
  const cover = post?.designs[0];

  return renderOgCard({
    eyebrow: "Blog de InspiraArte",
    title: post?.title ?? "Ideas de regalos personalizados",
    detail: post ? `${post.designs.length} productos para personalizar` : "Diseñamos tu idea a la medida",
    imageSource: cover ? getDesignImageUrl(getDesignImagePath(cover)) : null,
  });
}
