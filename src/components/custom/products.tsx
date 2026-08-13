"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Gift, Calendar, Briefcase, Heart, GraduationCap, Baby, PartyPopper, Church } from "lucide-react"
import { slugify } from "@/lib/slug"
import { cn } from "@/lib/utils"

type ProductListItem = {
  id: number
  name: string
  description: string
  image: string
  color: string
  categories: string[]
  materialName: string | null
  isCustomizable: boolean
  isActive: boolean
  isTested: boolean
  showInHome: boolean
  showInSite: boolean
}

type ProductCategory = {
  id: number
  name: string
}

interface ProductsProps {
  products: ProductListItem[]
  categories: ProductCategory[]
  materialOptions: string[]
  enableDevFilters?: boolean
}

type BooleanFilter = "all" | "yes" | "no"

function matchesBooleanFilter(value: boolean, filter: BooleanFilter): boolean {
  if (filter === "all") {
    return true
  }

  return filter === "yes" ? value : !value
}

const categoryIcons = [Gift, Briefcase, Heart, Church, PartyPopper, GraduationCap, Baby, Calendar]
const categoryColors = ["#00B003", "#4290A3", "#1FA4A7", "#585106", "#3ACBFE"]

export function Products({ products, categories, materialOptions, enableDevFilters = false }: ProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [customizableFilter, setCustomizableFilter] = useState<BooleanFilter>("all")
  const [statusFilter, setStatusFilter] = useState<BooleanFilter>("all")
  const [testedFilter, setTestedFilter] = useState<BooleanFilter>("all")
  const [showInHomeFilter, setShowInHomeFilter] = useState<BooleanFilter>("all")
  const [showInSiteFilter, setShowInSiteFilter] = useState<BooleanFilter>("all")
  const [materialFilter, setMaterialFilter] = useState<string>("all")

  const filteredProducts = products.filter((product) => {
    const byCategory = !selectedCategory || product.categories.includes(selectedCategory)
    const byCustomizable = matchesBooleanFilter(product.isCustomizable, customizableFilter)
    const byStatus = matchesBooleanFilter(product.isActive, statusFilter)
    const byTested = matchesBooleanFilter(product.isTested, testedFilter)
    const byShowInHome = matchesBooleanFilter(product.showInHome, showInHomeFilter)
    const byShowInSite = matchesBooleanFilter(product.showInSite, showInSiteFilter)
    const byMaterial = materialFilter === "all" || product.materialName === materialFilter

    return byCategory && byCustomizable && byStatus && byTested && byShowInHome && byShowInSite && byMaterial
  })

  return (
    <section id="productos" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4290A3]/10 text-[#4290A3] text-sm font-medium mb-4">
            Nuestros Productos
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Cada ocasión merece algo <span className="text-[#4290A3]">especial</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Desde un detalle único hasta pedidos corporativos, creamos lo que imaginas.
            Explora nuestras categorías y encuentra el regalo perfecto.
          </p>
        </div>

        {enableDevFilters && (
          <div className="rounded-2xl border border-border bg-white p-4 mb-8">
            <p className="text-sm font-medium text-foreground mb-3">Filtros de desarrollo</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              <select
                aria-label="Filtrar por personalizable"
                value={customizableFilter}
                onChange={(event) => setCustomizableFilter(event.target.value as BooleanFilter)}
                className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="all">Personalizable: Todos</option>
                <option value="yes">Personalizable: Si</option>
                <option value="no">Personalizable: No</option>
              </select>

              <select
                aria-label="Filtrar por material"
                value={materialFilter}
                onChange={(event) => setMaterialFilter(event.target.value)}
                className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="all">Material: Todos</option>
                {materialOptions.map((materialName) => (
                  <option key={materialName} value={materialName}>{materialName}</option>
                ))}
              </select>

              <select
                aria-label="Filtrar por status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as BooleanFilter)}
                className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="all">Status: Todos</option>
                <option value="yes">Status: Activo</option>
                <option value="no">Status: Inactivo</option>
              </select>

              <select
                aria-label="Filtrar por probado"
                value={testedFilter}
                onChange={(event) => setTestedFilter(event.target.value as BooleanFilter)}
                className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="all">Probado: Todos</option>
                <option value="yes">Probado: Si</option>
                <option value="no">Probado: No</option>
              </select>

              <select
                aria-label="Filtrar por mostrar en home"
                value={showInHomeFilter}
                onChange={(event) => setShowInHomeFilter(event.target.value as BooleanFilter)}
                className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="all">Mostrar en home: Todos</option>
                <option value="yes">Mostrar en home: Si</option>
                <option value="no">Mostrar en home: No</option>
              </select>

              <select
                aria-label="Filtrar por mostrar en sitio"
                value={showInSiteFilter}
                onChange={(event) => setShowInSiteFilter(event.target.value as BooleanFilter)}
                className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="all">Mostrar en sitio: Todos</option>
                <option value="yes">Mostrar en sitio: Si</option>
                <option value="no">Mostrar en sitio: No</option>
              </select>
            </div>
          </div>
        )}

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              !selectedCategory
                ? "bg-[#4290A3] text-white shadow-lg shadow-[#4290A3]/25"
                : "bg-white text-foreground hover:bg-[#4290A3]/10 border border-border"
            )}
          >
            Todos
          </button>
          {categories.map((category, index) => {
            const Icon = categoryIcons[index % categoryIcons.length]
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name === selectedCategory ? null : category.name)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                  selectedCategory === category.name
                    ? "bg-[#4290A3] text-white shadow-lg shadow-[#4290A3]/25"
                    : "bg-white text-foreground hover:bg-[#4290A3]/10 border border-border"
                )}
                style={{
                  borderColor: selectedCategory === category.name ? "transparent" : categoryColors[index % categoryColors.length],
                }}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            )
          })}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/productos/${product.id}-${slugify(product.name)}`}
              className="group block bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:shadow-[#4290A3]/10 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4290A3]/40"
            >
              {/* Product Image */}
              <div className={cn(
                "relative aspect-square bg-linear-to-br overflow-hidden",
                product.color
              )}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.categories.length === 0 && (
                    <span
                      key={`sin-categoria-${product.id}`}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                    >
                      Sin categoria
                    </span>
                  )}
                  {product.categories.map((categoryName) => (
                    <span
                      key={`${product.id}-${categoryName}`}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                    >
                      {categoryName}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            No hay diseños publicados para esta categoria por el momento.
          </p>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            ¿No encuentras lo que buscas? <span className="text-[#4290A3] font-medium">¡Lo creamos para ti!</span>
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 text-[#4290A3] font-medium hover:underline"
          >
            Solicitar producto personalizado →
          </a>
        </div>
      </div>
    </section>
  )
}
