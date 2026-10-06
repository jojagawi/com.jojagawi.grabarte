// Prompts de IA editables (tabla AiPrompts, Administrar › Prompts de IA).
// Sin dependencias: lo usan el seed, la API y el panel.

export const PRODUCT_THUMBNAIL_PROMPT_KEY = "product-thumbnail";

// Modelo de Gemini que edita imágenes a partir de una foto (entrada imagen + texto, salida imagen).
export const DEFAULT_THUMBNAIL_IMAGE_MODEL = "gemini-2.5-flash-image";

// Variables que se reemplazan con los datos del diseño al generar.
export const PROMPT_VARIABLES = [
  { token: "{{nombre}}", description: "Nombre del diseño" },
  { token: "{{descripcion}}", description: "Descripción corta (o la SEO / larga si no hay)" },
  { token: "{{material}}", description: "Material del diseño (por ejemplo MDF)" },
  { token: "{{categorias}}", description: "Categorías separadas por coma" },
  { token: "{{dimensiones}}", description: "Dimensiones registradas" },
] as const;

export const DEFAULT_PRODUCT_THUMBNAIL_PROMPT = `Crea una fotografía de producto cuadrada (1:1) para la tienda en línea de InspiraArte a partir de la imagen adjunta.

Producto: {{nombre}}
Descripción: {{descripcion}}
Material: {{material}}
Ocasión o categorías: {{categorias}}
Dimensiones: {{dimensiones}}

Reglas:
- Conserva exactamente el diseño del producto de la imagen: forma, proporciones, cortes, grabados, textos y detalles. No inventes piezas ni cambies el diseño.
- Si la imagen es un archivo de diseño (vector, plano o vista técnica), muéstralo como la pieza física terminada en {{material}}, con grosor, bordes de corte láser y textura realistas.
- Coloca el producto centrado, ocupando cerca del 70% del encuadre, sobre un fondo limpio y cálido (madera clara o tonos crema) con una ambientación sutil relacionada con la ocasión que no compita con el producto.
- Iluminación suave de estudio, sombras naturales, enfoque nítido y aspecto de fotografía real, atractivo para el cliente final.
- No agregues texto, logotipos, marcas de agua, precios ni bordes.`;

export interface PromptVariables {
  nombre: string;
  descripcion: string;
  material: string;
  categorias: string;
  dimensiones: string;
}

// Reemplaza {{variable}}; las que no tengan valor quedan como "no especificado".
export function fillPromptTemplate(template: string, variables: PromptVariables): string {
  return template.replace(/\{\{\s*([a-z]+)\s*\}\}/gi, (match, name: string) => {
    const key = name.toLowerCase() as keyof PromptVariables;
    if (!(key in variables)) {
      return match;
    }
    return variables[key]?.trim() || "no especificado";
  });
}
