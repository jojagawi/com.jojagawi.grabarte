import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { RateSiteForm } from "@/components/custom/rate-site-form";
import { getSiteDesigns } from "@/lib/site-designs.server";

export const metadata: Metadata = buildPageMetadata({
  title: "Agregar calificación | InspiraArte",
  description:
    "Formulario para compartir una nueva calificación y experiencia de compra en InspiraArte.",
  path: "/calificaciones/nueva",
  keywords: ["calificaciones", "opiniones", "testimonios", "InspiraArte"],
  // Formulario sin contenido propio: no aporta a la búsqueda y duplica la otra ruta de calificación.
  noIndex: true,
  imageAlt: "Formulario de calificación de InspiraArte",
});

export default async function NuevaCalificacionPage() {
  const products = (await getSiteDesigns()).map((design) => ({
    id: design.id,
    name: design.name ?? "Diseño sin nombre",
  }));

  return <RateSiteForm products={products} />;
}

