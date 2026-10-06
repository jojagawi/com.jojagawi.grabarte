import { prisma } from "@/lib/prisma";
import {
  type AdminAiModel,
  AI_PROVIDER_LABELS,
  AI_PROVIDERS,
  type AiPricing,
  type AiProvider,
  type EditorModelOption,
  encodeImageModelRef,
  isAiPricing,
  isAiProvider,
  isImageEditProvider,
  isSeoAiProvider,
} from "@/lib/ai-models";

type OfficialModel = {
  provider: AiProvider;
  modelId: string;
  displayName: string;
  description: string | null;
  inputText: boolean;
  inputImage: boolean;
  outputText: boolean;
  outputImage: boolean;
  pricing: AiPricing;
  contextLength: number | null;
};

// --- Listas oficiales -------------------------------------------------------

// Gemini no publica modalidades ni precios en su API: se deducen del nombre.
// Solo se importan los que sirven para generateContent (lo que usa el sitio).
async function fetchGeminiModels(): Promise<OfficialModel[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Falta GEMINI_API_KEY para leer la lista de modelos de Gemini.");
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000&key=${apiKey}`);
  if (!response.ok) {
    throw new Error(`Gemini respondió ${response.status} al listar modelos.`);
  }

  const payload = (await response.json()) as {
    models?: Array<{
      name: string;
      displayName?: string;
      description?: string;
      inputTokenLimit?: number;
      supportedGenerationMethods?: string[];
    }>;
  };

  return (payload.models ?? [])
    .filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
    .map((model) => {
      const modelId = model.name.replace(/^models\//, "");
      const outputImage = /image/i.test(modelId);
      const audioOnly = /tts|native-audio/i.test(modelId);
      return {
        provider: "gemini" as const,
        modelId,
        displayName: model.displayName?.trim() || modelId,
        description: model.description?.trim().slice(0, 500) || null,
        inputText: true,
        inputImage: /^(gemini-|gemma-3)/i.test(modelId) && !audioOnly,
        outputText: !audioOnly,
        outputImage,
        // Los de imagen no tienen nivel gratuito; el resto depende del plan del proyecto.
        pricing: outputImage ? ("paid" as const) : ("unknown" as const),
        contextLength: model.inputTokenLimit ?? null,
      };
    });
}

// OpenRouter publica modalidades y precios exactos (precio 0 = gratis).
async function fetchOpenRouterModels(): Promise<OfficialModel[]> {
  const response = await fetch("https://openrouter.ai/api/v1/models");
  if (!response.ok) {
    throw new Error(`OpenRouter respondió ${response.status} al listar modelos.`);
  }

  const payload = (await response.json()) as {
    data?: Array<{
      id: string;
      name?: string;
      description?: string;
      context_length?: number;
      architecture?: { input_modalities?: string[]; output_modalities?: string[] };
      pricing?: Record<string, string>;
    }>;
  };

  return (payload.data ?? []).map((model) => {
    const inputs = model.architecture?.input_modalities ?? ["text"];
    const outputs = model.architecture?.output_modalities ?? ["text"];
    const prices = Object.values(model.pricing ?? {}).map(Number).filter(Number.isFinite);
    return {
      provider: "openrouter" as const,
      modelId: model.id,
      displayName: model.name?.trim() || model.id,
      description: model.description?.trim().slice(0, 500) || null,
      inputText: inputs.includes("text"),
      inputImage: inputs.includes("image"),
      outputText: outputs.includes("text"),
      outputImage: outputs.includes("image"),
      pricing: prices.length > 0 && prices.every((price) => price === 0) ? ("free" as const) : ("paid" as const),
      contextLength: model.context_length ?? null,
    };
  });
}

// Pollinations publica modalidades y si el modelo exige Pollen pagado (paid_only).
// Los demás se pagan con Quest Pollen, que la cuenta recibe gratis: "gratis con límites".
async function fetchPollinationsModels(): Promise<OfficialModel[]> {
  const response = await fetch("https://gen.pollinations.ai/image/models");
  if (!response.ok) {
    throw new Error(`Pollinations respondió ${response.status} al listar modelos.`);
  }

  const payload = (await response.json()) as Array<{
    name: string;
    title?: string;
    description?: string;
    community?: boolean;
    paid_only?: boolean;
    input_modalities?: string[];
    output_modalities?: string[];
    supported_endpoints?: string[];
    health?: { status?: string };
  }>;

  return payload
    // Solo imágenes estables: sin modelos de la comunidad (sin garantía) ni de video.
    .filter((model) => !model.community && model.output_modalities?.includes("image"))
    .map((model) => {
      const inputs = model.input_modalities ?? ["text"];
      const canEdit = inputs.includes("image") && (model.supported_endpoints ?? []).includes("/v1/images/edits");
      const health = model.health?.status && model.health.status !== "healthy" ? ` Estado: ${model.health.status}.` : "";
      return {
        provider: "pollinations" as const,
        modelId: model.name,
        displayName: model.title?.trim() || model.name,
        description: `${model.description?.trim() ?? ""}${health}`.trim().slice(0, 500) || null,
        inputText: inputs.includes("text"),
        inputImage: canEdit,
        outputText: false,
        outputImage: true,
        pricing: model.paid_only ? ("paid" as const) : ("free-tier" as const),
        contextLength: null,
      };
    });
}

// Hugging Face: modelos de edición (image-to-image) con un proveedor de inferencia activo.
// La cuenta gratuita trae créditos mensuales: "gratis con límites". La licencia va en la
// descripción porque varias (FLUX dev) no permiten uso comercial.
const HUGGINGFACE_MODEL_LIMIT = 60;

async function fetchHuggingFaceModels(): Promise<OfficialModel[]> {
  const url =
    "https://huggingface.co/api/models?pipeline_tag=image-to-image&inference_provider=all&sort=likes" +
    `&limit=${HUGGINGFACE_MODEL_LIMIT}&expand%5B%5D=inferenceProviderMapping&expand%5B%5D=tags&expand%5B%5D=likes`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Hugging Face respondió ${response.status} al listar modelos.`);
  }

  const payload = (await response.json()) as Array<{
    id: string;
    tags?: string[];
    inferenceProviderMapping?: Array<{ provider: string; status: string; task?: string }>;
  }>;

  return payload
    .filter((model) => !/nsfw/i.test(model.id))
    .map((model) => {
      const live = (model.inferenceProviderMapping ?? []).filter((mapping) => mapping.status === "live");
      return { model, live };
    })
    .filter(({ live }) => live.length > 0)
    .map(({ model, live }) => {
      const license = model.tags?.find((tag) => tag.startsWith("license:"))?.slice("license:".length);
      return {
        provider: "huggingface" as const,
        modelId: model.id,
        displayName: model.id.split("/").pop() ?? model.id,
        description: `Licencia: ${license ?? "no indicada"}. Servido por: ${live.map((mapping) => mapping.provider).join(", ")}.`,
        inputText: true,
        inputImage: true,
        outputText: false,
        outputImage: true,
        pricing: "free-tier" as const,
        contextLength: null,
      };
    });
}

// Modelos que ya estaban configurados en el environment: al importarlos por primera
// vez quedan habilitados (y el principal como predeterminado) para no cambiar el editor.
function legacyEnvModels(provider: AiProvider): { enabled: Set<string>; defaultModel: string | null } {
  const list = (value: string | undefined) =>
    String(value ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  if (provider === "gemini") {
    const defaultModel = process.env.SEO_AI_GEMINI_MODEL?.trim() || null;
    return {
      enabled: new Set([
        ...list(process.env.SEO_AI_GEMINI_MODELS),
        ...list(defaultModel ?? ""),
        ...list(process.env.SEO_AI_GEMINI_IMAGE_MODEL),
      ]),
      defaultModel,
    };
  }

  if (provider !== "openrouter") {
    return { enabled: new Set(), defaultModel: null };
  }

  const defaultModel = process.env.SEO_AI_OPENROUTER_MODEL?.trim() || null;
  return {
    enabled: new Set([...list(process.env.SEO_AI_OPENROUTER_MODELS), ...list(defaultModel ?? "")]),
    defaultModel,
  };
}

const OFFICIAL_FETCHERS: Record<AiProvider, () => Promise<OfficialModel[]>> = {
  gemini: fetchGeminiModels,
  openrouter: fetchOpenRouterModels,
  huggingface: fetchHuggingFaceModels,
  pollinations: fetchPollinationsModels,
};

export interface SyncResult {
  provider: AiProvider;
  official: number;
  created: number;
  updated: number;
  unavailable: number;
  error: string | null;
}

async function syncProvider(provider: AiProvider): Promise<SyncResult> {
  const result: SyncResult = { provider, official: 0, created: 0, updated: 0, unavailable: 0, error: null };

  let official: OfficialModel[];
  try {
    official = await OFFICIAL_FETCHERS[provider]();
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    return result;
  }
  result.official = official.length;

  const existing = await prisma.aiModels.findMany({ where: { provider } });
  const existingById = new Map(existing.map((model) => [model.modelId, model]));
  const legacy = legacyEnvModels(provider);
  let hasDefault = existing.some((model) => model.isDefault);
  const now = new Date();

  for (const model of official) {
    const current = existingById.get(model.modelId);
    const capabilities = {
      displayName: model.displayName,
      description: model.description,
      inputText: model.inputText,
      inputImage: model.inputImage,
      outputText: model.outputText,
      outputImage: model.outputImage,
      contextLength: model.contextLength,
      isAvailable: true,
      lastSyncedAt: now,
    };

    if (current) {
      // Lo editado en el panel (habilitado, predeterminado, precio manual) se respeta.
      await prisma.aiModels.update({
        where: { id: current.id },
        data: { ...capabilities, ...(current.pricingManual ? {} : { pricing: model.pricing }) },
      });
      result.updated += 1;
      continue;
    }

    const isDefault = !hasDefault && legacy.defaultModel === model.modelId;
    hasDefault ||= isDefault;
    await prisma.aiModels.create({
      data: {
        provider,
        modelId: model.modelId,
        ...capabilities,
        pricing: model.pricing,
        isEnabled: legacy.enabled.has(model.modelId),
        isDefault,
        source: "official",
      },
    });
    result.created += 1;
  }

  // Los oficiales que ya no aparecen se marcan como no disponibles (no se borran).
  const officialIds = new Set(official.map((model) => model.modelId));
  const missing = existing.filter(
    (model) => model.source === "official" && model.isAvailable && !officialIds.has(model.modelId),
  );
  if (missing.length > 0) {
    await prisma.aiModels.updateMany({
      where: { id: { in: missing.map((model) => model.id) } },
      data: { isAvailable: false },
    });
  }
  result.unavailable = missing.length;

  return result;
}

export async function syncOfficialModels(): Promise<SyncResult[]> {
  return Promise.all(AI_PROVIDERS.map((provider) => syncProvider(provider)));
}

// --- Consultas -------------------------------------------------------------

type AiModelRow = Awaited<ReturnType<typeof prisma.aiModels.findMany>>[number];

export function toAdminAiModel(model: AiModelRow): AdminAiModel {
  return {
    id: model.id,
    provider: isAiProvider(model.provider) ? model.provider : "gemini",
    modelId: model.modelId,
    displayName: model.displayName,
    description: model.description,
    inputText: model.inputText,
    inputImage: model.inputImage,
    outputText: model.outputText,
    outputImage: model.outputImage,
    pricing: isAiPricing(model.pricing) ? model.pricing : "unknown",
    pricingManual: model.pricingManual,
    contextLength: model.contextLength,
    isEnabled: model.isEnabled,
    isDefault: model.isDefault,
    isAvailable: model.isAvailable,
    source: model.source === "manual" ? "manual" : "official",
    lastSyncedAt: model.lastSyncedAt?.toISOString() ?? null,
  };
}

export interface ImageModelOption {
  // "proveedor:modelo", lo que se guarda en AiPrompts.model.
  value: string;
  label: string;
}

// Modelos que editan una imagen (entrada imagen → salida imagen) de cualquier proveedor
// con integración: miniaturas de producto.
export async function getImageModelOptions(): Promise<ImageModelOption[]> {
  const models = await prisma.aiModels.findMany({
    where: { isEnabled: true, isAvailable: true, inputImage: true, outputImage: true },
    orderBy: [{ provider: "asc" }, { displayName: "asc" }],
    select: { provider: true, modelId: true, displayName: true, pricing: true },
  });
  return models
    .filter((model) => isAiProvider(model.provider) && model.provider !== "openrouter")
    .map((model) => {
      const provider = model.provider as AiProvider;
      return {
        value: encodeImageModelRef(provider, model.modelId),
        label: `${AI_PROVIDER_LABELS[provider]} · ${model.displayName} (${model.modelId})`,
      };
    });
}

// Combo "IA para generar" + "Modelo" del editor: modelos habilitados de los cuatro proveedores
// que sirven para el asistente SEO, para la miniatura o para ambos. Predeterminado primero.
export async function getEditorModelOptions(): Promise<Record<AiProvider, EditorModelOption[]>> {
  const models = await prisma.aiModels.findMany({
    where: { isEnabled: true, isAvailable: true, inputImage: true },
    orderBy: [{ isDefault: "desc" }, { displayName: "asc" }],
    select: { provider: true, modelId: true, displayName: true, outputText: true, outputImage: true },
  });

  const options = Object.fromEntries(AI_PROVIDERS.map((provider) => [provider, []])) as unknown as Record<
    AiProvider,
    EditorModelOption[]
  >;

  for (const model of models) {
    if (!isAiProvider(model.provider)) {
      continue;
    }
    const canSeo = isSeoAiProvider(model.provider) && model.outputText;
    const canThumb = isImageEditProvider(model.provider) && model.outputImage;
    if (!canSeo && !canThumb) {
      continue;
    }
    const uses = [canSeo ? "texto" : null, canThumb ? "imagen" : null].filter(Boolean).join(" + ");
    options[model.provider].push({
      modelId: model.modelId,
      label: `${model.displayName} · genera ${uses}`,
      canSeo,
      canThumb,
    });
  }

  return options;
}
