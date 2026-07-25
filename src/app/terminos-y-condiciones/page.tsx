import { Metadata } from "next";

export const metadata: Metadata = {
  title: "InspirArte | Personalización sin límites: del diseño a la realidad",
  description:
    "Descubre nuestro catálogo de productos personalizados. Expertos en corte y grabado láser en MDF, acrílico y cuero, y personalización de termos. ¡Haz tu pedido!",
  keywords: [
    "corte láser",
    "grabado láser",
    "termos personalizados",
    "corte en MDF",
    "grabado en acrílico",
    "regalos personalizados",
    "sellos a medida",
  ],
  openGraph: {
    title: "InspirArte | Productos Personalizados",
    description: "Materializamos tus ideas con precisión y detalle.",
    type: "website",
    locale: "es_MX",
  },
};

export default function Home() {
  return (
    <>
      <h1>terminos-y-condiciones</h1>
    </>
  );
}
