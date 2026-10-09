import { getCategoryPage, getCategoryPages } from "@/lib/categories.server";
import { renderOgCard } from "@/lib/og-image";
import { getDesignImagePath, getDesignImageUrl } from "@/lib/site-designs.server";

// Tarjeta Open Graph de la categoría como og.png (no opengraph-image.tsx): en el export estático
// esa convención escribe el archivo sin extensión y S3 lo serviría como binary/octet-stream.
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return (await getCategoryPages()).map((category) => ({ slug: category.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const category = await getCategoryPage((await params).slug);
  const count = category?.designs.length ?? 0;
  const cover = category?.designs[0];

  return renderOgCard({
    eyebrow: "Categoría",
    title: category?.name ?? "Productos personalizados",
    detail: `${count} ${count === 1 ? "diseño personalizable" : "diseños personalizables"}`,
    imageSource: cover ? getDesignImageUrl(getDesignImagePath(cover)) : null,
  });
}
