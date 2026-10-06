"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { FilePreview } from "@/components/custom/file-preview";
import { Card, CardContent } from "@/components/ui/card";

type FileItem = {
  id: number;
  previewUrl: string;
  displayUrl: string;
  downloadUrl: string;
  isVideo: boolean;
  isImage: boolean;
  fileName: string;
  mimeType: string;
  extension: string;
  key: string;
};

interface DesignMediaGalleryProps {
  designName: string;
  defaultImage: string;
  previewItem: FileItem | null;
  galleryItems: FileItem[];
  children: ReactNode;
}

type ModalImage = {
  src: string;
  alt: string;
  label: string;
};

export function DesignMediaGallery({
  designName,
  defaultImage,
  previewItem,
  galleryItems,
  children,
}: DesignMediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const modalImages = useMemo<ModalImage[]>(() => {
    const images: ModalImage[] = [];
    const seen = new Set<string>();

    const pushImage = (src: string, alt: string, label: string) => {
      if (!src || seen.has(src)) {
        return;
      }
      seen.add(src);
      images.push({ src, alt, label });
    };

    if (previewItem?.isImage) {
      pushImage(
        previewItem.previewUrl,
        `Vista previa de ${designName}`,
        "Imagen principal",
      );
    }

    galleryItems.forEach((item, index) => {
      if (!item.isImage) {
        return;
      }
      pushImage(
        item.previewUrl,
        `Imagen ${index + 1} del diseño ${designName}`,
        `Imagen ${index + 1}`,
      );
    });

    if (images.length === 0) {
      pushImage(defaultImage, `Vista previa de ${designName}`, "Imagen principal");
    }

    return images;
  }, [defaultImage, designName, galleryItems, previewItem]);

  const indexBySrc = useMemo(() => {
    const map = new Map<string, number>();
    modalImages.forEach((image, index) => {
      map.set(image.src, index);
    });
    return map;
  }, [modalImages]);

  const isOpen = activeIndex !== null;
  const currentImage = activeIndex !== null ? modalImages[activeIndex] : null;
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openBySrc = (src: string) => {
    const index = indexBySrc.get(src);
    if (typeof index === "number") {
      setActiveIndex(index);
    }
  };

  const closeModal = () => {
    setActiveIndex(null);
  };

  const goNext = () => {
    setActiveIndex((prev) => {
      if (prev === null) {
        return prev;
      }
      return (prev + 1) % modalImages.length;
    });
  };

  const goPrevious = () => {
    setActiveIndex((prev) => {
      if (prev === null) {
        return prev;
      }
      return (prev - 1 + modalImages.length) % modalImages.length;
    });
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // El foco entra al visor al abrir y regresa a la imagen que lo abrió al cerrar.
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      } else if (event.key === "ArrowRight") {
        setActiveIndex((prev) => {
          if (prev === null) {
            return prev;
          }
          return (prev + 1) % modalImages.length;
        });
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => {
          if (prev === null) {
            return prev;
          }
          return (prev - 1 + modalImages.length) % modalImages.length;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, modalImages.length]);

  return (
    <>
      <div className="grid items-start gap-8 lg:grid-cols-2">
        {/* La pieza acompaña la lectura de la ficha en escritorio en lugar de dejar un hueco. */}
        <Card className="overflow-hidden py-0 lg:sticky lg:top-24">
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
                  label="Subtítulos"
                  src="data:text/vtt,WEBVTT%0A%0A"
                />
                Tu navegador no soporta la reproducción de video.
              </video>
            ) : (
              <button
                type="button"
                onClick={() => openBySrc(previewItem?.previewUrl || defaultImage)}
                className="relative block w-full aspect-square bg-linear-to-br from-primary/10 to-inspirarte-teal/10 cursor-zoom-in"
                aria-label="Abrir imagen principal en pantalla completa"
              >
                <Image
                  src={previewItem?.displayUrl || previewItem?.previewUrl || defaultImage}
                  alt={`Vista previa de ${designName}`}
                  fill
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </button>
            )}
          </CardContent>
        </Card>

        {children}
      </div>

      {/* Sin imágenes adicionales no se muestra la sección: la vista previa ya está arriba. */}
      {galleryItems.length > 0 && (
        <section aria-labelledby="imagenes-del-diseno" className="space-y-6">
          <h2
            id="imagenes-del-diseno"
            className="font-serif text-2xl sm:text-3xl font-bold text-foreground"
          >
            Imágenes del diseño
          </h2>

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
                        label="Subtítulos"
                        src="data:text/vtt,WEBVTT%0A%0A"
                      />
                      Tu navegador no soporta la reproducción de video.
                    </video>
                  ) : item.isImage ? (
                    <button
                      type="button"
                      onClick={() => openBySrc(item.previewUrl)}
                      className="relative block w-full aspect-4/3 bg-muted cursor-zoom-in"
                      aria-label={`Abrir imagen ${index + 1} en pantalla completa`}
                    >
                      <Image
                        src={item.displayUrl || item.previewUrl}
                        alt={`Imagen ${index + 1} del diseño ${designName}`}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </button>
                  ) : (
                    <FilePreview
                      previewUrl={item.previewUrl}
                      fileName={item.fileName}
                      mimeType={item.mimeType}
                      extension={item.extension}
                      alt={`Archivo ${index + 1} del diseño ${designName}`}
                      className="w-full aspect-4/3 object-cover bg-muted"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {isOpen && currentImage && (
        <div
          className="fixed inset-0 z-100 bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imagen a pantalla completa"
        >
          {/* Clic en el fondo cierra; no se anuncia como control (el botón X ya lo es). */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 z-0 cursor-default"
            onClick={closeModal}
          />

          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-2 text-white">
            <p className="text-sm sm:text-base">
              {currentImage.label} - {activeIndex + 1}/{modalImages.length}
            </p>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeModal}
              className="inline-flex size-11 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Cerrar visor"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {modalImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goPrevious();
                }}
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goNext();
                }}
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}

          <div className="relative z-10 mx-auto h-full w-full max-w-7xl px-4 py-16 sm:px-8 sm:py-20">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}


