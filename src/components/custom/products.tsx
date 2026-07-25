"use client"

import { useState } from "react"
import Image from "next/image"
import { Gift, Calendar, Briefcase, Heart, GraduationCap, Baby, PartyPopper, Church } from "lucide-react"
import { cn } from "@/lib/utils"

const products = [
  {
    id: 1,
    name: "Termos Personalizados",
    description: "Grabado láser de alta precisión en acero inoxidable. Perfectos para regalar o uso diario.",
    image: "/images/termo-personalizado.webp",
    color: "from-[#4290A3]/10 to-[#1FA4A7]/10",
    occasions: ["Día del Padre", "Graduaciones", "Corporativo"],
  },
  {
    id: 2,
    name: "Llaveros Grabados",
    description: "Diseños únicos en madera, acrílico o metal. Ideales para recuerdos de eventos.",
    image: "/images/llaveros-grabados.webp",
    color: "from-[#1FA4A7]/10 to-[#3ACBFE]/10",
    occasions: ["Bodas", "XV Años", "Cumpleaños"],
  },
  {
    id: 3,
    name: "Carteras y Carpetas de Piel",
    description: "Grabado elegante en piel genuina. Un regalo con clase y personalidad.",
    image: "/images/cartera-piel.webp",
    color: "from-[#585106]/10 to-[#4290A3]/10",
    occasions: ["Día del Padre", "Graduaciones", "Ejecutivo"],
  },
  {
    id: 4,
    name: "Figuras Decorativas MDF",
    description: "Corte láser de precisión para crear decoraciones únicas para cualquier ocasión.",
    image: "/images/figuras-mdf.webp",
    color: "from-[#00B003]/10 to-[#1FA4A7]/10",
    occasions: ["Navidad", "Día de la Madre", "Decoración"],
  },
]

const occasions = [
  { name: "Navidad", icon: Gift, color: "#00B003" },
  { name: "Día del Padre", icon: Briefcase, color: "#4290A3" },
  { name: "Día de la Madre", icon: Heart, color: "#1FA4A7" },
  { name: "Bodas", icon: Church, color: "#585106" },
  { name: "XV Años", icon: PartyPopper, color: "#3ACBFE" },
  { name: "Graduaciones", icon: GraduationCap, color: "#4290A3" },
  { name: "Día del Niño", icon: Baby, color: "#00B003" },
  { name: "Cumpleaños", icon: Calendar, color: "#1FA4A7" },
]

export function Products() {
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null)

  const filteredProducts = selectedOccasion
    ? products.filter(p => p.occasions.some(o => o.toLowerCase().includes(selectedOccasion.toLowerCase())))
    : products

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

        {/* Occasions Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedOccasion(null)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              !selectedOccasion
                ? "bg-[#4290A3] text-white shadow-lg shadow-[#4290A3]/25"
                : "bg-white text-foreground hover:bg-[#4290A3]/10 border border-border"
            )}
          >
            Todos
          </button>
          {occasions.map((occasion) => {
            const Icon = occasion.icon
            return (
              <button
                key={occasion.name}
                onClick={() => setSelectedOccasion(occasion.name === selectedOccasion ? null : occasion.name)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                  selectedOccasion === occasion.name
                    ? "bg-[#4290A3] text-white shadow-lg shadow-[#4290A3]/25"
                    : "bg-white text-foreground hover:bg-[#4290A3]/10 border border-border"
                )}
              >
                <Icon className="w-4 h-4" />
                {occasion.name}
              </button>
            )
          })}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:shadow-[#4290A3]/10 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className={cn(
                "relative aspect-square bg-gradient-to-br overflow-hidden",
                product.color
              )}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
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
                  {product.occasions.map((occasion) => (
                    <span
                      key={occasion}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                    >
                      {occasion}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            ¿No encuentras lo que buscas? <span className="text-[#4290A3] font-medium">¡Lo creamos para ti!</span>
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 text-[#4290A3] font-medium hover:underline"
          >
            Solicitar producto personalizado →
          </a>
        </div>
      </div>
    </section>
  )
}
