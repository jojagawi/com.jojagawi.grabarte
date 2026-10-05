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
