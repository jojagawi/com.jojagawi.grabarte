"use client";

import { useMemo, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SeoRewriteMode = "complement" | "rewrite-soft" | "rewrite-hard";

type SeoWriterProfile = {
  id: number;
  name: string;
  tone: string;
  audience: string | null;
  defaultMode: SeoRewriteMode;
  instructions: string;
  isDefault: boolean;
};

type SeoWriterProfilesManagerProps = {
  initialProfiles: SeoWriterProfile[];
};

const MODE_LABELS: Record<SeoRewriteMode, string> = {
  complement: "Complementar contenido",
  "rewrite-soft": "Reescritura suave",
  "rewrite-hard": "Reescritura completa",
};

export function SeoWriterProfilesManager({ initialProfiles }: SeoWriterProfilesManagerProps) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [selectedId, setSelectedId] = useState<number>(initialProfiles[0]?.id ?? 0);
  const [name, setName] = useState(initialProfiles[0]?.name ?? "");
  const [tone, setTone] = useState(initialProfiles[0]?.tone ?? "");
  const [audience, setAudience] = useState(initialProfiles[0]?.audience ?? "");
  const [defaultMode, setDefaultMode] = useState<SeoRewriteMode>(
    initialProfiles[0]?.defaultMode ?? "rewrite-soft",
  );
  const [instructions, setInstructions] = useState(initialProfiles[0]?.instructions ?? "");
  const [isDefault, setIsDefault] = useState(initialProfiles[0]?.isDefault ?? false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedId) ?? null,
    [profiles, selectedId],
  );

  const loadProfileInForm = (profile: SeoWriterProfile) => {
    setSelectedId(profile.id);
    setName(profile.name);
    setTone(profile.tone);
    setAudience(profile.audience ?? "");
    setDefaultMode(profile.defaultMode);
    setInstructions(profile.instructions);
    setIsDefault(profile.isDefault);
    setMessage(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!selectedProfile) {
      setError("Selecciona un perfil para editar.");
      return;
    }

    if (!name.trim() || !tone.trim() || !instructions.trim()) {
      setError("Nombre, tono e instrucciones son obligatorios.");
      return;
    }

    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/seo-writer-profiles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedProfile.id,
          name: name.trim(),
          tone: tone.trim(),
          audience: audience.trim(),
          defaultMode,
          instructions: instructions.trim(),
          isDefault,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | (SeoWriterProfile & { error?: string })
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || "No se pudo actualizar el perfil");
      }

      setProfiles((prev) => {
        const updated = prev.map((profile) => {
          if (payload?.isDefault) {
            if (profile.id === payload.id) return payload;
            return { ...profile, isDefault: false };
          }
          return profile.id === payload?.id ? payload : profile;
        });

        return updated.sort((a, b) => a.name.localeCompare(b.name));
      });

      if (payload) {
        loadProfileInForm(payload);
      }

      setMessage("Perfil actualizado correctamente.");
    } catch (caughtError) {
      console.error(caughtError);
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  if (profiles.length === 0) {
    return (
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-muted/50 rounded-2xl p-8">
            <p className="text-sm text-muted-foreground">
              No hay perfiles de redaccion activos. Crea uno desde la edicion de producto.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <span className="inline-block px-4 py-1 rounded-full bg-[#00B003]/10 text-[#00B003] text-sm font-medium mb-4">
          Administracion
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
          Perfiles de <span className="text-[#4290A3]">redaccion SEO</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Visualiza y edita el perfil y modo de redaccion que usa la IA para productos.
        </p>

        <div className="bg-muted/50 rounded-2xl p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="seo-profile-selector">Perfil</Label>
            <select
              id="seo-profile-selector"
              value={String(selectedId)}
              onChange={(e) => {
                const profile = profiles.find((item) => String(item.id) === e.target.value);
                if (profile) {
                  loadProfileInForm(profile);
                }
              }}
              className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
            >
              {profiles.map((profile) => (
                <option key={profile.id} value={String(profile.id)}>
                  {profile.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-profile-name">Nombre del perfil</Label>
            <Input
              id="seo-profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-profile-tone">Tono</Label>
            <Input
              id="seo-profile-tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-profile-audience">Audiencia</Label>
            <Input
              id="seo-profile-audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-profile-mode">Modo de redaccion por defecto</Label>
            <select
              id="seo-profile-mode"
              value={defaultMode}
              onChange={(e) => setDefaultMode(e.target.value as SeoRewriteMode)}
              className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
            >
              {Object.entries(MODE_LABELS).map(([mode, label]) => (
                <option key={mode} value={mode}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-profile-instructions">Instrucciones</Label>
            <Textarea
              id="seo-profile-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="min-h-40"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="size-4"
            />
            Marcar como perfil predeterminado
          </label>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-[#4290A3] hover:bg-[#1FA4A7] text-white h-12"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios del perfil
              </>
            )}
          </Button>

          {message && <p className="text-sm text-[#00B003]">{message}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </div>
    </section>
  );
}

