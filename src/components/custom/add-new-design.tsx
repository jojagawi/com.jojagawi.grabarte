"use client"

import { useState } from "react"
import { Send, Upload, X, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { sendGTMEvent } from "@next/third-parties/google";

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
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [designImages, setDesignImages] = useState<File[]>([])
  const [instructionFile, setInstructionFile] = useState<File | null>(null)
  const [sourceFiles, setSourceFiles] = useState<File[]>([])

  const handleSingleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
  ) => {
    setter(e.target.files?.[0] ?? null)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const name = String(formData.get("name") ?? "").trim()

    // Simulate form submission
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        sendGTMEvent({ event: "formContactSend", value: name })
        resolve()
      }, 2000)
    })

    setIsSubmitting(false)
    setIsSubmitted(true)
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
              ¡Mensaje enviado!
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Recibimos tu solicitud. Te contactaremos en menos de 24 horas para comenzar a crear algo increíble juntos.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="border-[#4290A3] text-[#4290A3] hover:bg-[#4290A3]/10"
            >
              Enviar otra solicitud
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
          <form onSubmit={handleSubmit} className="space-y-8">
            <fieldset className="space-y-4 border border-border rounded-xl bg-white p-5">
              <legend className="px-2 text-sm font-semibold text-foreground">1. Información base</legend>

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

              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" name="isCustomizable" className="size-4" />
                Se puede personalizar
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="materialType">Tipo de material</Label>
                  <select
                    id="materialType"
                    name="materialType"
                    className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                  >
                    <option value="">Selecciona un material</option>
                    {materials.map((material) => (
                      <option key={material.id} value={material.slug || material.id}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags *</Label>
                  <Input
                    id="tags"
                    name="tags"
                    required
                    placeholder="Ej. navidad, adorno, mdf"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categories">Categorías del catálogo *</Label>
                <select
                  id="categories"
                  name="categories"
                  required
                  multiple
                  className="w-full min-h-32 px-3 py-2 rounded-md border border-input bg-white text-sm"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">Puedes seleccionar múltiples categorías.</p>
              </div>
            </fieldset>

            <fieldset className="space-y-4 border border-border rounded-xl bg-white p-5">
              <legend className="px-2 text-sm font-semibold text-foreground">2. Producción</legend>

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
                  <Label htmlFor="workTimeMinutes">Tiempo de trabajo (minutos)</Label>
                  <Input
                    id="workTimeMinutes"
                    name="workTimeMinutes"
                    type="number"
                    min={0}
                    placeholder="120"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-4 border border-border rounded-xl bg-white p-5">
              <legend className="px-2 text-sm font-semibold text-foreground">3. Visibilidad</legend>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" name="status" className="size-4" defaultChecked />
                  Status
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" name="tested" className="size-4" />
                  Probado
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" name="showInHome" className="size-4" />
                  Mostrar en el home
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" name="showInSite" className="size-4" defaultChecked />
                  Mostrar en el sitio
                </label>
              </div>
            </fieldset>

            <fieldset className="space-y-4 border border-border rounded-xl bg-white p-5">
              <legend className="px-2 text-sm font-semibold text-foreground">4. Archivos</legend>

              <div className="space-y-2">
                <Label htmlFor="preview-file">Vista previa</Label>
                <label
                  htmlFor="preview-file"
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-[#4290A3] transition-colors cursor-pointer bg-white block"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arrastra una imagen o <span className="text-[#4290A3] font-medium">haz clic para subir</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP</p>
                  <input
                    id="preview-file"
                    name="previewFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSingleFileChange(e, setPreviewFile)}
                    className="hidden"
                  />
                </label>
                {previewFile && <p className="text-xs text-muted-foreground">{previewFile.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="design-images">Imágenes del diseño</Label>
                <label
                  htmlFor="design-images"
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-[#4290A3] transition-colors cursor-pointer bg-white block"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arrastra imágenes o <span className="text-[#4290A3] font-medium">haz clic para subir</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Puedes subir múltiples archivos</p>
                  <input
                    id="design-images"
                    name="designImages"
                    type="file"
                    accept="image/*"
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
                <Label htmlFor="instruction-file">Instrucciones</Label>
                <label
                  htmlFor="instruction-file"
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-[#4290A3] transition-colors cursor-pointer bg-white block"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arrastra el archivo o <span className="text-[#4290A3] font-medium">haz clic para subir</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, TXT, MD, DOC, DOCX</p>
                  <input
                    id="instruction-file"
                    name="instructionFile"
                    type="file"
                    accept=".pdf,.txt,.md,.doc,.docx"
                    onChange={(e) => handleSingleFileChange(e, setInstructionFile)}
                    className="hidden"
                  />
                </label>
                {instructionFile && <p className="text-xs text-muted-foreground">{instructionFile.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="source-files">Archivos fuente</Label>
                <label
                  htmlFor="source-files"
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-[#4290A3] transition-colors cursor-pointer bg-white block"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arrastra archivos fuente o <span className="text-[#4290A3] font-medium">haz clic para subir</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">AI, EPS, SVG, PDF, PSD, CDR, LBRN2, DXF, STL, OBJ</p>
                  <input
                    id="source-files"
                    name="sourceFiles"
                    type="file"
                    multiple
                    accept=".ai,.eps,.svg,.pdf,.psd,.cdr,.lbrn2,.dxf,.stl,.obj"
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
        </div>
      </div>
    </section>
  );
}
