import Link from "next/link";
import { ArrowRight, MessageSquare, Package, Palette, Truck } from "lucide-react";

// Resumen de los pasos de /proceso (process.tsx); se muestra junto a la acción de
// cotizar para que el cliente sepa que aprueba el diseño antes de producir.
const orderSteps = [
  { title: "Nos cuentas tu idea", icon: MessageSquare },
  { title: "Apruebas la propuesta", icon: Palette },
  { title: "Producción láser", icon: Package },
  { title: "Envío a todo México", icon: Truck },
];

export function ProductOrderPath() {
  return (
    // data-llms-skip: los mismos 4 pasos en cada ficha; scripts/build-llms.ts los omite.
    <div className="space-y-3" data-llms-skip>
      <ol className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4" aria-label="Cómo trabajamos tu pedido">
        {orderSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={step.title} className="flex items-center gap-2 sm:flex-col sm:items-start">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <span className="text-sm leading-snug text-foreground">
                <span className="sr-only">Paso {index + 1}: </span>
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
      <Link
        href="/proceso"
        className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Ver cómo trabajamos
        <ArrowRight aria-hidden="true" className="size-3.5" />
      </Link>
    </div>
  );
}
