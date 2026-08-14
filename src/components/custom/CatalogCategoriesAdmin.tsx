"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { CategoryIcon } from "@/components/custom/category-icon-registry";
import {
  CATEGORY_ICON_OPTIONS,
  normalizeCategoryIcon,
  resolveCategoryIconKey,
} from "@/lib/category-icon-definitions";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CategoryItem = {
  id: number;
  name: string;
  icon: string | null;
  status: number;
  createdAt: string;
};

type CategoryApiPayload = {
  id: number;
  name: string;
  icon: string | null;
  status: number;
  createdAt: string;
  created: boolean;
};

interface CatalogCategoriesAdminProps {
  initialCategories: CategoryItem[];
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function CatalogCategoriesAdmin({ initialCategories }: CatalogCategoriesAdminProps) {
  const defaultIcon = "fa/FaHome";
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createName, setCreateName] = useState("");
  const [createIcon, setCreateIcon] = useState(defaultIcon);
  const [createStatus, setCreateStatus] = useState<"1" | "0">("1");

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState(defaultIcon);
  const [editStatus, setEditStatus] = useState<"1" | "0">("1");

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" })),
    [categories],
  );

  async function handleCreateCategory() {
    const name = createName.trim();
    if (!name) {
      setErrorMessage("El nombre es obligatorio.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon: normalizeCategoryIcon(createIcon), status: Number(createStatus) }),
      });

      const payload = (await response.json()) as CategoryApiPayload | { error?: string };
      if (!response.ok || !("id" in payload)) {
        setErrorMessage(("error" in payload && payload.error) || "No se pudo guardar la categoria.");
        return;
      }

      setCategories((previous) => {
        const current = previous.find((item) => item.id === payload.id);
        if (current) {
          return previous.map((item) => (
            item.id === payload.id ? { ...item, name: payload.name, icon: payload.icon, status: payload.status } : item
          ));
        }

        return [...previous, {
          id: payload.id,
          name: payload.name,
          icon: payload.icon,
          status: payload.status,
          createdAt: payload.createdAt,
        }];
      });

      setIsCreateOpen(false);
    } catch {
      setErrorMessage("No se pudo guardar la categoria.");
    } finally {
      setIsSaving(false);
    }
  }

  function openEditModal(category: CategoryItem) {
    setEditId(category.id);
    setEditName(category.name);
    setEditIcon(resolveCategoryIconKey(category.icon, category.name));
    setEditStatus(String(category.status === 1 ? 1 : 0) as "1" | "0");
    setErrorMessage(null);
    setIsEditOpen(true);
  }

  async function handleEditCategory() {
    if (!editId) {
      setErrorMessage("Categoria no valida.");
      return;
    }

    const name = editName.trim();
    if (!name) {
      setErrorMessage("El nombre es obligatorio.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, name, icon: normalizeCategoryIcon(editIcon), status: Number(editStatus) }),
      });

      const payload = (await response.json()) as CategoryApiPayload | { error?: string };
      if (!response.ok || !("id" in payload)) {
        setErrorMessage(("error" in payload && payload.error) || "No se pudo actualizar la categoria.");
        return;
      }

      setCategories((previous) => previous.map((item) => (
        item.id === payload.id ? { ...item, name: payload.name, icon: payload.icon, status: payload.status } : item
      )));

      setIsEditOpen(false);
    } catch {
      setErrorMessage("No se pudo actualizar la categoria.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Catalogo de categorias</h1>
          <p className="text-sm text-muted-foreground">Administra las categorias visibles del sitio.</p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setErrorMessage(null);
            setCreateName("");
            setCreateIcon(defaultIcon);
            setCreateStatus("1");
            setIsCreateOpen(true);
          }}
        >
          <Plus className="size-4" />
          Agregar categoria
        </Button>
      </div>

      <div className="rounded-lg border bg-white p-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Icono</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>
                  <CategoryIcon iconKey={category.icon} categoryName={category.name} className="size-4 text-[#4290A3]" />
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.status === 1 ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>{formatDate(category.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button type="button" variant="outline" size="sm" onClick={() => openEditModal(category)}>
                    <Pencil className="size-4" />
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {sortedCategories.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                  No hay categorias registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar categoria</DialogTitle>
            <DialogDescription>Crea una nueva categoria para el catalogo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nombre de la categoria" value={createName} onChange={(event) => setCreateName(event.target.value)} maxLength={120} />
            <label className="flex flex-col gap-1 text-sm text-foreground">
              Icono
              <select
                value={createIcon}
                onChange={(event) => setCreateIcon(event.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                {CATEGORY_ICON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-2 rounded-md border border-border p-2 text-sm text-muted-foreground">
              Preview: <CategoryIcon iconKey={createIcon} categoryName={createName} className="size-4 text-[#4290A3]" /> <span>{createIcon}</span>
            </div>
            <label className="flex flex-col gap-1 text-sm text-foreground">
              Status
              <select value={createStatus} onChange={(event) => setCreateStatus(event.target.value as "1" | "0")} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </label>
            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isSaving}>Cancelar</Button>
            <Button type="button" onClick={handleCreateCategory} disabled={isSaving}>{isSaving ? "Guardando..." : "Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar categoria</DialogTitle>
            <DialogDescription>Actualiza el nombre, icono y status de la categoria.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nombre de la categoria" value={editName} onChange={(event) => setEditName(event.target.value)} maxLength={120} />
            <label className="flex flex-col gap-1 text-sm text-foreground">
              Icono
              <select
                value={editIcon}
                onChange={(event) => setEditIcon(event.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                {CATEGORY_ICON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-2 rounded-md border border-border p-2 text-sm text-muted-foreground">
              Preview: <CategoryIcon iconKey={editIcon} categoryName={editName} className="size-4 text-[#4290A3]" /> <span>{editIcon}</span>
            </div>
            <label className="flex flex-col gap-1 text-sm text-foreground">
              Status
              <select value={editStatus} onChange={(event) => setEditStatus(event.target.value as "1" | "0")} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </label>
            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>Cancelar</Button>
            <Button type="button" onClick={handleEditCategory} disabled={isSaving}>{isSaving ? "Guardando..." : "Actualizar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}


