import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { invalidateAssetCaches } from "@/lib/cacheInvalidation";
import {
  DEFAULT_PRODUCT_THUMBNAIL_PROMPT,
  DEFAULT_THUMBNAIL_IMAGE_MODEL,
  fillPromptTemplate,
  PRODUCT_THUMBNAIL_PROMPT_KEY,
} from "@/lib/ai-prompts";
import { AI_THUMB_SIZE, buildAiThumbObjectKey } from "@/lib/preview-paths";
import { getImageModelOptions } from "@/lib/ai-models.server";
import {
  AI_PROVIDER_LABELS,
  decodeImageModelRef,
  encodeImageModelRef,
  isAiProvider,
  isImageEditProvider,
} from "@/lib/ai-models";
import { generateProductImage } from "@/lib/image-generation.server";

// Genera con IA la miniatura 590×590 de un diseño a partir de su vista previa,
// la guarda como preview/[id]-[id_archivo]-[slug]-thumb.webp y marca Files.thumbGenerated.

export const dynamic = "force-static";
export const revalidate = false;

export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  return process.env.STATIC_EXPORT === "true" ? [{ id: "0" }] : [];
}

function parseId(rawId: string): number | null {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const id = parseId((await context.params).id);
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const s3Bucket = process.env.NEXT_PUBLIC_S3;
  const s3Region = process.env.NEXT_AWS_REGION;
  const s3AccessKeyId = process.env.NEXT_AWS_ACCESS_KEY_ID;
  const s3SecretAccessKey = process.env.NEXT_AWS_SECRET_ACCESS_KEY;
  if (!s3Bucket || !s3Region || !s3AccessKeyId || !s3SecretAccessKey) {
    return NextResponse.json({ error: "Faltan variables de entorno para subir archivos a S3" }, { status: 500 });
  }

  const design = await prisma.designs.findUnique({
    where: { id },
    select: {
      name: true,
      description: true,
      seoDescription: true,
      longDescription: true,
      dimensions: true,
      material: { select: { name: true } },
      relDesignsCategories: {
        where: { status: 1, category: { status: 1 } },
        select: { category: { select: { name: true } } },
      },
      relDesignsFiles: {
        where: { status: 1, file: { status: 1, filePath: { not: null }, fileType: { name: "Vista previa" } } },
        select: { file: { select: { id: true, filePath: true } } },
      },
    },
  });

  if (!design) {
    return NextResponse.json({ error: "El diseño no existe." }, { status: 404 });
  }

  const previewFile = design.relDesignsFiles.find((relation) => relation.file?.filePath)?.file;
  if (!previewFile?.filePath) {
    return NextResponse.json(
      { error: "El diseño no tiene vista previa. Sube una en \"Vista previa\" y guarda antes de generar la miniatura." },
      { status: 400 },
    );
  }

  const storedPrompt = await prisma.aiPrompts.findUnique({ where: { key: PRODUCT_THUMBNAIL_PROMPT_KEY } });
  const prompt = fillPromptTemplate(storedPrompt?.prompt || DEFAULT_PRODUCT_THUMBNAIL_PROMPT, {
    nombre: design.name ?? "",
    descripcion: design.description || design.seoDescription || design.longDescription || "",
    material: design.material?.name ?? "",
    categorias: design.relDesignsCategories
      .map((relation) => relation.category?.name?.trim())
      .filter(Boolean)
      .join(", "),
    dimensiones: design.dimensions ?? "",
  });
  // Modelo elegido en Prompts de IA; si no hay, el primero de imagen habilitado en el catálogo.
  // 1) IA y modelo elegidos en el combo del editor (se validan contra el catálogo);
  // 2) si no llegan, el de Prompts de IA ("proveedor:modelo"); 3) el primero de imagen
  // habilitado; 4) el de Gemini por defecto.
  const requested = (await request.json().catch(() => null)) as { provider?: unknown; model?: unknown } | null;
  const requestedProvider = String(requested?.provider ?? "").trim();
  const requestedModel = String(requested?.model ?? "").trim();
  let editorModelRef: string | null = null;
  if (requestedProvider || requestedModel) {
    const catalogModel =
      isAiProvider(requestedProvider) && requestedModel
        ? await prisma.aiModels.findUnique({
            where: { provider_modelId: { provider: requestedProvider, modelId: requestedModel } },
          })
        : null;
    const usable =
      catalogModel &&
      isImageEditProvider(catalogModel.provider) &&
      catalogModel.isEnabled &&
      catalogModel.isAvailable &&
      catalogModel.inputImage &&
      catalogModel.outputImage;
    if (!usable || !isAiProvider(requestedProvider)) {
      return NextResponse.json(
        {
          error:
            "El modelo elegido no sirve para la miniatura: debe estar habilitado en Administrar › Modelos de IA, " +
            "recibir y generar imagen, y ser de Gemini, Hugging Face o Pollinations.ai.",
        },
        { status: 400 },
      );
    }
    editorModelRef = encodeImageModelRef(requestedProvider, requestedModel);
  }

  const modelRef =
    editorModelRef ||
    storedPrompt?.model?.trim() ||
    (await getImageModelOptions())[0]?.value ||
    DEFAULT_THUMBNAIL_IMAGE_MODEL;
  const { provider, modelId } = decodeImageModelRef(modelRef);
  const model = `${AI_PROVIDER_LABELS[provider]} · ${modelId}`;

  // La vista previa es pública en el CDN; se descarga por https.
  const previewUrl = `https://${s3Bucket}/${previewFile.filePath.replace(/^\/+/, "")}`;
  const previewResponse = await fetch(previewUrl);
  if (!previewResponse.ok) {
    return NextResponse.json(
      { error: `No se pudo descargar la vista previa (${previewResponse.status}): ${previewUrl}` },
      { status: 502 },
    );
  }

  let thumbBuffer: Buffer;
  try {
    // Se normaliza a PNG: todos los proveedores lo aceptan, sin depender del formato guardado.
    const sourcePng = await sharp(Buffer.from(await previewResponse.arrayBuffer()), { failOn: "none" })
      .rotate()
      .png()
      .toBuffer();
    const generated = await generateProductImage({ provider, modelId, prompt, sourcePng });
    thumbBuffer = await sharp(generated, { failOn: "none" })
      .resize({ width: AI_THUMB_SIZE, height: AI_THUMB_SIZE, fit: "cover", position: "attention" })
      .webp({ quality: 88 })
      .toBuffer();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo generar la miniatura.", prompt, model },
      { status: 502 },
    );
  }

  const objectKey = buildAiThumbObjectKey(previewFile.filePath);
  const s3Client = new S3Client({
    region: s3Region,
    credentials: { accessKeyId: s3AccessKeyId, secretAccessKey: s3SecretAccessKey },
  });
  await s3Client.send(
    new PutObjectCommand({
      Bucket: s3Bucket,
      Key: objectKey,
      Body: thumbBuffer,
      ContentType: "image/webp",
      // Se sobrescribe al regenerar: caché de un día (no "immutable") y purga del CDN abajo.
      CacheControl: "public, max-age=86400",
    }),
  );

  await prisma.files.update({ where: { id: previewFile.id }, data: { thumbGenerated: true } });

  const invalidation = await invalidateAssetCaches({
    requestUrl: request.url,
    objectKeys: [objectKey],
    fileIds: [],
    flushViteCache: false,
  });
  if (invalidation.errors.length > 0) {
    console.warn("No se completó la invalidación de caché de la miniatura", { errors: invalidation.errors });
  }

  return NextResponse.json({
    thumbUrl: `https://${s3Bucket}/${objectKey}?v=${Date.now()}`,
    objectKey,
    prompt,
    model,
  });
}
