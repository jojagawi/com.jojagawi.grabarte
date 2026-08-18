import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { RateSiteForm } from "@/components/custom/rate-site-form";

export const metadata: Metadata = buildPageMetadata({
  title: "Agregar calificacion | InspiraArte",
  description:
    "Formulario para compartir una nueva calificacion y experiencia de compra en InspiraArte.",
  path: "/calificaciones/nueva",
  keywords: ["calificaciones", "opiniones", "testimonios", "InspiraArte"],
  imagePath: "/dam/dafault-image-product.webp",
  imageAlt: "Formulario de calificacion de InspiraArte",
});

export default function NuevaCalificacionPage() {
  return <RateSiteForm />;
}

