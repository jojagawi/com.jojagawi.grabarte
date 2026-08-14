import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { CatalogCategoriesAdmin } from "@/components/custom/CatalogCategoriesAdmin";

export const metadata: Metadata = buildPageMetadata({
  title: "Categorias del catalogo | InspiraArte",
  description: "Panel interno para administrar categorias del catalogo.",
  path: "/catalogos/categorias",
  noIndex: true,
});

export default async function CatalogCategoriesPage() {
  const canEditDesigns = process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
  if (!canEditDesigns || process.env.NODE_ENV !== "development") {
    notFound();
  }

  const categories = await prisma.catCategories.findMany({
    select: {
      id: true,
      name: true,
      icon: true,
      status: true,
      createdAt: true,
    },
    orderBy: [{ name: "asc" }, { id: "asc" }],
  });

  return (
    <CatalogCategoriesAdmin
      initialCategories={categories.map((category) => ({
        id: category.id,
        name: category.name?.trim() || "Sin nombre",
        icon: category.icon?.trim() || null,
        status: Number(category.status ?? 0),
        createdAt: category.createdAt.toISOString(),
      }))}
    />
  );
}


