import { buildAiThumbObjectKey } from "@/lib/preview-paths";

// Miniaturas de las vistas previas del catálogo, generadas en el prebuild
// (scripts/build-preview-thumbnails.ts) y servidas como archivos estáticos.
// En el export estático next/image no optimiza, así que sin esto cada tarjeta
// descargaría la vista previa completa del CDN (76–272 KB).

export const PREVIEW_THUMBNAIL_DIR = "public/generated/previews";
export const PREVIEW_THUMBNAIL_URL_BASE = "/generated/previews";

// 480 cubre tarjetas de hasta ~240 px a 2x; 960, la pieza destacada del hero.
export const PREVIEW_THUMBNAIL_WIDTHS = [480, 960] as const;
export type PreviewThumbnailWidth = (typeof PREVIEW_THUMBNAIL_WIDTHS)[number];

export function previewThumbnailFileName(designId: number, width: PreviewThumbnailWidth): string {
  return `${designId}-${width}.webp`;
}

interface DesignFileRelation {
  file: {
    filePath: string | null;
    thumbGenerated?: boolean;
    fileType: { name: string | null } | null;
  } | null;
}

// Misma regla que el resto del sitio: la "Vista previa" y, si no hay, el primer archivo con ruta.
export function selectDesignImagePath(relations: DesignFileRelation[]): string | null {
  const previewFile = relations.find(
    (relation) => relation.file?.fileType?.name === "Vista previa" && relation.file.filePath,
  );
  const firstFileWithPath = relations.find((relation) => relation.file?.filePath);
  return previewFile?.file?.filePath ?? firstFileWithPath?.file?.filePath ?? null;
}

// Imagen para tarjetas y vistas del sitio: la miniatura de IA si ya se generó para la
// vista previa (Files.thumbGenerated); si no, la vista previa original. La vista a
// pantalla completa de la ficha sigue usando selectDesignImagePath (la original).
export function selectDesignCardImagePath(relations: DesignFileRelation[]): string | null {
  const preview = relations.find(
    (relation) => relation.file?.fileType?.name === "Vista previa" && relation.file.filePath,
  )?.file;
  if (preview?.filePath && preview.thumbGenerated) {
    return buildAiThumbObjectKey(preview.filePath);
  }
  return selectDesignImagePath(relations);
}
