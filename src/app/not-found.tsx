import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Página no encontrada | InspiraArte",
  description: "La página que buscas no existe o cambió de dirección. Revisa nuestro catálogo o cotiza tu idea.",
};

export default function NotFound() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          Error 404
        </span>
        <h1 className="font-serif text-4xl font-bold text-foreground text-balance sm:text-5xl">
          No encontramos esta página
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Puede que el diseño ya no esté disponible o que la dirección haya cambiado. Explora el catálogo o
          cuéntanos tu idea y la diseñamos contigo.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="outline" className="h-11 border-primary text-primary hover:bg-primary/10">
            <Link href="/productos">Ver el catálogo</Link>
          </Button>
          <Button asChild className="h-11 bg-primary text-primary-foreground hover:bg-inspirarte-petroleum-deep">
            <Link href="/contacto">Cotizar mi idea</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
