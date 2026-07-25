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
    return;
  }

  const result = await prisma.catCategories.createMany({
    data: pending,
  });

  console.log(
    `[prisma:seed] CatCategories: insertados ${result.count} registros (faltaban ${pending.length}).`,
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

