"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const defaultHeroImage = "/dam/dafault-image-product.webp"

const fallbackMarqueeCategories = [
  "Navidad",
  "Dia del Padre",
  "Dia de la Madre",
  "Bodas",
  "XV Anos",
  "Cumpleanos",
  "Graduaciones",
  "Dia del Nino",
]

export type HeroDesignItem = {
  id: number
  name: string
  description: string
  image: string
  categories: string[]
}

type HeroProps = {
  designs: HeroDesignItem[]
  marqueeCategories: string[]
}

export function Hero({ designs, marqueeCategories }: HeroProps) {
  const featuredDesign = designs[0]
  const secondaryDesigns = designs.slice(1, 3)
  const marqueeItems = marqueeCategories.length > 0 ? marqueeCategories : fallbackMarqueeCategories
  const marqueeText = `✦ ${marqueeItems.join(" ✦ ")}`

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-[#4290A3]/5" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234290A3' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4290A3]/10 text-[#4290A3]">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                Productos 100% personalizados
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Transforma tus ideas en{" "}
              <span className="text-[#4290A3]">regalos únicos</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Creamos productos personalizados con impresión láser y corte en
              MDF. Desde termos y llaveros hasta figuras decorativas para cada
              ocasión especial.
              <strong className="text-foreground"> ¡Hazlo tuyo!</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#4290A3] hover:bg-[#1FA4A7] text-white group"
              >
                <Link href="/contacto">
                  Solicitar cotización
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#4290A3] text-[#4290A3] hover:bg-[#4290A3]/10"
              >
                <Link href="/productos">Ver productos</Link>
              </Button>
            </div>

            {/* Stats */}
            {/*
            //TODO Agregar cuando se tengan estadísticas
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-[#1FA4A7]">500+</div>
                <div className="text-sm text-muted-foreground">
                  Clientes felices
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#00B003]">1000+</div>
                <div className="text-sm text-muted-foreground">
                  Productos creados
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#4290A3]">5★</div>
                <div className="text-sm text-muted-foreground">
                  Calificación
                </div>
              </div>
            </div>
            */}
          </div>

          {/* Hero Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Main Product Image */}
              <div className="col-span-2 relative aspect-4/3 rounded-2xl overflow-hidden group shadow-lg">
                <Image
                  src={featuredDesign?.image || defaultHeroImage}
                  alt={`Diseno destacado: ${featuredDesign?.name || "Producto personalizado"}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#4290A3] mb-2">
                    Destacado
                  </span>
                  <p className="text-white font-medium">
                    {featuredDesign?.name || "Producto personalizado"}
                  </p>
                  <p className="text-white/80 text-sm">
                    {featuredDesign?.description || "Con grabado laser de precision"}
                  </p>
                </div>
              </div>

              {/* Secondary Images */}
              {Array.from({ length: 2 }).map((_, index) => {
                const design = secondaryDesigns[index]

                return (
                  <div key={design?.id ?? `fallback-secondary-${index}`} className="relative aspect-square rounded-xl overflow-hidden shadow-md group">
                    <Image
                      src={design?.image || featuredDesign?.image || defaultHeroImage}
                      alt={`Diseno: ${design?.name || "Producto personalizado"}`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white text-sm font-medium">
                        {design?.categories[0] || design?.name || "Personalizado"}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -left-4 bg-white shadow-xl rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#00B003]/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#00B003]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Envío a todo México
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Entrega segura
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Marquee */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#4290A3] py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite]">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="mx-8 text-white/90 text-sm font-medium">
              {marqueeText}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
