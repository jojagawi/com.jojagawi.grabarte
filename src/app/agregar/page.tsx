import { Metadata } from "next";
import { AddNewDesign } from "@/components/custom/add-new-design";



export const metadata: Metadata = {
  title: "Agregar nuevo diseño | InspirArte",
  description:
    "Aquí puedes agregar nuevos diseños para que se muestren en el catalogo, o simplemente para poder almacenarlos para después.",
  keywords: ["diseños", "archivos", "agregar"],
  openGraph: {
    title: "Agregar nuevo diseño | InspirArte",
    description: "Agregar nuevos diseños para que se muestren en el catalogo.",
    type: "website",
    locale: "es_MX",
  },
};

export default function Agregar() {
  return (
    <>
      <AddNewDesign />
    </>
  );
}
