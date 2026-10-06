import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { AiPromptsAdmin } from "@/components/custom/AiPromptsAdmin";
import { DEFAULT_PRODUCT_THUMBNAIL_PROMPT, PRODUCT_THUMBNAIL_PROMPT_KEY } from "@/lib/ai-prompts";
import { getImageModelOptions } from "@/lib/ai-models.server";
import { decodeImageModelRef, encodeImageModelRef } from "@/lib/ai-models";

export const metadata: Metadata = buildPageMetadata({
  title: "Prompts de IA | InspiraArte",
  description: "Panel interno para editar los prompts que usa la IA.",
  path: "/catalogos/prompts-ia",
  noIndex: true,
});

export default async function AiPromptsPage() {
  const canEditDesigns = process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
  if (!canEditDesigns || process.env.NODE_ENV !== "development") {
    notFound();
  }

  const [prompts, imageModels] = await Promise.all([
    prisma.aiPrompts.findMany({ orderBy: { name: "asc" } }),
    getImageModelOptions(),
  ]);

  return (
    <AiPromptsAdmin
      imageModels={imageModels}
      prompts={prompts.map((prompt) => ({
        key: prompt.key,
        name: prompt.name,
        description: prompt.description,
        prompt: prompt.prompt,
        // Formato "proveedor:modelo" (los valores anteriores sin proveedor son de Gemini).
        model: prompt.model
          ? encodeImageModelRef(decodeImageModelRef(prompt.model).provider, decodeImageModelRef(prompt.model).modelId)
          : null,
        updatedAt: prompt.updatedAt.toISOString(),
        // Para "Restaurar original": solo el de miniaturas tiene texto por defecto en código.
        defaultPrompt: prompt.key === PRODUCT_THUMBNAIL_PROMPT_KEY ? DEFAULT_PRODUCT_THUMBNAIL_PROMPT : null,
      }))}
    />
  );
}
