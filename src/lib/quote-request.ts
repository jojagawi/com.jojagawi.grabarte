// Utilidades compartidas por la ficha de producto y /contacto para que el contexto
// de la cotización (producto, cantidad, fecha) viaje igual por formulario y WhatsApp.

const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "") || "";

const neededByFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export interface QuoteDraft {
  product?: string | null;
  productUrl?: string | null;
  quantity?: string | null;
  neededBy?: string | null;
  occasion?: string | null;
  details?: string | null;
}

// WhatsApp acepta textos largos, pero una URL enorme falla en algunos navegadores.
const MAX_WHATSAPP_DETAILS = 600;

// "2026-12-05" → Date local (new Date("2026-12-05") sería UTC y podría caer un día antes).
function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
  if (!match) {
    return null;
  }

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function formatNeededBy(value: string | null | undefined): string | null {
  const date = value ? parseIsoDate(value) : null;
  return date ? neededByFormatter.format(date) : null;
}

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// Deja a la vista lo que el taller necesita para cotizar (cantidad y fecha), con lo
// que el cliente ya haya escrito. Devuelve null si no hay teléfono configurado.
export function buildWhatsappQuoteHref({
  product,
  productUrl,
  quantity,
  neededBy,
  occasion,
  details,
}: QuoteDraft): string | null {
  if (!whatsappPhone) {
    return null;
  }

  const intro = product?.trim()
    ? `Hola, me interesa cotizar este diseño: ${product.trim()}`
    : "Hola, quiero cotizar un producto personalizado.";
  const lines = [
    intro,
    productUrl?.trim() ?? "",
    "",
    `Cantidad: ${quantity?.trim() ?? ""}`,
    `Fecha en que lo necesito: ${formatNeededBy(neededBy) ?? ""}`,
  ].filter((line, index) => index !== 1 || line);
  if (occasion?.trim()) {
    lines.push(`Ocasión: ${occasion.trim()}`);
  }
  const trimmedDetails = details?.trim();
  if (trimmedDetails) {
    const shortDetails =
      trimmedDetails.length > MAX_WHATSAPP_DETAILS
        ? `${trimmedDetails.slice(0, MAX_WHATSAPP_DETAILS - 1).trimEnd()}…`
        : trimmedDetails;
    lines.push("", shortDetails);
  }

  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

// Días hábiles de un texto libre de la BD ("Hasta 5 días hábiles", "2 a 5 días",
// "1 semana"). Toma el máximo para no prometer de más; null si no se entiende.
export function parseLeadDays(text: string | null | undefined): number | null {
  const value = text?.toLowerCase() ?? "";
  const numbers = Array.from(value.matchAll(/\d+/gu), (match) => Number(match[0]));
  if (numbers.length === 0) {
    return null;
  }

  const max = Math.max(...numbers);
  if (/semana/u.test(value)) {
    return max * 5;
  }

  return /d[ií]a/u.test(value) ? max : null;
}

// Días hábiles (lunes a viernes) desde mañana hasta la fecha pedida, inclusive.
export function businessDaysUntil(neededBy: string, today: Date): number | null {
  const target = parseIsoDate(neededBy);
  if (!target) {
    return null;
  }

  let count = 0;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  while (cursor < target) {
    cursor.setDate(cursor.getDate() + 1);
    const weekday = cursor.getDay();
    if (weekday !== 0 && weekday !== 6) {
      count += 1;
    }
  }

  return count;
}
