import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { FAQ } from "@/components/custom/faq";
import { prisma } from "@/lib/prisma";
import { buildFaqPageJsonLd, serializeJsonLd } from "@/lib/structured-data";


export const metadata: Metadata = buildPageMetadata({
  title: "Preguntas frecuentes: pedidos personalizados | InspiraArte",
  description:
    "Resuelve tus dudas sobre tiempos de entrega, pedido mínimo, formatos de archivo, envíos a todo México, pagos y garantía de tus productos personalizados.",
  path: "/faq",
  keywords: [
    "preguntas frecuentes",
    "faq",
    "envíos",
    "tiempos de entrega",
    "InspiraArte",
  ],
  imagePath: "/dam/default-image-product.webp",
  imageAlt: "Preguntas frecuentes sobre pedidos personalizados en InspiraArte",
});

export const llmstxt = {
  title: "Preguntas frecuentes",
  description: "Respuestas rápidas sobre pedidos, entregas, envíos y pagos.",
};

export default async function Faq() {
  const faqs = await prisma.faqs.findMany({
    where: {
      showInSite: 1,
    },
    select: {
      id: true,
      question: true,
      answer: true,
    },
    orderBy: [
      {
        priority: "asc",
      },
      {
        id: "asc",
      },
    ],
  });

  const faqJsonLd = buildFaqPageJsonLd("/faq/", faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />
      <FAQ faqs={faqs} isPageTitle />
    </>
  );
}
