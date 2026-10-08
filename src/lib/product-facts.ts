// Datos de la ficha (envío, disponibilidad) normalizados para mostrarlos y marcarlos en JSON-LD.
// La BD guarda textos libres generados por diseño ("Depende del destino y servicio de envío",
// "Consultar disponibilidad", "En stock"...); aquí se reducen a pocos valores consistentes.

export const SHIPPING_FALLBACK = "Según destino; se confirma al cotizar";

// "2 a 5 días hábiles a todo México" → "2 a 5 días hábiles"; sin plazo concreto → null.
export function toDisplayShippingTime(value: string | null | undefined): string | null {
  const match = value?.trim().match(/^\d+\s*(?:a|-)\s*\d+\s*días hábiles/iu);
  return match ? match[0].replace(/\s+/gu, " ") : null;
}

export type ProductAvailability = {
  label: "Disponible" | "Bajo pedido" | "Agotado";
  schema: "https://schema.org/InStock" | "https://schema.org/MadeToOrder" | "https://schema.org/OutOfStock";
};

// Todo se produce sobre pedido: solo un texto explícito de stock o inventario cuenta como disponible.
export function normalizeAvailability(value: string | null | undefined): ProductAvailability {
  const text = value?.trim().toLowerCase() ?? "";

  if (text.includes("agotad")) {
    return { label: "Agotado", schema: "https://schema.org/OutOfStock" };
  }

  if (/stock|inventario/u.test(text) && !/pedido|sujeto|consultar|confirm/u.test(text)) {
    return { label: "Disponible", schema: "https://schema.org/InStock" };
  }

  return { label: "Bajo pedido", schema: "https://schema.org/MadeToOrder" };
}
