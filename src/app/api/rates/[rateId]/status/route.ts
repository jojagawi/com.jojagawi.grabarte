import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateStaticParams(): Promise<Array<{ rateId: string }>> {
  if (process.env.STATIC_EXPORT === "true") {
    return [{ rateId: "0" }];
  }

  return [];
}

type PatchPayload = {
  status: number;
};

type RateJson = {
  id?: string;
  name?: string;
  product?: string;
  description?: string;
  rating?: number;
  createdAt?: string;
  source?: string;
  status?: number;
  updatedAt?: string;
};

function parsePayload(value: unknown): PatchPayload | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const payload = value as Record<string, unknown>;
  const status = Number(payload.status);

  if (!Number.isInteger(status) || (status !== 0 && status !== 1)) {
    return null;
  }

  return { status };
}

function isValidRateId(rateId: string) {
  return /^[a-f0-9-]{36}$/i.test(rateId);
}

async function streamToString(stream: unknown) {
  if (!stream || typeof stream !== "object") {
    return "";
  }

  const readable = stream as AsyncIterable<Uint8Array>;
  const chunks: Uint8Array[] = [];

  for await (const chunk of readable) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf-8");
}

function createS3Client() {
  const region = process.env.NEXT_AWS_REGION;
  const accessKeyId = process.env.NEXT_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing NEXT_AWS_* credentials for S3 updates.");
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ rateId: string }> },
) {
  const canEditDesigns = process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
  if (!canEditDesigns || process.env.NODE_ENV !== "development") {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const payload = parsePayload(await request.json().catch(() => null));
  if (!payload) {
    return NextResponse.json(
      { message: "Status invalido. Solo se permite 0 o 1." },
      { status: 400 },
    );
  }

  const { rateId } = await context.params;
  if (!isValidRateId(rateId)) {
    return NextResponse.json({ message: "Identificador de calificacion invalido." }, { status: 400 });
  }

  const bucket = process.env.NEXT_PUBLIC_S3;
  if (!bucket) {
    return NextResponse.json({ message: "No existe configuracion de bucket S3." }, { status: 500 });
  }

  const key = `rates/${rateId}.json`;

  let s3Client: S3Client;
  try {
    s3Client = createS3Client();
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "No fue posible configurar S3." },
      { status: 500 },
    );
  }

  let jsonContent = "";

  try {
    const getObjectResult = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    jsonContent = await streamToString(getObjectResult.Body);
  } catch {
    return NextResponse.json({ message: "No se encontro la calificacion en S3." }, { status: 404 });
  }

  let data: RateJson;
  try {
    const parsed = JSON.parse(jsonContent) as RateJson;
    data = {
      ...parsed,
      status: payload.status,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return NextResponse.json(
      { message: "El archivo de calificacion no contiene JSON valido." },
      { status: 422 },
    );
  }

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: JSON.stringify(data),
        ContentType: "application/json",
        CacheControl: "no-store",
      }),
    );
  } catch {
    return NextResponse.json(
      { message: "No fue posible guardar cambios de status en S3." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Status actualizado.",
    id: rateId,
    status: payload.status,
    key,
  });
}

