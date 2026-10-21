import { formatPrice } from "@/components/custom/product-quote-actions";
import { getDesignHref, type SiteDesign } from "@/lib/site-designs.server";

// Sección "Materiales y técnicas" de /proceso: definiciones cortas (lo que buscan los motores de
// respuesta: "¿qué es el MDF?") y dos tablas que salen del catálogo, así que el número de piezas,
// las medidas y los precios se actualizan solos en cada build.

type MaterialRow = {
  // Nombre en CatMaterials.
  name: string;
  definition: string;
  technique: string;
  bestFor: string;
};

const MATERIAL_ROWS: MaterialRow[] = [
  {
    name: "MDF",
    definition: "Tablero de fibras de madera prensadas con resina; liso, sin vetas ni nudos",
    technique: "Corte y grabado láser",
    bestFor: "Adornos, cajas, letreros y piezas para pintar",
  },
  {
    name: "Acrílico",
    definition: "Plástico rígido transparente o de color; el láser deja el borde pulido",
    technique: "Corte y grabado láser",
    bestFor: "Cajas, decoración y maquetas",
  },
  {
    name: "Metal",
    definition: "Piezas metálicas con un marcado permanente que no se borra con el uso",
    technique: "Grabado láser",
    bestFor: "Llaveros, placas y regalos para eventos",
  },
  {
    name: "Termo",
    definition: "Termos metálicos grabados alrededor de la pieza (grabado rotativo)",
    technique: "Grabado láser rotativo",
    bestFor: "Regalos corporativos y personalizados con nombre o logo",
  },
];

// Definiciones de las técnicas y del MDF; las comparten /proceso y la herramienta WebMCP
// get_materials_guide (public/mcp/materials.json).
const TECHNIQUE_DEFINITIONS = [
  "El **corte láser** es una técnica en la que un rayo láser atraviesa el material siguiendo un diseño digital. Así se obtienen formas detalladas y piezas idénticas entre sí, algo difícil de lograr con sierra.",
  "El **grabado láser** es una técnica en la que el láser quema o retira solo la capa superficial del material para marcar textos, fechas, logos o imágenes. No usa tintas, así que el grabado es permanente: no se despinta ni se borra con el uso.",
  "El **MDF** (tablero de fibra de densidad media) es un tablero hecho con fibras de madera prensadas con resina. Tiene una superficie lisa y pareja, sin vetas ni nudos, por eso se corta limpio con láser y acepta bien la pintura acrílica. Es para interiores: la humedad lo hincha. Lo trabajamos en grosores de 2 a 9 mm.",
];

// Piezas del catálogo que sirven de referencia de tamaño, de la más chica a la más grande.
const SIZE_REFERENCE_IDS = [184, 109, 64, 17, 91, 186];

function countByMaterial(designs: SiteDesign[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const design of designs) {
    const material = design.material?.name?.trim();
    if (material) {
      counts.set(material, (counts.get(material) ?? 0) + 1);
    }
  }
  return counts;
}

function buildMaterialTable(designs: SiteDesign[]): string {
  const counts = countByMaterial(designs);
  const rows = MATERIAL_ROWS.map((row) => {
    const count = counts.get(row.name) ?? 0;
    const catalog = count > 0 ? `${count} ${count === 1 ? "diseño" : "diseños"}` : "Bajo pedido";
    return `| **${row.name}** | ${row.definition} | ${row.technique} | ${row.bestFor} | ${catalog} |`;
  });

  return [
    "| Material | Qué es | Técnica | Ideal para | En el catálogo |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
  ].join("\n");
}

function hasConcreteDimensions(value: string | null | undefined): value is string {
  return Boolean(value && /\d/u.test(value));
}

function getSizeReferences(designs: SiteDesign[]): Array<SiteDesign & { dimensions: string }> {
  const byId = new Map(designs.map((design) => [design.id, design]));
  return SIZE_REFERENCE_IDS.map((id) => byId.get(id)).filter(
    (design): design is SiteDesign & { dimensions: string } =>
      Boolean(design && hasConcreteDimensions(design.dimensions)),
  );
}

function buildSizeTable(designs: SiteDesign[]): string | null {
  const rows = getSizeReferences(designs)
    .map((design) => {
      const price = formatPrice(design.suggestedPrice);
      return `| [${design.name}](${getDesignHref(design)}/) | ${design.dimensions} | ${price ? `${price} MXN` : "Cotizar"} |`;
    });

  if (rows.length === 0) {
    return null;
  }

  return ["| Pieza | Medidas | Desde |", "| --- | --- | --- |", ...rows].join("\n");
}

export function buildMaterialGuide(designs: SiteDesign[]): string {
  const sizeTable = buildSizeTable(designs);

  return [
    "## Materiales y técnicas",
    ...TECHNIQUE_DEFINITIONS,
    "### Comparativa de materiales",
    buildMaterialTable(designs),
    ...(sizeTable
      ? [
          "### Tamaños y precios de referencia",
          "Medidas y precios por pieza de algunos diseños del catálogo, para que te des una idea del tamaño.",
          sizeTable,
        ]
      : []),
  ].join("\n\n");
}

export type MaterialGuideData = {
  definitions: string[];
  materials: Array<MaterialRow & { catalogCount: number }>;
  sizeReferences: Array<{ name: string; url: string; dimensions: string; suggestedPrice: number | null }>;
};

// Lo mismo que buildMaterialGuide, como datos (sin Markdown) para public/mcp/materials.json.
export function buildMaterialGuideData(designs: SiteDesign[]): MaterialGuideData {
  const counts = countByMaterial(designs);
  return {
    definitions: TECHNIQUE_DEFINITIONS.map((text) => text.replace(/\*\*/gu, "")),
    materials: MATERIAL_ROWS.map((row) => ({ ...row, catalogCount: counts.get(row.name) ?? 0 })),
    sizeReferences: getSizeReferences(designs).map((design) => ({
      name: design.name ?? "",
      url: `${getDesignHref(design)}/`,
      dimensions: design.dimensions,
      suggestedPrice: formatPrice(design.suggestedPrice) ? design.suggestedPrice : null,
    })),
  };
}
