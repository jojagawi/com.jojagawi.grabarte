import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAiPricing, isAiProvider, isSeoAiProvider } from "@/lib/ai-models";
import { toAdminAiModel } from "@/lib/ai-models.server";

export const dynamic = "force-static";
export const revalidate = false;

function isAdminEnabled(): boolean {
  return process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
}

function notAvailable() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

// Edita un modelo: habilitado, predeterminado (uno por proveedor) o precio (queda como manual).
export async function PUT(request: Request) {
  if (!isAdminEnabled()) {
    return notAvailable();
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const id = Number(body?.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Modelo no válido." }, { status: 400 });
  }

  const model = await prisma.aiModels.findUnique({ where: { id } });
  if (!model) {
    return NextResponse.json({ error: "El modelo ya no existe." }, { status: 404 });
  }

  const data: { isEnabled?: boolean; isDefault?: boolean; pricing?: string; pricingManual?: boolean } = {};
  if (typeof body?.isEnabled === "boolean") {
    data.isEnabled = body.isEnabled;
    // Un modelo deshabilitado no puede ser el predeterminado.
    if (!body.isEnabled) {
      data.isDefault = false;
    }
  }
  if (typeof body?.pricing === "string") {
    if (!isAiPricing(body.pricing)) {
      return NextResponse.json({ error: "Precio no válido." }, { status: 400 });
    }
    data.pricing = body.pricing;
    data.pricingManual = true;
  }

  if (body?.isDefault === true) {
    if (!isSeoAiProvider(model.provider) || !model.inputImage || !model.outputText) {
      return NextResponse.json(
        { error: "Solo un modelo de Gemini, OpenAI, OpenRouter o GitHub Models que analiza imágenes y responde texto puede ser el predeterminado del asistente SEO." },
        { status: 400 },
      );
    }
    data.isDefault = true;
    data.isEnabled = true;
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (data.isDefault) {
      await tx.aiModels.updateMany({
        where: { provider: model.provider, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }
    return tx.aiModels.update({ where: { id }, data });
  });

  return NextResponse.json(toAdminAiModel(updated));
}

// Agrega un modelo a mano (por ejemplo uno que la lista oficial aún no publica).
export async function POST(request: Request) {
  if (!isAdminEnabled()) {
    return notAvailable();
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const provider = String(body?.provider ?? "");
  const modelId = String(body?.modelId ?? "").trim();
  const displayName = String(body?.displayName ?? "").trim() || modelId;
  const pricing = String(body?.pricing ?? "unknown");

  if (!isAiProvider(provider)) {
    return NextResponse.json({ error: "Proveedor no válido." }, { status: 400 });
  }
  if (!modelId || modelId.length > 200 || /\s/.test(modelId)) {
    return NextResponse.json({ error: "El identificador del modelo es obligatorio y no lleva espacios." }, { status: 400 });
  }
  if (!isAiPricing(pricing)) {
    return NextResponse.json({ error: "Precio no válido." }, { status: 400 });
  }

  const existing = await prisma.aiModels.findUnique({ where: { provider_modelId: { provider, modelId } } });
  if (existing) {
    return NextResponse.json({ error: "Ese modelo ya está en el catálogo." }, { status: 409 });
  }

  const created = await prisma.aiModels.create({
    data: {
      provider,
      modelId,
      displayName: displayName.slice(0, 120),
      inputText: body?.inputText !== false,
      inputImage: body?.inputImage === true,
      outputText: body?.outputText !== false,
      outputImage: body?.outputImage === true,
      pricing,
      pricingManual: true,
      isEnabled: true,
      source: "manual",
    },
  });

  return NextResponse.json(toAdminAiModel(created), { status: 201 });
}
