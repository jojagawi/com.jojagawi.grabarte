import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddNewDesign } from "@/components/custom/add-new-design";
import { prisma } from "@/lib/prisma";



export const metadata: Metadata = {
  title: "Agregar diseno al catalogo | InspiraArte",
  description:
    "Panel interno para registrar nuevos disenos, categorias, materiales y archivos del catalogo de InspiraArte.",
  keywords: ["panel interno", "agregar diseno", "catalogo", "InspiraArte"],
  openGraph: {
    title: "Agregar diseno al catalogo | InspiraArte",
    description: "Registro interno de nuevos productos y archivos del catalogo.",
    type: "website",
    locale: "es_MX",
  },
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
