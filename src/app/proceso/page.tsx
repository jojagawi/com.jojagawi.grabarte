import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { buildHowToJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { GuideContent } from "@/components/custom/guide-content";
import { Process, processSteps } from "@/components/custom/process";
import { buildMaterialGuide } from "@/lib/material-guide";
import { getSiteDesigns } from "@/lib/site-designs.server";


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
});

const howToJsonLd = buildHowToJsonLd({
  path: "/proceso/",
  name: "Cómo pedir un producto personalizado en InspiraArte",
  description:
    "Pasos para cotizar, aprobar el diseño, producir con láser y recibir tu producto personalizado en México.",
  steps: processSteps.map((step) => ({ name: step.title, text: step.description })),
});

// Detalle de cada paso. Los plazos, pagos y formatos son los mismos de la FAQ (src/lib/faq-data.ts):
// si cambian allá, cámbialos aquí.
const orderSteps = `## Paso 1: cuéntanos tu idea

Llena el [formulario de cotización](/contacto/) o escríbenos por WhatsApp. Te respondemos en menos de 24 horas. Para cotizar rápido, incluye:

- **Qué pieza necesitas**: un producto del [catálogo](/productos/) o una idea nueva.
- **Cantidad**: no hay pedido mínimo, puedes pedir desde una pieza.
- **Fecha en que lo necesitas** y si lo recoges en CDMX o te lo enviamos.
- **Qué quieres grabar**: nombres, fechas, frases o tu logo.
- **Imágenes de referencia**, si las tienes.

### ¿Qué archivos aceptan para grabar?

Aceptamos JPG, PNG, PDF y archivos vectoriales (AI, SVG, CDR). Para un grabado nítido, envía imágenes de 300 DPI o un vector. Si solo tienes una foto o un boceto en papel, lo digitalizamos por ti.

## Paso 2: diseñamos juntos

Te enviamos una vista previa digital con la pieza, las medidas y el texto o logo acomodados. Puedes pedir **hasta dos cambios sin costo**. Cuando apruebas el diseño te confirmamos el precio final y la fecha de entrega.

Para iniciar la producción pedimos un **anticipo del 50%**. Aceptamos transferencia bancaria, depósito en OXXO, tarjeta de crédito o débito y PayPal. El resto se paga al entregar o al enviar. Si lo necesitas, emitimos factura.

## Paso 3: producción

Cortamos y grabamos cada pieza con láser en nuestro taller de la Ciudad de México, principalmente en MDF, acrílico y metal. Antes de enviarla te mandamos fotos de la pieza terminada.

| Tipo de pedido | Tiempo de producción |
| --- | --- |
| Pedido pequeño (1 a 10 piezas) | 3 a 4 días hábiles |
| Pedido grande o diseño complejo | 7 a 15 días hábiles |
| Temporadas como Día de muertos o Navidad | Pide con al menos 3 semanas de anticipación |

Cada ficha del catálogo indica su propio tiempo de producción.

## Paso 4: entrega

Enviamos a toda la República Mexicana por paquetería. El costo depende del destino y del tamaño del paquete, y te lo confirmamos en la cotización. Si estás en la Ciudad de México, puedes **recoger tu pedido en el taller sin costo**.

### ¿Qué pasa si mi pieza llega dañada?

Si llega dañada o con un error de producción, la reponemos sin costo. Por eso te enviamos fotos antes de mandarla.

`;

const eventOrders = `## Pedidos para eventos y empresas

Para bodas, XV años, bautizos, graduaciones o regalos corporativos hay **descuento desde 10 piezas** y mejores precios desde 50. Cuéntanos la fecha del evento al cotizar para reservar tu lugar en producción. Tienes más respuestas en las [preguntas frecuentes](/faq/).`;

export default async function Proceso() {
  const designs = await getSiteDesigns();
  const processDetails = [orderSteps, buildMaterialGuide(designs), eventOrders].join("\n\n");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(howToJsonLd) }}
      />
      <Process isPageTitle>
        <div className="mx-auto mt-16 max-w-3xl">
          <GuideContent markdown={processDetails} />
        </div>
      </Process>
    </>
  );
}
