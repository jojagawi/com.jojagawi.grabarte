import { MessageSquare, Palette, Package, Truck } from "lucide-react";
import Link from "next/link";

export const processSteps = [
  {
    number: "01",
    title: "Cuéntanos tu idea",
    description:
      "Escríbenos qué producto necesitas, para qué ocasión y comparte tus ideas o imágenes de referencia.",
    icon: MessageSquare,
  },
  {
    number: "02",
    title: "Diseñamos juntos",
    description:
      "Nuestro equipo crea una propuesta de diseño. Tú apruebas o sugieres cambios hasta que quede perfecto.",
    icon: Palette,
  },
  {
    number: "03",
    title: "Producción",
    description:
      "Con tu aprobación, comenzamos la producción con tecnología láser de alta precisión.",
    icon: Package,
  },
  {
    number: "04",
    title: "Entrega",
    description:
      "Empacamos con cuidado y enviamos a cualquier parte de México. También puedes recoger en persona.",
    icon: Truck,
  },
];

// Mismo formato que las puertas de cotización: deja a la vista lo que el taller necesita.
const whatsappMessage =
  "Hola, quiero cotizar una pieza personalizada.\n\nQué necesito: \nCantidad: \nFecha en que lo necesito: ";

interface ProcessProps {
  /** Página propia (/proceso): el título de la sección es el h1. */
  isPageTitle?: boolean;
}

export function Process({ isPageTitle = false }: ProcessProps) {
  const TitleTag = isPageTitle ? "h1" : "h2";

  return (
    <section id="proceso" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {!isPageTitle && (
            <span className="inline-block px-4 py-1 rounded-full bg-inspirarte-olive/10 text-inspirarte-olive text-sm font-medium mb-4">
              Proceso de Pedido
            </span>
          )}
          <TitleTag className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            {/* En /proceso la etiqueta entra al h1 con la búsqueda que describe la página. */}
            {isPageTitle && (
              <span className="mb-4 block">
                <span className="inline-block px-4 py-1 rounded-full bg-inspirarte-olive/10 text-inspirarte-olive font-sans text-sm font-medium">
                  Cómo pedir tu producto personalizado
                </span>
              </span>
            )}
            Tan fácil como{" "}
            <span className="text-inspirarte-teal">1, 2, 3... ¡y 4!</span>
          </TitleTag>
          <p className="text-muted-foreground text-lg">
            Pedir tu producto personalizado es súper sencillo. Te acompañamos en
            cada paso para que el resultado sea exactamente lo que imaginaste.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              // El id es el destino de cada HowToStep del JSON-LD de /proceso.
              <div key={step.number} id={`paso-${index + 1}`}>
                <div className="text-center">
                  {/* Step Number: la insignia se ancla al ícono en todos los anchos. */}
                  <div className="relative w-24 h-24 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon aria-hidden="true" className="w-10 h-10 text-primary" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      <span className="sr-only">Paso </span>
                      {step.number.replace("0", "")}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-primary rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-serif text-2xl font-bold text-white mb-2">
                ¿Un regalo único o un pedido para tu evento?
              </h3>
              <p className="text-white">
                Cuéntanos qué necesitas y para cuándo.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contacto"
                className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors text-center focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Cotizar mi idea
              </Link>
              {process.env.NEXT_PUBLIC_WHATSAPP && (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-white/70 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Preguntar por WhatsApp
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
