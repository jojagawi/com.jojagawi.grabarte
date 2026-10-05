import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  PREVIEW_THUMBNAIL_DIR,
  PREVIEW_THUMBNAIL_URL_BASE,
  previewThumbnailFileName,
  type PreviewThumbnailWidth,
} from "@/lib/preview-thumbnails";

// URL de la miniatura si el prebuild la generó; si no, la imagen original.
export function getPreviewThumbnailUrl(
  designId: number,
  width: PreviewThumbnailWidth,
  fallbackUrl: string,
): string {
  const fileName = previewThumbnailFileName(designId, width);
  return existsSync(join(process.cwd(), PREVIEW_THUMBNAIL_DIR, fileName))
    ? `${PREVIEW_THUMBNAIL_URL_BASE}/${fileName}`
    : fallbackUrl;
}
