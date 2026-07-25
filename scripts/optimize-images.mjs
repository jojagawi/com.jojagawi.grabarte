import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const INPUT_DIR = path.resolve("public/images");
const QUALITY = 82;

async function exists(dirPath) {
  try {
    await fs.access(dirPath);
    return true;
  } catch {
    return false;
  }
}

async function collectSourceImages(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectSourceImages(fullPath)));
      continue;
    }

    if (!entry.isFile()) continue;

    const extension = path.extname(entry.name).toLowerCase();
    if ([".png", ".jpg", ".jpeg"].includes(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function toWebp(sourceFile) {
  const outputFile = sourceFile.replace(/\.(png|jpe?g)$/i, ".webp");

  const sourceMeta = await fs.stat(sourceFile);
  const outputExists = await exists(outputFile);

  if (outputExists) {
    const outputMeta = await fs.stat(outputFile);
    if (outputMeta.mtimeMs >= sourceMeta.mtimeMs) {
      return { sourceFile, outputFile, skipped: true };
    }
  }

  await sharp(sourceFile)
    .rotate()
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(outputFile);

  return { sourceFile, outputFile, skipped: false };
}

async function main() {
  if (!(await exists(INPUT_DIR))) {
    console.log(`[images:optimize] No existe ${INPUT_DIR}. No hay nada que procesar.`);
    return;
  }

  const images = await collectSourceImages(INPUT_DIR);
  if (images.length === 0) {
    console.log("[images:optimize] No se encontraron PNG/JPG en public/images.");
    return;
  }

  const results = await Promise.all(images.map((file) => toWebp(file)));
  const converted = results.filter((item) => !item.skipped).length;
  const skipped = results.length - converted;

  console.log(`[images:optimize] Procesadas: ${results.length} | Convertidas: ${converted} | Sin cambios: ${skipped}`);
}

main().catch((error) => {
  console.error("[images:optimize] Error:", error);
  process.exitCode = 1;
});

