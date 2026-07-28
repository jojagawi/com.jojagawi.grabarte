import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";

export const dynamic = "force-static";
export const revalidate = false;

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

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await request.formData();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return NextResponse.json(
      { error: "El nombre es obligatorio" },
      { status: 400 },
    );
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

  const description = String(formData.get("description") ?? "").trim() || null;
  const author = String(formData.get("author") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const materialId = parseOptionalInt(formData.get("materialType"));
  const materialConnect =
    materialId && materialId > 0 ? { connect: { id: materialId } } : undefined;
  const numberMdfTablesRaw = parseOptionalInt(formData.get("mdfBoards"));
  const timeMachineRaw = parseOptionalInt(formData.get("workTimeMinutes"));
  const suggestedPriceRaw = parseOptionalNumber(formData.get("suggestedPrice"));
  const minimumPriceRaw = parseOptionalNumber(formData.get("minimumPrice"));

  const numberMdfTables = Math.max(0, Math.min(99, numberMdfTablesRaw ?? 0));
  const timeMachine = Math.max(0, timeMachineRaw ?? 0);
  const suggestedPrice = suggestedPriceRaw === null ? null : Math.max(0, suggestedPriceRaw);
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

  // Files are received in the payload; persistence in Files table is pending.
  const previewFile = formData.get("previewFile");
  const designImages = formData.getAll("designImages");
  const instructionFile = formData.get("instructionFile");
  const sourceFiles = formData.getAll("sourceFiles");

  const fileCounts = {
    previewFile:
      previewFile instanceof File && previewFile.size > 0 ? 1 : 0,
    designImages: designImages.filter((value) => value instanceof File && value.size > 0)
      .length,
    instructionFile:
      instructionFile instanceof File && instructionFile.size > 0 ? 1 : 0,
    sourceFiles: sourceFiles.filter((value) => value instanceof File && value.size > 0)
      .length,
  };

  const s3Bucket = process.env.NEXT_PUBLIC_S3;
  const s3Region = process.env.NEXT_AWS_REGION;
  const s3AccessKeyId = process.env.NEXT_AWS_ACCESS_KEY_ID;
  const s3SecretAccessKey = process.env.NEXT_AWS_SECRET_ACCESS_KEY;

  const ensureExtensionId = async (extension: string, mimeType?: string) => {
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
  };


  const design = await prisma.$transaction(async (tx) => {
    const created = await tx.designs.create({
      data: {
        name,
        description,
        author,
        notes,
        material: materialConnect,
        status: formData.has("status") ? 1 : 0,
        isTested: formData.has("isTested") ? 1 : 0,
        isCustomizable: formData.has("isCustomizable") ? 1 : 0,
        showInHome: formData.has("showInHome") ? 1 : 0,
        showInSite: formData.has("showInSite") ? 1 : 0,
        numberMdfTables,
        timeMachine,
        suggestedPrice,
        minimumPrice,
      },
      select: { id: true, name: true },
    });

    await tx.relDesignsCategories.createMany({
      data: Array.from(new Set(categoryIds)).map((categoryId) => ({
        designId: created.id,
        categoryId,
        status: 1,
      })),
    });

    return created;
  });

  if (previewFile instanceof File && previewFile.size > 0) {
    if (!previewFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "El archivo de vista previa debe ser una imagen" },
        { status: 400 },
      );
    }

    if (!s3Bucket || !s3Region || !s3AccessKeyId || !s3SecretAccessKey) {
      return NextResponse.json(
        { error: "Faltan variables de entorno para subir archivos a S3" },
        { status: 500 },
      );
    }

    const previewBuffer = Buffer.from(await previewFile.arrayBuffer());
    const webpBuffer = await sharp(previewBuffer).webp({ quality: 90 }).toBuffer();

    const webpExtension = await prisma.catFileExtension.findFirst({
      where: { extension: "webp", status: 1 },
      select: { id: true },
    });

    const previewType = await prisma.catFileType.findFirst({
      where: { name: "Vista previa", status: 1 },
      select: { id: true },
    });

    if (!webpExtension || !previewType) {
      return NextResponse.json(
        { error: "No se encontró la configuración de extensión o tipo de archivo" },
        { status: 500 },
      );
    }

    const s3Client = new S3Client({
      region: s3Region,
      credentials: {
        accessKeyId: s3AccessKeyId,
        secretAccessKey: s3SecretAccessKey,
      },
    });

    const objectKey = `preview/${design.id}.webp`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: s3Bucket,
        Key: objectKey,
        Body: webpBuffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    const fileRecord = await prisma.files.create({
      data: {
        fileTypeId: previewType.id,
        fileExtensionId: webpExtension.id,
        filePath: objectKey,
        status: 1,
      },
      select: { id: true },
    });

    await prisma.relDesignsFiles.create({
      data: {
        designId: design.id,
        typeId: fileRecord.id,
        status: 1,
      },
    });
  }

  const uploadedDesignImages = designImages.filter(
    (value): value is File => value instanceof File && value.size > 0,
  );

  if (uploadedDesignImages.length > 0) {
    if (!s3Bucket || !s3Region || !s3AccessKeyId || !s3SecretAccessKey) {
      return NextResponse.json(
        { error: "Faltan variables de entorno para subir archivos a S3" },
        { status: 500 },
      );
    }

    const webpExtension = await prisma.catFileExtension.findFirst({
      where: { extension: "webp", status: 1 },
      select: { id: true },
    });

    const designImagesType = await prisma.catFileType.findFirst({
      where: { name: "Imagenes del diseño", status: 1 },
      select: { id: true },
    });

    if (!webpExtension || !designImagesType) {
      return NextResponse.json(
        { error: "No se encontró la configuración de extensiones o tipo de archivo" },
        { status: 500 },
      );
    }

    const s3Client = new S3Client({
      region: s3Region,
      credentials: {
        accessKeyId: s3AccessKeyId,
        secretAccessKey: s3SecretAccessKey,
      },
    });

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
        finalBuffer = await sharp(originalBuffer).webp({ quality: 90 }).toBuffer();
        finalExtension = "webp";
        finalMimeType = "image/webp";
        fileExtensionId = webpExtension.id;
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

        const sourceVideoExtension = await prisma.catFileExtension.findFirst({
          where: {
            extension: finalExtension,
            status: 1,
          },
          select: { id: true },
        });

        if (!sourceVideoExtension) {
          return NextResponse.json(
            { error: `No existe configuración para la extensión .${finalExtension}` },
            { status: 400 },
          );
        }

        fileExtensionId = sourceVideoExtension.id;
      }

      const fileRecord = await prisma.files.create({
        data: {
          fileTypeId: designImagesType.id,
          fileExtensionId,
          status: 1,
          filePath: "",
        },
        select: { id: true },
      });

      const objectKey = `preview/${design.id}/${fileRecord.id}.${finalExtension}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: s3Bucket,
          Key: objectKey,
          Body: finalBuffer,
          ContentType: finalMimeType,
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );

      await prisma.files.update({
        where: { id: fileRecord.id },
        data: { filePath: objectKey },
      });

      await prisma.relDesignsFiles.create({
        data: {
          designId: design.id,
          typeId: fileRecord.id,
          status: 1,
        },
      });
    }
  }

  const uploadedInstruction =
    instructionFile instanceof File && instructionFile.size > 0
      ? instructionFile
      : null;

  if (uploadedInstruction) {
    if (!s3Bucket || !s3Region || !s3AccessKeyId || !s3SecretAccessKey) {
      return NextResponse.json(
        { error: "Faltan variables de entorno para subir archivos a S3" },
        { status: 500 },
      );
    }

    const instructionType = await prisma.catFileType.findFirst({
      where: { name: "Instrucciones", status: 1 },
      select: { id: true },
    });

    if (!instructionType) {
      return NextResponse.json(
        { error: "No se encontró el tipo de archivo 'Instrucciones'" },
        { status: 500 },
      );
    }

    const s3Client = new S3Client({
      region: s3Region,
      credentials: {
        accessKeyId: s3AccessKeyId,
        secretAccessKey: s3SecretAccessKey,
      },
    });

    const extension = extensionFromFileName(uploadedInstruction.name) || "bin";
    const mimeType = uploadedInstruction.type || "application/octet-stream";
    const fileExtensionId = await ensureExtensionId(extension, mimeType);
    const fileBuffer = Buffer.from(await uploadedInstruction.arrayBuffer());

    const fileRecord = await prisma.files.create({
      data: {
        fileTypeId: instructionType.id,
        fileExtensionId,
        filePath: "",
        status: 1,
      },
      select: { id: true },
    });

    const objectKey = `files/${design.id}/${fileRecord.id}.${extension}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: s3Bucket,
        Key: objectKey,
        Body: fileBuffer,
        ContentType: mimeType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    await prisma.files.update({
      where: { id: fileRecord.id },
      data: { filePath: objectKey },
    });

    await prisma.relDesignsFiles.create({
      data: {
        designId: design.id,
        typeId: fileRecord.id,
        status: 1,
      },
    });
  }

  const uploadedSourceFiles = sourceFiles.filter(
    (value): value is File => value instanceof File && value.size > 0,
  );

  if (uploadedSourceFiles.length > 0) {
    if (!s3Bucket || !s3Region || !s3AccessKeyId || !s3SecretAccessKey) {
      return NextResponse.json(
        { error: "Faltan variables de entorno para subir archivos a S3" },
        { status: 500 },
      );
    }

    const sourceType = await prisma.catFileType.findFirst({
      where: { name: "Archivos fuente", status: 1 },
      select: { id: true },
    });

    if (!sourceType) {
      return NextResponse.json(
        { error: "No se encontró el tipo de archivo 'Archivos fuente'" },
        { status: 500 },
      );
    }

    const s3Client = new S3Client({
      region: s3Region,
      credentials: {
        accessKeyId: s3AccessKeyId,
        secretAccessKey: s3SecretAccessKey,
      },
    });

    for (const sourceFile of uploadedSourceFiles) {
      const extension = extensionFromFileName(sourceFile.name) || "bin";
      const mimeType = sourceFile.type || "application/octet-stream";
      const fileExtensionId = await ensureExtensionId(extension, mimeType);
      const fileBuffer = Buffer.from(await sourceFile.arrayBuffer());

      const fileRecord = await prisma.files.create({
        data: {
          fileTypeId: sourceType.id,
          fileExtensionId,
          filePath: "",
          status: 1,
        },
        select: { id: true },
      });

      const objectKey = `files/${design.id}/${fileRecord.id}.${extension}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: s3Bucket,
          Key: objectKey,
          Body: fileBuffer,
          ContentType: mimeType,
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );

      await prisma.files.update({
        where: { id: fileRecord.id },
        data: { filePath: objectKey },
      });

      await prisma.relDesignsFiles.create({
        data: {
          designId: design.id,
          typeId: fileRecord.id,
          status: 1,
        },
      });
    }
  }

  return NextResponse.json({
    id: design.id,
    name: design.name,
    categoriesLinked: Array.from(new Set(categoryIds)).length,
    files: fileCounts,
  });
}

