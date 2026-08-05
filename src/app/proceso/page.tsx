import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { Process } from "@/components/custom/process";


export const metadata: Metadata = buildPageMetadata({
  title: "Proceso de pedido | InspiraArte",
  description:
    "Conoce cómo trabajamos tu pedido personalizado: idea, propuesta de diseño, producción láser y entrega en México.",
  path: "/proceso",
  keywords: [
    "proceso de pedido",
    "personalización",
    "producción láser",
    "cotización",
    "InspiraArte",
  ],
  imagePath: "/dam/dafault-image-product.webp",
  imageAlt: "Proceso de pedido de productos personalizados en InspiraArte",
});

export default function Proceso() {
  return (
    <>
      <Process />
    </>
  );
}
