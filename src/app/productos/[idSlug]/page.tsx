import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { buildPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { FilePreview } from "@/components/custom/file-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const defaultImage = "/dam/dafault-image-product.webp";
const canEditDesigns = process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";

export const llmstxt = {
  title: "Detalle de producto",
  description: "Ficha de un diseño personalizado con galería y especificaciones.",
};

interface ProductDetailPageProps {
  params: Promise<{ idSlug: string }>;
}

type FileItem = {
  id: number;
  previewUrl: string;
  downloadUrl: string;
  isVideo: boolean;
  isImage: boolean;
  fileName: string;
  mimeType: string;
  extension: string;
  key: string;
};

const usePrivateFilesProxy = process.env.NEXT_PUBLIC_S3_IS_PUBLIC !== "true";

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
    downloadUrl,
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

  return buildPageMetadata({
    title: `${design.name} | InspiraArte`,
    description:
      design.description?.trim() ||
      "Conoce este diseño personalizado de InspiraArte y solicita tu cotización.",
    path: canonicalPath,
    imagePath: socialImagePath,
    imageAlt: `Vista previa del producto ${design.name} de InspiraArte`,
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

  const previewItem = toFileItem(
    previewRelation?.id ?? 0,
    previewRelation?.filePath,
    previewRelation?.fileExtension?.mimeType,
    previewRelation?.fileExtension?.extension,
  );

  const galleryItems = fileRelations
    .filter((file) => file.fileTypeId === 2)
    .map((file) => toFileItem(file.id, file.filePath, file.fileExtension?.mimeType, file.fileExtension?.extension))
    .filter((item): item is FileItem => Boolean(item));

  const instructionItems = fileRelations
    .filter((file) => file.fileTypeId === 3)
    .map((file) =>
      toFileItem(file.id, file.filePath, file.fileExtension?.mimeType, file.fileExtension?.extension, usePrivateFilesProxy),
    )
    .filter((item): item is FileItem => Boolean(item));

  const sourceFileItems = fileRelations
    .filter((file) => file.fileTypeId === 4)
    .map((file) =>
      toFileItem(file.id, file.filePath, file.fileExtension?.mimeType, file.fileExtension?.extension, usePrivateFilesProxy),
    )
    .filter((item): item is FileItem => Boolean(item));

  return (
    <section className="py-24 bg-muted/30">
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

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="overflow-hidden py-0">
            <CardContent className="p-0">
              {previewItem?.isVideo ? (
                <video
                  controls
                  className="w-full aspect-square object-cover bg-black"
                  preload="metadata"
                >
                  <source src={previewItem.previewUrl} />
                  <track
                    kind="captions"
                    srcLang="es"
                    label="Subtitulos"
                    src="data:text/vtt,WEBVTT%0A%0A"
                  />
                  Tu navegador no soporta la reproducción de video.
                </video>
              ) : (
                <div className="relative aspect-square bg-linear-to-br from-[#4290A3]/10 to-[#1FA4A7]/10">
                  <Image
                    src={previewItem?.previewUrl || defaultImage}
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
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Material
                  </p>
                  <Badge variant="outline" className="text-sm">
                    {design.material?.name?.trim() || "No especificado"}
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
                    ) : item.isImage ? (
                      <div className="relative aspect-4/3 bg-muted">
                        <Image
                          src={item.previewUrl}
                          alt={`Imagen ${index + 1} del diseño ${design.name}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-4/3 bg-muted flex items-center justify-center text-xs text-muted-foreground px-4 text-center">
                        {item.fileName}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {isDevelopment && (
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
                            download
                            className="text-sm font-medium text-[#4290A3] hover:underline"
                          >
                            Descargar archivo
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
                            download
                            className="text-sm font-medium text-[#4290A3] hover:underline"
                          >
                            Descargar archivo
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

