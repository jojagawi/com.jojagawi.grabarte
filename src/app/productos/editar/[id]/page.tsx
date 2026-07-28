import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditDesign } from "@/components/custom/edit-design";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Editar producto | InspiraArte",
  description: "Panel para editar productos del catalogo y administrar sus archivos.",
};

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  if (process.env.STATIC_EXPORT === "true") {
    return [{ id: "0" }];
  }

  return [];
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

function parseId(rawId: string): number | null {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id: rawId } = await params;

  const canEditDesigns = process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
  if (!canEditDesigns || process.env.NODE_ENV !== "development") {
    notFound();
  }

  const id = parseId(rawId);
  if (!id) {
    notFound();
  }

  const [categories, materials, design] = await Promise.all([
    prisma.catCategories.findMany({
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
    }),
    prisma.catMaterials.findMany({
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
    }),
    prisma.designs.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        author: true,
        notes: true,
        materialId: true,
        status: true,
        isTested: true,
        isCustomizable: true,
        showInHome: true,
        showInSite: true,
        numberMdfTables: true,
        timeMachine: true,
        suggestedPrice: true,
        minimumPrice: true,
        relDesignsCategories: {
          where: { status: 1, categoryId: { not: null } },
          select: {
            categoryId: true,
          },
        },
        relDesignsFiles: {
          where: {
            status: 1,
            file: {
              status: 1,
            },
          },
          select: {
            file: {
              select: {
                id: true,
                filePath: true,
                fileType: {
                  select: {
                    name: true,
                  },
                },
                fileExtension: {
                  select: {
                    mimeType: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  if (!design) {
    notFound();
  }

  return (
    <EditDesign
      categories={categories.map((item) => ({ id: item.id, name: item.name ?? "" }))}
      materials={materials.map((item) => ({
        id: item.id,
        name: item.name ?? "",
        slug: item.slug ?? "",
      }))}
      design={{
        id: design.id,
        name: design.name ?? "",
        description: design.description ?? "",
        author: design.author ?? "",
        notes: design.notes ?? "",
        materialId: design.materialId,
        status: design.status,
        isTested: design.isTested,
        isCustomizable: design.isCustomizable,
        showInHome: design.showInHome,
        showInSite: design.showInSite,
        numberMdfTables: design.numberMdfTables,
        timeMachine: design.timeMachine,
        suggestedPrice: design.suggestedPrice,
        minimumPrice: design.minimumPrice,
        categoryIds: design.relDesignsCategories
          .map((relation) => relation.categoryId)
          .filter((categoryId): categoryId is number => Number.isInteger(categoryId)),
        files: design.relDesignsFiles
          .map((relation) => relation.file)
          .filter((file): file is NonNullable<typeof file> => Boolean(file?.id))
          .map((file) => ({
            id: file.id,
            filePath: file.filePath,
            typeName: file.fileType?.name ?? "Sin tipo",
            mimeType: file.fileExtension?.mimeType ?? "",
          })),
      }}
    />
  );
}

