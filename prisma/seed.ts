import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./data/mydb.sqlite",
});

const prisma = new PrismaClient({ adapter });

const categoryNames = [
  "Adornos",
  "Navidad",
  "Esferas",
  "Adorno puerta",
  "Halloween",
  "Clips",
  "Oficina",
  "Cruces",
  "Religiosos",
  "Recuerdos",
  "1ra Comunión",
  "Confirmación",
  "Boda",
  "Graduación",
  "Día de las madres",
  "Día del padre",
  "Día del Amor y la amistad",
  "Flores",
  "Rompecabezas",
  "Rompecabezas 3D",
  "Juegos de Mesa",
  "Llaveros",
  "Mapas",
  "Montesori",
  "One Piece",
  "Dragones",
  "Litografías",
  "Porta Llaves",
  "Regalos",
  "Salud",
  "Contenedores",
  "Calibración",
  "Utilidades",
  "Medalleros",
  "Calendario",
] as const;

const fileExtensions = [
  { name: "SVG", extension: "svg", mimeType: "image/svg+xml" },
  { name: "LightBurn", extension: "lbrn2", mimeType: "application/octet-stream" },
  { name: "PDF", extension: "pdf", mimeType: "application/pdf" },
  { name: "AI", extension: "ai", mimeType: "application/postscript" },
  { name: "DFX", extension: "dfx", mimeType: "application/octet-stream" },
  { name: "EPS", extension: "eps", mimeType: "application/postscript" },
  { name: "PNG", extension: "png", mimeType: "image/png" },
  { name: "WEBP", extension: "webp", mimeType: "image/webp" },
] as const;

const fileTypes = [
  { name: "Vista previa", description: "Usado como thumb en el sitio" },
  {
    name: "Imagenes del diseño",
    description: "Fotos y videos usados para mostrar el diseño desde diferentes angulos",
  },
  {
    name: "Instrucciones",
    description: "PDF, textos y/o videos con instrucciones adicionales, o implementaciones",
  },
  {
    name: "Archivos fuente",
    description: "Archivos necesarios para el proyecto",
  },
] as const;

const materials = [
  {
    name: "MDF",
    slug: "mdf",
    description: "Cajas, decoración y maquetas. Espesores de 2 a 9mm.",
    icon: "Layers",
  },
  {
    name: "Termo",
    slug: "termo",
    description: "Grabado rotativo personalizado para termos.",
    icon: "Coffee",
  },
  {
    name: "Acrílico",
    slug: "acrilico",
    description: "Cajas, decoración y maquetas. Espesores de 2 a 9mm.",
    icon: null,
  },
  {
    name: "Metal",
    slug: "metal",
    description: "Paneles, señalética y piezas de precisión.",
    icon: "Layers",
  },
  {
    name: "Impresión 3D",
    slug: "impresion-3d",
    description: null,
    icon: null,
  },
] as const;

async function main() {
  const existing = await prisma.catCategories.findMany({
    where: {
      name: {
        in: [...categoryNames],
      },
    },
    select: {
      name: true,
    },
  });

  const existingNames = new Set(existing.map((item) => item.name).filter(Boolean));
  const pending = categoryNames
    .filter((name) => !existingNames.has(name))
    .map((name) => ({ name, status: 1 }));

  if (pending.length === 0) {
    console.log("[prisma:seed] CatCategories ya contiene todos los valores esperados.");
  } else {
    const result = await prisma.catCategories.createMany({
      data: pending,
    });

    console.log(
      `[prisma:seed] CatCategories: insertados ${result.count} registros (faltaban ${pending.length}).`,
    );
  }

  const existingExtensions = await prisma.catFileExtension.findMany({
    where: {
      OR: fileExtensions.map((item) => ({
        name: item.name,
        extension: item.extension,
      })),
    },
    select: {
      id: true,
      name: true,
      extension: true,
      mimeType: true,
    },
  });

  const existingExtensionKeys = new Set(
    existingExtensions.map((item) => `${item.name ?? ""}::${item.extension ?? ""}`),
  );

  const pendingExtensions = fileExtensions
    .filter(
      (item) => !existingExtensionKeys.has(`${item.name}::${item.extension}`),
    )
    .map((item) => ({
      ...item,
      status: 1,
    }));

  const mimeTypeUpdates = existingExtensions
    .map((existing) => {
      const target = fileExtensions.find(
        (item) => item.name === existing.name && item.extension === existing.extension,
      );

      if (!target) return null;
      if (existing.mimeType === target.mimeType) return null;

      return {
        id: existing.id,
        mimeType: target.mimeType,
      };
    })
    .filter(Boolean) as Array<{ id: number; mimeType: string }>;

  if (pendingExtensions.length === 0) {
    console.log("[prisma:seed] CatFileExtension ya contiene todos los valores esperados.");
  } else {
    const extensionResult = await prisma.catFileExtension.createMany({
      data: pendingExtensions,
    });

    console.log(
      `[prisma:seed] CatFileExtension: insertados ${extensionResult.count} registros (faltaban ${pendingExtensions.length}).`,
    );
  }

  if (mimeTypeUpdates.length > 0) {
    await Promise.all(
      mimeTypeUpdates.map((item) =>
        prisma.catFileExtension.update({
          where: { id: item.id },
          data: { mimeType: item.mimeType },
        }),
      ),
    );

    console.log(
      `[prisma:seed] CatFileExtension: actualizados ${mimeTypeUpdates.length} mime-types.`,
    );
  }

  const existingFileTypes = await prisma.catFileType.findMany({
    where: {
      name: {
        in: fileTypes.map((item) => item.name),
      },
    },
    select: {
      name: true,
    },
  });

  const existingFileTypeNames = new Set(
    existingFileTypes.map((item) => item.name).filter(Boolean),
  );

  const pendingFileTypes = fileTypes
    .filter((item) => !existingFileTypeNames.has(item.name))
    .map((item) => ({
      name: item.name,
      description: item.description,
      status: 1,
    }));

  if (pendingFileTypes.length === 0) {
    console.log("[prisma:seed] CatFileType ya contiene todos los valores esperados.");
  } else {
    const fileTypeResult = await prisma.catFileType.createMany({
      data: pendingFileTypes,
    });

    console.log(
      `[prisma:seed] CatFileType: insertados ${fileTypeResult.count} registros (faltaban ${pendingFileTypes.length}).`,
    );
  }

  const existingMaterials = await prisma.catMaterials.findMany({
    where: {
      slug: {
        in: materials.map((item) => item.slug),
      },
    },
    select: {
      slug: true,
    },
  });

  const existingMaterialSlugs = new Set(
    existingMaterials.map((item) => item.slug).filter(Boolean),
  );

  const pendingMaterials = materials
    .filter((item) => !existingMaterialSlugs.has(item.slug))
    .map((item) => ({
      name: item.name,
      slug: item.slug,
      description: item.description,
      icon: item.icon,
      status: 1,
    }));

  if (pendingMaterials.length === 0) {
    console.log("[prisma:seed] CatMaterials ya contiene todos los valores esperados.");
    return;
  }

  const materialsResult = await prisma.catMaterials.createMany({
    data: pendingMaterials,
  });

  console.log(
    `[prisma:seed] CatMaterials: insertados ${materialsResult.count} registros (faltaban ${pendingMaterials.length}).`,
  );
}

main()
  .catch((error) => {
    console.error("[prisma:seed] Error:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

