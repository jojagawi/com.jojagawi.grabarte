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

const faqs = [
  {
    question: "¿Cuánto tiempo tarda mi pedido?",
    answer:
      "El tiempo depende del producto y la cantidad. Generalmente, pedidos pequeños (1-10 piezas) están listos en 3-5 días hábiles. Para pedidos grandes o con diseños complejos, el tiempo puede ser de 7-15 días. Te confirmamos la fecha exacta al aprobar tu diseño.",
  },
  {
    question: "¿Cuál es el pedido mínimo?",
    answer:
      "¡No hay mínimo! Puedes pedir desde una sola pieza. Sin embargo, para pedidos de 10 piezas o más, ofrecemos descuentos especiales. Para eventos o corporativos (50+ piezas), tenemos precios muy atractivos.",
  },
  {
    question: "¿Qué formatos de imagen aceptan?",
    answer:
      "Aceptamos JPG, PNG, PDF y archivos vectoriales (AI, SVG, CDR). Para mejor calidad de grabado, te recomendamos enviar imágenes en alta resolución (300 DPI mínimo) o archivos vectoriales. Si solo tienes una foto o boceto, ¡no te preocupes! Nuestro equipo puede digitalizarlo.",
  },
  {
    question: "¿Hacen envíos a todo México?",
    answer:
      "¡Sí! Enviamos a toda la República Mexicana a través de paqueterías confiables. El costo de envío depende del destino y el tamaño del paquete. También ofrecemos recolección en nuestro taller en CDMX sin costo adicional.",
  },
  {
    question: "¿Puedo ver un diseño antes de producir?",
    answer:
      "¡Claro que sí! Siempre te enviamos una vista previa digital del diseño para tu aprobación antes de iniciar la producción. Puedes solicitar hasta 2 cambios sin costo adicional.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos transferencia bancaria, depósito en OXXO, tarjetas de crédito/débito y PayPal. Para iniciar tu pedido requerimos un anticipo del 50%, y el resto lo cubres al momento de la entrega o envío.",
  },
  {
    question: "¿Los productos tienen garantía?",
    answer:
      "Garantizamos la calidad de nuestro trabajo. Si tu producto llega dañado o con errores de producción, lo reponemos sin costo. Las imágenes del producto final siempre se envían antes del envío para tu tranquilidad.",
  },
  {
    question: "¿Trabajan con empresas o solo particulares?",
    answer:
      "¡Ambos! Trabajamos con personas que buscan un regalo especial, organizadores de eventos, empresas que necesitan merchandising y cualquier persona con una idea creativa. Emitimos facturas y ofrecemos precios especiales para clientes frecuentes o pedidos grandes.",
  },
] as const;

// Temporadas de la vitrina de la portada. Las categorías se enlazan por nombre
// normalizado (sin acentos ni mayúsculas); las que todavía no existen (Pascua,
// Primavera, Día del maestro…) se asignan después en /catalogos/temporadas.
const seasons = [
  { slug: "amor-y-amistad", name: "Amor y amistad", description: "Regalos para el 14 de febrero: detalles para tu pareja, tus amigos o tu equipo de trabajo. Cuéntanos qué te gustaría grabar y te enviamos una propuesta antes de producir.", startMonth: 1, endMonth: 2, categories: ["dia del amor y la amistad", "amor y amistad", "san valentin"] },
  { slug: "primavera", name: "Primavera", description: "Piezas para la temporada de primavera: decoración, regalos y detalles para celebrar la llegada del buen clima.", startMonth: 3, endMonth: 3, categories: ["primavera"] },
  { slug: "pascua", name: "Pascua", description: "Detalles y decoración para Pascua: piezas para regalar o para ambientar tu casa y tus reuniones familiares.", startMonth: 4, endMonth: 4, categories: ["pascua"] },
  { slug: "dia-del-nino", name: "Día del niño", description: "Regalos para el Día del niño, el 30 de abril: piezas para jugar, aprender y decorar el cuarto de los más pequeños.", startMonth: 4, endMonth: 4, categories: ["dia del nino", "dia de los ninos", "dia del nino y la nina"] },
  { slug: "dia-de-la-madre", name: "Día de la madre", description: "Regalos para el 10 de mayo: piezas para mamá, abuela o quien celebres ese día. Pide con anticipación para que llegue a tiempo.", startMonth: 5, endMonth: 5, categories: ["dia de la madre", "dia de las madres"] },
  { slug: "dia-del-maestro", name: "Día del maestro", description: "Detalles para el 15 de mayo: regalos de agradecimiento para maestras y maestros, individuales o para todo el grupo.", startMonth: 5, endMonth: 5, categories: ["dia del maestro", "dia de los maestros"] },
  { slug: "dia-del-padre", name: "Día del padre", description: "Regalos para el Día del padre, el tercer domingo de junio: piezas para papá, abuelo o quien celebres ese día.", startMonth: 6, endMonth: 6, categories: ["dia del padre"] },
  { slug: "graduaciones", name: "Graduaciones", description: "Recuerdos y regalos de graduación: piezas para quien se gradúa o recuerdos para toda la generación.", startMonth: 6, endMonth: 7, categories: ["graduacion", "graduaciones"] },
  { slug: "regreso-a-clases", name: "Regreso a clases", description: "Artículos para el regreso a clases: piezas para el salón, el escritorio o para identificar las cosas de cada niño.", startMonth: 8, endMonth: 8, categories: ["regreso a clases", "escuela"] },
  { slug: "fiestas-patrias", name: "Fiestas patrias", description: "Decoración y detalles para las fiestas patrias de septiembre, con motivos mexicanos para tu casa, oficina o reunión.", startMonth: 9, endMonth: 9, categories: ["fiestas patrias", "mexico"] },
  { slug: "dia-de-muertos", name: "Día de muertos", description: "Piezas para tu altar del 1 y 2 de noviembre: portavelas, calaveras, marcos y adornos para recordar a quienes ya no están.", startMonth: 10, endMonth: 10, categories: ["dia de muertos"] },
  { slug: "halloween", name: "Halloween", description: "Decoración y detalles para Halloween, el 31 de octubre: piezas para ambientar tu casa, tu fiesta o para regalar.", startMonth: 10, endMonth: 10, categories: ["halloween"] },
  { slug: "navidad", name: "Navidad", description: "Decoración y regalos para Navidad: nacimientos, esferas y adornos para tu casa, y detalles para regalar en posadas e intercambios.", startMonth: 11, endMonth: 12, categories: ["navidad", "nacimiento"] },
] as const;

function normalizeName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

// Solo inserta las temporadas que faltan (por slug) y llena descripciones vacías:
// no pisa lo editado en el panel.
async function seedSeasons() {
  const existingSeasons = await prisma.catSeasons.findMany({ select: { slug: true, description: true } });
  const existingSlugs = new Set(existingSeasons.map((season) => season.slug));
  const pendingSeasons = seasons.filter((season) => !existingSlugs.has(season.slug));

  let filledDescriptions = 0;
  for (const existing of existingSeasons) {
    const defaults = seasons.find((season) => season.slug === existing.slug);
    if (defaults && !existing.description?.trim()) {
      await prisma.catSeasons.update({ where: { slug: existing.slug }, data: { description: defaults.description } });
      filledDescriptions += 1;
    }
  }
  if (filledDescriptions > 0) {
    console.log(`[prisma:seed] CatSeasons: ${filledDescriptions} descripciones completadas.`);
  }

  if (pendingSeasons.length === 0) {
    console.log("[prisma:seed] CatSeasons ya contiene todas las temporadas esperadas.");
    return;
  }

  const categories = await prisma.catCategories.findMany({ select: { id: true, name: true } });
  const categoryIdsByName = new Map<string, number[]>();
  for (const category of categories) {
    if (!category.name) continue;
    const key = normalizeName(category.name);
    categoryIdsByName.set(key, [...(categoryIdsByName.get(key) ?? []), category.id]);
  }

  let linkedCategories = 0;
  for (const season of pendingSeasons) {
    const categoryIds = [...new Set(season.categories.flatMap((name) => categoryIdsByName.get(name) ?? []))];
    linkedCategories += categoryIds.length;

    await prisma.catSeasons.create({
      data: {
        slug: season.slug,
        name: season.name,
        description: season.description,
        startMonth: season.startMonth,
        endMonth: season.endMonth,
        sortOrder: seasons.findIndex((item) => item.slug === season.slug) + 1,
        relSeasonsCategories: {
          create: categoryIds.map((categoryId) => ({ categoryId })),
        },
      },
    });
  }

  console.log(
    `[prisma:seed] CatSeasons: insertadas ${pendingSeasons.length} temporadas con ${linkedCategories} categorías enlazadas.`,
  );
}

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
  } else {
    const materialsResult = await prisma.catMaterials.createMany({
      data: pendingMaterials,
    });

    console.log(
      `[prisma:seed] CatMaterials: insertados ${materialsResult.count} registros (faltaban ${pendingMaterials.length}).`,
    );
  }

  const existingFaqs = await prisma.faqs.findMany({
    where: {
      question: {
        in: faqs.map((faq) => faq.question),
      },
    },
    select: {
      question: true,
    },
  });

  const existingFaqQuestions = new Set(existingFaqs.map((faq) => faq.question));

  const pendingFaqs = faqs
    .filter((faq) => !existingFaqQuestions.has(faq.question))
    .map((faq, index) => ({
      question: faq.question,
      answer: faq.answer,
      showInSite: 1,
      showInMcp: 1,
      priority: index + 1,
    }));

  if (pendingFaqs.length === 0) {
    console.log("[prisma:seed] Faqs ya contiene todos los valores esperados.");
  } else {
    const faqResult = await prisma.faqs.createMany({
      data: pendingFaqs,
    });

    console.log(
      `[prisma:seed] Faqs: insertados ${faqResult.count} registros (faltaban ${pendingFaqs.length}).`,
    );
  }

  await seedSeasons();
}

main()
  .catch((error) => {
    console.error("[prisma:seed] Error:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

