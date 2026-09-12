import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { buildPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { buildProductCode } from "@/lib/utils";
import { DesignMediaGallery } from "@/components/custom/design-media-gallery";
import { FilePreview } from "@/components/custom/file-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toResizedWebpDataUrlFromUrl } from "@/lib/utils.server";
import { ProductCodeVisibility } from "@/components/custom/product-code-visibility";
import { FAQ } from "@/components/custom/faq";
import { buildProductJsonLd, serializeJsonLd } from "@/lib/structured-data";

const defaultImage = "/dam/dafault-image-product.webp";
const canEditDesigns = process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";

interface ProductDetailPageProps {
  params: Promise<{ idSlug: string }>;
}

type FileItem = {
  id: number;
  previewUrl: string;
  displayUrl: string;
  downloadUrl: string;
  downloadName: string;
  isVideo: boolean;
  isImage: boolean;
  fileName: string;
  mimeType: string;
  extension: string;
  key: string;
};

type ProductFaqItem = {
  id: number;
  question: string;
  answer: string;
};

type RelatedProductItem = {
  id: number;
  name: string;
  description: string;
  image: string;
  categories: string[];
};

const relatedCardGradients = [
  "from-[#00B003]/15 to-[#00B003]/5",
  "from-[#4290A3]/15 to-[#4290A3]/5",
  "from-[#1FA4A7]/15 to-[#1FA4A7]/5",
  "from-[#585106]/15 to-[#585106]/5",
];

function parseIdSlug(value: string): { id: number } | null {
  const match = /^(\d+)-(.+)$/u.exec(value);
  if (!match) {
    return null;
  }

  const id = Number(match[1]);
  if (!Number.isInteger(id)) {
    return null;
  }

  return { id };
}

function getMediaBaseUrl(): string {
  return `${process.env.NEXT_PUBLIC_S3_PROTOCOL || "http"}://${process.env.NEXT_PUBLIC_S3 || "dam.inspiraarte.com"}`;
}

function toMediaUrl(filePath: string | null | undefined): string | null {
  if (!filePath) {
    return null;
  }

  return `${getMediaBaseUrl()}/${filePath.replace(/^\/+/, "")}`;
}

function isVideoMime(mimeType: string | null | undefined): boolean {
  return Boolean(mimeType?.startsWith("video/"));
}

function isImageMime(mimeType: string | null | undefined): boolean {
  return Boolean(mimeType?.startsWith("image/"));
}

function getFileNameFromPath(filePath: string | null | undefined): string {
  if (!filePath) {
    return "archivo";
  }

  const parts = filePath.split("/");
  return parts[parts.length - 1] || "archivo";
}

function getPrivateFileProxyUrl(fileId: number): string {
  return `/api/admin/designs/files/${fileId}`;
}

function getFileExtensionLabel(extension: string): string {
  const normalized = extension.trim();
  return normalized ? normalized.toUpperCase() : "ARCHIVO";
}

function normalizeExtension(extension: string | null | undefined): string {
  const cleaned = String(extension || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return cleaned || "bin";
}

function buildDownloadName(fileId: number, productName: string, extension: string): string {
  const safeProductSlug = slugify(productName) || "producto";
  const safeExtension = normalizeExtension(extension);
  return `${fileId}-${safeProductSlug}.${safeExtension}`;
}

function buildProxyDownloadUrl(fileId: number, downloadName: string): string {
  const params = new URLSearchParams({
    download: "1",
    filename: downloadName,
  });

  return `${getPrivateFileProxyUrl(fileId)}?${params.toString()}`;
}

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

function splitKeywords(value: string | null | undefined): string[] {
  return String(value || "")
    .split(/[\n,]/u)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeFaqRawText(value: string | null | undefined): string {
  return String(value || "")
    .replace(/----\s*inicio\s*----/giu, "")
    .replace(/----\s*fin\s*---*/giu, "")
    .trim();
}

function parseProductFaqItems(value: string | null | undefined): ProductFaqItem[] {
  const raw = normalizeFaqRawText(value);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed
        .map((item, index) => {
          if (!item || typeof item !== "object") {
            return null;
          }

          const question = String((item as { question?: unknown }).question ?? "").trim();
          const answer = String((item as { answer?: unknown }).answer ?? "").trim();

          if (!question || !answer) {
            return null;
          }

          return {
            id: index + 1,
            question,
            answer,
          };
        })
        .filter((item): item is ProductFaqItem => Boolean(item));
    }
  } catch {
    // Intentamos formato de texto libre.
  }

  const questionAnswerMatches = Array.from(
    raw.matchAll(/(¿[^?]+\?)\s*([\s\S]*?)(?=¿[^?]+\?|$)/gu),
  )
    .map((match, index) => {
      const question = String(match[1] || "").trim();
      const answer = String(match[2] || "").trim();

      if (!question || !answer) {
        return null;
      }

      return {
        id: index + 1,
        question,
        answer,
      };
    })
    .filter((item): item is ProductFaqItem => Boolean(item));

  if (questionAnswerMatches.length > 0) {
    return questionAnswerMatches;
  }

  return raw
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const match = line.match(/^(.+?)(?:\s*\|\|\s*|\s*\|\s*|\s*=>\s*|\s*:\s+)(.+)$/u);
      if (!match) {
        return null;
      }

      const question = String(match[1] || "").trim();
      const answer = String(match[2] || "").trim();

      if (!question || !answer) {
        return null;
      }

      return {
        id: index + 1,
        question,
        answer,
      };
    })
    .filter((item): item is ProductFaqItem => Boolean(item));
}

function toFileItem(
  fileId: number,
  filePath: string | null | undefined,
  mimeType: string | null | undefined,
  extension: string | null | undefined,
  preferPrivateProxy = false,
): FileItem | null {
  const normalizedExtension = String(extension || "").toLowerCase();
  const proxyDownloadUrl = getPrivateFileProxyUrl(fileId);
  const mediaDownloadUrl = preferPrivateProxy ? proxyDownloadUrl : toMediaUrl(filePath);

  if (!mediaDownloadUrl && normalizedExtension !== "lbrn2") {
    return null;
  }

  const previewUrl =
    normalizedExtension === "lbrn2"
      ? `${proxyDownloadUrl}?format=svg`
      : mediaDownloadUrl ?? proxyDownloadUrl;

  const downloadUrl = mediaDownloadUrl ?? proxyDownloadUrl;

  return {
    id: fileId,
    previewUrl,
    displayUrl: previewUrl,
    downloadUrl,
    downloadName: getFileNameFromPath(filePath),
    isVideo: isVideoMime(mimeType),
    isImage: isImageMime(mimeType) || normalizedExtension === "svg" || normalizedExtension === "lbrn2",
    fileName: getFileNameFromPath(filePath),
    mimeType: mimeType || "",
    extension: normalizedExtension,
    key: `${fileId}-${filePath ?? previewUrl}`,
  };
}

export async function generateStaticParams(): Promise<Array<{ idSlug: string }>> {
  const isDevelopment = process.env.NODE_ENV === "development";
  const designs = await prisma.designs.findMany({
    where: {
      ...(isDevelopment ? {} : { status: 1, showInSite: 1 }),
      name: { not: null },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return designs
    .filter((design): design is { id: number; name: string } => Boolean(design.name?.trim()))
    .map((design) => ({
      idSlug: `${design.id}-${slugify(design.name)}`,
    }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { idSlug } = await params;
  const parsed = parseIdSlug(idSlug);
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!parsed) {
    return buildPageMetadata({
      title: "Producto | InspiraArte",
      description: "Explora productos personalizados de InspiraArte y solicita tu cotización.",
      path: "/productos",
      noIndex: true,
    });
  }

  const design = await prisma.designs.findFirst({
    where: {
      id: parsed.id,
      ...(isDevelopment ? {} : { status: 1, showInSite: 1 }),
      name: { not: null },
    },
    select: {
      id: true,
      name: true,
      description: true,
      keywords: true,
      seoDescription: true,
      longDescription: true,
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
  });

  if (!design?.name) {
    return buildPageMetadata({
      title: "Producto | InspiraArte",
      description: "Explora productos personalizados de InspiraArte y solicita tu cotización.",
      path: "/productos",
      noIndex: true,
    });
  }

  const canonicalPath = `/productos/${design.id}-${slugify(design.name)}`;
  const firstPreviewPath = design.relDesignsFiles.find((relation) => relation.file?.fileTypeId === 1)?.file?.filePath;
  const firstGalleryPath = design.relDesignsFiles.find((relation) => relation.file?.filePath)?.file?.filePath;
  const selectedImagePath = firstPreviewPath ?? firstGalleryPath ?? defaultImage;
  const socialImagePath = toMediaUrl(selectedImagePath) || defaultImage;
  const seoDescription =
    design.seoDescription?.trim() ||
    design.description?.trim() ||
    "Conoce este diseño personalizado de InspiraArte y solicita tu cotización.";

  return buildPageMetadata({
    title: `${design.name} | InspiraArte`,
    description: seoDescription,
    path: canonicalPath,
    imagePath: socialImagePath,
    imageAlt: `Vista previa del producto ${design.name} de InspiraArte`,
    keywords: splitKeywords(design.keywords),
    locale: "es_MX",
    countryName: "MX",
    imageWidth: 1200,
    imageHeight: 630,
    imageType: "image/webp",
  });
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { idSlug } = await params;
  const parsed = parseIdSlug(idSlug);
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!parsed) {
    notFound();
  }

  const design = await prisma.designs.findFirst({
    where: {
      id: parsed.id,
      ...(isDevelopment ? {} : { status: 1, showInSite: 1 }),
      name: { not: null },
    },
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
      showInHome: true,
      showInSite: true,
      minimumPrice: true,
      suggestedPrice: true,
      mayoreo: true,
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
            fileTypeId: { in: [1, 2, 3, 4] },
          },
        },
        select: {
          file: {
            select: {
              id: true,
              filePath: true,
              fileTypeId: true,
              fileType: {
                select: {
                  name: true,
                },
              },
              fileExtension: {
                select: {
                  mimeType: true,
                  extension: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!design?.name) {
    notFound();
  }

  const designNameForFiles = design.name ?? "producto";

  const canonicalSlug = slugify(design.name);
  const canonicalIdSlug = `${design.id}-${canonicalSlug}`;

  if (idSlug !== canonicalIdSlug) {
    permanentRedirect(`/productos/${canonicalIdSlug}`);
  }

  const categories = Array.from(
    new Set(
      design.relDesignsCategories
        .map((relation) => relation.category?.name)
        .filter((name): name is string => Boolean(name?.trim())),
    ),
  );

  const fileRelations = design.relDesignsFiles
    .map((relation) => relation.file)
    .filter((file): file is NonNullable<typeof file> =>
      Boolean(file?.filePath),
    );

  const previewRelation = fileRelations.find((file) => file.fileTypeId === 1);

  const previewItemRaw = toFileItem(
    previewRelation?.id ?? 0,
    previewRelation?.filePath,
    previewRelation?.fileExtension?.mimeType,
    previewRelation?.fileExtension?.extension,
  );

  const previewItem = previewItemRaw
    ? {
        ...previewItemRaw,
        displayUrl: previewItemRaw.isImage
          ? (await toResizedWebpDataUrlFromUrl(previewItemRaw.previewUrl, 600)) ?? previewItemRaw.previewUrl
          : previewItemRaw.previewUrl,
      }
    : null;

  const galleryItems = (
    await Promise.all(
      fileRelations
        .filter((file) => file.fileTypeId === 2)
        .map(async (file) => {
          const item = toFileItem(
            file.id,
            file.filePath,
            file.fileExtension?.mimeType,
            file.fileExtension?.extension,
          );

          if (!item) {
            return null;
          }

          if (!item.isImage) {
            return item;
          }

          const resizedBase64 = await toResizedWebpDataUrlFromUrl(item.previewUrl, 400);
          return {
            ...item,
            displayUrl: resizedBase64 ?? item.previewUrl,
          };
        }),
    )
  ).filter((item): item is FileItem => Boolean(item));

  const instructionItems = fileRelations
    .filter((file) => file.fileTypeId === 3)
    .map((file) => {
      const item = toFileItem(
        file.id,
        file.filePath,
        file.fileExtension?.mimeType,
        file.fileExtension?.extension,
        true,
      );

      if (!item) {
        return null;
      }

      const downloadName = buildDownloadName(item.id, designNameForFiles, item.extension);
      return {
        ...item,
        downloadName,
        downloadUrl: buildProxyDownloadUrl(item.id, downloadName),
      };
    })
    .filter((item): item is FileItem => Boolean(item));

  const sourceFileItems = fileRelations
    .filter((file) => file.fileTypeId === 4)
    .map((file) => {
      const item = toFileItem(
        file.id,
        file.filePath,
        file.fileExtension?.mimeType,
        file.fileExtension?.extension,
        true,
      );

      if (!item) {
        return null;
      }

      const downloadName = buildDownloadName(item.id, designNameForFiles, item.extension);
      return {
        ...item,
        downloadName,
        downloadUrl: buildProxyDownloadUrl(item.id, downloadName),
      };
    })
    .filter((item): item is FileItem => Boolean(item));

  const hasNumericCodeValues =
    Number.isFinite(design.minimumPrice) &&
    Number.isFinite(design.suggestedPrice);

  const minimumPrice = hasNumericCodeValues ? Math.trunc(design.minimumPrice as number) : null;
  const suggestedPrice = hasNumericCodeValues ? Math.trunc(design.suggestedPrice as number) : null;
  const mayoreoPrice = Number.isFinite(design.mayoreo) ? Math.trunc(design.mayoreo as number) : 0;

  const productCode =
    minimumPrice !== null && suggestedPrice !== null
      ? buildProductCode(design.id, minimumPrice, suggestedPrice, mayoreoPrice)
      : null;

  const productJsonLd = buildProductJsonLd({
    name: design.name,
    description:
      design.seoDescription?.trim() ||
      design.longDescription?.trim() ||
      design.description?.trim() ||
      "Diseño personalizado de InspiraArte.",
    url: `/productos/${canonicalIdSlug}`,
    sku: String(design.id),
    brandName: "InspiraArte",
    material: design.material?.name?.trim() || null,
    categories,
    images: [previewItem?.previewUrl, ...galleryItems.map((item) => item.previewUrl)].filter(
      (value): value is string => Boolean(value),
    ),
    author: design.author,
    features: design.features,
    benefits: design.benefits,
    useCases: design.useCases,
    audience: design.audience,
    faq: design.faq,
    imageDescription: design.imageDescription,
    productionTime: design.productionTime,
    shippingTime: design.shippingTime,
    availability: design.availability,
    dimensions: design.dimensions,
    keywords: splitKeywords(design.keywords),
    prices: {
      minimumPrice,
      suggestedPrice,
      mayoreoPrice,
      currency: "MXN",
    },
  });

  const relatedDesigns =
    categories.length > 0
      ? await prisma.designs.findMany({
          where: {
            id: { not: design.id },
            name: { not: null },
            ...(isDevelopment ? {} : { status: 1, showInSite: 1 }),
            relDesignsCategories: {
              some: {
                status: 1,
                category: {
                  status: 1,
                  name: {
                    in: categories,
                  },
                },
              },
            },
          },
          select: {
            id: true,
            name: true,
            description: true,
            seoDescription: true,
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
        })
      : [];

  const relatedProducts: RelatedProductItem[] = shuffleArray(relatedDesigns)
    .slice(0, 4)
    .map((relatedDesign) => {
      const previewFile = relatedDesign.relDesignsFiles.find(
        (relation) => relation.file?.fileType?.name === "Vista previa" && relation.file.filePath,
      );
      const firstFileWithPath = relatedDesign.relDesignsFiles.find((relation) => relation.file?.filePath);
      const selectedPath = previewFile?.file?.filePath ?? firstFileWithPath?.file?.filePath ?? null;
      const image = toMediaUrl(selectedPath) || defaultImage;
      const relatedCategories = Array.from(
        new Set(
          relatedDesign.relDesignsCategories
            .map((relation) => relation.category?.name)
            .filter((name): name is string => Boolean(name?.trim())),
        ),
      );

      return {
        id: relatedDesign.id,
        name: relatedDesign.name?.trim() || "Diseño sin nombre",
        description:
          relatedDesign.seoDescription?.trim() ||
          relatedDesign.description?.trim() ||
          "Diseño personalizado disponible bajo cotización.",
        image,
        categories: relatedCategories,
      };
    });

  const originalProductCode =
    minimumPrice !== null && suggestedPrice !== null
      ? [
          toFourDigits(design.id),
          toFourDigits(minimumPrice),
          toFourDigits(suggestedPrice),
          toFourDigits(mayoreoPrice),
        ].join("-")
      : null;
  const productFaqs = parseProductFaqItems(design.faq);

  return (
    <section className="py-24 bg-muted/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            asChild
            variant="ghost"
            className="text-[#4290A3] hover:text-[#1FA4A7]"
          >
            <Link href="/productos" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver a productos
            </Link>
          </Button>

          {canEditDesigns && (
            <Button
              asChild
              className="bg-[#4290A3] hover:bg-[#1FA4A7] text-white"
            >
              <Link
                href={`/productos/editar/${design.id}`}
                className="inline-flex items-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Editar producto
              </Link>
            </Button>
          )}
        </div>

        <DesignMediaGallery
          designName={design.name}
          defaultImage={defaultImage}
          previewItem={previewItem}
          galleryItems={galleryItems}
        >
          <Card className="py-0">
            <CardContent className="p-6 lg:p-8 space-y-6">
              <div className="space-y-3">
                <span className="inline-block px-4 py-1 rounded-full bg-[#4290A3]/10 text-[#4290A3] text-sm font-medium">
                  Producto personalizado
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground text-balance">
                  {design.name}
                </h1>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {design.seoDescription?.trim() ||
                    design.description?.trim() ||
                    "Diseño personalizado disponible bajo cotización."}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Material
                  </p>
                  <Badge variant="outline" className="text-sm">
                    {design.material?.name?.trim() || "No especificado"}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Codigo
                  </p>
                  <Badge variant="outline" className="text-sm">
                    <ProductCodeVisibility
                      encodedCode={productCode}
                      originalCode={originalProductCode}
                      fallback="No disponible"
                    />
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Categoria
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.length > 0 ? (
                      categories.map((categoryName) => (
                        <Badge
                          key={categoryName}
                          variant="secondary"
                          className="text-sm"
                        >
                          {categoryName}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="text-sm">
                        Sin categoria
                      </Badge>
                    )}
                  </div>
                </div>

                {(design.longDescription?.trim() || design.description?.trim()) && (
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">
                      Descripción del producto
                    </p>
                    <Card className="border-border/60 bg-white">
                      <CardContent className="p-4 sm:p-5">
                        <div className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                          {design.longDescription?.trim() || design.description?.trim()}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                { isDevelopment && ( splitKeywords(design.keywords).length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">
                      Keywords SEO
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {splitKeywords(design.keywords).map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-sm">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}

                {isDevelopment && (
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">
                      Visibilidad
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={
                          design.showInHome === 1 ? "secondary" : "outline"
                        }
                        className="text-sm"
                      >
                        Show in home:{" "}
                        {design.showInHome === 1
                          ? "Habilitado"
                          : "Deshabilitado"}
                      </Badge>
                      <Badge
                        variant={
                          design.showInSite === 1 ? "secondary" : "outline"
                        }
                        className="text-sm"
                      >
                        Show in site:{" "}
                        {design.showInSite === 1
                          ? "Habilitado"
                          : "Deshabilitado"}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </DesignMediaGallery>

        {productFaqs.length > 0 && <FAQ faqs={productFaqs} />}

        {relatedProducts.length > 0 && (
          <section className="bg-muted/30 py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <span className="mb-4 inline-block rounded-full bg-[#4290A3]/10 px-4 py-1 text-sm font-medium text-[#4290A3]">
                  Productos relacionados
                </span>
                <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
                  Más diseños que podrían <span className="text-[#4290A3]">interesarte</span>
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                  Seleccionamos productos con categorías en común para que descubras opciones similares.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    href={`/productos/${product.id}-${slugify(product.name)}`}
                    className="group block overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4290A3]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4290A3]/40"
                  >
                    <div
                      className={`relative aspect-square overflow-hidden bg-linear-to-br ${relatedCardGradients[index % relatedCardGradients.length]}`}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="space-y-4 p-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                        <p className="line-clamp-3 text-sm text-muted-foreground">{product.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {product.categories.length > 0 ? (
                          product.categories.map((categoryName) => (
                            <span
                              key={`${product.id}-${categoryName}`}
                              className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                            >
                              {categoryName}
                            </span>
                          ))
                        ) : (
                          <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                            Sin categoría
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {isDevelopment && canEditDesigns && (
          <>
            <div className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Instrucciones
              </h2>

              {instructionItems.length === 0 ? (
                <Card>
                  <CardContent className="text-sm text-muted-foreground">
                    Este producto aun no tiene archivos de instrucciones.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {instructionItems.map((item, index) => (
                    <Card
                      key={`${item.key}-${index}`}
                      className="overflow-hidden py-0"
                    >
                      <CardContent className="p-0">
                        {item.isVideo ? (
                          <video
                            controls
                            className="w-full aspect-4/3 object-cover bg-black"
                            preload="metadata"
                          >
                            <source src={item.previewUrl} />
                            <track
                              kind="captions"
                              srcLang="es"
                              label="Subtitulos"
                              src="data:text/vtt,WEBVTT%0A%0A"
                            />
                            Tu navegador no soporta la reproducción de video.
                          </video>
                        ) : (
                          <FilePreview
                            previewUrl={item.previewUrl}
                            fileName={item.fileName}
                            mimeType={item.mimeType}
                            extension={item.extension}
                            alt={`Archivo de instrucciones ${index + 1} de ${design.name}`}
                            className="w-full aspect-4/3 object-cover bg-muted"
                          />
                        )}
                        <div className="p-4 border-t border-border">
                          <a
                            href={item.downloadUrl}
                            download={item.downloadName}
                            className="text-sm font-medium text-[#4290A3] hover:underline"
                          >
                            Descargar archivo ({getFileExtensionLabel(item.extension)})
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Archivos fuente
              </h2>

              {sourceFileItems.length === 0 ? (
                <Card>
                  <CardContent className="text-sm text-muted-foreground">
                    Este producto aun no tiene archivos fuente.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sourceFileItems.map((item, index) => (
                    <Card
                      key={`${item.key}-${index}`}
                      className="overflow-hidden py-0"
                    >
                      <CardContent className="p-0">
                        {item.isVideo ? (
                          <video
                            controls
                            className="w-full aspect-4/3 object-cover bg-black"
                            preload="metadata"
                          >
                            <source src={item.previewUrl} />
                            <track
                              kind="captions"
                              srcLang="es"
                              label="Subtitulos"
                              src="data:text/vtt,WEBVTT%0A%0A"
                            />
                            Tu navegador no soporta la reproducción de video.
                          </video>
                        ) : (
                          <FilePreview
                            previewUrl={item.previewUrl}
                            fileName={item.fileName}
                            mimeType={item.mimeType}
                            extension={item.extension}
                            alt={`Archivo fuente ${index + 1} de ${design.name}`}
                            className="w-full aspect-4/3 object-cover bg-muted"
                          />
                        )}
                        <div className="p-4 border-t border-border">
                          <a
                            href={item.downloadUrl}
                            download={item.downloadName}
                            className="text-sm font-medium text-[#4290A3] hover:underline"
                          >
                            Descargar archivo ({getFileExtensionLabel(item.extension)})
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function toFourDigits(value: number): string {
  return Math.trunc(value).toString().padStart(4, "0");
}
