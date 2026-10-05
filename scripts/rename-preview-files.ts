import { config } from "dotenv";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

// Renombra las vistas previas de preview/[id_diseño].[ext] a
// preview/[id_diseño]-[id_archivo]-[slug].[ext] sin perder la referencia:
//   1. copia el objeto en S3 al nombre nuevo (conserva Content-Type y Cache-Control),
//   2. actualiza Files.filePath en SQLite solo si la copia salió bien.
// Los objetos viejos NO se borran: el sitio publicado los usa hasta el siguiente build.
// Después de desplegar, --delete-old elimina los nombres viejos ya migrados.
//
// Uso:
//   pnpm run images:rename-previews --dry-run     muestra el plan, sin escribir
//   pnpm run images:rename-previews               copia en S3 y actualiza la base
//   pnpm run images:rename-previews --delete-old  borra de S3 los nombres viejos ya migrados

config({ path: [".env.local", ".env.development", ".env"], quiet: true });

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const deleteOld = args.has("--delete-old");

const LEGACY_PREVIEW_PATTERN = /^preview\/(\d+)\.([a-z0-9]+)$/i;
const NEW_PREVIEW_PATTERN = /^preview\/(\d+)-(\d+)-[a-z0-9-]+\.([a-z0-9]+)$/i;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Falta ${name} en el entorno (.env.development, .env.local o .env).`);
  }
  return value;
}

async function objectExists(client: S3Client, bucket: string, key: string): Promise<boolean> {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (error) {
    const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
    if (status === 404 || status === 403) {
      return false;
    }
    throw error;
  }
}

async function main() {
  const bucket = requireEnv("NEXT_PUBLIC_S3");
  const client = new S3Client({
    region: requireEnv("NEXT_AWS_REGION"),
    credentials: {
      accessKeyId: requireEnv("NEXT_AWS_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("NEXT_AWS_SECRET_ACCESS_KEY"),
    },
  });

  // Se importan después de cargar el entorno: prisma lee DATABASE_URL al iniciar.
  const { prisma } = await import("@/lib/prisma");
  const { buildPreviewObjectKey } = await import("@/lib/preview-paths");

  try {
    const previews = await prisma.files.findMany({
      where: { fileType: { name: "Vista previa" }, filePath: { not: null } },
      select: {
        id: true,
        filePath: true,
        relDesignsFiles: { select: { design: { select: { id: true, name: true } } } },
      },
      orderBy: { id: "asc" },
    });

    if (deleteOld) {
      // Solo borra el nombre viejo de archivos cuya base YA apunta al nombre nuevo.
      let deleted = 0;
      for (const file of previews) {
        const match = file.filePath?.match(NEW_PREVIEW_PATTERN);
        if (!match) {
          continue;
        }
        const extension = match[3];
        const legacyKey = `preview/${match[1]}.${extension}`;
        if (!(await objectExists(client, bucket, file.filePath ?? "")) || !(await objectExists(client, bucket, legacyKey))) {
          continue;
        }
        if (dryRun) {
          console.log(`  - borraría ${legacyKey}`);
        } else {
          await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: legacyKey }));
        }
        deleted += 1;
      }
      console.log(
        `[images:rename-previews] ${dryRun ? "Por borrar" : "Borrados"}: ${deleted} nombres viejos${dryRun ? " (--dry-run)" : ""}.`,
      );
      return;
    }

    let renamed = 0;
    let alreadyMigrated = 0;
    const problems: string[] = [];

    for (const file of previews) {
      const oldKey = file.filePath ?? "";
      if (NEW_PREVIEW_PATTERN.test(oldKey)) {
        alreadyMigrated += 1;
        continue;
      }

      const design = file.relDesignsFiles.find((relation) => relation.design)?.design;
      const legacy = oldKey.match(LEGACY_PREVIEW_PATTERN);
      if (!design || !legacy) {
        problems.push(`archivo ${file.id}: ruta inesperada "${oldKey}" o sin diseño; se deja igual`);
        continue;
      }

      const newKey = buildPreviewObjectKey(design.id, file.id, design.name, legacy[2]);
      if (!(await objectExists(client, bucket, oldKey))) {
        problems.push(`archivo ${file.id}: no existe ${oldKey} en S3; se deja igual`);
        continue;
      }

      if (dryRun) {
        if (renamed < 10) {
          console.log(`  ${oldKey} → ${newKey}`);
        }
        renamed += 1;
        continue;
      }

      await client.send(
        new CopyObjectCommand({
          Bucket: bucket,
          CopySource: `${bucket}/${oldKey.split("/").map(encodeURIComponent).join("/")}`,
          Key: newKey,
          // COPY conserva Content-Type, Cache-Control y demás metadatos del original.
          MetadataDirective: "COPY",
        }),
      );
      await prisma.files.update({ where: { id: file.id }, data: { filePath: newKey } });
      renamed += 1;
    }

    console.log(
      `[images:rename-previews] Vistas previas: ${previews.length} | ${dryRun ? "Por renombrar" : "Renombradas"}: ${renamed} | Ya migradas: ${alreadyMigrated} | Con problema: ${problems.length}${dryRun ? " (--dry-run: no se escribió nada)" : ""}`,
    );
    for (const problem of problems) {
      console.warn(`  ! ${problem}`);
    }
    if (!dryRun && renamed > 0) {
      console.log(
        "[images:rename-previews] Los nombres viejos siguen en S3. Después de compilar y desplegar el sitio, corre --delete-old.",
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("[images:rename-previews]", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
