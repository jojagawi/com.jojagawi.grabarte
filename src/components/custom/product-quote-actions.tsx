import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaWhatsapp } from "@react-icons/all-files/fa/FaWhatsapp";
import { Button } from "@/components/ui/button";
import { buildWhatsappQuoteHref } from "@/lib/quote-request";
import { ProductQuoteBar } from "@/components/custom/product-quote-bar";

interface ProductQuoteActionsProps {
  productName: string;
  productReference: string;
  productUrl: string;
  suggestedPrice: number | null;
  // El diseño tiene precio de mayoreo: se avisa que existe, la cifra no se publica.
  hasWholesale?: boolean;
  // Solo valores reales (sin rellenos como "No especificado").
  productionTime?: string;
  shippingTime?: string;
  // Ruta en S3 de la miniatura (preview/…); /contacto la muestra junto al producto.
  imagePath?: string | null;
}

const actionsId = "acciones-de-cotizacion";

const priceFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

// Nombre + referencia que viaja a /contacto y a WhatsApp; se recorta para no
// generar URLs enormes con nombres muy largos.
export function buildQuoteSubject(productName: string, productReference: string): string {
  const name = productName.trim() || "Producto personalizado";
  const shortName = name.length > 120 ? `${name.slice(0, 117)}…` : name;
  return `${productReference} · ${shortName}`;
}

// Los tiempos del diseño viajan a /contacto para orientar la fecha que pide el cliente,
// y la miniatura para que vea la pieza que está cotizando.
function buildContactHref(
  subject: string,
  productionTime?: string,
  shippingTime?: string,
  imagePath?: string | null,
  productPath?: string,
): string {
  const params = new URLSearchParams({ producto: subject });
  if (productionTime) {
    params.set("produccion", productionTime.slice(0, 80));
  }
  if (shippingTime) {
    params.set("envio", shippingTime.slice(0, 80));
  }
  if (imagePath) {
    params.set("imagen", imagePath);
  }
  if (productPath) {
    params.set("ficha", productPath);
  }

  return `/contacto?${params.toString()}`;
}

export function formatPrice(suggestedPrice: number | null): string | null {
  if (suggestedPrice === null || !Number.isFinite(suggestedPrice) || suggestedPrice <= 0) {
    return null;
  }

  return priceFormatter.format(suggestedPrice);
}

export function ProductQuoteActions({
  productName,
  productReference,
  productUrl,
  suggestedPrice,
  hasWholesale = false,
  productionTime,
  shippingTime,
  imagePath,
}: ProductQuoteActionsProps) {
  const subject = buildQuoteSubject(productName, productReference);
  const contactHref = buildContactHref(subject, productionTime, shippingTime, imagePath, new URL(productUrl).pathname);
  const whatsappHref = buildWhatsappQuoteHref({ product: subject, productUrl });
  const price = formatPrice(suggestedPrice);

  return (
    <>
      <div id={actionsId} className="space-y-4 border-t border-border pt-6">
        <div className="space-y-1">
          <p className="text-foreground">
            {price ? (
              <>
                <span className="text-sm text-muted-foreground">Desde </span>
                <span className="text-2xl font-semibold tabular-nums">{price}</span>
                <span className="text-sm text-muted-foreground"> MXN por pieza</span>
              </>
            ) : (
              <span className="text-lg font-semibold">Precio bajo cotización</span>
            )}
          </p>
          {hasWholesale && (
            <p className="text-sm text-muted-foreground">
              ¿Necesitas varias piezas? Pide precio de mayoreo en tu cotización.
            </p>
          )}
        </div>

        {/* data-llms-skip: botones repetidos en cada ficha; scripts/build-llms.ts los omite. */}
        <div className="flex flex-col gap-3 sm:flex-row" data-llms-skip>
          <Button
            asChild
            size="lg"
            className="group h-11 bg-primary text-primary-foreground hover:bg-inspirarte-petroleum-deep"
          >
            <Link href={contactHref}>
              Cotizar este diseño
              <ArrowRight
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Button>

          {whatsappHref && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 border-primary text-primary hover:bg-primary/10 hover:text-primary"
            >
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp aria-hidden="true" className="text-inspirarte-green" />
                Preguntar por WhatsApp
              </a>
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Cotización sin compromiso. Te enviamos una propuesta de diseño antes de producir.
        </p>
      </div>

      <ProductQuoteBar actionsId={actionsId}>
        <div className="flex items-center gap-3" data-llms-skip>
          <p className="min-w-0 flex-1 truncate text-sm text-foreground">
            {price ? (
              <>
                <span className="text-muted-foreground">Desde </span>
                <span className="font-semibold tabular-nums">{price}</span>
                <span className="text-muted-foreground"> por pieza</span>
              </>
            ) : (
              <span className="font-semibold">Precio bajo cotización</span>
            )}
          </p>
          {whatsappHref && (
            <Button
              asChild
              size="icon-lg"
              variant="outline"
              className="size-11 border-primary"
            >
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Preguntar por WhatsApp"
              >
                <FaWhatsapp aria-hidden="true" className="size-5 text-inspirarte-green" />
              </a>
            </Button>
          )}
          <Button
            asChild
            size="lg"
            className="h-11 bg-primary px-5 text-white hover:bg-inspirarte-petroleum-deep"
          >
            <Link href={contactHref}>Cotizar</Link>
          </Button>
        </div>
      </ProductQuoteBar>
    </>
  );
}
