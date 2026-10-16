"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactMethods } from "@/components/custom/contact-methods";
import { SocialLinks } from "@/components/custom/social-links";
import { slugify } from "@/lib/slug";
import { type QueryProduct, useQueryProduct } from "@/lib/query-product";

const socialLinkClassName =
  "w-11 h-11 rounded-full border border-border bg-white text-foreground flex items-center justify-center transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

interface ProductThanksProps {
  /** Diseños publicados: ?id= solo se acepta si corresponde a uno de ellos. */
  products: QueryProduct[];
}

// Destino del QR impreso en los flyers (/gracias/?id=<id del diseño>).
export function ProductThanks({ products }: ProductThanksProps) {
  const product = useQueryProduct(products);
  const rateHref = product ? `/calificaciones/nueva/?id=${product.id}` : "/calificaciones/nueva/";

  return (
    <section className="pt-28 pb-20">
      <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            ¡Gracias por tu compra!
          </h1>
          {product ? (
            <p className="mt-3 text-muted-foreground">
              Tu producto:{" "}
              <Link
                href={`/productos/${product.id}-${slugify(product.name)}/`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {product.name}
              </Link>
            </p>
          ) : (
            <p className="mt-3 text-muted-foreground">
              Esperamos que disfrutes tu producto personalizado InspiraArte.
            </p>
          )}
          <p className="mt-4 text-foreground">
            Tu opinión nos ayuda a mejorar y orienta a nuevos clientes. ¿Nos regalas una calificación?
          </p>
          <Button asChild size="lg" className="mt-6 w-full bg-primary text-white hover:bg-inspirarte-petroleum-deep sm:w-auto">
            <Link href={rateHref}>
              <Star aria-hidden="true" />
              Calificar {product ? "este producto" : "mi producto"}
            </Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-foreground">Contáctanos</h2>
          <p className="mt-2 mb-6 text-muted-foreground">
            ¿Quieres otro diseño o tienes alguna duda? Escríbenos o llámanos.
          </p>
          <ContactMethods showPhone />
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-foreground">Síguenos</h2>
          <p className="mt-2 mb-6 text-muted-foreground">
            Mira nuestros trabajos más recientes y comparte la foto de tu producto.
          </p>
          <SocialLinks linkClassName={socialLinkClassName} />
        </div>
      </div>
    </section>
  );
}
