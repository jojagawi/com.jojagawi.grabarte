"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, Pencil, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type AdminSeason,
  DEFAULT_SEASON_LEAD_DAYS,
  formatSeasonMonths,
  getActiveSeasons,
  joinSpanishList,
  MIN_SEASON_DESIGNS,
  MONTH_NAMES,
  normalizeCategoryName,
} from "@/lib/seasons";

type CategoryOption = {
  id: number;
  name: string;
  // Diseños publicados (showInSite) en la categoría: los que puede usar la vitrina.
  designIds: number[];
};

type SeasonDraft = {
  id: number | null;
  name: string;
  description: string;
  startMonth: number;
  endMonth: number;
  leadDays: string;
  sortOrder: string;
  status: "1" | "0";
  categoryIds: number[];
};

interface CatalogSeasonsAdminProps {
  todayIso: string;
  initialSeasons: AdminSeason[];
  categories: CategoryOption[];
}

const selectClassName = "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm";

function emptyDraft(nextSortOrder: number): SeasonDraft {
  return {
    id: null,
    name: "",
    description: "",
    startMonth: 1,
    endMonth: 1,
    leadDays: String(DEFAULT_SEASON_LEAD_DAYS),
    sortOrder: String(nextSortOrder),
    status: "1",
    categoryIds: [],
  };
}

function draftFromSeason(season: AdminSeason): SeasonDraft {
  return {
    id: season.id,
    name: season.name,
    description: season.description ?? "",
    startMonth: season.startMonth,
    endMonth: season.endMonth,
    leadDays: String(season.leadDays),
    sortOrder: String(season.sortOrder),
    status: season.status === 1 ? "1" : "0",
    categoryIds: season.categoryIds,
  };
}

// Fecha en que la temporada empieza a mostrarse este año (primer mes menos el adelanto).
function formatShowsFrom(startMonth: number, leadDays: number, year: number): string {
  const date = new Date(year, startMonth - 1, 1);
  date.setDate(date.getDate() - leadDays);
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" }).format(date);
}

function sortSeasons(seasons: AdminSeason[]): AdminSeason[] {
  return [...seasons].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
}

export function CatalogSeasonsAdmin({ todayIso, initialSeasons, categories }: CatalogSeasonsAdminProps) {
  const [seasons, setSeasons] = useState<AdminSeason[]>(() => sortSeasons(initialSeasons));
  const [draft, setDraft] = useState<SeasonDraft | null>(null);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const today = useMemo(() => new Date(todayIso), [todayIso]);
  const categoriesById = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories]);

  function countDesigns(categoryIds: number[]): number {
    return countDesignsFor(categoryIds, categoriesById);
  }

  // Lo mismo que calcula la portada en el build, con los datos de esta tabla.
  const todayPreview = useMemo(() => {
    const active = getActiveSeasons(
      seasons
        .filter((season) => season.status === 1)
        .map((season) => ({ ...season, label: season.name })),
      today,
    );
    const withDesigns = active.filter((season) => countDesignsFor(season.categoryIds, categoriesById) > 0);
    const total = countDesignsFor(
      withDesigns.flatMap((season) => season.categoryIds),
      categoriesById,
    );
    return { names: withDesigns.map((season) => season.label), total };
  }, [seasons, today, categoriesById]);

  const filteredCategories = useMemo(() => {
    const query = normalizeCategoryName(categoryQuery);
    const selected = new Set(draft?.categoryIds ?? []);
    return categories
      .filter((category) => !query || normalizeCategoryName(category.name).includes(query))
      .sort((a, b) => Number(selected.has(b.id)) - Number(selected.has(a.id)));
  }, [categories, categoryQuery, draft?.categoryIds]);

  function openCreate() {
    const nextSortOrder = Math.max(0, ...seasons.map((season) => season.sortOrder)) + 1;
    setDraft(emptyDraft(nextSortOrder));
    setCategoryQuery("");
    setErrorMessage(null);
  }

  function openEdit(season: AdminSeason) {
    setDraft(draftFromSeason(season));
    setCategoryQuery("");
    setErrorMessage(null);
  }

  function toggleCategory(categoryId: number) {
    setDraft((current) =>
      current
        ? {
            ...current,
            categoryIds: current.categoryIds.includes(categoryId)
              ? current.categoryIds.filter((id) => id !== categoryId)
              : [...current.categoryIds, categoryId],
          }
        : current,
    );
  }

  async function handleSave() {
    if (!draft) {
      return;
    }
    if (!draft.name.trim()) {
      setErrorMessage("El nombre es obligatorio.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/seasons", {
        method: draft.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draft.id ?? undefined,
          name: draft.name.trim(),
          description: draft.description.trim(),
          startMonth: draft.startMonth,
          endMonth: draft.endMonth,
          leadDays: Number(draft.leadDays),
          sortOrder: Number(draft.sortOrder),
          status: Number(draft.status),
          categoryIds: draft.categoryIds,
        }),
      });

      const payload = (await response.json().catch(() => null)) as AdminSeason | { error?: string } | null;
      if (!response.ok || !payload || !("id" in payload)) {
        setErrorMessage((payload && "error" in payload && payload.error) || "No se pudo guardar la temporada.");
        return;
      }

      setSeasons((current) =>
        sortSeasons(
          current.some((season) => season.id === payload.id)
            ? current.map((season) => (season.id === payload.id ? payload : season))
            : [...current, payload],
        ),
      );
      setDraft(null);
    } catch {
      setErrorMessage("No se pudo guardar la temporada.");
    } finally {
      setIsSaving(false);
    }
  }

  const draftDesignCount = draft ? countDesigns(draft.categoryIds) : 0;
  const crossesYear = draft ? draft.endMonth < draft.startMonth : false;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Temporadas de la portada</h1>
          <p className="text-sm text-muted-foreground">
            Qué ocasión muestra la vitrina según el mes y de qué categorías toma las piezas. Los cambios se ven
            en el siguiente build del sitio.
          </p>
        </div>

        <Button type="button" onClick={openCreate}>
          <Plus className="size-4" />
          Agregar temporada
        </Button>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg border bg-white p-4 text-sm">
        <CalendarDays aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
        {todayPreview.total >= MIN_SEASON_DESIGNS ? (
          <p>
            <span className="font-medium text-foreground">Hoy la portada muestra:</span> Para{" "}
            {joinSpanishList(todayPreview.names)}, con {todayPreview.total} piezas públicas.
          </p>
        ) : (
          <p>
            <span className="font-medium text-foreground">Hoy ninguna temporada tiene piezas suficientes</span>{" "}
            ({todayPreview.total} de {MIN_SEASON_DESIGNS} mínimas), así que la portada usa el respaldo «Diseños del
            catálogo».
          </p>
        )}
      </div>

      <div className="rounded-lg border bg-white p-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">Orden</TableHead>
              <TableHead>Temporada</TableHead>
              <TableHead>Meses</TableHead>
              <TableHead>Se muestra desde</TableHead>
              <TableHead>Categorías</TableHead>
              <TableHead className="text-right">Piezas</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seasons.map((season) => {
              const designCount = countDesigns(season.categoryIds);
              return (
                <TableRow key={season.id} className={season.status === 1 ? undefined : "text-muted-foreground"}>
                  <TableCell className="tabular-nums">{season.sortOrder}</TableCell>
                  <TableCell className="font-medium">{season.name}</TableCell>
                  <TableCell>{formatSeasonMonths(season.startMonth, season.endMonth)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatShowsFrom(season.startMonth, season.leadDays, today.getFullYear())}
                    <span className="text-muted-foreground"> ({season.leadDays} días antes)</span>
                  </TableCell>
                  <TableCell>
                    {season.categoryIds.length === 0 ? (
                      <span className="text-muted-foreground">Sin categorías</span>
                    ) : (
                      <span className="flex flex-wrap gap-1">
                        {season.categoryIds.map((categoryId) => (
                          <span key={categoryId} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {categoriesById.get(categoryId)?.name ?? `#${categoryId} (inactiva)`}
                          </span>
                        ))}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span className="inline-flex items-center gap-1">
                      {designCount < MIN_SEASON_DESIGNS && season.status === 1 && (
                        <AlertTriangle aria-hidden="true" className="size-3.5 text-amber-600" />
                      )}
                      {designCount}
                      {designCount < MIN_SEASON_DESIGNS && season.status === 1 && (
                        <span className="sr-only"> (menos de {MIN_SEASON_DESIGNS}, no basta por sí sola)</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>{season.status === 1 ? "Activa" : "Inactiva"}</TableCell>
                  <TableCell className="text-right">
                    <Button type="button" variant="outline" size="sm" onClick={() => openEdit(season)}>
                      <Pencil className="size-4" />
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {seasons.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                  No hay temporadas registradas. Corre <code>pnpm run prisma:seed</code> para cargar las iniciales.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <p className="mt-3 flex items-center gap-1 px-1 text-xs text-muted-foreground">
          <AlertTriangle aria-hidden="true" className="size-3.5 text-amber-600" />
          Menos de {MIN_SEASON_DESIGNS} piezas públicas: la temporada solo aparece si se combina con otra activa
          en las mismas fechas.
        </p>
      </div>

      <Dialog open={draft !== null} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Editar temporada" : "Agregar temporada"}</DialogTitle>
            <DialogDescription>
              Define los meses de la ocasión y las categorías de las que la vitrina toma las piezas.
            </DialogDescription>
          </DialogHeader>

          {draft && (
            <div className="space-y-4">
              <label htmlFor="season-name" className="flex flex-col gap-1 text-sm text-foreground">
                Nombre
                <Input
                  id="season-name"
                  value={draft.name}
                  maxLength={60}
                  placeholder="Ej. Día de la madre"
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                />
              </label>

              <label htmlFor="season-description" className="flex flex-col gap-1 text-sm text-foreground">
                Descripción
                <Textarea
                  id="season-description"
                  value={draft.description}
                  maxLength={600}
                  className="min-h-24"
                  placeholder="Texto introductorio de la página de la temporada"
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                />
                <span className="text-xs text-muted-foreground">
                  Se muestra en /temporada/{draft.id ? seasons.find((season) => season.id === draft.id)?.slug : "…"} y
                  en la descripción para buscadores. {draft.description.length}/600
                </span>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-foreground">
                  Mes de inicio
                  <select
                    className={selectClassName}
                    value={draft.startMonth}
                    onChange={(event) => setDraft({ ...draft, startMonth: Number(event.target.value) })}
                  >
                    {MONTH_NAMES.map((month, index) => (
                      <option key={month} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm text-foreground">
                  Mes de fin
                  <select
                    className={selectClassName}
                    value={draft.endMonth}
                    onChange={(event) => setDraft({ ...draft, endMonth: Number(event.target.value) })}
                  >
                    {MONTH_NAMES.map((month, index) => (
                      <option key={month} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {crossesYear && (
                <p className="text-xs text-muted-foreground">
                  Cruza el año: de {MONTH_NAMES[draft.startMonth - 1]} a {MONTH_NAMES[draft.endMonth - 1]} del año
                  siguiente.
                </p>
              )}

              <div className="grid gap-3 sm:grid-cols-3">
                <label htmlFor="season-lead-days" className="flex flex-col gap-1 text-sm text-foreground">
                  Días de adelanto
                  <Input
                    id="season-lead-days"
                    type="number"
                    min={0}
                    max={90}
                    value={draft.leadDays}
                    onChange={(event) => setDraft({ ...draft, leadDays: event.target.value })}
                  />
                </label>
                <label htmlFor="season-sort-order" className="flex flex-col gap-1 text-sm text-foreground">
                  Orden
                  <Input
                    id="season-sort-order"
                    type="number"
                    value={draft.sortOrder}
                    onChange={(event) => setDraft({ ...draft, sortOrder: event.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-foreground">
                  Estado
                  <select
                    className={selectClassName}
                    value={draft.status}
                    onChange={(event) => setDraft({ ...draft, status: event.target.value as "1" | "0" })}
                  >
                    <option value="1">Activa</option>
                    <option value="0">Inactiva</option>
                  </select>
                </label>
              </div>
              {Number.isInteger(Number(draft.leadDays)) && Number(draft.leadDays) >= 0 && (
                <p className="text-xs text-muted-foreground">
                  Se empieza a mostrar el{" "}
                  {formatShowsFrom(draft.startMonth, Number(draft.leadDays), today.getFullYear())}.
                </p>
              )}

              <fieldset className="space-y-2">
                <legend className="text-sm text-foreground">
                  Categorías ({draft.categoryIds.length} seleccionadas ·{" "}
                  <span className={draftDesignCount < MIN_SEASON_DESIGNS ? "text-amber-700" : undefined}>
                    {draftDesignCount} piezas públicas
                  </span>
                  )
                </legend>
                <Input
                  type="search"
                  placeholder="Buscar categoría"
                  aria-label="Buscar categoría"
                  value={categoryQuery}
                  onChange={(event) => setCategoryQuery(event.target.value)}
                />
                <div className="max-h-56 overflow-y-auto rounded-md border border-border">
                  {filteredCategories.map((category) => (
                    <label
                      key={category.id}
                      className="flex cursor-pointer items-center gap-2 border-b border-border px-3 py-2 text-sm last:border-b-0 hover:bg-muted/60"
                    >
                      <input
                        type="checkbox"
                        className="size-4 accent-primary"
                        checked={draft.categoryIds.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                      />
                      <span className="flex-1">{category.name}</span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {category.designIds.length} {category.designIds.length === 1 ? "pieza" : "piezas"}
                      </span>
                    </label>
                  ))}
                  {filteredCategories.length === 0 && (
                    <p className="px-3 py-4 text-center text-sm text-muted-foreground">Sin coincidencias.</p>
                  )}
                </div>
              </fieldset>

              {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDraft(null)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Guardando..." : draft?.id ? "Actualizar" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function countDesignsFor(categoryIds: number[], categoriesById: Map<number, CategoryOption>): number {
  const designIds = new Set<number>();
  for (const categoryId of categoryIds) {
    for (const designId of categoriesById.get(categoryId)?.designIds ?? []) {
      designIds.add(designId);
    }
  }
  return designIds.size;
}
