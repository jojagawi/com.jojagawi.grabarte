import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { RateSiteForm } from "@/components/custom/rate-site-form";

export const metadata: Metadata = buildPageMetadata({
  title: "Agregar calificacion | InspiraArte",
  description:
    "Formulario para que los usuarios compartan su testimonio y calificacion sobre su compra.",
  path: "/agregar-calificacion",
  keywords: ["testimonios", "calificaciones", "opiniones", "InspiraArte"],
  imagePath: "/dam/dafault-image-product.webp",
  imageAlt: "Formulario para agregar calificacion",
});

export default function AgregarCalificacionPage() {
  return <RateSiteForm />;
}

