import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { buildHowToJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { Process, processSteps } from "@/components/custom/process";


export const metadata: Metadata = buildPageMetadata({
  title: "Cómo pedir tu producto personalizado | InspiraArte",
  description:
    "Así trabajamos tu pedido personalizado en 4 pasos: nos cuentas tu idea, aprobamos juntos el diseño, lo producimos con láser y lo enviamos a todo México.",
  path: "/proceso",
  keywords: [
    "proceso de pedido",
    "personalización",
    "producción láser",
    "cotización",
    "InspiraArte",
  ],
  imagePath: "/dam/default-image-product.webp",
  imageAlt: "Proceso de pedido de productos personalizados en InspiraArte",
});

const howToJsonLd = buildHowToJsonLd({
  path: "/proceso/",
  name: "Cómo pedir un producto personalizado en InspiraArte",
  description:
    "Pasos para cotizar, aprobar el diseño, producir con láser y recibir tu producto personalizado en México.",
  steps: processSteps.map((step) => ({ name: step.title, text: step.description })),
});

export default function Proceso() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(howToJsonLd) }}
      />
      <Process isPageTitle />
    </>
  );
}
