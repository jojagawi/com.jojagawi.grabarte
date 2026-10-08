import { NextResponse } from "next/server";

// Proxy a la Lambda de calificaciones (cuando no hay NEXT_PUBLIC_RATES_LAMBDA_URL, el formulario
// llama aquí). Responde lo mismo que la Lambda para que el formulario no distinga entre ambos:
// la validación completa (reCAPTCHA, foto en S3, ids) vive en la Lambda.
const ALLOWED_ACTIONS = new Set(["rate_upload", "add_client_rate"]);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const action = String(body?.action ?? "").trim();

  if (!body || !ALLOWED_ACTIONS.has(action)) {
    return NextResponse.json({ message: "Accion invalida." }, { status: 400 });
  }

  const lambdaUrl = process.env.RATES_LAMBDA_URL;
  if (!lambdaUrl) {
    return NextResponse.json(
      { message: "No existe configuracion para RATES_LAMBDA_URL." },
      { status: 500 },
    );
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const lambdaApiKey = process.env.RATES_LAMBDA_API_KEY;
  if (lambdaApiKey) {
    headers["x-api-key"] = lambdaApiKey;
  }

  const lambdaResponse = await fetch(lambdaUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const lambdaBody = (await lambdaResponse.json().catch(() => null)) as Record<string, unknown> | null;

  return NextResponse.json(lambdaBody ?? { message: "La funcion lambda no respondio JSON." }, {
    status: lambdaBody ? lambdaResponse.status : 502,
  });
}
