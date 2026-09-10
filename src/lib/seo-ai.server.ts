type SeoRewriteMode = "complement" | "rewrite-soft" | "rewrite-hard";

type SeoDraftContext = {
  name: string;
  shortDescription: string;
  seoDescription: string;
  longDescription: string;
  keywords: string;
  features: string;
  benefits: string;
  useCases: string;
  audience: string;
  faq: string;
  imageDescription: string;
  productionTime: string;
  shippingTime: string;
  availability: string;
  dimensions: string;
  notes: string;
  author: string;
  material: string;
  categories: string[];
};

type SeoWriterProfile = {
  id: number;
  name: string;
  tone: string;
  audience: string | null;
  instructions: string;
};

type GenerateSeoDraftInput = {
  mode: SeoRewriteMode;
  profile: SeoWriterProfile;
  context: SeoDraftContext;
  imageBase64: string;
  imageMimeType: string;
};

type GeneratedSeoDraft = {
  title: string;
  shortDescription: string;
  keywords: string;
  seoDescription: string;
  longDescription: string;
  features: string;
  benefits: string;
  useCases: string;
  audience: string;
  faq: string;
  imageDescription: string;
  productionTime: string;
  shippingTime: string;
  availability: string;
  dimensions: string;
};

interface SeoGenerationProvider {
  generateDraft(input: GenerateSeoDraftInput): Promise<GeneratedSeoDraft>;
}

function buildModeInstruction(mode: SeoRewriteMode) {
  if (mode === "complement") {
    return "Mantener la intencion actual del contenido y complementar solo lo que falte para claridad SEO.";
  }

  if (mode === "rewrite-soft") {
    return "Reescribir conservando concepto principal, mejorando estructura, claridad comercial y SEO.";
  }

  return "Reescritura total basada en la imagen y contexto del producto, manteniendo tono del perfil.";
}

function buildPrompt(input: GenerateSeoDraftInput) {
  const categoryText = input.context.categories.length > 0 ? input.context.categories.join(", ") : "sin categoria";

  return [
    "Eres redactor SEO de catalogo ecommerce.",
    "Debes devolver EXCLUSIVAMENTE JSON valido, sin markdown y sin texto adicional.",
    "",
    "Perfil de redactor:",
    `- Nombre perfil: ${input.profile.name}`,
    `- Tono: ${input.profile.tone}`,
    `- Audiencia: ${input.profile.audience ?? "general"}`,
    `- Instrucciones: ${input.profile.instructions}`,
    "",
    "Modo de trabajo:",
    `- ${buildModeInstruction(input.mode)}`,
    "",
    "Contexto actual del formulario (puedes complementar o reescribir):",
    `- Titulo actual: ${input.context.name || ""}`,
    `- Descripcion corta actual: ${input.context.shortDescription || ""}`,
    `- Keywords actuales: ${input.context.keywords || ""}`,
    `- Meta descripcion actual: ${input.context.seoDescription || ""}`,
    `- Descripcion larga actual: ${input.context.longDescription || ""}`,
    `- Caracteristicas: ${input.context.features || ""}`,
    `- Beneficios: ${input.context.benefits || ""}`,
    `- Casos de uso: ${input.context.useCases || ""}`,
    `- Audiencia: ${input.context.audience || ""}`,
    `- FAQ: ${input.context.faq || ""}`,
    `- Descripcion de imagen: ${input.context.imageDescription || ""}`,
    `- Tiempo de produccion: ${input.context.productionTime || ""}`,
    `- Tiempo de envio: ${input.context.shippingTime || ""}`,
    `- Disponibilidad: ${input.context.availability || ""}`,
    `- Dimensiones: ${input.context.dimensions || ""}`,
    `- Material: ${input.context.material || ""}`,
    `- Categorias: ${categoryText}`,
    `- Autor: ${input.context.author || ""}`,
    `- Notas internas: ${input.context.notes || ""}`,
    "",
    "Tambien completa estos campos del bloque Contexto SEO y GEO cuando sea util, manteniendo textos breves, claros y accionables:",
    "- features",
    "- benefits",
    "- useCases",
    "- audience",
    "- faq",
    "- imageDescription",
    "- productionTime",
    "- shippingTime",
    "- availability",
    "- dimensions",
    "",
    "Reglas de salida:",
    "- title: maximo 70 caracteres, claro y comercial.",
    "- shortDescription: 120-220 caracteres, directo para catalogo.",
    "- keywords: lista separada por comas, 8 a 12 keywords, sin hashtags.",
    "- seoDescription: 140-160 caracteres, natural, sin relleno.",
    "- longDescription: 400-900 caracteres, detalle util, beneficios y usos.",
    "- features, benefits y useCases: frases o bullets cortos, orientados a valor y contexto de busqueda.",
    "- audience: publico objetivo concreto.",
    "- faq: una o varias preguntas y respuestas breves si aplica.",
    "- imageDescription: descripcion sintetica de la imagen para contexto visual.",
    "- productionTime, shippingTime, availability y dimensions: valores concisos y consistentes con el producto.",
    "- Evita afirmaciones no verificables.",
    "- Todo en espanol.",
    "",
    "Devuelve exactamente este formato JSON:",
    '{"title":"","shortDescription":"","keywords":"","seoDescription":"","longDescription":"","features":"","benefits":"","useCases":"","audience":"","faq":"","imageDescription":"","productionTime":"","shippingTime":"","availability":"","dimensions":""}',
  ].join("\n");
}

function parseJsonCandidate(rawText: string): unknown {
  const trimmed = rawText.trim();
  if (!trimmed) {
    throw new Error("La IA no devolvio contenido");
  }

  const directStart = trimmed.indexOf("{");
  const directEnd = trimmed.lastIndexOf("}");

  if (directStart === -1 || directEnd === -1 || directEnd <= directStart) {
    throw new Error("No se encontro JSON en la respuesta de la IA");
  }

  const jsonText = trimmed.slice(directStart, directEnd + 1);
  return JSON.parse(jsonText);
}

function normalizeText(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim();
}

function sanitizeGeneratedDraft(value: unknown): GeneratedSeoDraft {
  if (!value || typeof value !== "object") {
    throw new Error("La IA devolvio un formato invalido");
  }

  const payload = value as Record<string, unknown>;

  return {
    title: normalizeText(payload.title).slice(0, 120),
    shortDescription: normalizeText(payload.shortDescription).slice(0, 500),
    keywords: normalizeText(payload.keywords).slice(0, 600),
    seoDescription: normalizeText(payload.seoDescription).slice(0, 320),
    longDescription: normalizeText(payload.longDescription).slice(0, 4000),
    features: normalizeText(payload.features).slice(0, 4000),
    benefits: normalizeText(payload.benefits).slice(0, 4000),
    useCases: normalizeText(payload.useCases).slice(0, 4000),
    audience: normalizeText(payload.audience).slice(0, 500),
    faq: normalizeText(payload.faq).slice(0, 4000),
    imageDescription: normalizeText(payload.imageDescription).slice(0, 2000),
    productionTime: normalizeText(payload.productionTime).slice(0, 200),
    shippingTime: normalizeText(payload.shippingTime).slice(0, 200),
    availability: normalizeText(payload.availability).slice(0, 200),
    dimensions: normalizeText(payload.dimensions).slice(0, 200),
  };
}

class GeminiSeoProvider implements SeoGenerationProvider {
  async generateDraft(input: GenerateSeoDraftInput): Promise<GeneratedSeoDraft> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Falta GEMINI_API_KEY para generar contenido SEO");
    }

    const model = process.env.SEO_AI_GEMINI_MODEL || "gemini-2.5-flash";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json",
          },
          contents: [
            {
              role: "user",
              parts: [
                { text: buildPrompt(input) },
                {
                  inlineData: {
                    mimeType: input.imageMimeType,
                    data: input.imageBase64,
                  },
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Error de Gemini (${response.status}): ${body || "sin detalle"}`);
    }

    const payload = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const text = payload.candidates?.[0]?.content?.parts?.find((part) => typeof part.text === "string")?.text;

    if (!text) {
      throw new Error("Gemini no devolvio texto utilizable");
    }

    const parsed = parseJsonCandidate(text);
    return sanitizeGeneratedDraft(parsed);
  }
}

function getProvider(): SeoGenerationProvider {
  const provider = (process.env.SEO_AI_PROVIDER || "gemini").toLowerCase();

  switch (provider) {
    case "gemini":
      return new GeminiSeoProvider();
    default:
      throw new Error(`Proveedor SEO no soportado: ${provider}`);
  }
}

export type { GeneratedSeoDraft, SeoDraftContext, SeoRewriteMode, SeoWriterProfile };

export async function generateSeoDraftFromImage(input: GenerateSeoDraftInput) {
  const provider = getProvider();
  return provider.generateDraft(input);
}

