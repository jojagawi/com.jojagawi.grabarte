import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { getSiteDesigns } from "@/lib/site-designs.server";
import { ProductFlyer } from "@/components/custom/product-flyer";

export const metadata: Metadata = buildPageMetadata({
  title: "Flyers con QR | InspiraArte",
  description: "Panel interno para imprimir flyers con QR de calificación por producto.",
  path: "/catalogos/flyers",
  noIndex: true,
});

// Los flyers se imprimen en desarrollo, pero el QR debe abrir el sitio público.
const flyerSiteUrl = (process.env.NEXT_PUBLIC_FLYER_SITE_URL?.trim() || "https://www.inspiraarte.com").replace(
  /\/+$/u,
  "",
);

export default async function CatalogFlyersPage() {
  const canEditDesigns = process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
  if (!canEditDesigns || process.env.NODE_ENV !== "development") {
    notFound();
  }

  const products = (await getSiteDesigns())
    .map((design) => ({
      id: design.id,
      name: design.name ?? "Diseño sin nombre",
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  return <ProductFlyer products={products} thanksUrl={`${flyerSiteUrl}/gracias/`} />;
}
