import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import {
  PREVIEW_THUMBNAIL_DIR,
  PREVIEW_THUMBNAIL_WIDTHS,
  previewThumbnailFileName,
  selectDesignCardImagePath,
} from "@/lib/preview-thumbnails";
import { isAiThumbPath } from "@/lib/preview-paths";

// Genera miniaturas webp de los diseños publicados a partir de su imagen de tarjeta:
// la miniatura de IA si existe (Files.thumbGenerated) o la vista previa original.
// Las que ya existen se conservan mientras su imagen de origen no cambie (manifest.json
// guarda el origen de cada diseño); `--force` las regenera todas.

const QUALITY = 80;
const CONCURRENCY = 6;
const force = process.argv.includes("--force");
const outputDir = resolve(PREVIEW_THUMBNAIL_DIR);
const manifestPath = join(outputDir, "manifest.json");

// Origen con el que se generó cada diseño: { [designId]: imagePath }.
async function readManifest(): Promise<Record<string, string>> {
  try {
    return JSON.parse(await readFile(manifestPath, "utf8")) as Record<string, string>;
  } catch {
    return {};
  }
}

function toMediaUrl(path: string): string {
  const protocol = process.env.NEXT_PUBLIC_S3_PROTOCOL || "https";
  const host = process.env.NEXT_PUBLIC_S3 || "dam.inspiraarte.com";
  return `${protocol}://${host}/${path.replace(/^\/+/, "")}`;
}

async function hasFile(filePath: string): Promise<boolean> {
  try {
    return (await stat(filePath)).size > 0;
  } catch {
    return false;
  }
}

type Outcome = "generated" | "cached" | "failed";

async function buildThumbnails(designId: number, imagePath: string, previousSource: string | undefined): Promise<Outcome> {
  const targets = PREVIEW_THUMBNAIL_WIDTHS.map((width) => ({
    width,
    filePath: join(outputDir, previewThumbnailFileName(designId, width)),
  }));

  const sourceUnchanged = previousSource === imagePath;
  if (!force && sourceUnchanged && (await Promise.all(targets.map(({ filePath }) => hasFile(filePath)))).every(Boolean)) {
    return "cached";
  }

  try {
    const response = await fetch(toMediaUrl(imagePath));
    if (!response.ok) {
      console.warn(`[images:thumbnails] ${designId}: HTTP ${response.status}`);
      return "failed";
    }
    const source = Buffer.from(await response.arrayBuffer());

    await Promise.all(
      targets.map(async ({ width, filePath }) => {
        const output = await sharp(source)
          .rotate()
          .resize({ width, height: width, fit: "inside", withoutEnlargement: true })
          .webp({ quality: QUALITY, effort: 5 })
          .toBuffer();
        await writeFile(filePath, output);
      }),
    );
    return "generated";
  } catch (error) {
    console.warn(`[images:thumbnails] ${designId}:`, error instanceof Error ? error.message : error);
    return "failed";
  }
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  const designs = await prisma.designs.findMany({
    where: { status: 1, showInSite: 1 },
    select: {
      id: true,
      relDesignsFiles: {
        where: { status: 1, file: { status: 1, filePath: { not: null } } },
        select: { file: { select: { filePath: true, thumbGenerated: true, fileType: { select: { name: true } } } } },
      },
    },
  });

  const jobs = designs
    .map((design) => ({ id: design.id, imagePath: selectDesignCardImagePath(design.relDesignsFiles) }))
    .filter((job): job is { id: number; imagePath: string } => Boolean(job.imagePath))
    // Las miniaturas de IA (590×590) ya están optimizadas: el sitio las usa directo del CDN.
    .filter((job) => !isAiThumbPath(job.imagePath));

  const manifest = await readManifest();
  const counts: Record<Outcome, number> = { generated: 0, cached: 0, failed: 0 };
  for (let index = 0; index < jobs.length; index += CONCURRENCY) {
    const batch = jobs.slice(index, index + CONCURRENCY);
    const outcomes = await Promise.all(
      batch.map((job) => buildThumbnails(job.id, job.imagePath, manifest[String(job.id)])),
    );
    batch.forEach((job, position) => {
      counts[outcomes[position]] += 1;
      // Solo se registra el origen si las miniaturas quedaron al día.
      if (outcomes[position] !== "failed") {
        manifest[String(job.id)] = job.imagePath;
      }
    });
  }
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(
    `[images:thumbnails] Diseños: ${jobs.length} | Generadas: ${counts.generated} | Sin cambios: ${counts.cached} | Fallidas: ${counts.failed}`,
  );
}

main()
  .catch((error) => {
    console.error("[images:thumbnails]", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
