import { Metadata } from "next";
import { Products } from "@/components/custom/products";
import { prisma } from "@/lib/prisma";


export const metadata: Metadata = {
  title: "InspiraArte | Personalización sin límites: del diseño a la realidad",
  description:
    "Descubre nuestro catálogo de productos personalizados. Expertos en corte y grabado láser en MDF, acrílico y cuero, y personalización de termos. ¡Haz tu pedido!",
  keywords: [
    "corte láser",
    "grabado láser",
    "termos personalizados",
    "corte en MDF",
    "grabado en acrílico",
    "regalos personalizados",
    "sellos a medida",
  ],
  openGraph: {
    title: "InspiraArte | Productos Personalizados",
    description: "Materializamos tus ideas con precisión y detalle.",
    type: "website",
    locale: "es_MX",
  },
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
    };
  });

  return (
    <>
      <Products
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name ?? "Sin nombre",
        }))}
        products={products}
      />
    </>
  );
}
