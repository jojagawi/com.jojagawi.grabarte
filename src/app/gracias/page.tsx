import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { getSiteDesigns } from "@/lib/site-designs.server";
import { ProductThanks } from "@/components/custom/product-thanks";

export const metadata: Metadata = buildPageMetadata({
  title: "Gracias por tu compra | InspiraArte",
  description:
    "Datos de contacto, redes sociales y enlace para calificar tu producto InspiraArte.",
  path: "/gracias",
  keywords: ["contacto", "calificar producto", "redes sociales", "InspiraArte"],
  // Destino del QR de los flyers impresos: no aporta a la búsqueda.
  noIndex: true,
  imageAlt: "Gracias por tu compra en InspiraArte",
});

export default async function GraciasPage() {
  const products = (await getSiteDesigns()).map((design) => ({
    id: design.id,
    name: design.name ?? "Diseño sin nombre",
  }));

  return <ProductThanks products={products} />;
}
