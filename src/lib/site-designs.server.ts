import { prisma } from "@/lib/prisma";
import { selectDesignImagePath } from "@/lib/preview-thumbnails";
import { getPreviewThumbnailUrl } from "@/lib/preview-thumbnails.server";
import { slugify } from "@/lib/slug";
import type { SeasonShowcaseItem } from "@/components/custom/showcase-card";

// Diseños publicados en el sitio y su mapeo a tarjetas. Lo comparten la portada
// (hero y vitrina de temporada) y las páginas /temporada/[slug].

const defaultImage = "/dam/dafault-image-product.webp";

// Solo se muestra un plazo concreto ("2 a 4 días hábiles"); los textos tipo
// "A confirmar" o "Consultar" no le dicen nada al visitante en la portada.
export function toDisplayProductionTime(value: string | null): string | null {
  const text = value?.trim() ?? "";
  return /^\d+\s*(a|-)\s*\d+\s*días hábiles$/i.test(text) ? text : null;
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
      // Pedidos ganados en HubSpot (lo actualiza hubspot:sync-products).
      requests: true,
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
  return selectDesignImagePath(design.relDesignsFiles);
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
  return {
    id: design.id,
    name: design.name ?? "Diseño sin nombre",
    href: getDesignHref(design),
    image: getPreviewThumbnailUrl(
      design.id,
      480,
      getDesignImageUrl(getDesignImagePath(design)),
    ),
    occasion,
    isCustomizable: design.isCustomizable === 1,
    productionTime: toDisplayProductionTime(design.productionTime),
  };
}
