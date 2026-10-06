"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PROMPT_VARIABLES } from "@/lib/ai-prompts";

type AiPromptItem = {
  key: string;
  name: string;
  description: string | null;
  prompt: string;
  model: string | null;
  updatedAt: string;
  defaultPrompt: string | null;
};

interface AiPromptsAdminProps {
  prompts: AiPromptItem[];
  // Modelos habilitados que editan imagen (Administrar › Modelos de IA), como "proveedor:modelo".
  imageModels: Array<{ value: string; label: string }>;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function PromptEditor({
  item,
  imageModels,
}: {
  item: AiPromptItem;
  imageModels: Array<{ value: string; label: string }>;
}) {
  const [prompt, setPrompt] = useState(item.prompt);
  const [model, setModel] = useState(item.model ?? "");
  const [savedAt, setSavedAt] = useState(item.updatedAt);
  const [savedPrompt, setSavedPrompt] = useState(item.prompt);
  const [savedModel, setSavedModel] = useState(item.model ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const isDirty = prompt !== savedPrompt || model !== savedModel;
  const promptId = `prompt-${item.key}`;
  const modelId = `model-${item.key}`;

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/ai-prompts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: item.key, prompt, model }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { prompt?: string; model?: string | null; updatedAt?: string; error?: string }
        | null;
      if (!response.ok || !payload?.updatedAt) {
        throw new Error(payload?.error || "No se pudo guardar el prompt.");
      }
      setSavedPrompt(payload.prompt ?? prompt);
      setSavedModel(payload.model ?? "");
      setSavedAt(payload.updatedAt);
      setMessage({ ok: true, text: "Prompt guardado. Se usa en la siguiente generación." });
    } catch (error) {
      setMessage({ ok: false, text: error instanceof Error ? error.message : "No se pudo guardar el prompt." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className="space-y-4 rounded-lg border bg-white p-5">
      <header>
        <h2 className="text-lg font-semibold text-foreground">{item.name}</h2>
        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
        <p className="mt-1 text-xs text-muted-foreground">
          Clave <code>{item.key}</code> · Última edición {formatDate(savedAt)}
        </p>
      </header>

      <div className="space-y-2">
        <label htmlFor={promptId} className="text-sm font-medium text-foreground">
          Prompt
        </label>
        <Textarea
          id={promptId}
          value={prompt}
          maxLength={8000}
          onChange={(event) => setPrompt(event.target.value)}
          className="min-h-80 font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Variables que se reemplazan con los datos del producto:{" "}
          {PROMPT_VARIABLES.map((variable, index) => (
            <span key={variable.token}>
              {index > 0 && " · "}
              <code>{variable.token}</code> {variable.description.toLowerCase()}
            </span>
          ))}
          .
        </p>
      </div>

      <div className="max-w-sm space-y-2">
        <label htmlFor={modelId} className="text-sm font-medium text-foreground">
          Modelo para generar la imagen
        </label>
        <select
          id={modelId}
          value={model}
          onChange={(event) => setModel(event.target.value)}
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="">Primer modelo de imagen habilitado</option>
          {/* El guardado se conserva aunque ya no esté habilitado. */}
          {model && !imageModels.some((option) => option.value === model) && (
            <option value={model}>{model} (no habilitado)</option>
          )}
          {imageModels.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Aparecen los modelos habilitados que editan imagen (Gemini, Hugging Face o Pollinations.ai) en
          Administrar › Modelos de IA.
        </p>
      </div>

      {message && (
        <p role="status" className={message.ok ? "text-sm text-foreground" : "text-sm text-destructive"}>
          {message.text}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={handleSave} disabled={isSaving || !isDirty || !prompt.trim()}>
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSaving || !isDirty}
          onClick={() => {
            setPrompt(savedPrompt);
            setModel(savedModel);
            setMessage(null);
          }}
        >
          Descartar cambios
        </Button>
        {item.defaultPrompt && (
          <Button
            type="button"
            variant="ghost"
            disabled={isSaving || prompt === item.defaultPrompt}
            onClick={() => setPrompt(item.defaultPrompt ?? prompt)}
          >
            Restaurar texto original
          </Button>
        )}
      </div>
    </article>
  );
}

export function AiPromptsAdmin({ prompts, imageModels }: AiPromptsAdminProps) {
  return (
    <section className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Prompts de IA</h1>
        <p className="text-sm text-muted-foreground">
          Instrucciones que recibe la IA. Los cambios aplican a la siguiente generación.
        </p>
      </div>

      {prompts.length === 0 ? (
        <p className="rounded-lg border bg-white p-5 text-sm text-muted-foreground">
          No hay prompts registrados. Corre <code>pnpm run prisma:seed</code> para cargar los iniciales.
        </p>
      ) : (
        prompts.map((item) => <PromptEditor key={item.key} item={item} imageModels={imageModels} />)
      )}
    </section>
  );
}
