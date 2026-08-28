import type { NextApiRequest, NextApiResponse } from "next";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { lbrn2ToSvg, parseLbrn2 } from "lbrn2-to-svg";
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

function sanitizeFileName(value: string, fallback: string): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();

  return normalized || fallback;
}

function parseBooleanQuery(value: string | string[] | undefined): boolean {
  if (!value || Array.isArray(value)) {
    return false;
  }

  return value === "1" || value.toLowerCase() === "true";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ErrorPayload | Buffer | string>) {
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
          extension: true,
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

  const requestedFormat = String(req.query.format ?? "").toLowerCase();
  const fileExtension = String(file.fileExtension?.extension ?? "").toLowerCase();
  const shouldForceDownload = parseBooleanQuery(req.query.download);
  const requestedFileNameRaw =
    typeof req.query.filename === "string" ? req.query.filename.trim() : "";

  if (requestedFormat === "svg" && fileExtension === "lbrn2") {
    try {
      const project = parseLbrn2(buffer.toString("utf-8"));
      const svg = lbrn2ToSvg(project);
      const svgFallbackName = file.filePath.replace(/\.lbrn2$/i, ".svg").split("/").pop() || `archivo-${fileId}.svg`;
      const svgFileName = sanitizeFileName(requestedFileNameRaw || svgFallbackName, svgFallbackName);
      const svgDisposition = shouldForceDownload ? "attachment" : "inline";

      res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `${svgDisposition}; filename=\"${svgFileName}\"; filename*=UTF-8''${encodeURIComponent(svgFileName)}`,
      );
      res.setHeader("Cache-Control", "private, max-age=0, must-revalidate");

      return res.status(200).send(svg);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "No se pudo convertir el archivo LBRN2 a SVG" });
    }
  }

  const contentType = file.fileExtension?.mimeType || response.ContentType || "application/octet-stream";
  const fallbackFileName = file.filePath.split("/").pop() || `archivo-${fileId}`;
  const fileName = sanitizeFileName(requestedFileNameRaw || fallbackFileName, fallbackFileName);
  const disposition = shouldForceDownload ? "attachment" : inferDisposition(contentType);

  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Length", String(buffer.byteLength));
  res.setHeader(
    "Content-Disposition",
    `${disposition}; filename=\"${fileName}\"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
  );
  res.setHeader("Cache-Control", "private, max-age=0, must-revalidate");

  res.status(200).send(buffer);
}
