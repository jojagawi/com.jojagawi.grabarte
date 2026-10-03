import { Check, PenLine } from "lucide-react";

interface PersonalizableTagProps {
  className?: string;
}

// DESIGN.md: "The Purple Means Personal Rule". El púrpura solo marca lo personalizable.
export function PersonalizableTag({ className = "" }: PersonalizableTagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-sm font-medium text-secondary-foreground ${className}`}
    >
      <PenLine aria-hidden="true" className="size-3.5" />
      Personalizable
    </span>
  );
}

interface ProductFeatureListsProps {
  features: string | null | undefined;
  isCustomizable: boolean;
}

// `features` llega del panel en dos formatos: frases separadas por ";" o una lista
// con guiones o viñetas, una por línea ("- a\r\n- b"). Se aceptan ambos.
export function splitFeatures(features: string | null | undefined): string[] {
  return (features ?? "")
    .split(/[;\r\n]+/u)
    .map((item) =>
      item
        .trim()
        .replace(/^[-–—•*·]\s*/u, "")
        .replace(/\.$/u, "")
        .trim(),
    )
    .filter(Boolean);
}

const personalizationPattern = /personaliz/iu;

function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase("es-MX") + text.slice(1);
}

// Bajo el título "Lo que puedes personalizar", "Personalización con nombre…" repite
// la idea: se deja solo lo que cambia ("Nombre, iniciales o mensaje").
function toPersonalizationOption(item: string): string {
  return capitalize(item.replace(/^personalizaci[oó]n\s+(con|de|en|por)\s+/iu, ""));
}

export function ProductFeatureLists({ features, isCustomizable }: ProductFeatureListsProps) {
  const items = splitFeatures(features);
  // Solo se separan las frases de personalización cuando el producto es personalizable;
  // si no, "personalizar" sería una promesa que el producto no cumple.
  const personalization = isCustomizable
    ? items.filter((item) => personalizationPattern.test(item))
    : [];
  const characteristics = items.filter((item) => !personalization.includes(item));

  if (personalization.length === 0 && characteristics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {personalization.length > 0 && (
        <section
          aria-labelledby="lo-que-puedes-personalizar"
          className="rounded-2xl border border-secondary/20 bg-secondary/5 p-6"
        >
          <h3
            id="lo-que-puedes-personalizar"
            className="mb-3 flex items-center gap-2 font-medium text-secondary"
          >
            <PenLine aria-hidden="true" className="size-4" />
            Lo que puedes personalizar
          </h3>
          <ul className="space-y-2">
            {personalization.map((item) => (
              <li key={item} className="text-foreground wrap-break-word">
                {toPersonalizationOption(item)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {characteristics.length > 0 && (
        <section aria-labelledby="caracteristicas">
          <h3 id="caracteristicas" className="mb-3 font-medium text-foreground">
            Características
          </h3>
          <ul className="space-y-2">
            {characteristics.map((item) => (
              <li key={item} className="flex gap-2 text-foreground/80 wrap-break-word">
                <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                {capitalize(item)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
