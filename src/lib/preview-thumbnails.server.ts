import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  PREVIEW_THUMBNAIL_DIR,
  PREVIEW_THUMBNAIL_URL_BASE,
  previewThumbnailFileName,
  type PreviewThumbnailWidth,
} from "@/lib/preview-thumbnails";
import { isAiThumbPath } from "@/lib/preview-paths";

const manifestPath = join(process.cwd(), PREVIEW_THUMBNAIL_DIR, "manifest.json");
let manifestCache: { mtimeMs: number; sources: Record<string, string> } | null = null;

// Origen con el que el prebuild generó las miniaturas de cada diseño
// (scripts/build-preview-thumbnails.ts). Se relee solo si el archivo cambió.
function readManifest(): Record<string, string> {
  try {
    const { mtimeMs } = statSync(manifestPath);
    if (manifestCache?.mtimeMs !== mtimeMs) {
      manifestCache = { mtimeMs, sources: JSON.parse(readFileSync(manifestPath, "utf8")) as Record<string, string> };
    }
    return manifestCache.sources;
  } catch {
    return {};
  }
}

// URL para tarjetas: la miniatura de IA (…-thumb.webp, 590×590) se sirve tal cual desde el
// CDN; ya está optimizada. Para la vista previa original se usa la copia local reducida si el
// prebuild la generó a partir de esa misma imagen; si no, la del CDN hasta que
// `pnpm run images:thumbnails` (prebuild) regenere las copias.
export function getPreviewThumbnailUrl(
  designId: number,
  width: PreviewThumbnailWidth,
  fallbackUrl: string,
  sourcePath: string | null,
): string {
  if (isAiThumbPath(sourcePath)) {
    return fallbackUrl;
  }
  const fileName = previewThumbnailFileName(designId, width);
  const isCurrent = sourcePath !== null && readManifest()[String(designId)] === sourcePath;
  return isCurrent && existsSync(join(process.cwd(), PREVIEW_THUMBNAIL_DIR, fileName))
    ? `${PREVIEW_THUMBNAIL_URL_BASE}/${fileName}`
    : fallbackUrl;
}
