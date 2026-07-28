import { Metadata } from "next";
import { Process } from "@/components/custom/process";


export const metadata: Metadata = {
  title: "Proceso de pedido | InspiraArte",
  description:
    "Conoce como trabajamos tu pedido personalizado: idea, propuesta de diseño, producción laser y entrega en Mexico.",
  keywords: [
    "proceso de pedido",
    "personalización",
    "producción laser",
    "cotización",
    "InspiraArte",
  ],
  openGraph: {
    title: "Proceso de pedido | InspiraArte",
    description: "Descubre los pasos para convertir tu idea en un producto personalizado.",
    type: "website",
    locale: "es_MX",
  },
};

export default function Proceso() {
  return (
    <>
      <Process />
    </>
  );
}
