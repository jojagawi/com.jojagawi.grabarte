import { NextResponse } from "next/server";

type CreateRatePayload = {
  name: string;
  product: string;
  description: string;
  rating: number;
  recaptchaToken: string;
  action: string;
};

function getTrimmed(value: unknown) {
  return String(value ?? "").trim();
}

function parsePayload(payload: unknown): CreateRatePayload | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const body = payload as Record<string, unknown>;
  const name = getTrimmed(body.name);
  const product = getTrimmed(body.product);
  const description = getTrimmed(body.description);
  const rating = Number(body.rating);
  const recaptchaToken = getTrimmed(body.recaptchaToken);
  const action = getTrimmed(body.action);

  if (!name || !product || !description) {
    return null;
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return null;
  }

  if (!recaptchaToken || action !== "add_client_rate") {
    return null;
  }

  return {
    name,
    product,
    description,
    rating,
    recaptchaToken,
    action,
  };
}

export async function POST(request: Request) {
  const parsedRequestBody = parsePayload(await request.json().catch(() => null));

  if (!parsedRequestBody) {
    return NextResponse.json(
      { message: "Datos invalidos. Revisa nombre, producto, descripcion y calificacion." },
      { status: 400 },
    );
  }

  const lambdaUrl = process.env.RATES_LAMBDA_URL;
  if (!lambdaUrl) {
    return NextResponse.json(
      { message: "No existe configuracion para RATES_LAMBDA_URL." },
      { status: 500 },
    );
  }

  const lambdaApiKey = process.env.RATES_LAMBDA_API_KEY;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (lambdaApiKey) {
    headers["x-api-key"] = lambdaApiKey;
  }

  const lambdaResponse = await fetch(lambdaUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(parsedRequestBody),
    cache: "no-store",
  });

  const lambdaBody = (await lambdaResponse.json().catch(() => null)) as
    | Record<string, unknown>
    | null;

  if (!lambdaResponse.ok) {
    return NextResponse.json(
      {
        message:
          String(lambdaBody?.message ?? "La funcion lambda rechazo la solicitud."),
      },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      message: "Calificacion enviada y procesada correctamente.",
      data: lambdaBody,
    },
    { status: 201 },
  );
}

