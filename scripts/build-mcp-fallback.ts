import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { prisma } from "@/lib/prisma";
import { faqEntries } from "@/lib/faq-data";
import { slugify } from "@/lib/slug";

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
  material: string | null;
  minimumPrice: number | null;
  suggestedPrice: number | null;
  image: string | null;
  gallery: string[];
  url: string;
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
      minimumPrice: true,
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
        material: design.material?.name?.trim() || null,
        minimumPrice: design.minimumPrice,
        suggestedPrice: design.suggestedPrice,
        image: toMediaUrl(previewPath || null),
        gallery,
        url: `/productos/${idSlug}`,
      };
    });
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
    },
  };
}

async function writeJsonFile(fileName: string, value: unknown): Promise<void> {
  const outputDirectory = resolve(process.cwd(), "public", "mcp");
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(resolve(outputDirectory, fileName), JSON.stringify(value, null, 2), "utf8");
}

async function main() {
  const [categories, products] = await Promise.all([buildCategories(), buildProducts()]);

  await Promise.all([
    writeJsonFile("categories.json", categories),
    writeJsonFile("products.json", products),
    writeJsonFile("faqs.json", faqEntries),
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

