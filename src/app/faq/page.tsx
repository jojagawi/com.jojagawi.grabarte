import { Metadata } from "next";
import { FAQ } from "@/components/custom/faq";


export const metadata: Metadata = {
  title: "Preguntas frecuentes | InspiraArte",
  description:
    "Resuelve dudas sobre tiempos de entrega, pedidos mínimos, formatos de archivo, envios, pagos y garantías.",
  keywords: [
    "preguntas frecuentes",
    "faq",
    "envios",
    "tiempos de entrega",
    "InspiraArte",
  ],
  openGraph: {
    title: "Preguntas frecuentes | InspiraArte",
    description: "Encuentra respuestas rápidas sobre pedidos y personalización.",
    type: "website",
    locale: "es_MX",
  },
};

export default function Faq() {
  return (
    <>
      <FAQ />
    </>
  );
}
