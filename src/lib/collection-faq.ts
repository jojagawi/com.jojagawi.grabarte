import { formatPrice } from "@/components/custom/product-quote-actions";
import type { SiteDesign } from "@/lib/site-designs.server";

// Preguntas frecuentes de las páginas de categoría y temporada. Las respuestas salen de los datos
// del catálogo (precios, materiales, tiempos de producción de esas piezas) y de las políticas de
// /faq, para que buscadores y asistentes de IA puedan citar una respuesta concreta de la página.
// Solo se incluye una pregunta cuando hay datos para contestarla.

export interface CollectionFaqItem {
  id: number;
  question: string;
  answer: string;
}

interface CollectionFaqInput {
  /** Nombre de la categoría o temporada tal como se muestra ("¿Cuánto cuestan los diseños de Navidad?"). */
  name: string;
  designs: SiteDesign[];
  /** Temporadas: días antes del inicio en que conviene pedir (CatSeasons.leadDays). */
  leadDays?: number;
}

// Mismos plazos que la FAQ general (/faq).
const SMALL_ORDER_DAYS = "3 a 5 días hábiles";
const LARGE_ORDER_DAYS = "7 a 15 días";

function joinList(items: string[]): string {
  return items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

function describePrices(name: string, designs: SiteDesign[]): CollectionFaqItem | null {
  const prices = designs
    .map((design) => design.suggestedPrice)
    .filter((price): price is number => price !== null && Number.isFinite(price) && price > 0);
  if (prices.length === 0) {
    return null;
  }

  const min = formatPrice(Math.min(...prices));
  const max = formatPrice(Math.max(...prices));
  const range = min === max ? `${min} MXN por pieza` : `${min} a ${max} MXN por pieza`;
  return {
    id: 1,
    question: `¿Cuánto cuestan los diseños de ${name}?`,
    answer: `Los precios de referencia van de ${range}. El precio final depende de la cantidad y de la personalización, y te lo confirmamos en la cotización. Puedes pedir desde una sola pieza, y a partir de 10 piezas hay descuento.`,
  };
}

function describeMaterials(name: string, designs: SiteDesign[]): CollectionFaqItem | null {
  const counts = new Map<string, number>();
  for (const design of designs) {
    const material = design.material?.name?.trim();
    if (material && material.toLowerCase() !== "varios") {
      counts.set(material, (counts.get(material) ?? 0) + 1);
    }
  }
  if (counts.size === 0) {
    return null;
  }

  const materials = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([material]) => material);
  const [main] = materials;
  const answer =
    materials.length === 1
      ? `Los diseños de ${name} están hechos en ${main} y los cortamos y grabamos con láser en nuestro taller de Ciudad de México.`
      : `La mayoría están hechos en ${main}; también hay piezas en ${joinList(materials.slice(1))}. Los cortamos y grabamos con láser en nuestro taller de Ciudad de México.`;
  return { id: 2, question: `¿De qué material son los diseños de ${name}?`, answer };
}

function describeCustomization(name: string, designs: SiteDesign[]): CollectionFaqItem | null {
  const customizable = designs.filter((design) => design.isCustomizable === 1).length;
  if (customizable === 0) {
    return null;
  }

  const share =
    customizable === designs.length
      ? `Sí, los ${designs.length} diseños se pueden personalizar`
      : `Sí, ${customizable} de los ${designs.length} diseños se pueden personalizar`;
  return {
    id: 3,
    question: `¿Puedo personalizar los diseños de ${name}?`,
    answer: `${share} con nombres, fechas, frases o tu logotipo. Antes de producir te enviamos una vista previa digital para que la apruebes, con hasta 2 cambios sin costo.`,
  };
}

// Plazo de producción que declaran las fichas ("2 a 4 días hábiles"); sin plazos concretos, null.
function productionRange(designs: SiteDesign[]): string | null {
  const ranges = designs
    .map((design) => design.productionTime?.trim().match(/^(\d+)\s*(?:a|-)\s*(\d+)\s*días hábiles/iu))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => [Number(match[1]), Number(match[2])]);
  if (ranges.length === 0) {
    return null;
  }

  const min = Math.min(...ranges.map(([from]) => from));
  const max = Math.max(...ranges.map(([, to]) => to));
  return min === max ? `${min} días hábiles` : `${min} a ${max} días hábiles`;
}

function describeProductionTime(name: string, designs: SiteDesign[]): CollectionFaqItem {
  const range = productionRange(designs);
  const typical = range
    ? `Estas piezas se producen en ${range} para pedidos pequeños`
    : `Los pedidos pequeños (1 a 10 piezas) están listos en ${SMALL_ORDER_DAYS}`;
  return {
    id: 4,
    question: `¿Cuánto tarda un pedido de ${name}?`,
    answer: `${typical}; los pedidos grandes o con diseños complejos toman de ${LARGE_ORDER_DAYS}. Te confirmamos la fecha exacta al aprobar tu diseño. El envío se suma a ese tiempo.`,
  };
}

function describeLeadTime(name: string, leadDays: number): CollectionFaqItem | null {
  if (leadDays <= 0) {
    return null;
  }

  const weeks = leadDays % 7 === 0 ? `${leadDays / 7} semanas` : `${leadDays} días`;
  return {
    id: 5,
    question: `¿Con cuánta anticipación debo pedir para ${name}?`,
    answer: `Te recomendamos pedir al menos ${weeks} antes de la fecha en que lo necesitas. Así hay tiempo para aprobar el diseño, producir (${SMALL_ORDER_DAYS} en pedidos pequeños, ${LARGE_ORDER_DAYS} en pedidos grandes) y enviar a cualquier parte de México.`,
  };
}

const SHIPPING_ITEM: CollectionFaqItem = {
  id: 6,
  question: "¿Hacen envíos a todo México?",
  answer:
    "Sí. Enviamos a toda la República Mexicana por paquetería; el costo depende del destino y del tamaño del paquete. También puedes recoger tu pedido en nuestro taller de Ciudad de México sin costo adicional.",
};

export function buildCollectionFaq({ name, designs, leadDays }: CollectionFaqInput): CollectionFaqItem[] {
  if (designs.length === 0) {
    return [];
  }

  return [
    leadDays !== undefined ? describeLeadTime(name, leadDays) : null,
    describePrices(name, designs),
    describeCustomization(name, designs),
    describeMaterials(name, designs),
    describeProductionTime(name, designs),
    SHIPPING_ITEM,
  ].filter((item): item is CollectionFaqItem => Boolean(item));
}
