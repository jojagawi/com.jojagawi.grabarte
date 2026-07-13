'use client'

import { useState } from 'react'
import {
  CATEGORIES,
  MATERIALS,
  FORMATS,
  MDF_THICKNESSES,
  type Material,
  type FileFormat,
} from '@/lib/designs'
import { FileDropzone } from '@/components/file-dropzone'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { CheckCircle2, Plus, X } from 'lucide-react'

function MultiToggle<T extends string>({
  options,
  selected,
  onToggle,
  formatLabel,
}: {
  options: readonly T[]
  selected: T[]
  onToggle: (v: T) => void
  formatLabel?: (v: T) => string
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={cn(
              'border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors',
              active
                ? 'border-primary bg-primary/10 text-cyan'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {formatLabel ? formatLabel(opt) : opt}
          </button>
        )
      })}
    </div>
  )
}

export function UploadForm() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [formats, setFormats] = useState<FileFormat[]>([])
  const [dimensions, setDimensions] = useState<string[]>([])
  const [customDim, setCustomDim] = useState('')
  const [category, setCategory] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function toggle<T>(setter: React.Dispatch<React.SetStateAction<T[]>>) {
    return (value: T) =>
      setter((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      )
  }

  function addCustomDim() {
    const v = customDim.trim()
    if (v && !dimensions.includes(v)) {
      setDimensions((prev) => [...prev, v])
      setCustomDim('')
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Demo: en este prototipo no se persiste. Conecta Neon + Blob para guardar.
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl border border-primary/40 bg-card p-10 text-center glow-cyan">
        <CheckCircle2 className="mx-auto size-10 text-cyan" />
        <h2 className="mt-6 font-heading text-2xl font-bold text-foreground">
          ¡Diseño enviado!
        </h2>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          Recibimos tu diseño correctamente. En este prototipo los datos no se
          guardan todavía. Al conectar la base de datos y el almacenamiento, el
          envío quedará registrado y aparecerá en el catálogo.
        </p>
        <Button
          className="mt-8 font-mono text-xs uppercase tracking-widest"
          onClick={() => setSubmitted(false)}
        >
          Subir otro diseño
        </Button>
      </div>
    )
  }

  const showMdfThickness = materials.includes('MDF')

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-10">
      {/* Datos generales */}
      <fieldset className="space-y-5 border border-border bg-card p-6">
        <legend className="px-2 font-mono text-xs uppercase tracking-[0.3em] text-cyan">
          01 / Información
        </legend>

        <div className="space-y-2">
          <Label htmlFor="name">Nombre del diseño *</Label>
          <Input
            id="name"
            required
            placeholder="Ej. Mandala Geométrico"
            className="border-border bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción *</Label>
          <Textarea
            id="description"
            required
            rows={4}
            placeholder="Describe el diseño, recomendaciones de potencia/velocidad, ensamble, etc."
            className="border-border bg-background"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="author">Autor *</Label>
            <Input
              id="author"
              required
              placeholder="Tu nombre o estudio"
              className="border-border bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label>Categoría *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="border-border bg-background">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </fieldset>

      {/* Materiales y dimensiones */}
      <fieldset className="space-y-6 border border-border bg-card p-6">
        <legend className="px-2 font-mono text-xs uppercase tracking-[0.3em] text-cyan">
          02 / Materiales y dimensiones
        </legend>

        <div className="space-y-3">
          <Label>Materiales *</Label>
          <MultiToggle
            options={MATERIALS}
            selected={materials}
            onToggle={toggle(setMaterials)}
          />
        </div>

        {showMdfThickness && (
          <div className="space-y-3">
            <Label>Espesores de MDF</Label>
            <MultiToggle
              options={MDF_THICKNESSES}
              selected={dimensions}
              onToggle={toggle(setDimensions)}
            />
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="customDim">Otras dimensiones / materiales</Label>
          <div className="flex gap-2">
            <Input
              id="customDim"
              value={customDim}
              onChange={(e) => setCustomDim(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustomDim()
                }
              }}
              placeholder="Ej. Cuero 2mm, Acero 1mm, 20oz..."
              className="border-border bg-background"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addCustomDim}
              className="border-border"
            >
              <Plus className="size-4" />
            </Button>
          </div>
          {dimensions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {dimensions.map((d) => (
                <span
                  key={d}
                  className="flex items-center gap-1.5 border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[11px] text-cyan"
                >
                  {d}
                  <button
                    type="button"
                    onClick={() =>
                      setDimensions((prev) => prev.filter((x) => x !== d))
                    }
                    aria-label={`Quitar ${d}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label>Formatos incluidos *</Label>
          <MultiToggle
            options={FORMATS}
            selected={formats}
            onToggle={toggle(setFormats)}
            formatLabel={(f) => `.${f.toLowerCase()}`}
          />
        </div>
      </fieldset>

      {/* Archivos */}
      <fieldset className="space-y-6 border border-border bg-card p-6">
        <legend className="px-2 font-mono text-xs uppercase tracking-[0.3em] text-cyan">
          03 / Archivos
        </legend>

        <FileDropzone
          id="thumb"
          label="Miniatura (thumb)"
          hint="PNG o JPG · 1 imagen"
          accept="image/*"
          variant="image"
        />

        <FileDropzone
          id="instrucciones"
          label="Instrucciones"
          hint="PDF, imagen o documento"
          accept=".pdf,image/*,.doc,.docx,.txt"
        />

        <FileDropzone
          id="archivos"
          label="Archivos de corte (múltiples)"
          hint="SVG, LBRN, LBRN2, CDR, PDF, HTML, EPS, AI, DXF..."
          accept=".svg,.lbrn,.lbrn2,.cdr,.pdf,.html,.eps,.ai,.dxf"
          multiple
        />
      </fieldset>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          * Campos obligatorios
        </p>
        <Button
          type="submit"
          size="lg"
          className="font-mono text-xs uppercase tracking-widest"
        >
          Publicar diseño
        </Button>
      </div>
    </form>
  )
}
