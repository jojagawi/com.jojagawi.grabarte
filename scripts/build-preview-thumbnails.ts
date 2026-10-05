import { mkdir, stat, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import {
  PREVIEW_THUMBNAIL_DIR,
  PREVIEW_THUMBNAIL_WIDTHS,
  previewThumbnailFileName,
  selectDesignImagePath,
} from "@/lib/preview-thumbnails";

// Genera miniaturas webp de las vistas previas de los diseños publicados.
// Las que ya existen se conservan; `--force` las regenera todas.

const QUALITY = 80;
const CONCURRENCY = 6;
const force = process.argv.includes("--force");
const outputDir = resolve(PREVIEW_THUMBNAIL_DIR);

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

async function buildThumbnails(designId: number, imagePath: string): Promise<Outcome> {
  const targets = PREVIEW_THUMBNAIL_WIDTHS.map((width) => ({
    width,
    filePath: join(outputDir, previewThumbnailFileName(designId, width)),
  }));

  if (!force && (await Promise.all(targets.map(({ filePath }) => hasFile(filePath)))).every(Boolean)) {
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
        select: { file: { select: { filePath: true, fileType: { select: { name: true } } } } },
      },
    },
  });

  const jobs = designs
    .map((design) => ({ id: design.id, imagePath: selectDesignImagePath(design.relDesignsFiles) }))
    .filter((job): job is { id: number; imagePath: string } => Boolean(job.imagePath));

  const counts: Record<Outcome, number> = { generated: 0, cached: 0, failed: 0 };
  for (let index = 0; index < jobs.length; index += CONCURRENCY) {
    const batch = jobs.slice(index, index + CONCURRENCY);
    const outcomes = await Promise.all(batch.map((job) => buildThumbnails(job.id, job.imagePath)));
    for (const outcome of outcomes) {
      counts[outcome] += 1;
    }
  }

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
