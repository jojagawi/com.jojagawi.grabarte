import { NextResponse } from "next/server";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { invalidateAssetCaches } from "@/lib/cacheInvalidation";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  if (process.env.STATIC_EXPORT === "true") {
    return [{ id: "0" }];
  }

  return [];
}

function parseOptionalInt(value: FormDataEntryValue | null) {
  const numeric = Number(String(value ?? "").trim());
  return Number.isFinite(numeric) ? numeric : null;
}

function parseOptionalNumber(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : null;
}

function extensionFromFileName(fileName: string) {
  const parts = fileName.split(".");
  if (parts.length < 2) return "";
  return parts.pop()?.toLowerCase() ?? "";
}

async function convertImageToWebp(input: Buffer) {
  try {
    return await sharp(input).rotate().webp({ quality: 90 }).toBuffer();
  } catch (error) {
    // Fallback para archivos con metadatos o interpretación de color no estándar.
    try {
      const normalized = await sharp(input, { failOn: "none" })
        .rotate()
        .toColourspace("srgb")
        .png()
        .toBuffer();

      return await sharp(normalized).webp({ quality: 90 }).toBuffer();
    } catch {
      throw error;
    }
  }
}

function parseId(rawId: string): number | null {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function buildS3Client() {
  const bucket = process.env.NEXT_PUBLIC_S3;
  const region = process.env.NEXT_AWS_REGION;
  const accessKeyId = process.env.NEXT_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_AWS_SECRET_ACCESS_KEY;

  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return {
    bucket,
    client: new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    }),
  };
}

async function ensureExtensionId(extension: string, mimeType?: string) {
  const normalizedExtension = extension.toLowerCase();

  const existing = await prisma.catFileExtension.findFirst({
    where: { extension: normalizedExtension },
    select: { id: true, mimeType: true },
  });

  if (existing) {
    if (!existing.mimeType && mimeType) {
      await prisma.catFileExtension.update({
        where: { id: existing.id },
        data: { mimeType },
      });
    }
    return existing.id;
  }

  const created = await prisma.catFileExtension.create({
    data: {
      name: normalizedExtension.toUpperCase(),
      extension: normalizedExtension,
      mimeType: mimeType || null,
      status: 1,
    },
    select: { id: true },
  });

  return created.id;
}

async function getFileTypeId(name: string) {
  const type = await prisma.catFileType.findFirst({
    where: { name, status: 1 },
    select: { id: true },
  });

  return type?.id ?? null;
}

async function removeFilesFromDesign(designId: number, fileIds: number[]) {
  if (fileIds.length === 0) {
    return { removedFileIds: [] as number[], removedObjectKeys: [] as string[] };
  }

  const uniqueFileIds = Array.from(new Set(fileIds));

  const files = await prisma.files.findMany({
    where: {
      id: { in: uniqueFileIds },
      relDesignsFiles: {
        some: {
          designId,
          status: 1,
        },
      },
    },
    select: {
      id: true,
      filePath: true,
    },
  });

  if (files.length === 0) {
    return { removedFileIds: [] as number[], removedObjectKeys: [] as string[] };
  }

  const s3Context = buildS3Client();
  if (!s3Context) {
    const hasRemoteFiles = files.some((file) => Boolean(file.filePath));
    if (hasRemoteFiles) {
      throw new Error("No se pudieron eliminar archivos del S3 por falta de configuracion");
    }
  } else {
    for (const file of files) {
      if (!file.filePath) {
        continue;
      }

      await s3Context.client.send(
        new DeleteObjectCommand({
          Bucket: s3Context.bucket,
          Key: file.filePath,
        }),
      );
    }
  }

  const fileIdsToRemove = files.map((file) => file.id);
  const removedObjectKeys = files
    .map((file) => file.filePath)
    .filter((filePath): filePath is string => Boolean(filePath));

  await prisma.$transaction(async (tx) => {
    await tx.relDesignsFiles.deleteMany({
      where: {
        designId,
        typeId: { in: fileIdsToRemove },
      },
    });

    await tx.files.deleteMany({
      where: {
        id: { in: fileIdsToRemove },
      },
    });
  });

  return {
    removedFileIds: fileIdsToRemove,
    removedObjectKeys,
  };
}

async function createAndAttachFileRecord(input: {
  designId: number;
  fileTypeId: number;
  fileExtensionId: number;
  objectKey: string;
  body: Buffer;
  contentType: string;
}) {
  const s3Context = buildS3Client();
  if (!s3Context) {
    throw new Error("Faltan variables de entorno para subir archivos a S3");
  }

  await s3Context.client.send(
    new PutObjectCommand({
      Bucket: s3Context.bucket,
      Key: input.objectKey,
      Body: input.body,
      ContentType: input.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  const fileRecord = await prisma.files.create({
    data: {
      fileTypeId: input.fileTypeId,
      fileExtensionId: input.fileExtensionId,
      filePath: input.objectKey,
      status: 1,
    },
    select: { id: true },
  });

  await prisma.relDesignsFiles.create({
    data: {
      designId: input.designId,
      typeId: fileRecord.id,
      status: 1,
    },
  });

  return fileRecord.id;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { id: rawId } = await context.params;
  const id = parseId(rawId);

  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const design = await prisma.designs.findFirst({
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
      mayoreo: true,
      minimumPrice: true,
      relDesignsCategories: {
        where: { status: 1, categoryId: { not: null } },
        select: { categoryId: true },
      },
      relDesignsFiles: {
        where: { status: 1 },
        select: {
          file: {
            select: {
              id: true,
              filePath: true,
              status: true,
              fileType: { select: { name: true } },
              fileExtension: { select: { mimeType: true } },
            },
          },
        },
      },
    },
  });

  if (!design) {
    return NextResponse.json({ error: "Diseño no encontrado" }, { status: 404 });
  }

  return NextResponse.json({
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
  });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { id: rawId } = await context.params;
  const id = parseId(rawId);

  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  const categoryIds = formData
    .getAll("categories")
    .map((value) => Number(String(value)))
    .filter((value) => Number.isInteger(value) && value > 0);

  if (categoryIds.length === 0) {
    return NextResponse.json(
      { error: "Debes seleccionar al menos una categoría" },
      { status: 400 },
    );
  }

  const designExists = await prisma.designs.findFirst({
    where: { id },
    select: { id: true },
  });

  if (!designExists) {
    return NextResponse.json({ error: "Diseño no encontrado" }, { status: 404 });
  }

  const description = String(formData.get("description") ?? "").trim() || null;
  const author = String(formData.get("author") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const materialId = parseOptionalInt(formData.get("materialType"));
  const numberMdfTablesRaw = parseOptionalInt(formData.get("mdfBoards"));
  const timeMachineRaw = parseOptionalInt(formData.get("workTimeMinutes"));
  const suggestedPriceRaw = parseOptionalNumber(formData.get("suggestedPrice"));
  const mayoreoRaw = parseOptionalNumber(formData.get("mayoreo"));
  const minimumPriceRaw = parseOptionalNumber(formData.get("minimumPrice"));

  const numberMdfTables = Math.max(0, Math.min(99, numberMdfTablesRaw ?? 0));
  const timeMachine = Math.max(0, timeMachineRaw ?? 0);
  const suggestedPrice = suggestedPriceRaw === null ? null : Math.max(0, suggestedPriceRaw);
  const mayoreo = mayoreoRaw === null ? null : Math.max(0, mayoreoRaw);
  const minimumPrice = minimumPriceRaw === null ? null : Math.max(0, minimumPriceRaw);

  if (
    suggestedPrice !== null &&
    minimumPrice !== null &&
    minimumPrice > suggestedPrice
  ) {
    return NextResponse.json(
      { error: "El precio minimo no puede ser mayor al precio sugerido" },
      { status: 400 },
    );
  }

  const deletedFileIds = formData
    .getAll("deletedFileIds")
    .map((value) => Number(String(value)))
    .filter((value) => Number.isInteger(value) && value > 0);

  const affectedObjectKeys: string[] = [];
  const affectedFileIds: number[] = [];

  await prisma.$transaction(async (tx) => {
    await tx.designs.update({
      where: { id },
      data: {
        name,
        description,
        author,
        notes,
        materialId: materialId && materialId > 0 ? materialId : null,
        status: formData.has("status") ? 1 : 0,
        isTested: formData.has("isTested") ? 1 : 0,
        isCustomizable: formData.has("isCustomizable") ? 1 : 0,
        showInHome: formData.has("showInHome") ? 1 : 0,
        showInSite: formData.has("showInSite") ? 1 : 0,
        numberMdfTables,
        timeMachine,
        suggestedPrice,
        mayoreo,
        minimumPrice,
      },
    });

    await tx.relDesignsCategories.deleteMany({ where: { designId: id } });

    await tx.relDesignsCategories.createMany({
      data: Array.from(new Set(categoryIds)).map((categoryId) => ({
        designId: id,
        categoryId,
        status: 1,
      })),
    });
  });

  const removedByUserRequest = await removeFilesFromDesign(id, deletedFileIds);
  affectedObjectKeys.push(...removedByUserRequest.removedObjectKeys);
  affectedFileIds.push(...removedByUserRequest.removedFileIds);

  const previewTypeId = await getFileTypeId("Vista previa");
  const designImagesTypeId = await getFileTypeId("Imagenes del diseño");
  const instructionTypeId = await getFileTypeId("Instrucciones");
  const sourceTypeId = await getFileTypeId("Archivos fuente");

  const previewFile = formData.get("previewFile");
  const designImages = formData.getAll("designImages");
  const instructionFile = formData.get("instructionFile");
  const sourceFiles = formData.getAll("sourceFiles");

  if (previewFile instanceof File && previewFile.size > 0) {
    if (!previewFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "El archivo de vista previa debe ser una imagen" },
        { status: 400 },
      );
    }

    if (!previewTypeId) {
      return NextResponse.json(
        { error: "No se encontró el tipo de archivo 'Vista previa'" },
        { status: 500 },
      );
    }

    const oldPreviewRelations = await prisma.relDesignsFiles.findMany({
      where: {
        designId: id,
        status: 1,
        file: {
          status: 1,
          fileType: {
            name: "Vista previa",
          },
        },
      },
      select: { typeId: true },
    });

    const removedPreviousPreview = await removeFilesFromDesign(
      id,
      oldPreviewRelations
        .map((relation) => relation.typeId)
        .filter((fileId): fileId is number => Number.isInteger(fileId)),
    );
    affectedObjectKeys.push(...removedPreviousPreview.removedObjectKeys);
    affectedFileIds.push(...removedPreviousPreview.removedFileIds);

    const previewBuffer = Buffer.from(await previewFile.arrayBuffer());
    const webpBuffer = await convertImageToWebp(previewBuffer);
    const webpExtensionId = await ensureExtensionId("webp", "image/webp");

    const previewFileId = await createAndAttachFileRecord({
      designId: id,
      fileTypeId: previewTypeId,
      fileExtensionId: webpExtensionId,
      objectKey: `preview/${id}.webp`,
      body: webpBuffer,
      contentType: "image/webp",
    });
    affectedObjectKeys.push(`preview/${id}.webp`);
    affectedFileIds.push(previewFileId);
  }

  const uploadedDesignImages = designImages.filter(
    (value): value is File => value instanceof File && value.size > 0,
  );

  if (uploadedDesignImages.length > 0) {
    if (!designImagesTypeId) {
      return NextResponse.json(
        { error: "No se encontró el tipo de archivo 'Imagenes del diseño'" },
        { status: 500 },
      );
    }

    for (const uploadedFile of uploadedDesignImages) {
      const isImage = uploadedFile.type.startsWith("image/");
      const isVideo = uploadedFile.type.startsWith("video/");

      if (!isImage && !isVideo) {
        return NextResponse.json(
          { error: `Tipo de archivo no soportado en imágenes del diseño: ${uploadedFile.name}` },
          { status: 400 },
        );
      }

      let finalBuffer: Buffer;
      let finalExtension: string;
      let finalMimeType: string;
      let fileExtensionId: number;

      if (isImage) {
        const originalBuffer = Buffer.from(await uploadedFile.arrayBuffer());
        finalBuffer = await convertImageToWebp(originalBuffer);
        finalExtension = "webp";
        finalMimeType = "image/webp";
        fileExtensionId = await ensureExtensionId("webp", "image/webp");
      } else {
        finalBuffer = Buffer.from(await uploadedFile.arrayBuffer());
        finalExtension = extensionFromFileName(uploadedFile.name);
        finalMimeType = uploadedFile.type || "video/mp4";

        if (!finalExtension) {
          return NextResponse.json(
            { error: `No fue posible identificar la extensión del video: ${uploadedFile.name}` },
            { status: 400 },
          );
        }

        fileExtensionId = await ensureExtensionId(finalExtension, finalMimeType);
      }

      const objectKey = `preview/${id}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${finalExtension}`;

      const fileId = await createAndAttachFileRecord({
        designId: id,
        fileTypeId: designImagesTypeId,
        fileExtensionId,
        objectKey,
        body: finalBuffer,
        contentType: finalMimeType,
      });
      affectedObjectKeys.push(objectKey);
      affectedFileIds.push(fileId);
    }
  }

  if (instructionFile instanceof File && instructionFile.size > 0) {
    if (!instructionTypeId) {
      return NextResponse.json(
        { error: "No se encontró el tipo de archivo 'Instrucciones'" },
        { status: 500 },
      );
    }

    const extension = extensionFromFileName(instructionFile.name) || "bin";
    const mimeType = instructionFile.type || "application/octet-stream";
    const fileExtensionId = await ensureExtensionId(extension, mimeType);
    const fileBuffer = Buffer.from(await instructionFile.arrayBuffer());

    const objectKey = `files/${id}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;

    const fileId = await createAndAttachFileRecord({
      designId: id,
      fileTypeId: instructionTypeId,
      fileExtensionId,
      objectKey,
      body: fileBuffer,
      contentType: mimeType,
    });
    affectedObjectKeys.push(objectKey);
    affectedFileIds.push(fileId);
  }

  const uploadedSourceFiles = sourceFiles.filter(
    (value): value is File => value instanceof File && value.size > 0,
  );

  if (uploadedSourceFiles.length > 0) {
    if (!sourceTypeId) {
      return NextResponse.json(
        { error: "No se encontró el tipo de archivo 'Archivos fuente'" },
        { status: 500 },
      );
    }

    for (const sourceFile of uploadedSourceFiles) {
      const extension = extensionFromFileName(sourceFile.name) || "bin";
      const mimeType = sourceFile.type || "application/octet-stream";
      const fileExtensionId = await ensureExtensionId(extension, mimeType);
      const fileBuffer = Buffer.from(await sourceFile.arrayBuffer());

      const objectKey = `files/${id}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;

      const fileId = await createAndAttachFileRecord({
        designId: id,
        fileTypeId: sourceTypeId,
        fileExtensionId,
        objectKey,
        body: fileBuffer,
        contentType: mimeType,
      });
      affectedObjectKeys.push(objectKey);
      affectedFileIds.push(fileId);
    }
  }

  const cacheInvalidationResult = await invalidateAssetCaches({
    requestUrl: request.url,
    objectKeys: affectedObjectKeys,
    fileIds: affectedFileIds,
    flushViteCache: true,
  });

  if (cacheInvalidationResult.errors.length > 0) {
    console.warn("No se completo toda la invalidacion de cache", {
      errors: cacheInvalidationResult.errors,
    });
  }

  return NextResponse.json({
    id,
    updated: true,
  });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { id: rawId } = await context.params;
  const id = parseId(rawId);

  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const design = await prisma.designs.findFirst({
    where: { id },
    select: { id: true },
  });

  if (!design) {
    return NextResponse.json({ error: "Diseño no encontrado" }, { status: 404 });
  }

  const fileIds = await prisma.relDesignsFiles.findMany({
    where: {
      designId: id,
      status: 1,
      typeId: { not: null },
    },
    select: { typeId: true },
  });

  await removeFilesFromDesign(
    id,
    fileIds
      .map((relation) => relation.typeId)
      .filter((fileId): fileId is number => Number.isInteger(fileId)),
  );

  await prisma.$transaction(async (tx) => {
    await tx.relDesignsCategories.deleteMany({ where: { designId: id } });
    await tx.relDesignsTypes.deleteMany({ where: { designId: id } });
    await tx.designs.delete({ where: { id } });
  });

  return NextResponse.json({
    id,
    deleted: true,
  });
}
