import { renderOgCard } from "@/lib/og-image";
import { formatSeasonMonths } from "@/lib/seasons";
import { getSeasonDesigns, getSeasonPage, getSeasonPages } from "@/lib/seasons.server";
import { getDesignImagePath, getDesignImageUrl } from "@/lib/site-designs.server";

// Tarjeta Open Graph de la temporada como og.png (ver productos/categoria/[slug]/og.png).
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return (await getSeasonPages()).map((season) => ({ slug: season.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const season = await getSeasonPage((await params).slug);
  const designs = season ? await getSeasonDesigns(season) : [];
  const cover = designs[0]?.design;

  return renderOgCard({
    eyebrow: season ? `Temporada · ${formatSeasonMonths(season.startMonth, season.endMonth)}` : "Temporada",
    title: season?.label ?? "Regalos de temporada",
    detail:
      designs.length > 0
        ? `${designs.length} ${designs.length === 1 ? "diseño personalizable" : "diseños personalizables"}`
        : "Diseñamos tu idea a la medida",
    imageSource: cover ? getDesignImageUrl(getDesignImagePath(cover)) : null,
  });
}
