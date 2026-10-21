import { config } from "dotenv";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { buildMaterialGuideData } from "@/lib/material-guide";
import { formatSeasonMonths } from "@/lib/seasons";
import { getSeasonPagesWithDesigns, getSeasonPath } from "@/lib/seasons.server";
import { getDesignHref, getSiteDesigns } from "@/lib/site-designs.server";
import { getLatestRatesFromAthena } from "@/lib/rates-athena.server";

// Datos de respaldo de las herramientas WebMCP (src/lib/webmcp-setup.ts). El sitio es un export
// estático, así que estos JSON son la única fuente de las herramientas en producción.
// tsx no lee los .env como `next build`: sin esto business-info.json sale sin WhatsApp,
// horarios ni redes. El primer archivo que define una variable gana.
config({ path: [".env.production.local", ".env.local", ".env.production", ".env"], quiet: true });

const DEFAULT_GOOGLE_BUSINESS_URL = "https://share.google/7gV0CtdvltCVHepT8";

type FallbackCategory = {
  id: number;
  name: string;
};

type FallbackProduct = {
  id: number;
  idSlug: string;
  name: string;
  description: string;
  categories: string[];
  reference: string;
  material: string | null;
  // Solo el precio sugerido: el mínimo y el de mayoreo son internos.
  suggestedPrice: number | null;
  productionTime: string | null;
  shippingTime: string | null;
  dimensions: string | null;
  isCustomizable: boolean;
  image: string | null;
  gallery: string[];
  url: string;
};

type FallbackSeason = {
  slug: string;
  name: string;
  months: string;
  url: string;
  description: string | null;
  guide: string | null;
  categories: string[];
  products: Array<{ id: number; name: string; url: string }>;
};

type FallbackReview = {
  name: string;
  product: string;
  rating: number;
  comment: string;
  productId: number | null;
  createdAt: string;
};

type FallbackFaq = {
  question: string;
  answer: string;
};

function toMediaUrl(path: string | null): string | null {
  if (!path) {
    return null;
  }

  const protocol = process.env.NEXT_PUBLIC_S3_PROTOCOL || "https";
  const host = process.env.NEXT_PUBLIC_S3 || "dam.inspiraarte.com";

  return `${protocol}://${host}/${path.replace(/^\/+/, "")}`;
}

async function buildCategories(): Promise<FallbackCategory[]> {
  const categories = await prisma.catCategories.findMany({
    where: {
      status: 1,
      name: { not: null },
      relDesignsCategories: {
        some: {
          status: 1,
          design: {
            status: 1,
            showInSite: 1,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name || "Sin nombre",
  }));
}

async function buildProducts(): Promise<FallbackProduct[]> {
  const designs = await prisma.designs.findMany({
    where: {
      status: 1,
      showInSite: 1,
      name: { not: null },
    },
    select: {
      id: true,
      name: true,
      description: true,
      suggestedPrice: true,
      productionTime: true,
      shippingTime: true,
      dimensions: true,
      isCustomizable: true,
      material: {
        select: {
          name: true,
        },
      },
      relDesignsCategories: {
        where: {
          status: 1,
          category: {
            status: 1,
            name: { not: null },
          },
        },
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      relDesignsFiles: {
        where: {
          status: 1,
          file: {
            status: 1,
            filePath: { not: null },
            fileTypeId: { in: [1, 2] },
          },
        },
        select: {
          file: {
            select: {
              fileTypeId: true,
              filePath: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return designs
    .filter((design): design is typeof design & { name: string } => Boolean(design.name?.trim()))
    .map((design) => {
      const categories = Array.from(
        new Set(
          design.relDesignsCategories
            .map((relation) => relation.category?.name)
            .filter((name): name is string => Boolean(name?.trim())),
        ),
      );

      const previewPath = design.relDesignsFiles.find((relation) => relation.file?.fileTypeId === 1)?.file?.filePath;
      const gallery = design.relDesignsFiles
        .filter((relation) => relation.file?.fileTypeId === 2)
        .map((relation) => toMediaUrl(relation.file?.filePath || null))
        .filter((value): value is string => Boolean(value));

      const idSlug = `${design.id}-${slugify(design.name)}`;

      return {
        id: design.id,
        idSlug,
        name: design.name,
        description: design.description?.trim() || "Producto personalizado disponible bajo cotización.",
        categories,
        reference: `IA-${String(design.id).padStart(4, "0")}`,
        material: design.material?.name?.trim() || null,
        suggestedPrice: design.suggestedPrice,
        productionTime: design.productionTime?.trim() || null,
        shippingTime: design.shippingTime?.trim() || null,
        dimensions: design.dimensions?.trim() || null,
        isCustomizable: design.isCustomizable === 1,
        image: toMediaUrl(previewPath || null),
        gallery,
        url: `/productos/${idSlug}`,
      };
    });
}

// Temporadas con al menos un diseño publicado, con su guía en Markdown y sus piezas.
async function buildSeasons(): Promise<FallbackSeason[]> {
  const seasons = await getSeasonPagesWithDesigns();
  const categoryNames = new Map(
    (await prisma.catCategories.findMany({ select: { id: true, name: true } })).map((category) => [
      category.id,
      category.name,
    ]),
  );

  return seasons.map((season) => ({
    slug: season.slug,
    name: season.label,
    months: formatSeasonMonths(season.startMonth, season.endMonth),
    url: `${getSeasonPath(season.slug)}/`,
    description: season.description,
    guide: season.guide,
    categories: season.categoryIds
      .map((id) => categoryNames.get(id))
      .filter((name): name is string => Boolean(name?.trim())),
    products: season.designs.map(({ design }) => ({
      id: design.id,
      name: design.name ?? "",
      url: `${getDesignHref(design)}/`,
    })),
  }));
}

async function buildMaterials() {
  return buildMaterialGuideData(await getSiteDesigns());
}

// Calificaciones aprobadas (las mismas que muestra el sitio). Sin credenciales de Athena el
// build sigue: la herramienta responde que aún no hay calificaciones publicadas.
async function buildReviews(): Promise<FallbackReview[]> {
  try {
    const rates = await getLatestRatesFromAthena(200);
    return rates
      .filter((rate) => rate.status === 1 && rate.name.trim() && rate.description.trim())
      .map((rate) => ({
        name: rate.name.trim(),
        product: rate.product.trim(),
        rating: Math.min(5, Math.max(1, Math.round(rate.rating))),
        comment: rate.description.trim(),
        productId: rate.designId,
        createdAt: rate.createdAt,
      }));
  } catch (error) {
    console.warn("build:mcp: no se pudieron leer las calificaciones de Athena.", error);
    return [];
  }
}

async function buildFaqs(): Promise<FallbackFaq[]> {
  const faqs = await prisma.faqs.findMany({
    where: {
      showInMcp: 1,
    },
    select: {
      question: true,
      answer: true,
    },
    orderBy: [
      {
        priority: "asc",
      },
      {
        id: "asc",
      },
    ],
  });

  return faqs.map((faq) => ({
    question: faq.question,
    answer: faq.answer,
  }));
}

function buildBusinessInfo() {
  const scheduleText = process.env.NEXT_PUBLIC_SCHEDULES || "";
  const schedules = scheduleText
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [dayRange, ...hoursParts] = item.split(":");

      return {
        dayRange: dayRange?.trim() || "Horario",
        hours: hoursParts.join(":").trim() || "No disponible",
      };
    });

  return {
    businessName: process.env.NEXT_PUBLIC_SITENAME || "InspiraArte",
    email: process.env.NEXT_PUBLIC_EMAIL || "contacto@inspiraarte.com",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "",
    address: process.env.NEXT_PUBLIC_DIR || "Ciudad de México, México",
    contactUrl: "/contacto",
    schedules,
    social: {
      instagram: process.env.NEXT_PUBLIC_INSTAGRAM || null,
      facebook: process.env.NEXT_PUBLIC_FACEBOOK || null,
      tiktok: process.env.NEXT_PUBLIC_TIKTOK || null,
      googleBusiness: process.env.NEXT_PUBLIC_GOOGLE_BUSINESS || DEFAULT_GOOGLE_BUSINESS_URL,
    },
  };
}

async function writeJsonFile(fileName: string, value: unknown): Promise<void> {
  const outputDirectory = resolve(process.cwd(), "public", "mcp");
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(resolve(outputDirectory, fileName), JSON.stringify(value, null, 2), "utf8");
}

async function main() {
  const [categories, products, faqs, seasons, materials, reviews] = await Promise.all([
    buildCategories(),
    buildProducts(),
    buildFaqs(),
    buildSeasons(),
    buildMaterials(),
    buildReviews(),
  ]);

  await Promise.all([
    writeJsonFile("categories.json", categories),
    writeJsonFile("products.json", products),
    writeJsonFile("faqs.json", faqs),
    writeJsonFile("seasons.json", seasons),
    writeJsonFile("materials.json", materials),
    writeJsonFile("reviews.json", reviews),
    writeJsonFile("business-info.json", buildBusinessInfo()),
  ]);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

