import { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { AddNewDesign } from "@/components/custom/add-new-design";



export const metadata: Metadata = buildPageMetadata({
  title: "Agregar diseño al catálogo | InspiraArte",
  description:
    "Panel interno para registrar nuevos diseños, categorías, materiales y archivos del catálogo de InspiraArte.",
  path: "/agregar",
  keywords: ["panel interno", "agregar diseño", "catálogo", "InspiraArte"],
  imagePath: "/dam/dafault-image-product.webp",
  imageAlt: "Panel interno para agregar productos en InspiraArte",
  noIndex: true,
});

export const llmstxt = {
  title: "Agregar diseño",
  description: "Panel interno para registrar nuevos productos y archivos.",
};

export default async function Agregar() {

  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const categories = await prisma.catCategories.findMany({
    where: {
      status: 1,
      name: { not: null },
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const materials = await prisma.catMaterials.findMany({
    where: {
      status: 1,
      name: { not: null },
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      <AddNewDesign
        categories={categories.map((item) => ({ id: item.id, name: item.name ?? "" }))}
        materials={materials.map((item) => ({
          id: item.id,
          name: item.name ?? "",
          slug: item.slug ?? "",
        }))}
      />
    </>
  );
}
