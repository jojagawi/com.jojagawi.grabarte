import { slugify } from "@/lib/slug";

// Ruta en S3 de la vista previa de un diseño: preview/[id_diseño]-[id_archivo]-[slug].[ext]
// (antes preview/[id_diseño].webp). El id del archivo hace el nombre único por versión,
// así que una vista previa nueva nunca reutiliza la URL cacheada de la anterior.
export function buildPreviewObjectKey(
  designId: number,
  fileId: number,
  designName: string | null | undefined,
  extension: string,
): string {
  const slug = slugify(designName ?? "") || "diseno";
  const cleanExtension = extension.replace(/^\.+/, "").toLowerCase() || "webp";
  return `preview/${designId}-${fileId}-${slug}.${cleanExtension}`;
}

// Miniatura generada con IA (590×590) a partir de una vista previa:
// preview/[id_diseño]-[id_archivo]-[slug].webp → preview/[id_diseño]-[id_archivo]-[slug]-thumb.webp
// Se deriva de la ruta guardada de la vista previa, así no depende del nombre actual del diseño.
export const AI_THUMB_SIZE = 590;

export function buildAiThumbObjectKey(previewFilePath: string): string {
  return `${previewFilePath.replace(/\.[a-z0-9]+$/i, "")}-thumb.webp`;
}

export function isAiThumbPath(path: string | null | undefined): boolean {
  return Boolean(path?.endsWith("-thumb.webp"));
}
