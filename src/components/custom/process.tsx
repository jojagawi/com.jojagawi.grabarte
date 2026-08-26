import { MessageSquare, Palette, Package, Truck } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Cuéntanos tu idea",
    description:
      "Escríbenos qué producto necesitas, para qué ocasión y comparte tus ideas o imágenes de referencia.",
    icon: MessageSquare,
    color: "#4290A3",
  },
  {
    number: "02",
    title: "Diseñamos juntos",
    description:
      "Nuestro equipo crea una propuesta de diseño. Tú apruebas o sugieres cambios hasta que quede perfecto.",
    icon: Palette,
    color: "#1FA4A7",
  },
  {
    number: "03",
    title: "Producción",
    description:
      "Con tu aprobación, comenzamos la producción con tecnología láser de alta precisión.",
    icon: Package,
    color: "#3ACBFE",
  },
  {
    number: "04",
    title: "Entrega",
    description:
      "Empacamos con cuidado y enviamos a cualquier parte de México. También puedes recoger en persona.",
    icon: Truck,
    color: "#00B003",
  },
];

export function Process() {
  return (
    <section id="proceso" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#1FA4A7]/10 text-[#1FA4A7] text-sm font-medium mb-4">
            Proceso de Pedido
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Tan fácil como{" "}
            <span className="text-[#1FA4A7]">1, 2, 3... ¡y 4!</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Pedir tu producto personalizado es súper sencillo. Te acompañamos en
            cada paso para que el resultado sea exactamente lo que imaginaste.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative group">

                <div className="relative z-10 text-center">
                  {/* Step Number */}
                  <div
                    className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-3"
                    style={{ backgroundColor: `${step.color}15` }}
                  >
                    <Icon className="w-10 h-10" style={{ color: step.color }} />
                  </div>

                  {/* Number Badge */}
                  <div
                    className="absolute -top-2 -right-2 md:right-auto md:left-1/2 md:-translate-x-1/2 md:-top-2 w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.number.replace("0", "")}
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
        <div className="mt-16 bg-gradient-to-r from-[#4290A3] to-[#1FA4A7] rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                ¿Listo para crear algo increíble?
              </h3>
              <p className="text-white/80">
                No importa si es un regalo único o 500 piezas para tu evento.
                ¡Estamos listos!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contacto"
                className="px-6 py-3 bg-white text-[#4290A3] font-semibold rounded-lg hover:bg-white/90 transition-colors text-center"
              >
                Iniciar pedido
              </a>
              {process.env.NEXT_PUBLIC_WHATSAPP && (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#00B003] text-white font-semibold rounded-lg hover:bg-[#00B003]/90 transition-colors flex items-center justify-center gap-2"
                  href={
                    "https://wa.me/" +
                    process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "")
                  }
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
