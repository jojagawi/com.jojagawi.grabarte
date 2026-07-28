import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ fileId: string }>;
}

function parseId(rawId: string): number | null {
  const value = Number(rawId);
  if (!Number.isInteger(value) || value <= 0) {
    return null;
  }

  return value;
}

function createS3Client() {
  const bucket = process.env.NEXT_PUBLIC_S3;
  const region = process.env.NEXT_AWS_REGION;
  const accessKeyId = process.env.NEXT_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_AWS_SECRET_ACCESS_KEY;

  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    return null;
  }

  const client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return { client, bucket };
}

function inferDisposition(contentType: string): "inline" | "attachment" {
  if (contentType.startsWith("image/") || contentType.startsWith("video/") || contentType === "application/pdf") {
    return "inline";
  }

  return "attachment";
}

export async function GET(_request: Request, context: RouteContext) {
  const canEditDesigns = process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
  if (process.env.NODE_ENV !== "development" || !canEditDesigns) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { fileId: rawFileId } = await context.params;
  const fileId = parseId(rawFileId);

  if (!fileId) {
    return NextResponse.json({ error: "ID de archivo invalido" }, { status: 400 });
  }

  const file = await prisma.files.findFirst({
    where: {
      id: fileId,
      status: 1,
      filePath: { not: null },
    },
    select: {
      filePath: true,
      fileExtension: {
        select: {
          mimeType: true,
        },
      },
      relDesignsFiles: {
        where: {
          status: 1,
          design: {
            status: 1,
          },
        },
        select: {
          id: true,
        },
        take: 1,
      },
    },
  });

  if (!file?.filePath || file.relDesignsFiles.length === 0) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  const s3 = createS3Client();
  if (!s3) {
    return NextResponse.json(
      { error: "Faltan variables de entorno para consultar archivos privados" },
      { status: 500 },
    );
  }

  const output = await s3.client.send(
    new GetObjectCommand({
      Bucket: s3.bucket,
      Key: file.filePath,
    }),
  );

  if (!output.Body) {
    return NextResponse.json({ error: "No fue posible leer el archivo" }, { status: 404 });
  }

  const bytes = await output.Body.transformToByteArray();
  const contentType = file.fileExtension?.mimeType || output.ContentType || "application/octet-stream";
  const disposition = inferDisposition(contentType);
  const fileName = file.filePath.split("/").pop() || `archivo-${fileId}`;

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(bytes.byteLength),
      "Content-Disposition": `${disposition}; filename="${fileName}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}

