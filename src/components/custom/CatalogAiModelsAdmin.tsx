"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type AdminAiModel,
  AI_PRICING_LABELS,
  AI_PRICING_VALUES,
  AI_PROVIDER_LABELS,
  AI_PROVIDERS,
  type AiPricing,
  type AiProvider,
  isSeoAiProvider,
} from "@/lib/ai-models";

type SyncResult = {
  provider: AiProvider;
  official: number;
  created: number;
  updated: number;
  unavailable: number;
  error: string | null;
};

interface CatalogAiModelsAdminProps {
  initialModels: AdminAiModel[];
}

const MAX_VISIBLE_ROWS = 150;
const selectClassName = "h-9 rounded-md border border-input bg-transparent px-3 text-sm";

const pricingChipClassName: Record<AiPricing, string> = {
  free: "bg-inspirarte-green/10 text-foreground",
  "free-tier": "bg-primary/10 text-foreground",
  paid: "bg-amber-100 text-foreground",
  unknown: "bg-muted text-muted-foreground",
};

function formatTokens(value: number | null): string {
  if (!value) {
    return "—";
  }
  return value >= 1_000_000 ? `${(value / 1_000_000).toFixed(value % 1_000_000 ? 1 : 0)}M` : `${Math.round(value / 1000)}K`;
}

function CapabilityChips({ text, image }: { text: boolean; image: boolean }) {
  return (
    <span className="flex flex-wrap gap-1">
      {text && <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">Texto</span>}
      {image && <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-foreground">Imagen</span>}
      {!text && !image && <span className="text-xs text-muted-foreground">Otro</span>}
    </span>
  );
}

export function CatalogAiModelsAdmin({ initialModels }: CatalogAiModelsAdminProps) {
  const [models, setModels] = useState<AdminAiModel[]>(initialModels);
  const [provider, setProvider] = useState<AiProvider | "all">("all");
  const [query, setQuery] = useState("");
  const [onlyEnabled, setOnlyEnabled] = useState(initialModels.some((model) => model.isEnabled));
  const [needsImageInput, setNeedsImageInput] = useState(false);
  const [needsImageOutput, setNeedsImageOutput] = useState(false);
  const [pricingFilter, setPricingFilter] = useState<AiPricing | "all">("all");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<SyncResult[] | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newModel, setNewModel] = useState({
    provider: "gemini" as AiProvider,
    modelId: "",
    displayName: "",
    inputImage: true,
    outputText: true,
    outputImage: false,
    pricing: "unknown" as AiPricing,
  });

  const lastSyncedAt = useMemo(() => {
    const dates = models.map((model) => model.lastSyncedAt).filter((value): value is string => Boolean(value));
    return dates.length > 0 ? dates.sort().at(-1) ?? null : null;
  }, [models]);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return models
      .filter((model) => provider === "all" || model.provider === provider)
      .filter((model) => !onlyEnabled || model.isEnabled)
      .filter((model) => !needsImageInput || model.inputImage)
      .filter((model) => !needsImageOutput || model.outputImage)
      .filter((model) => pricingFilter === "all" || model.pricing === pricingFilter)
      .filter(
        (model) =>
          !text || model.modelId.toLowerCase().includes(text) || model.displayName.toLowerCase().includes(text),
      )
      .sort(
        (a, b) =>
          Number(b.isDefault) - Number(a.isDefault) ||
          Number(b.isEnabled) - Number(a.isEnabled) ||
          a.displayName.localeCompare(b.displayName, "es"),
      );
  }, [models, provider, onlyEnabled, needsImageInput, needsImageOutput, pricingFilter, query]);

  function replaceModel(updated: AdminAiModel) {
    setModels((current) =>
      current.map((model) => {
        if (model.id === updated.id) {
          return updated;
        }
        // Solo hay un predeterminado por proveedor.
        if (updated.isDefault && model.provider === updated.provider && model.isDefault) {
          return { ...model, isDefault: false };
        }
        return model;
      }),
    );
  }

  async function updateModel(id: number, changes: Partial<Pick<AdminAiModel, "isEnabled" | "isDefault" | "pricing">>) {
    setSavingId(id);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/admin/ai-models", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...changes }),
      });
      const payload = (await response.json().catch(() => null)) as (AdminAiModel & { error?: string }) | null;
      if (!response.ok || !payload?.id) {
        throw new Error(payload?.error || "No se pudo guardar el modelo.");
      }
      replaceModel(payload);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo guardar el modelo.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleSync() {
    setIsSyncing(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/admin/ai-models/sync", { method: "POST" });
      const payload = (await response.json().catch(() => null)) as
        | { results?: SyncResult[]; models?: AdminAiModel[]; error?: string }
        | null;
      if (!response.ok || !payload?.models) {
        throw new Error(payload?.error || "No se pudo actualizar la lista de modelos.");
      }
      setModels(payload.models);
      setSyncResults(payload.results ?? null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo actualizar la lista de modelos.");
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleAddModel() {
    setErrorMessage(null);
    try {
      const response = await fetch("/api/admin/ai-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newModel, inputText: true }),
      });
      const payload = (await response.json().catch(() => null)) as (AdminAiModel & { error?: string }) | null;
      if (!response.ok || !payload?.id) {
        throw new Error(payload?.error || "No se pudo agregar el modelo.");
      }
      setModels((current) => [...current, payload]);
      setNewModel((current) => ({ ...current, modelId: "", displayName: "" }));
      setShowAddForm(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo agregar el modelo.");
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Modelos de IA</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Los modelos habilitados aparecen en el editor: el asistente SEO usa los de Gemini y OpenRouter que
            analizan imagen y responden texto; las miniaturas usan los que editan imagen (Gemini, Hugging Face o
            Pollinations.ai). El predeterminado se selecciona al abrir el editor.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {lastSyncedAt
              ? `Última actualización: ${new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lastSyncedAt))}`
              : "Aún no se ha descargado la lista oficial."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setShowAddForm((current) => !current)}>
            <Plus className="size-4" />
            Agregar a mano
          </Button>
          <Button type="button" onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            {isSyncing ? "Actualizando..." : "Actualizar modelos oficiales"}
          </Button>
        </div>
      </div>

      {syncResults && (
        <div role="status" className="mb-4 space-y-1 rounded-lg border bg-white p-3 text-sm">
          {syncResults.map((result) => (
            <p key={result.provider} className={result.error ? "text-destructive" : "text-foreground"}>
              <span className="font-medium">{AI_PROVIDER_LABELS[result.provider]}:</span>{" "}
              {result.error
                ? result.error
                : `${result.official} oficiales · ${result.created} nuevos · ${result.updated} actualizados${result.unavailable ? ` · ${result.unavailable} ya no disponibles` : ""}`}
            </p>
          ))}
          <p className="text-xs text-muted-foreground">
            Los modelos nuevos llegan deshabilitados. En Gemini, el costo se deduce (los de imagen son de pago) y
            puede corregirse; en OpenRouter viene de su lista de precios.
          </p>
        </div>
      )}

      {errorMessage && <p className="mb-4 text-sm text-destructive">{errorMessage}</p>}

      {showAddForm && (
        <div className="mb-6 space-y-3 rounded-lg border bg-white p-4">
          <p className="text-sm font-medium text-foreground">Agregar modelo a mano</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-1 text-sm">
              Proveedor
              <select
                className={selectClassName}
                value={newModel.provider}
                onChange={(event) => setNewModel({ ...newModel, provider: event.target.value as AiProvider })}
              >
                {AI_PROVIDERS.map((value) => (
                  <option key={value} value={value}>
                    {AI_PROVIDER_LABELS[value]}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="new-model-id" className="flex flex-col gap-1 text-sm">
              Identificador
              <Input
                id="new-model-id"
                value={newModel.modelId}
                placeholder="gemini-2.5-flash"
                onChange={(event) => setNewModel({ ...newModel, modelId: event.target.value })}
              />
            </label>
            <label htmlFor="new-model-name" className="flex flex-col gap-1 text-sm">
              Nombre
              <Input
                id="new-model-name"
                value={newModel.displayName}
                onChange={(event) => setNewModel({ ...newModel, displayName: event.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Costo
              <select
                className={selectClassName}
                value={newModel.pricing}
                onChange={(event) => setNewModel({ ...newModel, pricing: event.target.value as AiPricing })}
              >
                {AI_PRICING_VALUES.map((value) => (
                  <option key={value} value={value}>
                    {AI_PRICING_LABELS[value]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={newModel.inputImage}
                onChange={(event) => setNewModel({ ...newModel, inputImage: event.target.checked })}
              />
              Entrada de imagen
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={newModel.outputText}
                onChange={(event) => setNewModel({ ...newModel, outputText: event.target.checked })}
              />
              Salida de texto
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={newModel.outputImage}
                onChange={(event) => setNewModel({ ...newModel, outputImage: event.target.checked })}
              />
              Salida de imagen
            </label>
          </div>
          <Button type="button" onClick={handleAddModel} disabled={!newModel.modelId.trim()}>
            Agregar y habilitar
          </Button>
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
        <select
          aria-label="Proveedor"
          className={selectClassName}
          value={provider}
          onChange={(event) => setProvider(event.target.value as AiProvider | "all")}
        >
          <option value="all">Todos los proveedores</option>
          {AI_PROVIDERS.map((value) => (
            <option key={value} value={value}>
              {AI_PROVIDER_LABELS[value]}
            </option>
          ))}
        </select>
        <Input
          type="search"
          aria-label="Buscar modelo"
          placeholder="Buscar modelo"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-9 w-56"
        />
        <select
          aria-label="Costo"
          className={selectClassName}
          value={pricingFilter}
          onChange={(event) => setPricingFilter(event.target.value as AiPricing | "all")}
        >
          <option value="all">Cualquier costo</option>
          {AI_PRICING_VALUES.map((value) => (
            <option key={value} value={value}>
              {AI_PRICING_LABELS[value]}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={onlyEnabled}
            onChange={(event) => setOnlyEnabled(event.target.checked)}
          />
          Solo habilitados
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={needsImageInput}
            onChange={(event) => setNeedsImageInput(event.target.checked)}
          />
          Entrada de imagen
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={needsImageOutput}
            onChange={(event) => setNeedsImageOutput(event.target.checked)}
          />
          Salida de imagen
        </label>
        <span className="text-muted-foreground">
          {filtered.length} de {models.length}
        </span>
      </div>

      <div className="rounded-lg border bg-white p-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Modelo</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Salida</TableHead>
              <TableHead>Costo</TableHead>
              <TableHead className="text-right">Contexto</TableHead>
              <TableHead>Habilitado</TableHead>
              <TableHead>Predeterminado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.slice(0, MAX_VISIBLE_ROWS).map((model) => {
              // El predeterminado es del asistente SEO: proveedor SEO, analiza imagen y responde texto.
              const canBeDefault = isSeoAiProvider(model.provider) && model.inputImage && model.outputText;
              return (
                <TableRow key={model.id} className={model.isAvailable ? undefined : "text-muted-foreground"}>
                  <TableCell className="max-w-80">
                    <p className="font-medium text-foreground">{model.displayName}</p>
                    <code className="text-xs text-muted-foreground break-all">{model.modelId}</code>
                    <span className="mt-1 flex flex-wrap gap-1">
                      {!model.isAvailable && (
                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs">Ya no disponible</span>
                      )}
                      {model.source === "manual" && (
                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs">Agregado a mano</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>{AI_PROVIDER_LABELS[model.provider]}</TableCell>
                  <TableCell>
                    <CapabilityChips text={model.inputText} image={model.inputImage} />
                  </TableCell>
                  <TableCell>
                    <CapabilityChips text={model.outputText} image={model.outputImage} />
                  </TableCell>
                  <TableCell>
                    <select
                      aria-label={`Costo de ${model.displayName}`}
                      className={`h-8 rounded-md border-0 px-2 text-xs ${pricingChipClassName[model.pricing]}`}
                      value={model.pricing}
                      disabled={savingId === model.id}
                      onChange={(event) => updateModel(model.id, { pricing: event.target.value as AiPricing })}
                    >
                      {AI_PRICING_VALUES.map((value) => (
                        <option key={value} value={value}>
                          {AI_PRICING_LABELS[value]}
                        </option>
                      ))}
                    </select>
                    {model.pricingManual && <p className="mt-1 text-xs text-muted-foreground">Editado a mano</p>}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatTokens(model.contextLength)}</TableCell>
                  <TableCell>
                    <input
                      type="checkbox"
                      aria-label={`Habilitar ${model.displayName}`}
                      className="size-4 accent-primary"
                      checked={model.isEnabled}
                      disabled={savingId === model.id}
                      onChange={(event) => updateModel(model.id, { isEnabled: event.target.checked })}
                    />
                  </TableCell>
                  <TableCell>
                    {model.isDefault ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
                        <Star aria-hidden="true" className="size-3.5 fill-primary text-primary" />
                        Predeterminado
                      </span>
                    ) : (
                      canBeDefault && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={savingId === model.id}
                          onClick={() => updateModel(model.id, { isDefault: true })}
                        >
                          Usar por defecto
                        </Button>
                      )
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                  {models.length === 0
                    ? "El catálogo está vacío. Usa «Actualizar modelos oficiales» para descargar la lista."
                    : "Ningún modelo coincide con los filtros."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {filtered.length > MAX_VISIBLE_ROWS && (
          <p className="px-1 pt-3 text-xs text-muted-foreground">
            Se muestran {MAX_VISIBLE_ROWS} de {filtered.length}. Usa la búsqueda o los filtros para encontrar el resto.
          </p>
        )}
      </div>
    </section>
  );
}
