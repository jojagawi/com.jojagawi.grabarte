import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { RateSiteForm } from "@/components/custom/rate-site-form";
import { getSiteDesigns } from "@/lib/site-designs.server";

export const metadata: Metadata = buildPageMetadata({
  title: "Agregar calificación | InspiraArte",
  description:
    "Formulario para que los usuarios compartan su testimonio y calificación sobre su compra.",
  path: "/agregar-calificacion",
  keywords: ["testimonios", "calificaciones", "opiniones", "InspiraArte"],
  imagePath: "/dam/default-image-product.webp",
  // Formulario sin contenido propio: no aporta a la búsqueda y duplica la otra ruta de calificación.
  noIndex: true,
  imageAlt: "Formulario para agregar calificación",
});

export default async function AgregarCalificacionPage() {
  const products = (await getSiteDesigns()).map((design) => ({
    id: design.id,
    name: design.name ?? "Diseño sin nombre",
  }));

  return <RateSiteForm products={products} />;
}

