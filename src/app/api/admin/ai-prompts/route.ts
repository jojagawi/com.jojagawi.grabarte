import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-static";
export const revalidate = false;

const MAX_PROMPT_LENGTH = 8000;

function isAdminEnabled(): boolean {
  return process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
}

// Actualiza el texto (y opcionalmente el modelo) de un prompt existente por su key.
export async function PUT(request: Request) {
  if (!isAdminEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { key?: unknown; prompt?: unknown; model?: unknown } | null;
  const key = String(body?.key ?? "").trim();
  const prompt = String(body?.prompt ?? "").trim();
  const model = String(body?.model ?? "").trim();

  if (!key) {
    return NextResponse.json({ error: "Prompt no válido." }, { status: 400 });
  }
  if (!prompt || prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json(
      { error: `El prompt es obligatorio (máximo ${MAX_PROMPT_LENGTH} caracteres).` },
      { status: 400 },
    );
  }

  const existing = await prisma.aiPrompts.findUnique({ where: { key }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "El prompt no existe. Corre pnpm run prisma:seed." }, { status: 404 });
  }

  const updated = await prisma.aiPrompts.update({
    where: { key },
    data: { prompt, model: model || null },
    select: { key: true, prompt: true, model: true, updatedAt: true },
  });

  return NextResponse.json({ ...updated, updatedAt: updated.updatedAt.toISOString() });
}
