import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSeoDraftFromImage, type SeoRewriteMode } from "@/lib/seo-ai.server";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  if (process.env.STATIC_EXPORT === "true") {
    return [{ id: "0" }];
  }

  return [];
}

function parseId(rawId: string): number | null {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function getPublicAssetUrl(path: string | null): string | null {
  if (!path) {
    return null;
  }

  const host = process.env.NEXT_PUBLIC_S3;
  if (!host) {
    return null;
  }

  const protocol = process.env.NEXT_PUBLIC_S3_PROTOCOL || "http";
  return `${protocol}://${host}/${path.replace(/^\/+/, "")}`;
}

function isValidMode(mode: string): mode is SeoRewriteMode {
  return mode === "complement" || mode === "rewrite-soft" || mode === "rewrite-hard";
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { id: rawId } = await context.params;
  const id = parseId(rawId);

  if (!id) {
    return NextResponse.json({ error: "ID invalido" }, { status: 400 });
  }

  const payload = (await request.json().catch(() => null)) as
    | {
        profileId?: number;
        mode?: string;
        previewFileId?: number;
        context?: {
          name?: string;
          shortDescription?: string;
          seoDescription?: string;
          longDescription?: string;
          keywords?: string;
          features?: string;
          benefits?: string;
          useCases?: string;
          audience?: string;
          faq?: string;
          imageDescription?: string;
          productionTime?: string;
          shippingTime?: string;
          availability?: string;
          dimensions?: string;
          notes?: string;
          author?: string;
          material?: string;
          categories?: string[];
        };
      }
    | null;

  const profileId = Number(payload?.profileId ?? 0);
  const mode = String(payload?.mode ?? "").trim();
  const previewFileId = Number(payload?.previewFileId ?? 0);

  if (!Number.isInteger(profileId) || profileId <= 0) {
    return NextResponse.json({ error: "Perfil de redactor invalido" }, { status: 400 });
  }

  if (!isValidMode(mode)) {
    return NextResponse.json({ error: "Modo de redaccion invalido" }, { status: 400 });
  }

  const design = await prisma.designs.findFirst({
    where: { id },
    select: { id: true },
  });

  if (!design) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  const writerProfile = await prisma.seoWriterProfiles.findFirst({
    where: { id: profileId, status: 1 },
    select: {
      id: true,
      name: true,
      tone: true,
      audience: true,
      instructions: true,
    },
  });

  if (!writerProfile) {
    return NextResponse.json({ error: "Perfil de redactor no encontrado" }, { status: 404 });
  }

  const previewRelation = await prisma.relDesignsFiles.findFirst({
    where: {
      designId: id,
      status: 1,
      typeId: previewFileId > 0 ? previewFileId : undefined,
      file: {
        status: 1,
        fileType: {
          name: "Vista previa",
        },
      },
    },
    select: {
      file: {
        select: {
          filePath: true,
          fileExtension: {
            select: {
              mimeType: true,
            },
          },
        },
      },
    },
  });

  const imageUrl = getPublicAssetUrl(previewRelation?.file?.filePath ?? null);

  if (!imageUrl) {
    return NextResponse.json(
      { error: "No se encontro una imagen de vista previa utilizable para IA" },
      { status: 400 },
    );
  }

  const imageResponse = await fetch(imageUrl);

  if (!imageResponse.ok) {
    return NextResponse.json(
      { error: "No fue posible descargar la imagen para analisis IA" },
      { status: 502 },
    );
  }

  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
  const imageMimeType = previewRelation?.file?.fileExtension?.mimeType || "image/webp";

  try {
    const draft = await generateSeoDraftFromImage({
      mode,
      profile: writerProfile,
      imageBase64: imageBuffer.toString("base64"),
      imageMimeType,
      context: {
        name: String(payload?.context?.name ?? "").trim(),
        shortDescription: String(payload?.context?.shortDescription ?? "").trim(),
        seoDescription: String(payload?.context?.seoDescription ?? "").trim(),
        longDescription: String(payload?.context?.longDescription ?? "").trim(),
        keywords: String(payload?.context?.keywords ?? "").trim(),
        features: String(payload?.context?.features ?? "").trim(),
        benefits: String(payload?.context?.benefits ?? "").trim(),
        useCases: String(payload?.context?.useCases ?? "").trim(),
        audience: String(payload?.context?.audience ?? "").trim(),
        faq: String(payload?.context?.faq ?? "").trim(),
        imageDescription: String(payload?.context?.imageDescription ?? "").trim(),
        productionTime: String(payload?.context?.productionTime ?? "").trim(),
        shippingTime: String(payload?.context?.shippingTime ?? "").trim(),
        availability: String(payload?.context?.availability ?? "").trim(),
        dimensions: String(payload?.context?.dimensions ?? "").trim(),
        notes: String(payload?.context?.notes ?? "").trim(),
        author: String(payload?.context?.author ?? "").trim(),
        material: String(payload?.context?.material ?? "").trim(),
        categories: Array.isArray(payload?.context?.categories)
          ? payload?.context?.categories.map((item) => String(item).trim()).filter(Boolean)
          : [],
      },
    });

    return NextResponse.json(draft);
  } catch (error) {
    console.error("Error al generar SEO con IA", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo generar contenido SEO con IA",
      },
      { status: 500 },
    );
  }
}

