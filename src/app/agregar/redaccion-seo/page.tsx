import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { SeoWriterProfilesManager } from "@/components/custom/seo-writer-profiles-manager";

export const metadata: Metadata = buildPageMetadata({
  title: "Perfiles de redaccion SEO | InspiraArte",
  description:
    "Panel interno para visualizar y editar perfiles y modos de redaccion SEO usados por la IA.",
  path: "/agregar/redaccion-seo",
  imagePath: "/dam/dafault-image-product.webp",
  imageAlt: "Panel interno de perfiles de redaccion SEO",
  noIndex: true,
});

export default async function RedaccionSeoPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const profiles = await prisma.seoWriterProfiles.findMany({
    where: { status: 1 },
    select: {
      id: true,
      name: true,
      tone: true,
      audience: true,
      defaultMode: true,
      instructions: true,
      isDefault: true,
    },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
  });

  return (
    <SeoWriterProfilesManager
      initialProfiles={profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        tone: profile.tone,
        audience: profile.audience,
        defaultMode:
          profile.defaultMode === "complement" ||
          profile.defaultMode === "rewrite-hard" ||
          profile.defaultMode === "rewrite-soft"
            ? profile.defaultMode
            : "rewrite-soft",
        instructions: profile.instructions,
        isDefault: profile.isDefault === 1,
      }))}
    />
  );
}

