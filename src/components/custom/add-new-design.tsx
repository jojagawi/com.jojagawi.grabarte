"use client"

import { useState } from "react"
import { Send, Upload, X, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CategoryMultiSelect } from "@/components/custom/CategoryMultiSelect"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { sendGTMEvent } from "@next/third-parties/google"

type CategoryOption = {
  id: number
  name: string
}

type MaterialOption = {
  id: number
  name: string
  slug: string
}

type AddNewDesignProps = {
  categories: CategoryOption[]
  materials: MaterialOption[]
}

export function AddNewDesign({ categories, materials }: AddNewDesignProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formResetKey, setFormResetKey] = useState(0)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isAddingMaterial, setIsAddingMaterial] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newMaterialName, setNewMaterialName] = useState("")
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>(categories)
  const [materialOptions, setMaterialOptions] = useState<MaterialOption[]>(materials)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [selectedMaterialId, setSelectedMaterialId] = useState("")
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [designImages, setDesignImages] = useState<File[]>([])
  const [instructionFile, setInstructionFile] = useState<File | null>(null)
  const [sourceFiles, setSourceFiles] = useState<File[]>([])
  const [activeDropzone, setActiveDropzone] = useState<string | null>(null)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim()
    if (!name) return

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("No se pudo guardar la categoría")
      }

      const created: { id: number; name: string } = await response.json()

      setCategoryOptions((prev) => {
        if (prev.some((item) => item.id === created.id)) return prev
        return [...prev, { id: created.id, name: created.name }].sort((a, b) =>
          a.name.localeCompare(b.name),
        )
      })

      setSelectedCategoryIds((prev) => {
        const id = String(created.id)
        return prev.includes(id) ? prev : [...prev, id]
      })

      setNewCategoryName("")
      setIsAddingCategory(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateMaterial = async () => {
    const name = newMaterialName.trim()
    if (!name) return

    try {
      const response = await fetch("/api/admin/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("No se pudo guardar el material")
      }

      const created: { id: number; name: string; slug: string } = await response.json()

      setMaterialOptions((prev) => {
        if (prev.some((item) => item.id === created.id)) return prev
        return [
          ...prev,
          {
            id: created.id,
            name: created.name,
            slug: created.slug,
          },
        ].sort((a, b) => a.name.localeCompare(b.name))
      })

      setSelectedMaterialId(String(created.id))
      setNewMaterialName("")
      setIsAddingMaterial(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSingleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
  ) => {
    setter(e.target.files?.[0] ?? null)
  }

  const isImageFile = (file: File) => file.type.startsWith("image/")

  const handlePreviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isImageFile(file)) {
      alert("La vista previa solo acepta archivos de tipo imagen.")
      e.target.value = ""
      return
    }

    setPreviewFile(file)
  }

  const preventDragDefaults = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragOver = (e: React.DragEvent<HTMLElement>, zone: string) => {
    preventDragDefaults(e)
    if (activeDropzone !== zone) {
      setActiveDropzone(zone)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    preventDragDefaults(e)
    setActiveDropzone(null)
  }

  const handleSingleFileDrop = (
    e: React.DragEvent<HTMLElement>,
    setter: (file: File | null) => void,
  ) => {
    preventDragDefaults(e)
    setActiveDropzone(null)
    const droppedFiles = e.dataTransfer.files
    if (!droppedFiles || droppedFiles.length === 0) return
    setter(droppedFiles[0])
  }

  const handlePreviewFileDrop = (e: React.DragEvent<HTMLElement>) => {
    preventDragDefaults(e)
    setActiveDropzone(null)

    const droppedFiles = e.dataTransfer.files
    if (!droppedFiles || droppedFiles.length === 0) return

    const file = droppedFiles[0]
    if (!isImageFile(file)) {
      alert("La vista previa solo acepta archivos de tipo imagen.")
      return
    }

    setPreviewFile(file)
  }

  const handleMultiFileDrop = (
    e: React.DragEvent<HTMLElement>,
    setter: React.Dispatch<React.SetStateAction<File[]>>,
    maxFiles = 10,
  ) => {
    preventDragDefaults(e)
    setActiveDropzone(null)
    const droppedFiles = Array.from(e.dataTransfer.files || [])
    if (droppedFiles.length === 0) return
    setter((prev) => [...prev, ...droppedFiles].slice(0, maxFiles))
  }

  const handleMultiFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File[]>>,
    maxFiles = 10,
  ) => {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files)
    setter((prev) => [...prev, ...newFiles].slice(0, maxFiles))
    e.target.value = ""
  }

  const removeFileAtIndex = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<File[]>>,
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index))
  }

  const dropzoneClassName = (zone: string) =>
    `border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer block ${
      activeDropzone === zone
        ? "border-[#1FA4A7] bg-[#4290A3]/5"
        : "border-border bg-white hover:border-[#4290A3]"
    }`

  const resetFormState = () => {
    setSelectedCategoryIds([])
    setSelectedMaterialId("")
    setPreviewFile(null)
    setDesignImages([])
    setInstructionFile(null)
    setSourceFiles([])
    setActiveDropzone(null)
    setNewCategoryName("")
    setNewMaterialName("")
    setIsAddingCategory(false)
    setIsAddingMaterial(false)
    setCategoryError(null)
    setFormResetKey((prev) => prev + 1)
  }

  const handleSendMoreMaterials = () => {
    resetFormState()
    setIsSubmitted(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (selectedCategoryIds.length === 0) {
      setCategoryError("Selecciona al menos una categoría del catálogo.")
      return
    }

    setCategoryError(null)
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const name = String(formData.get("name") ?? "").trim()

    formData.delete("previewFile")
    formData.delete("instructionFile")
    formData.delete("designImages")
    formData.delete("sourceFiles")

    if (previewFile) formData.append("previewFile", previewFile)
    if (instructionFile) formData.append("instructionFile", instructionFile)
    designImages.forEach((file) => formData.append("designImages", file))
    sourceFiles.forEach((file) => formData.append("sourceFiles", file))

    try {
      const response = await fetch("/api/admin/designs", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("No se pudo guardar el diseño")
      }

      sendGTMEvent({ event: "formContactSend", value: name })
      setIsSubmitted(true)
    } catch (error) {
      console.error(error)
      alert("No se pudo guardar el diseño. Verifica los datos e inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="contacto" className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00B003]/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-[#00B003]" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              ¡Diseño agregado correctamente!
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Tu diseño ya forma parte de nuestra base de datos, gracias por el aporte.
            </p>
            <Button
              onClick={handleSendMoreMaterials}
              variant="outline"
              className="border-[#4290A3] text-[#4290A3] hover:bg-[#4290A3]/10"
            >
              Enviar mas materiales
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contacto" className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <span className="inline-block px-4 py-1 rounded-full bg-[#00B003]/10 text-[#00B003] text-sm font-medium mb-4">
          Contacto
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
          Comparte tu <span className="text-[#4290A3]">nuevo diseño</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          Aqui puedes subir tus diseños para poder mostrarlos en el sitio web o
          simplemente para poder almacenarlos y podermos usar en un futuro.
        </p>

        {/* Form */}
        <div className="bg-muted/50 rounded-2xl p-8">
          <form key={formResetKey} onSubmit={handleSubmit} className="space-y-8">
            <fieldset className="space-y-4 border border-border rounded-xl bg-white p-5">
              <legend className="px-2 text-sm font-semibold text-foreground">
                1. Información base
              </legend>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Nombre del diseño"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe el diseño, medidas, acabado o recomendaciones..."
                  className="min-h-30"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Autor</Label>
                  <Input
                    id="author"
                    name="author"
                    placeholder="Nombre del autor o creador"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Notas internas o comentarios adicionales"
                    className="min-h-20"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  name="isCustomizable"
                  className="size-4"
                />
                Se puede personalizar
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="materialType">Tipo de material</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddingMaterial(true)}
                    >
                      Agregar nuevo
                    </Button>
                  </div>
                  <select
                    id="materialType"
                    name="materialType"
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
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="categories">Categorías del catálogo *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingCategory(true)}
                  >
                    Agregar nueva
                  </Button>
                </div>
                <CategoryMultiSelect
                  name="categories"
                  options={categoryOptions}
                  selectedValues={selectedCategoryIds}
                  error={categoryError}
                  onChangeAction={(values) => {
                    setSelectedCategoryIds(values)
                    if (values.length > 0) {
                      setCategoryError(null)
                    }
                  }}
                />
              </div>
            </fieldset>

            <fieldset className="space-y-4 border border-border rounded-xl bg-white p-5">
              <legend className="px-2 text-sm font-semibold text-foreground">
                2. Producción
              </legend>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mdfBoards">Número de tablones MDF</Label>
                  <Input
                    id="mdfBoards"
                    name="mdfBoards"
                    type="number"
                    min={0}
                    max={99}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workTimeMinutes">
                    Tiempo de trabajo (minutos)
                  </Label>
                  <Input
                    id="workTimeMinutes"
                    name="workTimeMinutes"
                    type="number"
                    min={0}
                    placeholder="120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suggestedPrice">Precio sugerido</Label>
                  <Input
                    id="suggestedPrice"
                    name="suggestedPrice"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimumPrice">Precio mínimo</Label>
                  <Input
                    id="minimumPrice"
                    name="minimumPrice"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-4 border border-border rounded-xl bg-white p-5">
              <legend className="px-2 text-sm font-semibold text-foreground">
                3. Visibilidad
              </legend>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    name="status"
                    className="size-4"
                    defaultChecked
                  />
                  Status
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" name="isTested" className="size-4" />
                  Probado
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" name="showInHome" className="size-4" />
                  Mostrar en el home
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    name="showInSite"
                    className="size-4"
                    defaultChecked
                  />
                  Mostrar en el sitio
                </label>
              </div>
            </fieldset>

            <fieldset className="space-y-4 border border-border rounded-xl bg-white p-5">
              <legend className="px-2 text-sm font-semibold text-foreground">
                4. Archivos
              </legend>

              <div className="space-y-2">
                <Label htmlFor="preview-file">Vista previa</Label>
                <label
                  htmlFor="preview-file"
                  className={dropzoneClassName("preview")}
                  onDragOver={(e) => handleDragOver(e, "preview")}
                  onDragLeave={handleDragLeave}
                  onDrop={handlePreviewFileDrop}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arrastra una imagen o{" "}
                    <span className="text-[#4290A3] font-medium">
                      haz clic para subir
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WEBP
                  </p>
                  <input
                    id="preview-file"
                    name="previewFile"
                    type="file"
                    accept="image/*"
                    onChange={handlePreviewFileChange}
                    className="hidden"
                  />
                </label>
                {previewFile && (
                  <p className="text-xs text-muted-foreground">
                    {previewFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="design-images">Imágenes del diseño</Label>
                <label
                  htmlFor="design-images"
                  className={dropzoneClassName("designImages")}
                  onDragOver={(e) => handleDragOver(e, "designImages")}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleMultiFileDrop(e, setDesignImages, 20)}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arrastra imágenes o{" "}
                    <span className="text-[#4290A3] font-medium">
                      haz clic para subir
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Puedes subir múltiples archivos
                  </p>
                  <input
                    id="design-images"
                    name="designImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      handleMultiFileChange(e, setDesignImages, 20)
                    }
                    className="hidden"
                  />
                </label>
                {designImages.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {designImages.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-md border border-border bg-white px-3 py-2"
                      >
                        <span className="text-sm text-foreground truncate">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            removeFileAtIndex(index, setDesignImages)
                          }
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
                <Label htmlFor="instruction-file">Instrucciones</Label>
                <label
                  htmlFor="instruction-file"
                  className={dropzoneClassName("instruction")}
                  onDragOver={(e) => handleDragOver(e, "instruction")}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleSingleFileDrop(e, setInstructionFile)}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arrastra el archivo o{" "}
                    <span className="text-[#4290A3] font-medium">
                      haz clic para subir
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Puedes subir cualquier tipo de archivo
                  </p>
                  <input
                    id="instruction-file"
                    name="instructionFile"
                    type="file"
                    accept="*/*"
                    onChange={(e) =>
                      handleSingleFileChange(e, setInstructionFile)
                    }
                    className="hidden"
                  />
                </label>
                {instructionFile && (
                  <p className="text-xs text-muted-foreground">
                    {instructionFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="source-files">Archivos fuente</Label>
                <label
                  htmlFor="source-files"
                  className={dropzoneClassName("sourceFiles")}
                  onDragOver={(e) => handleDragOver(e, "sourceFiles")}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleMultiFileDrop(e, setSourceFiles, 20)}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arrastra archivos fuente o{" "}
                    <span className="text-[#4290A3] font-medium">
                      haz clic para subir
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Puedes subir cualquier tipo de archivo
                  </p>
                  <input
                    id="source-files"
                    name="sourceFiles"
                    type="file"
                    multiple
                    accept="*/*"
                    onChange={(e) =>
                      handleMultiFileChange(e, setSourceFiles, 20)
                    }
                    className="hidden"
                  />
                </label>
                {sourceFiles.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {sourceFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-md border border-border bg-white px-3 py-2"
                      >
                        <span className="text-sm text-foreground truncate">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            removeFileAtIndex(index, setSourceFiles)
                          }
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#4290A3] hover:bg-[#1FA4A7] text-white h-12"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Guardar diseño
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Al enviar, aceptas nuestro{" "}
              <a
                href="/aviso-de-privacidad"
                className="text-[#4290A3] hover:underline"
              >
                aviso de privacidad
              </a>
              .
            </p>
          </form>

          <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva categoría</DialogTitle>
                <DialogDescription>
                  Escribe el nombre de la categoría para guardarla y
                  seleccionarla automáticamente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="new-category-name">Nombre</Label>
                <Input
                  id="new-category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ej. San Valentín"
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingCategory(false)}
                >
                  Cancelar
                </Button>
                <Button type="button" onClick={handleCreateCategory}>
                  Guardar categoría
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingMaterial} onOpenChange={setIsAddingMaterial}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo material</DialogTitle>
                <DialogDescription>
                  Escribe el nombre del material para guardarlo y seleccionarlo
                  automáticamente.
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingMaterial(false)}
                >
                  Cancelar
                </Button>
                <Button type="button" onClick={handleCreateMaterial}>
                  Guardar material
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  )
}
