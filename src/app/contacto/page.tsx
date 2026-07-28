import { Metadata } from "next";
import { Contact } from "@/components/custom/contact";


export const metadata: Metadata = {
  title: "Contacto y cotizacion | InspiraArte",
  description:
    "Cuéntanos tu idea y solicita tu cotización de productos personalizados. Adjunta referencias y recibe respuesta en menos de 24 horas.",
  keywords: [
    "contacto",
    "cotización",
    "productos personalizados",
    "pedido personalizado",
    "InspiraArte",
  ],
  openGraph: {
    title: "Contacto y cotización | InspiraArte",
    description: "Solicita tu cotización y comparte los detalles de tu proyecto personalizado.",
    type: "website",
    locale: "es_MX",
  },
};

export default function Contacto() {
  return (
    <>
      <Contact />
    </>
  );
}
