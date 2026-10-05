import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaWhatsapp } from "@react-icons/all-files/fa/FaWhatsapp";
import { Button } from "@/components/ui/button";

interface ProductQuoteActionsProps {
  productName: string;
  productReference: string;
  productUrl: string;
  suggestedPrice: number | null;
}

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

function buildWhatsappHref(subject: string, productUrl: string): string | null {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "");
  if (!phone) {
    return null;
  }

  // Deja a la vista lo que el taller necesita para cotizar (cantidad y fecha).
  const message = `Hola, me interesa cotizar este diseño: ${subject}\n${productUrl}\n\nCantidad: \nFecha en que lo necesito: `;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
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
}: ProductQuoteActionsProps) {
  const subject = buildQuoteSubject(productName, productReference);
  const contactHref = `/contacto?producto=${encodeURIComponent(subject)}`;
  const whatsappHref = buildWhatsappHref(subject, productUrl);
  const price = formatPrice(suggestedPrice);

  return (
    <>
      <div className="space-y-4 border-t border-border pt-6">
        <p className="text-foreground">
          {price ? (
            <>
              <span className="text-sm text-muted-foreground">Desde </span>
              <span className="text-2xl font-semibold tabular-nums">{price}</span>
              <span className="text-sm text-muted-foreground"> MXN</span>
            </>
          ) : (
            <span className="text-lg font-semibold">Precio bajo cotización</span>
          )}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
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

      {/* Barra fija en móvil: la acción queda al alcance del pulgar en todo momento. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <p className="min-w-0 flex-1 truncate text-sm text-foreground">
            {price ? (
              <>
                <span className="text-muted-foreground">Desde </span>
                <span className="font-semibold tabular-nums">{price}</span>
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
      </div>
    </>
  );
}
