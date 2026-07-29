"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2, Save, Upload, X } from "lucide-react";
import { sendGTMEvent } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CategoryMultiSelect } from "@/components/custom/CategoryMultiSelect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CategoryOption = {
  id: number;
  name: string;
};

type MaterialOption = {
  id: number;
  name: string;
  slug: string;
};

type ExistingFile = {
  id: number;
  filePath: string | null;
  typeName: string;
  mimeType: string;
};

type EditableDesign = {
  id: number;
  name: string;
  description: string;
  author: string;
  notes: string;
  materialId: number | null;
  status: number;
  isTested: number;
  isCustomizable: number;
  showInHome: number;
  showInSite: number;
  numberMdfTables: number;
  timeMachine: number;
  suggestedPrice: number | null;
  minimumPrice: number | null;
  categoryIds: number[];
  files: ExistingFile[];
};

type EditDesignProps = {
  categories: CategoryOption[];
  materials: MaterialOption[];
  design: EditableDesign;
};

function getMediaUrl(path: string | null): string | null {
  if (!path) {
    return null;
  }

  const protocol = process.env.NEXT_PUBLIC_S3_PROTOCOL || "http";
  const host = process.env.NEXT_PUBLIC_S3 || "dam.inspiraarte.com";

  return `${protocol}://${host}/${path.replace(/^\/+/, "")}`;
}

function isImageMime(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

function isVideoMime(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

function getPrivateFileProxyUrl(fileId: number): string {
  return `/api/admin/designs/files/${fileId}`;
}

export function EditDesign({ categories, materials, design }: EditDesignProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newMaterialName, setNewMaterialName] = useState("");

  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>(categories);
  const [materialOptions, setMaterialOptions] = useState<MaterialOption[]>(materials);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    design.categoryIds.map((id) => String(id)),
  );
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [name, setName] = useState(design.name);
  const [description, setDescription] = useState(design.description);
  const [author, setAuthor] = useState(design.author);
  const [notes, setNotes] = useState(design.notes);
  const [selectedMaterialId, setSelectedMaterialId] = useState(
    design.materialId ? String(design.materialId) : "",
  );
  const [numberMdfTables, setNumberMdfTables] = useState(String(design.numberMdfTables || 0));
  const [timeMachine, setTimeMachine] = useState(String(design.timeMachine || 0));
  const [suggestedPrice, setSuggestedPrice] = useState(
    design.suggestedPrice === null ? "" : String(design.suggestedPrice),
  );
  const [minimumPrice, setMinimumPrice] = useState(
    design.minimumPrice === null ? "" : String(design.minimumPrice),
  );

  const [status, setStatus] = useState(design.status === 1);
  const [isTested, setIsTested] = useState(design.isTested === 1);
  const [isCustomizable, setIsCustomizable] = useState(design.isCustomizable === 1);
  const [showInHome, setShowInHome] = useState(design.showInHome === 1);
  const [showInSite, setShowInSite] = useState(design.showInSite === 1);

  const [existingFiles, setExistingFiles] = useState<ExistingFile[]>(design.files);
  const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);

  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [designImages, setDesignImages] = useState<File[]>([]);
  const [instructionFile, setInstructionFile] = useState<File | null>(null);
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [activeDropzone, setActiveDropzone] = useState<string | null>(null);

  const filesByType = useMemo(() => {
    return {
      preview: existingFiles.filter((file) => file.typeName === "Vista previa"),
      designImages: existingFiles.filter((file) => file.typeName === "Imagenes del diseño"),
      instructions: existingFiles.filter((file) => file.typeName === "Instrucciones"),
      sourceFiles: existingFiles.filter((file) => file.typeName === "Archivos fuente"),
    };
  }, [existingFiles]);

  const handleCreateCategory = async () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) return;

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar la categoria");
      }

      const created: { id: number; name: string } = await response.json();

      setCategoryOptions((prev) => {
        if (prev.some((item) => item.id === created.id)) return prev;
        return [...prev, created].sort((a, b) => a.name.localeCompare(b.name));
      });

      setSelectedCategoryIds((prev) => {
        const createdId = String(created.id);
        return prev.includes(createdId) ? prev : [...prev, createdId];
      });

      setNewCategoryName("");
      setIsAddingCategory(false);
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar la categoria");
    }
  };

  const handleCreateMaterial = async () => {
    const trimmedName = newMaterialName.trim();
    if (!trimmedName) return;

    try {
      const response = await fetch("/api/admin/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar el material");
      }

      const created: { id: number; name: string; slug: string } = await response.json();

      setMaterialOptions((prev) => {
        if (prev.some((item) => item.id === created.id)) return prev;
        return [...prev, created].sort((a, b) => a.name.localeCompare(b.name));
      });

      setSelectedMaterialId(String(created.id));
      setNewMaterialName("");
      setIsAddingMaterial(false);
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar el material");
    }
  };

  const preventDragDefaults = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>, zone: string) => {
    preventDragDefaults(e);
    if (activeDropzone !== zone) {
      setActiveDropzone(zone);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    preventDragDefaults(e);
    setActiveDropzone(null);
  };

  const handleSingleFileDrop = (
    e: React.DragEvent<HTMLElement>,
    setter: (file: File | null) => void,
  ) => {
    preventDragDefaults(e);
    setActiveDropzone(null);
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles || droppedFiles.length === 0) return;
    setter(droppedFiles[0]);
  };

  const handleMultiFileDrop = (
    e: React.DragEvent<HTMLElement>,
    setter: React.Dispatch<React.SetStateAction<File[]>>,
    maxFiles = 20,
  ) => {
    preventDragDefaults(e);
    setActiveDropzone(null);
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (droppedFiles.length === 0) return;
    setter((prev) => [...prev, ...droppedFiles].slice(0, maxFiles));
  };

  const handlePreviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("La vista previa solo acepta archivos de imagen.");
      e.target.value = "";
      return;
    }

    setPreviewFile(file);
  };

  const handleMultiFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File[]>>,
    maxFiles = 20,
  ) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setter((prev) => [...prev, ...newFiles].slice(0, maxFiles));
    e.target.value = "";
  };

  const handleSingleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
  ) => {
    setter(e.target.files?.[0] ?? null);
  };

  const removeFileAtIndex = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<File[]>>,
  ) => {
    setter((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const toggleFileDeletion = (fileId: number) => {
    setDeletedFileIds((prev) =>
      prev.includes(fileId)
        ? prev.filter((currentId) => currentId !== fileId)
        : [...prev, fileId],
    );
  };

  const dropzoneClassName = (zone: string) =>
    `border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer block ${
      activeDropzone === zone
        ? "border-[#1FA4A7] bg-[#4290A3]/5"
        : "border-border bg-white hover:border-[#4290A3]"
    }`;

  const submitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedCategoryIds.length === 0) {
      setCategoryError("Selecciona al menos una categoria del catalogo.");
      return;
    }

    setCategoryError(null);
    setIsSubmitting(true);

    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("author", author.trim());
    formData.append("notes", notes.trim());
    formData.append("materialType", selectedMaterialId);
    formData.append("mdfBoards", numberMdfTables);
    formData.append("workTimeMinutes", timeMachine);
    formData.append("suggestedPrice", suggestedPrice);
    formData.append("minimumPrice", minimumPrice);

    selectedCategoryIds.forEach((categoryId) => formData.append("categories", categoryId));
    deletedFileIds.forEach((fileId) => formData.append("deletedFileIds", String(fileId)));

    if (status) formData.append("status", "on");
    if (isTested) formData.append("isTested", "on");
    if (isCustomizable) formData.append("isCustomizable", "on");
    if (showInHome) formData.append("showInHome", "on");
    if (showInSite) formData.append("showInSite", "on");

    if (previewFile) {
      formData.append("previewFile", previewFile);
    }

    if (instructionFile) {
      formData.append("instructionFile", instructionFile);
    }

    designImages.forEach((file) => formData.append("designImages", file));
    sourceFiles.forEach((file) => formData.append("sourceFiles", file));

    try {
      const response = await fetch(`/api/admin/designs/${design.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "No se pudo actualizar el diseno");
      }

      sendGTMEvent({ event: "formDesignEdit", value: name.trim() });
      setIsSaved(true);
      setExistingFiles((prev) => prev.filter((file) => !deletedFileIds.includes(file.id)));
      setDeletedFileIds([]);
      setPreviewFile(null);
      setInstructionFile(null);
      setDesignImages([]);
      setSourceFiles([]);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "No se pudo actualizar el diseno");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDesign = async () => {
    const shouldDelete = window.confirm(
      "Esta accion eliminara el producto y sus archivos en S3 de forma permanente. ¿Deseas continuar?",
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/designs/${design.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "No se pudo eliminar el diseno");
      }

      sendGTMEvent({ event: "formDesignDelete", value: name.trim() });
      window.location.href = "/productos";
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "No se pudo eliminar el diseno");
      setIsDeleting(false);
    }
  };

  if (isSaved) {
    return (
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00B003]/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-[#00B003]" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Producto actualizado correctamente
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Los cambios ya quedaron guardados en la base de datos.
            </p>
            <Button
              onClick={() => setIsSaved(false)}
              variant="outline"
              className="border-[#4290A3] text-[#4290A3] hover:bg-[#4290A3]/10"
            >
              Seguir editando
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const renderExistingFiles = (title: string, files: ExistingFile[], usePrivateProxy = false) => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {files.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin archivos registrados.</p>
      ) : (
        <div className="space-y-3">
          {files.map((file) => {
            const mediaUrl = usePrivateProxy
              ? getPrivateFileProxyUrl(file.id)
              : getMediaUrl(file.filePath);
            const willBeDeleted = deletedFileIds.includes(file.id);

            return (
              <div
                key={file.id}
                className="rounded-md border border-border bg-white p-3 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.filePath || "Sin ruta"}</p>
                    <p className="text-xs text-muted-foreground">{file.mimeType || "Mime desconocido"}</p>
                  </div>
                  <Button
                    type="button"
                    variant={willBeDeleted ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFileDeletion(file.id)}
                    className={willBeDeleted ? "bg-destructive hover:bg-destructive/90 text-white" : ""}
                  >
                    {willBeDeleted ? "Restaurar" : "Eliminar"}
                  </Button>
                </div>

                {mediaUrl && isImageMime(file.mimeType) && (
                  <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                    <Image
                      src={mediaUrl}
                      alt={file.filePath || `Archivo ${file.id}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized={usePrivateProxy}
                      className="object-cover"
                    />
                  </div>
                )}

                {mediaUrl && isVideoMime(file.mimeType) && (
                  <video controls className="w-full rounded-md bg-black" preload="metadata">
                    <source src={mediaUrl} />
                    <track
                      kind="captions"
                      srcLang="es"
                      label="Subtitulos"
                      src="data:text/vtt,WEBVTT%0A%0A"
                    />
                    Tu navegador no soporta la reproduccion de video.
                  </video>
                )}

                {usePrivateProxy && mediaUrl && (
                  <div className="pt-1">
                    <a
                      href={mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-[#4290A3] hover:underline"
                    >
                      Abrir archivo en nueva pestana
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <span className="inline-block px-4 py-1 rounded-full bg-[#00B003]/10 text-[#00B003] text-sm font-medium mb-4">
          Administracion
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
          Editar <span className="text-[#4290A3]">producto</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Ajusta los datos de este producto, actualiza su visibilidad y administra archivos.
        </p>

        <div className="bg-muted/50 rounded-2xl p-8">
          <form onSubmit={submitEdit} className="space-y-8">
            <fieldset className="space-y-4 border border-border rounded-xl bg-white p-5">
              <legend className="px-2 text-sm font-semibold text-foreground">1. Informacion base</legend>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripcion</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-30"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Autor</Label>
                  <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-20"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={isCustomizable}
                  onChange={(e) => setIsCustomizable(e.target.checked)}
                  className="size-4"
                />
                Se puede personalizar
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="materialType">Tipo de material</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingMaterial(true)}>
                    Agregar nuevo
                  </Button>
                </div>
                <select
                  id="materialType"
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                >
                  <option value="">Selecciona un material</option>
                  {materialOptions.map((material) => (
                    <option key={material.id} value={String(material.id)}>
                      {material.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="categories">Categorias del catalogo *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingCategory(true)}>
                    Agregar nueva
                  </Button>
                </div>
                <CategoryMultiSelect
                  name="categories"
                  options={categoryOptions}
                  selectedValues={selectedCategoryIds}
                  error={categoryError}
                  onChangeAction={(values) => {
                    setSelectedCategoryIds(values);
                    if (values.length > 0) {
                      setCategoryError(null);
                    }
                  }}
                />
              </div>
            </fieldset>

            <fieldset className="space-y-4 border border-border rounded-xl bg-white p-5">
              <legend className="px-2 text-sm font-semibold text-foreground">2. Produccion</legend>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mdfBoards">Numero de tablones MDF</Label>
                  <Input
                    id="mdfBoards"
                    type="number"
                    min={0}
                    max={99}
                    value={numberMdfTables}
                    onChange={(e) => setNumberMdfTables(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workTimeMinutes">Tiempo de trabajo (minutos)</Label>
                  <Input
                    id="workTimeMinutes"
                    type="number"
                    min={0}
                    value={timeMachine}
                    onChange={(e) => setTimeMachine(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suggestedPrice">Precio sugerido</Label>
                  <Input
                    id="suggestedPrice"
                    type="number"
                    min={0}
                    step="0.01"
                    value={suggestedPrice}
                    onChange={(e) => setSuggestedPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimumPrice">Precio minimo</Label>
                  <Input
                    id="minimumPrice"
                    type="number"
                    min={0}
                    step="0.01"
                    value={minimumPrice}
                    onChange={(e) => setMinimumPrice(e.target.value)}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-4 border border-border rounded-xl bg-white p-5">
              <legend className="px-2 text-sm font-semibold text-foreground">3. Visibilidad</legend>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} className="size-4" />
                  Status
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={isTested} onChange={(e) => setIsTested(e.target.checked)} className="size-4" />
                  Probado
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={showInHome} onChange={(e) => setShowInHome(e.target.checked)} className="size-4" />
                  Mostrar en el home
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={showInSite} onChange={(e) => setShowInSite(e.target.checked)} className="size-4" />
                  Mostrar en el sitio
                </label>
              </div>
            </fieldset>

            <fieldset className="space-y-6 border border-border rounded-xl bg-white p-5">
              <legend className="px-2 text-sm font-semibold text-foreground">4. Archivos registrados</legend>
              {renderExistingFiles("Vista previa", filesByType.preview)}
              {renderExistingFiles("Imagenes del diseno", filesByType.designImages)}
              {renderExistingFiles("Instrucciones", filesByType.instructions, true)}
              {renderExistingFiles("Archivos fuente", filesByType.sourceFiles, true)}
            </fieldset>

            <fieldset className="space-y-4 border border-border rounded-xl bg-white p-5">
              <legend className="px-2 text-sm font-semibold text-foreground">5. Subir nuevos archivos</legend>

              <div className="space-y-2">
                <Label htmlFor="preview-file">Reemplazar vista previa</Label>
                <label
                  htmlFor="preview-file"
                  className={dropzoneClassName("preview")}
                  onDragOver={(e) => handleDragOver(e, "preview")}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleSingleFileDrop(e, setPreviewFile)}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Selecciona una nueva imagen de vista previa.</p>
                  <input
                    id="preview-file"
                    type="file"
                    accept="image/*"
                    onChange={handlePreviewFileChange}
                    className="hidden"
                  />
                </label>
                {previewFile && <p className="text-xs text-muted-foreground">{previewFile.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="design-images">Agregar imagenes del diseno</Label>
                <label
                  htmlFor="design-images"
                  className={dropzoneClassName("designImages")}
                  onDragOver={(e) => handleDragOver(e, "designImages")}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleMultiFileDrop(e, setDesignImages, 20)}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Puedes subir imagenes o videos.</p>
                  <input
                    id="design-images"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => handleMultiFileChange(e, setDesignImages, 20)}
                    className="hidden"
                  />
                </label>
                {designImages.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {designImages.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-md border border-border bg-white px-3 py-2">
                        <span className="text-sm text-foreground truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFileAtIndex(index, setDesignImages)}
                          className="ml-2 p-1 hover:bg-muted rounded"
                          aria-label={`Eliminar ${file.name}`}
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instruction-file">Agregar instruccion</Label>
                <label
                  htmlFor="instruction-file"
                  className={dropzoneClassName("instruction")}
                  onDragOver={(e) => handleDragOver(e, "instruction")}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleSingleFileDrop(e, setInstructionFile)}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Sube un archivo de instrucciones.</p>
                  <input
                    id="instruction-file"
                    type="file"
                    accept="*/*"
                    onChange={(e) => handleSingleFileChange(e, setInstructionFile)}
                    className="hidden"
                  />
                </label>
                {instructionFile && <p className="text-xs text-muted-foreground">{instructionFile.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="source-files">Agregar archivos fuente</Label>
                <label
                  htmlFor="source-files"
                  className={dropzoneClassName("sourceFiles")}
                  onDragOver={(e) => handleDragOver(e, "sourceFiles")}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleMultiFileDrop(e, setSourceFiles, 20)}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Puedes subir multiples archivos fuente.</p>
                  <input
                    id="source-files"
                    type="file"
                    multiple
                    accept="*/*"
                    onChange={(e) => handleMultiFileChange(e, setSourceFiles, 20)}
                    className="hidden"
                  />
                </label>
                {sourceFiles.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {sourceFiles.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-md border border-border bg-white px-3 py-2">
                        <span className="text-sm text-foreground truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFileAtIndex(index, setSourceFiles)}
                          className="ml-2 p-1 hover:bg-muted rounded"
                          aria-label={`Eliminar ${file.name}`}
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </fieldset>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#4290A3] hover:bg-[#1FA4A7] text-white h-12">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando cambios...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar cambios
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting || isSubmitting}
              onClick={handleDeleteDesign}
              className="w-full h-12"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </Button>
          </form>

          <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva categoria</DialogTitle>
                <DialogDescription>
                  Escribe el nombre de la categoria para guardarla y seleccionarla automaticamente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="new-category-name">Nombre</Label>
                <Input
                  id="new-category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ej. San Valentin"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddingCategory(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleCreateCategory}>Guardar categoria</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingMaterial} onOpenChange={setIsAddingMaterial}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo material</DialogTitle>
                <DialogDescription>
                  Escribe el nombre del material para guardarlo y seleccionarlo automaticamente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="new-material-name">Nombre</Label>
                <Input
                  id="new-material-name"
                  value={newMaterialName}
                  onChange={(e) => setNewMaterialName(e.target.value)}
                  placeholder="Ej. Vinil reflectivo"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddingMaterial(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleCreateMaterial}>Guardar material</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}

