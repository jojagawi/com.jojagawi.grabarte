import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { toAdminAiModel } from "@/lib/ai-models.server";
import { CatalogAiModelsAdmin } from "@/components/custom/CatalogAiModelsAdmin";

export const metadata: Metadata = buildPageMetadata({
  title: "Modelos de IA | InspiraArte",
  description: "Panel interno para administrar el catálogo de modelos de IA.",
  path: "/catalogos/modelos-ia",
  noIndex: true,
});

export default async function AiModelsPage() {
  const canEditDesigns = process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
  if (!canEditDesigns || process.env.NODE_ENV !== "development") {
    notFound();
  }

  const models = await prisma.aiModels.findMany({ orderBy: [{ provider: "asc" }, { displayName: "asc" }] });

  return <CatalogAiModelsAdmin initialModels={models.map(toAdminAiModel)} />;
}
