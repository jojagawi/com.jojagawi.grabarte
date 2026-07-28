import type { NextApiRequest, NextApiResponse } from "next";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";

type ErrorPayload = {
  error: string;
};

function parseFileId(value: string | string[] | undefined): number | null {
  if (!value || Array.isArray(value)) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function inferDisposition(contentType: string): "inline" | "attachment" {
  if (contentType.startsWith("image/") || contentType.startsWith("video/") || contentType === "application/pdf") {
    return "inline";
  }

  return "attachment";
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ErrorPayload | Buffer>) {
  const canEditDesigns = process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
  if (process.env.NODE_ENV !== "development" || !canEditDesigns) {
    return res.status(404).json({ error: "Not found" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const fileId = parseFileId(req.query.fileId);
  if (!fileId) {
    return res.status(400).json({ error: "ID de archivo invalido" });
  }

  const file = await prisma.files.findFirst({
    where: {
      id: fileId,
      status: 1,
      filePath: { not: null },
      relDesignsFiles: {
        some: {
          status: 1,
          design: {
            status: 1,
          },
        },
      },
    },
    select: {
      filePath: true,
      fileExtension: {
        select: {
          mimeType: true,
        },
      },
    },
  });

  if (!file?.filePath) {
    return res.status(404).json({ error: "Archivo no encontrado" });
  }

  const bucket = process.env.NEXT_PUBLIC_S3;
  const region = process.env.NEXT_AWS_REGION;
  const accessKeyId = process.env.NEXT_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_AWS_SECRET_ACCESS_KEY;

  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    return res
      .status(500)
      .json({ error: "Faltan variables de entorno para consultar archivos privados" });
  }

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: file.filePath,
    }),
  );

  if (!response.Body) {
    return res.status(404).json({ error: "No fue posible leer el archivo" });
  }

  const body = response.Body as unknown as NodeJS.ReadableStream;
  const buffer = await streamToBuffer(body);
  const contentType = file.fileExtension?.mimeType || response.ContentType || "application/octet-stream";
  const fileName = file.filePath.split("/").pop() || `archivo-${fileId}`;

  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Length", String(buffer.byteLength));
  res.setHeader("Content-Disposition", `${inferDisposition(contentType)}; filename=\"${fileName}\"`);
  res.setHeader("Cache-Control", "private, max-age=0, must-revalidate");

  res.status(200).send(buffer);
}

