import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { EditDesign } from "@/components/custom/edit-design";

export const metadata: Metadata = buildPageMetadata({
  title: "Editar producto del catalogo | InspiraArte",
  description:
    "Panel interno para actualizar informacion, visibilidad, categorias, precios y archivos de un producto.",
  path: "/productos/editar",
  imagePath: "/dam/dafault-image-product.webp",
  imageAlt: "Panel interno para editar productos en InspiraArte",
  noIndex: true,
});

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

function parseModelOptions(rawValue: string | undefined, fallbackModel: string): string[] {
  const options = String(rawValue || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (options.length > 0) {
    return Array.from(new Set(options));
  }

  return [fallbackModel];
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
  const defaultSeoAiProvider =
    process.env.SEO_AI_PROVIDER?.trim().toLowerCase() === "openrouter" ? "openrouter" : "gemini";
  const defaultSeoAiModels = {
    gemini: parseModelOptions(
      process.env.SEO_AI_GEMINI_MODELS,
      process.env.SEO_AI_GEMINI_MODEL?.trim() || "gemini-2.5-flash",
    ),
    openrouter: parseModelOptions(
      process.env.SEO_AI_OPENROUTER_MODELS,
      process.env.SEO_AI_OPENROUTER_MODEL?.trim() || "qwen/qwen2.5-vl-72b-instruct:free",
    ),
  };

  const canEditDesigns = process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
  if (!canEditDesigns || process.env.NODE_ENV !== "development") {
    notFound();
  }

  const id = parseId(rawId);
  if (!id) {
    notFound();
  }

  const [categories, materials, seoWriterProfiles, design] = await Promise.all([
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
    prisma.seoWriterProfiles.findMany({
      where: {
        status: 1,
      },
      select: {
        id: true,
        name: true,
        tone: true,
        audience: true,
        defaultMode: true,
        instructions: true,
        isDefault: true,
      },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    }),
    prisma.designs.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        keywords: true,
        seoDescription: true,
        longDescription: true,
        features: true,
        benefits: true,
        useCases: true,
        audience: true,
        faq: true,
        imageDescription: true,
        productionTime: true,
        shippingTime: true,
        availability: true,
        dimensions: true,
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
        mayoreo: true,
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
      defaultSeoAiProvider={defaultSeoAiProvider}
      defaultSeoAiModels={defaultSeoAiModels}
      categories={categories.map((item) => ({ id: item.id, name: item.name ?? "" }))}
      materials={materials.map((item) => ({
        id: item.id,
        name: item.name ?? "",
        slug: item.slug ?? "",
      }))}
      seoWriterProfiles={seoWriterProfiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        tone: profile.tone,
        audience: profile.audience,
        defaultMode:
          profile.defaultMode === "complement" ||
          profile.defaultMode === "rewrite-hard" ||
          profile.defaultMode === "rewrite-soft"
            ? profile.defaultMode
            : "rewrite-soft",
        instructions: profile.instructions,
        isDefault: profile.isDefault === 1,
      }))}
      design={{
        id: design.id,
        name: design.name ?? "",
        description: design.description ?? "",
        keywords: design.keywords ?? "",
        seoDescription: design.seoDescription ?? "",
        longDescription: design.longDescription ?? "",
        features: design.features ?? "",
        benefits: design.benefits ?? "",
        useCases: design.useCases ?? "",
        audience: design.audience ?? "",
        faq: design.faq ?? "",
        imageDescription: design.imageDescription ?? "",
        productionTime: design.productionTime ?? "",
        shippingTime: design.shippingTime ?? "",
        availability: design.availability ?? "",
        dimensions: design.dimensions ?? "",
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
        mayoreo: design.mayoreo,
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
