import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncOfficialModels, toAdminAiModel } from "@/lib/ai-models.server";

export const dynamic = "force-static";
export const revalidate = false;

// "Actualizar modelos oficiales": sincroniza con Gemini y OpenRouter y devuelve el catálogo.
export async function POST() {
  if (process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS !== "true") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const results = await syncOfficialModels();
  const models = await prisma.aiModels.findMany({ orderBy: [{ provider: "asc" }, { displayName: "asc" }] });

  return NextResponse.json({ results, models: models.map(toAdminAiModel) });
}
