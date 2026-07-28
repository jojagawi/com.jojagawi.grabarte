import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const defaultImage = "/dam/dafault-image-product.webp";
const canEditDesigns = process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";

interface ProductDetailPageProps {
  params: Promise<{ idSlug: string }>;
}

type FileItem = {
  url: string;
  isVideo: boolean;
  key: string;
};

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

function toFileItem(
  filePath: string | null | undefined,
  mimeType: string | null | undefined,
): FileItem | null {
  const url = toMediaUrl(filePath);
  if (!url) {
    return null;
  }

  return {
    url,
    isVideo: isVideoMime(mimeType),
    key: filePath ?? url,
  };
}

export async function generateStaticParams(): Promise<Array<{ idSlug: string }>> {
  const designs = await prisma.designs.findMany({
    where: {
      status: 1,
      showInSite: 1,
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

  if (!parsed) {
    return {
      title: "Producto | InspiraArte",
    };
  }

  const design = await prisma.designs.findFirst({
    where: {
      id: parsed.id,
      status: 1,
      showInSite: 1,
      name: { not: null },
    },
    select: {
      name: true,
      description: true,
    },
  });

  if (!design?.name) {
    return {
      title: "Producto | InspiraArte",
    };
  }

  return {
    title: `${design.name} | InspiraArte`,
    description:
      design.description?.trim() ||
      "Conoce este diseño personalizado de InspiraArte y solicita tu cotización.",
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { idSlug } = await params;
  const parsed = parseIdSlug(idSlug);

  if (!parsed) {
    notFound();
  }

  const design = await prisma.designs.findFirst({
    where: {
      id: parsed.id,
      status: 1,
      showInSite: 1,
      name: { not: null },
    },
    select: {
      id: true,
      name: true,
      description: true,
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
  });

  if (!design?.name) {
    notFound();
  }

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
    .filter((file): file is NonNullable<typeof file> => Boolean(file?.filePath));

  const previewRelation =
    fileRelations.find((file) => file.fileType?.name === "Vista previa") || fileRelations[0];

  const previewItem = toFileItem(
    previewRelation?.filePath,
    previewRelation?.fileExtension?.mimeType,
  );

  const possibleDesignItems = fileRelations
    .filter((file) => file.fileType?.name === "Imagenes del diseño")
    .map((file) => toFileItem(file.filePath, file.fileExtension?.mimeType))
    .filter((item): item is FileItem => Boolean(item));

  const galleryItems =
    possibleDesignItems.length > 0
      ? possibleDesignItems
      : previewItem
        ? [previewItem]
        : [];

  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" className="text-[#4290A3] hover:text-[#1FA4A7]">
            <Link href="/productos" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver a productos
            </Link>
          </Button>

          {canEditDesigns && (
            <Button asChild className="bg-[#4290A3] hover:bg-[#1FA4A7] text-white">
              <Link href={`/productos/editar/${design.id}`} className="inline-flex items-center gap-2">
                <Pencil className="w-4 h-4" />
                Editar producto
              </Link>
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="overflow-hidden py-0">
            <CardContent className="p-0">
              {previewItem?.isVideo ? (
                <video
                  controls
                  className="w-full aspect-square object-cover bg-black"
                  preload="metadata"
                >
                  <source src={previewItem.url} />
                  Tu navegador no soporta la reproducción de video.
                </video>
              ) : (
                <div className="relative aspect-square bg-gradient-to-br from-[#4290A3]/10 to-[#1FA4A7]/10">
                  <Image
                    src={previewItem?.url || defaultImage}
                    alt={`Vista previa de ${design.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

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
                  {design.description?.trim() ||
                    "Diseño personalizado disponible bajo cotización."}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Material</p>
                  <Badge variant="outline" className="text-sm">
                    {design.material?.name?.trim() || "No especificado"}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Categoria</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.length > 0 ? (
                      categories.map((categoryName) => (
                        <Badge key={categoryName} variant="secondary" className="text-sm">
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
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Imagenes del diseno
          </h2>

          {galleryItems.length === 0 ? (
            <Card>
              <CardContent className="text-sm text-muted-foreground">
                Este producto aun no tiene imagenes adicionales disponibles.
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item, index) => (
                <Card key={`${item.key}-${index}`} className="overflow-hidden py-0">
                  <CardContent className="p-0">
                    {item.isVideo ? (
                      <video
                        controls
                        className="w-full aspect-[4/3] object-cover bg-black"
                        preload="metadata"
                      >
                        <source src={item.url} />
                        Tu navegador no soporta la reproducción de video.
                      </video>
                    ) : (
                      <div className="relative aspect-[4/3] bg-muted">
                        <Image
                          src={item.url}
                          alt={`Imagen ${index + 1} del diseño ${design.name}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

