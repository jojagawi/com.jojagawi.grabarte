"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type PdfComponents = {
  Document: typeof import("react-pdf").Document;
  Page: typeof import("react-pdf").Page;
};

type FilePreviewProps = {
  previewUrl: string;
  fileName: string;
  mimeType: string;
  extension: string;
  alt: string;
  className?: string;
};

function isPdf(mimeType: string, extension: string): boolean {
  return mimeType === "application/pdf" || extension === "pdf";
}

function isDxf(extension: string): boolean {
  return extension === "dxf";
}

function isVideo(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

function isImage(mimeType: string, extension: string): boolean {
  return mimeType.startsWith("image/") || extension === "svg" || extension === "lbrn2";
}

export function FilePreview({
  previewUrl,
  fileName,
  mimeType,
  extension,
  alt,
  className,
}: FilePreviewProps) {
  const dxfContainerRef = useRef<HTMLDivElement | null>(null);
  const [dxfError, setDxfError] = useState<string | null>(null);
  const [pdfComponents, setPdfComponents] = useState<PdfComponents | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    if (!isDxf(extension) || !dxfContainerRef.current) {
      return;
    }

    let viewer: { Load: (input: { url: string }) => Promise<void>; Destroy: () => void } | null = null;
    let cancelled = false;

    (async () => {
      try {
        const dxfViewerModule = await import("dxf-viewer");
        if (cancelled || !dxfContainerRef.current) {
          return;
        }

        const container = dxfContainerRef.current;
        viewer = new dxfViewerModule.DxfViewer(container, { autoResize: true });
        await viewer.Load({ url: previewUrl });
      } catch (error) {
        console.error(error);
        setDxfError("No fue posible previsualizar el archivo DXF.");
      }
    })();

    return () => {
      cancelled = true;
      if (viewer) {
        viewer.Destroy();
      }
    };
  }, [extension, previewUrl]);

  useEffect(() => {
    if (!isPdf(mimeType, extension)) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const reactPdfModule = await import("react-pdf");
        reactPdfModule.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${reactPdfModule.pdfjs.version}/build/pdf.worker.min.mjs`;

        if (!cancelled) {
          setPdfError(null);
          setPdfComponents({
            Document: reactPdfModule.Document,
            Page: reactPdfModule.Page,
          });
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setPdfError("No fue posible cargar la previsualizacion del PDF.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mimeType, extension]);

  if (isVideo(mimeType)) {
    return (
      <video controls className={className} preload="metadata">
        <source src={previewUrl} />
        <track kind="captions" srcLang="es" label="Subtitulos" src="data:text/vtt,WEBVTT%0A%0A" />
        Tu navegador no soporta la reproduccion de video.
      </video>
    );
  }

  if (isPdf(mimeType, extension)) {
    const wrapperClass = className ? `${className} bg-muted overflow-hidden` : "bg-muted overflow-hidden";

    if (pdfError) {
      return <div className={`${wrapperClass} p-3 text-xs text-destructive`}>{pdfError}</div>;
    }

    if (!pdfComponents) {
      return <div className={`${wrapperClass} p-4 text-xs text-muted-foreground`}>Cargando PDF...</div>;
    }

    const { Document, Page } = pdfComponents;

    return (
      <div className={wrapperClass}>
        <Document file={previewUrl} loading={<div className="p-4 text-xs text-muted-foreground">Cargando PDF...</div>}>
          <Page pageNumber={1} width={420} renderTextLayer={false} renderAnnotationLayer={false} />
        </Document>
      </div>
    );
  }

  if (isDxf(extension)) {
    return (
      <div className={className ? `${className} bg-muted` : "bg-muted"}>
        <div ref={dxfContainerRef} className="w-full h-full min-h-[220px]" />
        {dxfError && (
          <div className="p-3 text-xs text-destructive">
            {dxfError}
          </div>
        )}
      </div>
    );
  }

  if (isImage(mimeType, extension)) {
    return (
      <Image
        src={previewUrl}
        alt={alt}
        width={1200}
        height={1200}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, 50vw"
        className={className}
        unoptimized
      />
    );
  }

  return (
    <div className={className ? `${className} flex items-center justify-center text-xs text-muted-foreground px-4 text-center bg-muted` : "flex items-center justify-center text-xs text-muted-foreground px-4 text-center bg-muted"}>
      {fileName}
    </div>
  );
}

