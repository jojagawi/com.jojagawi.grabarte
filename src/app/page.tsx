import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/custom/hero";
import { Process } from "@/components/custom/process";
import { Testimonials } from "@/components/custom/testimonials";
import { getRandomHomeTestimonialsFromAthena } from "@/lib/rates-athena.server";

export const metadata: Metadata = buildPageMetadata({
  title: "InspiraArte | Regalos y productos personalizados en México",
  description:
    "Creamos termos, llaveros, figuras MDF y más con grabado y corte láser. Cotiza tu diseño personalizado para regalos, eventos y marcas.",
  path: "/",
  keywords: [
    "productos personalizados",
    "regalos personalizados",
    "grabado láser",
    "corte láser",
    "InspiraArte",
    "termos personalizados",
    "México",
  ],
  imagePath: "/dam/logos/hero.webp",
  imageAlt: "Catalogo de productos personalizados de InspiraArte",
});

export const llmstxt = {
  title: "Inicio",
  description: "Presentación general de InspiraArte y acceso al catálogo.",
};

const defaultImage = "/dam/dafault-image-product.webp";

export default async function Home() {

  const categories = await prisma.catCategories.findMany({
    where: {
      relDesignsCategories: {
        some: {
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

  const designs = await prisma.designs.findMany({
    where: {
      status: 1,
      showInSite: 1,
      showInHome: 1,
      name: { not: null },
    },
    select: {
      id: true,
      name: true,
      description: true,
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
          },
        },
        select: {
          file: {
            select: {
              filePath: true,
              fileType: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  const mediaBaseUrl = (process.env.NEXT_PUBLIC_S3_PROTOCOL || "http")
    .concat("://")
    .concat(process.env.NEXT_PUBLIC_S3 || "/dam/files/");

  const heroDesigns = designs.map((design) => {
    const previewFile = design.relDesignsFiles.find(
      (relation) =>
        relation.file?.fileType?.name === "Vista previa" &&
        relation.file.filePath,
    );
    const firstFileWithPath = design.relDesignsFiles.find(
      (relation) => relation.file?.filePath,
    );
    const selectedPath =
      previewFile?.file?.filePath ?? firstFileWithPath?.file?.filePath ?? null;

    const image =
      selectedPath && mediaBaseUrl
        ? `${mediaBaseUrl}/${selectedPath.replace(/^\/+/, "")}`
        : defaultImage;

    const designCategories = Array.from(
      new Set(
        design.relDesignsCategories
          .map((relation) => relation.category?.name)
          .filter((name): name is string => Boolean(name?.trim())),
      ),
    );

    return {
      id: design.id,
      name: design.name ?? "Diseno sin nombre",
      description:
        design.description?.trim() ||
        "Diseno personalizado disponible bajo cotizacion.",
      image,
      categories: designCategories,
    };
  });

  const marqueeCategories = Array.from(
    new Set(
      categories
        .map((category) => category.name)
        .filter((name): name is string => Boolean(name?.trim())),
    ),
  );

  const testimonials = await getRandomHomeTestimonialsFromAthena(4);

  return (
    <>
      <Hero designs={heroDesigns} marqueeCategories={marqueeCategories} />
      <Process />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
