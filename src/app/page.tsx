import { Metadata } from "next";
import { Hero } from "@/components/custom/hero";
import { Process } from "@/components/custom/process";
import { Testimonials } from "@/components/custom/testimonials";

export const metadata: Metadata = {
  title: "InspiraArte | Regalos y productos personalizados en Mexico",
  description:
    "Creamos termos, llaveros, figuras MDF y mas con grabado y corte laser. Cotiza tu diseño personalizado para regalos, eventos y marcas.",
  keywords: [
    "productos personalizados",
    "regalos personalizados",
    "grabado laser",
    "corte laser",
    "InspiraArte",
    "termos personalizados",
    "Mexico",
  ],
  openGraph: {
    title: "InspiraArte | Productos personalizados para cada ocasion",
    description:
      "Transformamos tus ideas en productos personalizados con acabados de calidad y atencion cercana.",
    type: "website",
    locale: "es_MX",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Process />
      <Testimonials />
    </>
  );
}
