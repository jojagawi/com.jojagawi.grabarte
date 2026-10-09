import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { Contact } from "@/components/custom/contact";


export const metadata: Metadata = buildPageMetadata({
  title: "Contacto y cotización | InspiraArte",
  description:
    "Cuéntanos tu idea y solicita tu cotización de productos personalizados. Adjunta referencias y recibe respuesta en menos de 24 horas.",
  path: "/contacto",
  keywords: [
    "contacto",
    "cotización",
    "productos personalizados",
    "pedido personalizado",
    "InspiraArte",
  ],
});

export default function Contacto() {
  return (
    <>
      <Contact />
    </>
  );
}
