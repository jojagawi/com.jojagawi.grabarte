import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { Products } from "@/components/custom/products";


export const metadata: Metadata = buildPageMetadata({
  title: "Catálogo de productos personalizados | InspiraArte",
  description:
    "Explora nuestro catalogo por categorías y encuentra diseños personalizados para regalos, eventos y proyectos corporativos.",
  path: "/productos",
  keywords: [
    "catalogo de productos",
    "productos personalizados",
    "diseños personalizados",
    "regalos",
    "InspiraArte",
  ],
  imagePath: "/dam/dafault-image-product.webp",
  imageAlt: "Catalogo de productos personalizados de InspiraArte",
});

export const llmstxt = {
  title: "Catálogo de productos",
  description: "Listado de diseños personalizados disponibles en InspiraArte.",
};

const defaultImage = "/dam/dafault-image-product.webp";

const cardGradients = [
  "from-[#4290A3]/10 to-[#1FA4A7]/10",
  "from-[#1FA4A7]/10 to-[#3ACBFE]/10",
  "from-[#585106]/10 to-[#4290A3]/10",
  "from-[#00B003]/10 to-[#1FA4A7]/10",
];

export default async function Productos() {
  const isDevelopment = process.env.NODE_ENV === "development";

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
      icon: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const designs = await prisma.designs.findMany({
    where: {
      ...(isDevelopment ? {} : { status: 1, showInSite: 1 }),
      name: { not: null },
    },
    select: {
      id: true,
      name: true,
      description: true,
      isCustomizable: true,
      status: true,
      isTested: true,
      showInHome: true,
      showInSite: true,
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
            fileTypeId: 1,
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
  });

  const mediaBaseUrl = (process.env.NEXT_PUBLIC_S3_PROTOCOL || "http").concat("://").concat(
    process.env.NEXT_PUBLIC_S3 || "/dam/files/",
  );

  const products = designs.map((design, index) => {
    const previewFile = design.relDesignsFiles.find(
      (relation) => relation.file?.fileType?.name === "Vista previa" && relation.file.filePath,
    );
    const firstFileWithPath = design.relDesignsFiles.find((relation) => relation.file?.filePath);
    const selectedPath = previewFile?.file?.filePath ?? firstFileWithPath?.file?.filePath ?? null;

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
      name: design.name ?? "Diseño sin nombre",
      description: design.description?.trim() || "Diseño personalizado disponible bajo cotización.",
      image,
      color: cardGradients[index % cardGradients.length],
      categories: designCategories,
      materialName: design.material?.name?.trim() || null,
      isCustomizable: Number(design.isCustomizable) === 1,
      isActive: Number(design.status) === 1,
      isTested: Number(design.isTested) === 1,
      showInHome: Number(design.showInHome) === 1,
      showInSite: Number(design.showInSite) === 1,
    };
  });

  const materialOptions = Array.from(
    new Set(
      designs
        .map((design) => design.material?.name?.trim())
        .filter((materialName): materialName is string => Boolean(materialName)),
    ),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <>
      <Products
        enableDevFilters={isDevelopment}
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name ?? "Sin nombre",
          icon: category.icon?.trim() || null,
        }))}
        materialOptions={materialOptions}
        products={products}
      />
    </>
  );
}
