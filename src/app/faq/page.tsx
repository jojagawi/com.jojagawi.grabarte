import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { FAQ } from "@/components/custom/faq";


export const metadata: Metadata = buildPageMetadata({
  title: "Preguntas frecuentes | InspiraArte",
  description:
    "Resuelve dudas sobre tiempos de entrega, pedidos mínimos, formatos de archivo, envios, pagos y garantías.",
  path: "/faq",
  keywords: [
    "preguntas frecuentes",
    "faq",
    "envíos",
    "tiempos de entrega",
    "InspiraArte",
  ],
  imagePath: "/dam/dafault-image-product.webp",
  imageAlt: "Preguntas frecuentes sobre pedidos personalizados en InspiraArte",
});

export default function Faq() {
  return (
    <>
      <FAQ />
    </>
  );
}
