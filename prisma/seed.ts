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
}

main()
  .catch((error) => {
    console.error("[prisma:seed] Error:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

