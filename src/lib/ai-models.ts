// Catálogo de modelos de IA (tabla AiModels). Tipos y etiquetas compartidos por
// el panel, las rutas de API y los selectores del editor.

export const AI_PROVIDERS = ["gemini", "openrouter", "huggingface", "pollinations"] as const;
export type AiProvider = (typeof AI_PROVIDERS)[number];

export const AI_PROVIDER_LABELS: Record<AiProvider, string> = {
  gemini: "Gemini",
  openrouter: "OpenRouter",
  huggingface: "Hugging Face",
  pollinations: "Pollinations.ai",
};

// Proveedores que usa el asistente SEO (analizar imagen → texto). Los demás solo
// se usan para generar imágenes (miniaturas).
export const SEO_AI_PROVIDERS = ["gemini", "openrouter"] as const;

export function isSeoAiProvider(value: string): boolean {
  return (SEO_AI_PROVIDERS as readonly string[]).includes(value);
}

// Proveedores con integración para editar imágenes (miniaturas): ver image-generation.server.ts.
export const IMAGE_EDIT_PROVIDERS = ["gemini", "huggingface", "pollinations"] as const;

export function isImageEditProvider(value: string): boolean {
  return (IMAGE_EDIT_PROVIDERS as readonly string[]).includes(value);
}

// Opción del combo "Modelo" del editor: para qué botón sirve cada modelo.
export interface EditorModelOption {
  modelId: string;
  label: string;
  // Asistente SEO: proveedor SEO, analiza imagen y responde texto.
  canSeo: boolean;
  // Miniatura: proveedor con integración de imagen, entrada y salida de imagen.
  canThumb: boolean;
}

// Modelo de imagen guardado en AiPrompts.model como "proveedor:modelo"
// (por ejemplo "huggingface:Qwen/Qwen-Image-Edit"). Un valor sin proveedor
// conocido al inicio es de Gemini (formato anterior).
export function encodeImageModelRef(provider: AiProvider, modelId: string): string {
  return `${provider}:${modelId}`;
}

export function decodeImageModelRef(value: string): { provider: AiProvider; modelId: string } {
  const separator = value.indexOf(":");
  const prefix = separator > 0 ? value.slice(0, separator) : "";
  if (isAiProvider(prefix)) {
    return { provider: prefix, modelId: value.slice(separator + 1) };
  }
  return { provider: "gemini", modelId: value };
}

export const AI_PRICING_VALUES = ["free", "free-tier", "paid", "unknown"] as const;
export type AiPricing = (typeof AI_PRICING_VALUES)[number];

export const AI_PRICING_LABELS: Record<AiPricing, string> = {
  free: "Gratis",
  "free-tier": "Gratis con límites",
  paid: "De pago",
  unknown: "Por confirmar",
};

export function isAiProvider(value: string): value is AiProvider {
  return (AI_PROVIDERS as readonly string[]).includes(value);
}

export function isAiPricing(value: string): value is AiPricing {
  return (AI_PRICING_VALUES as readonly string[]).includes(value);
}

export interface AdminAiModel {
  id: number;
  provider: AiProvider;
  modelId: string;
  displayName: string;
  description: string | null;
  inputText: boolean;
  inputImage: boolean;
  outputText: boolean;
  outputImage: boolean;
  pricing: AiPricing;
  pricingManual: boolean;
  contextLength: number | null;
  isEnabled: boolean;
  isDefault: boolean;
  isAvailable: boolean;
  source: "official" | "manual";
  lastSyncedAt: string | null;
}
