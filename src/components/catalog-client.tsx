'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  DESIGNS,
  CATEGORIES,
  MATERIALS,
  FORMATS,
  type Category,
  type Material,
  type FileFormat,
} from '@/lib/designs'
import { DesignCard } from '@/components/design-card'
import { Input } from '@/components/ui/input'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'

function FilterGroup<T extends string>({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string
  options: readonly T[]
  selected: T[]
  onToggle: (value: T) => void
}) {
  return (
    <div className="border-b border-border py-5">
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-cyan">
        {title}
      </h3>
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
              {title === 'Formato' ? `.${opt.toLowerCase()}` : opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function CatalogClient() {
  const params = useSearchParams()
  const initialMaterial = params.get('material') as Material | null

  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [materials, setMaterials] = useState<Material[]>(
    initialMaterial && MATERIALS.includes(initialMaterial)
      ? [initialMaterial]
      : [],
  )
  const [formats, setFormats] = useState<FileFormat[]>([])
  const [mobileOpen, setMobileOpen] = useState(false)

  function toggle<T>(setter: React.Dispatch<React.SetStateAction<T[]>>) {
    return (value: T) =>
      setter((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      )
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return DESIGNS.filter((d) => {
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.author.toLowerCase().includes(q)
      const matchesCategory =
        categories.length === 0 || categories.includes(d.category)
      const matchesMaterial =
        materials.length === 0 ||
        materials.some((m) => d.materials.includes(m))
      const matchesFormat =
        formats.length === 0 || formats.some((f) => d.formats.includes(f))
      return (
        matchesQuery && matchesCategory && matchesMaterial && matchesFormat
      )
    })
  }, [query, categories, materials, formats])

  const activeCount =
    categories.length + materials.length + formats.length

  function clearAll() {
    setCategories([])
    setMaterials([])
    setFormats([])
    setQuery('')
  }

  const filters = (
    <>
      <FilterGroup
        title="Categoría"
        options={CATEGORIES}
        selected={categories}
        onToggle={toggle(setCategories)}
      />
      <FilterGroup
        title="Material"
        options={MATERIALS}
        selected={materials}
        onToggle={toggle(setMaterials)}
      />
      <FilterGroup
        title="Formato"
        options={FORMATS}
        selected={formats}
        onToggle={toggle(setFormats)}
      />
    </>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, descripción o autor..."
          className="h-14 border-border bg-card pl-12 font-mono text-sm"
        />
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* sidebar filters - desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <div className="flex items-center justify-between border-b border-primary/30 pb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-foreground">
                Filtros
              </span>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="font-mono text-[11px] uppercase tracking-wider text-cyan hover:underline"
                >
                  Limpiar ({activeCount})
                </button>
              )}
            </div>
            {filters}
          </div>
        </aside>

        {/* mobile filter toggle */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex w-full items-center justify-between border border-border bg-card px-4 py-3 font-mono text-xs uppercase tracking-widest text-foreground"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-cyan" />
              Filtros {activeCount > 0 && `(${activeCount})`}
            </span>
            {mobileOpen ? (
              <X className="size-4" />
            ) : (
              <span className="text-cyan">+</span>
            )}
          </button>
          {mobileOpen && (
            <div className="mt-2 border border-border bg-card px-4">
              {filters}
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="my-4 font-mono text-[11px] uppercase tracking-wider text-cyan hover:underline"
                >
                  Limpiar filtros ({activeCount})
                </button>
              )}
            </div>
          )}
        </div>

        {/* results */}
        <div className="flex-1">
          <div className="mb-5 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span>
              <span className="text-cyan">{results.length}</span> resultado
              {results.length !== 1 && 's'}
            </span>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((d) => (
                <DesignCard key={d.id} design={d} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border border-dashed border-border py-24 text-center">
              <Search className="size-8 text-muted-foreground" />
              <p className="mt-4 font-mono text-sm text-foreground">
                Sin resultados
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Prueba con otros términos o limpia los filtros.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 font-mono text-[11px] uppercase tracking-wider text-cyan hover:underline"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
