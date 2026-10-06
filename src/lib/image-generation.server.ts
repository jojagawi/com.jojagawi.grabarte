import { InferenceClient } from "@huggingface/inference";
import type { AiProvider } from "@/lib/ai-models";

// Edición de imagen con IA (foto de origen + prompt → imagen nueva) para las miniaturas.
// Un adaptador por proveedor; todos reciben un PNG y devuelven la imagen generada.
// Claves en el environment: GEMINI_API_KEY, HF_TOKEN y POLLINATIONS_API_KEY.

export interface ImageEditInput {
  provider: AiProvider;
  modelId: string;
  prompt: string;
  sourcePng: Buffer;
}

function requireKey(name: string, provider: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Falta ${name} en el environment para generar imágenes con ${provider}.`);
  }
  return value;
}

// Mensajes legibles para los rechazos más comunes (sin saldo, cuota, clave).
function describeHttpError(provider: string, status: number, body: string): string {
  if (status === 401 || status === 403) {
    return `${provider} rechazó la clave (${status}). Revisa que sea válida y tenga permiso para generar imágenes.`;
  }
  if (status === 402) {
    return `${provider} indica saldo o créditos insuficientes (402). Recarga créditos o elige otro modelo.`;
  }
  if (status === 429) {
    return `${provider} rechazó por cuota o límite de uso (429). Espera a que se renueve o elige otro modelo.`;
  }
  return `Error de ${provider} (${status}): ${body.slice(0, 400) || "sin detalle"}`;
}

async function editWithGemini({ modelId, prompt, sourcePng }: ImageEditInput): Promise<Buffer> {
  const apiKey = requireKey("GEMINI_API_KEY", "Gemini");
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }, { inlineData: { mimeType: "image/png", data: sourcePng.toString("base64") } }],
          },
        ],
        generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "1:1" } },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    if (response.status === 429) {
      throw new Error(
        `Gemini rechazó la solicitud por cuota (429). El modelo de imágenes ${modelId} no tiene nivel gratuito: ` +
          "activa la facturación del proyecto en Google AI Studio o elige otro proveedor.",
      );
    }
    throw new Error(describeHttpError("Gemini", response.status, body));
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      finishReason?: string;
      content?: { parts?: Array<{ inlineData?: { data?: string }; text?: string }> };
    }>;
    promptFeedback?: { blockReason?: string };
  };
  const candidate = payload.candidates?.[0];
  const imageData = candidate?.content?.parts?.find((part) => part.inlineData?.data)?.inlineData?.data;
  if (!imageData) {
    const reason = payload.promptFeedback?.blockReason || candidate?.finishReason || "sin imagen en la respuesta";
    throw new Error(`Gemini no devolvió una imagen (${reason}).`);
  }
  return Buffer.from(imageData, "base64");
}

// Hugging Face Inference Providers: la librería oficial elige el proveedor activo
// (fal-ai, Replicate, WaveSpeed…) para el modelo y devuelve la imagen.
async function editWithHuggingFace({ modelId, prompt, sourcePng }: ImageEditInput): Promise<Buffer> {
  const client = new InferenceClient(requireKey("HF_TOKEN", "Hugging Face"));
  try {
    const image = await client.imageToImage({
      provider: "auto",
      model: modelId,
      inputs: new Blob([new Uint8Array(sourcePng)], { type: "image/png" }),
      parameters: { prompt },
    });
    return Buffer.from(await image.arrayBuffer());
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = Number(message.match(/\b(40[1-3]|429)\b/)?.[1]);
    throw new Error(Number.isFinite(status) ? describeHttpError("Hugging Face", status, message) : `Hugging Face: ${message}`);
  }
}

// Pollinations: endpoint de edición compatible con OpenAI. Se cobra en Pollen
// (los modelos que no son "paid_only" aceptan el Quest Pollen gratuito de la cuenta).
async function editWithPollinations({ modelId, prompt, sourcePng }: ImageEditInput): Promise<Buffer> {
  const apiKey = requireKey("POLLINATIONS_API_KEY", "Pollinations");
  const response = await fetch("https://gen.pollinations.ai/v1/images/edits", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: modelId,
      prompt,
      image: `data:image/png;base64,${sourcePng.toString("base64")}`,
      n: 1,
      response_format: "b64_json",
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(describeHttpError("Pollinations", response.status, body));
  }

  const payload = (await response.json()) as { data?: Array<{ b64_json?: string; url?: string }> };
  const result = payload.data?.[0];
  if (result?.b64_json) {
    return Buffer.from(result.b64_json, "base64");
  }
  if (result?.url) {
    const image = await fetch(result.url);
    if (image.ok) {
      return Buffer.from(await image.arrayBuffer());
    }
  }
  throw new Error("Pollinations no devolvió una imagen.");
}

const IMAGE_EDITORS: Partial<Record<AiProvider, (input: ImageEditInput) => Promise<Buffer>>> = {
  gemini: editWithGemini,
  huggingface: editWithHuggingFace,
  pollinations: editWithPollinations,
};

export async function generateProductImage(input: ImageEditInput): Promise<Buffer> {
  const editor = IMAGE_EDITORS[input.provider];
  if (!editor) {
    throw new Error(`El proveedor ${input.provider} no está integrado para generar imágenes.`);
  }
  return editor(input);
}
