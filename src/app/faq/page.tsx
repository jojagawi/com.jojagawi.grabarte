import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { FAQ } from "@/components/custom/faq";
import { prisma } from "@/lib/prisma";


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

  return (
    <>
      <FAQ faqs={faqs} />
    </>
  );
}
