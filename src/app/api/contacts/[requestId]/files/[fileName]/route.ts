import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateStaticParams(): Promise<Array<{ requestId: string; fileName: string }>> {
  if (process.env.STATIC_EXPORT === "true") {
    return [{ requestId: "0", fileName: "0" }];
  }

  return [];
}

// Los adjuntos de /contacto son privados en S3: el panel los descarga a través de esta ruta,
// que solo existe en desarrollo con el administrador activo.
function isAdminEnabled() {
  return process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
}

function createS3Client() {
  const region = process.env.NEXT_AWS_REGION;
  const accessKeyId = process.env.NEXT_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing NEXT_AWS_* credentials for S3 downloads.");
  }

  return new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ requestId: string; fileName: string }> },
) {
  if (!isAdminEnabled()) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const { requestId, fileName } = await context.params;
  // Mismo formato que genera la Lambda: <uuid>/<n>-<nombre-seguro>.
  if (!/^[a-f0-9-]{36}$/i.test(requestId) || !/^[a-zA-Z0-9._-]{1,100}$/.test(fileName) || fileName.startsWith(".")) {
    return NextResponse.json({ message: "Archivo invalido." }, { status: 400 });
  }

  const bucket = process.env.NEXT_PUBLIC_S3;
  if (!bucket) {
    return NextResponse.json({ message: "No existe configuracion de bucket S3." }, { status: 500 });
  }

  try {
    const result = await createS3Client().send(
      new GetObjectCommand({ Bucket: bucket, Key: `contact/uploads/${requestId}/${fileName}` }),
    );
    const body = result.Body?.transformToWebStream();
    if (!body) {
      return NextResponse.json({ message: "El archivo esta vacio." }, { status: 404 });
    }

    return new Response(body, {
      headers: {
        "Content-Type": result.ContentType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ message: "No se encontro el archivo en S3." }, { status: 404 });
  }
}
