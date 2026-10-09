import { prisma } from "@/lib/prisma";
import { selectDesignCardImagePath } from "@/lib/preview-thumbnails";
import { getPreviewThumbnailUrl } from "@/lib/preview-thumbnails.server";
import { slugify } from "@/lib/slug";
import type { SeasonShowcaseItem } from "@/components/custom/showcase-card";

// Diseños publicados en el sitio y su mapeo a tarjetas. Lo comparten la portada
// (hero y vitrina de temporada) y las páginas /temporada/[slug].

const defaultImage = "/dam/default-image-product.webp";

// Solo se muestra un plazo concreto ("2 a 4 días hábiles", "Hasta 5 días hábiles"); los textos
// tipo "A confirmar" o "Consultar" no le dicen nada al visitante. Si el plazo trae una coletilla
// ("3 a 5 días hábiles de fabricación artesanal") se muestra solo el plazo.
export function toDisplayProductionTime(value: string | null | undefined): string | null {
  const match = value?.trim().match(/^(\d+\s*(?:a|-)\s*\d+|hasta\s+\d+)\s*días hábiles/iu);
  return match ? match[0].replace(/\s+/gu, " ") : null;
}

export type SiteDesign = Awaited<ReturnType<typeof getSiteDesigns>>[number];

export function getSiteDesigns() {
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
      // Precio de referencia y material: los resumen las preguntas frecuentes de categorías y temporadas.
      suggestedPrice: true,
      material: { select: { name: true } },
      // Pedidos ganados en HubSpot (lo actualiza hubspot:sync-products).
      requests: true,
      createdAt: true,
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
              id: true,
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
              thumbGenerated: true,
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

export function getDesignImagePath(design: SiteDesign): string | null {
  // Miniatura de IA si existe; si no, la vista previa original.
  return selectDesignCardImagePath(design.relDesignsFiles);
}

export function getDesignImageUrl(imagePath: string | null): string {
  return imagePath
    ? `${mediaBaseUrl}/${imagePath.replace(/^\/+/, "")}`
    : defaultImage;
}

export function getDesignCategoryNames(design: SiteDesign): string[] {
  return Array.from(
    new Set(
      design.relDesignsCategories
        .map((relation) => relation.category?.name)
        .filter((name): name is string => Boolean(name?.trim())),
    ),
  );
}

export function getDesignHref(design: SiteDesign): string {
  return `/productos/${design.id}-${slugify(design.name ?? "Diseño sin nombre")}`;
}

// Probados y elegidos para la portada primero; el resto conserva el orden de más reciente.
export function byShowcasePriority(a: SiteDesign, b: SiteDesign): number {
  return (
    (b.isTested ?? 0) - (a.isTested ?? 0) ||
    (b.showInHome ?? 0) - (a.showInHome ?? 0)
  );
}

export function toShowcaseItem(
  design: SiteDesign,
  occasion: string | null,
): SeasonShowcaseItem {
  // Miniatura de IA si existe (o la vista previa); la copia local solo si salió de esa imagen.
  const imagePath = getDesignImagePath(design);
  return {
    id: design.id,
    name: design.name ?? "Diseño sin nombre",
    href: getDesignHref(design),
    image: getPreviewThumbnailUrl(design.id, 480, getDesignImageUrl(imagePath), imagePath),
    occasion,
    isCustomizable: design.isCustomizable === 1,
    productionTime: toDisplayProductionTime(design.productionTime),
  };
}
