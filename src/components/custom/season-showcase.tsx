"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { PersonalizableTag } from "@/components/custom/product-personalization"

export interface SeasonShowcaseItem {
  id: number
  name: string
  href: string
  image: string
  occasion: string | null
  isCustomizable: boolean
  productionTime: string | null
}

interface SeasonShowcaseProps {
  eyebrow: string
  title: string
  description: string
  items: SeasonShowcaseItem[]
  totalDesigns: number
}

// Ancho de tarjeta: asoma la siguiente en móvil para que se note que hay más.
const slideClassName = "w-[78%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"

function ShowcaseCard({ item }: { item: SeasonShowcaseItem }) {
  return (
    <Link
      href={item.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 focus-visible:-translate-y-1 focus-visible:shadow-xl focus-visible:shadow-primary/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={item.image}
          alt={`Foto de ${item.name}`}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {item.isCustomizable && <PersonalizableTag className="absolute left-3 top-3" />}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-medium text-foreground line-clamp-2">{item.name}</h3>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
          {item.occasion && (
            <span className="rounded-lg bg-muted px-2 py-1 text-muted-foreground">{item.occasion}</span>
          )}
          {item.productionTime && (
            <span className="text-muted-foreground">Producción: {item.productionTime}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export function SeasonShowcase({ eyebrow, title, description, items, totalDesigns }: SeasonShowcaseProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateScrollState = useCallback(() => {
    const track = trackRef.current
    if (!track) {
      return
    }
    setCanScrollPrev(track.scrollLeft > 4)
    setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) {
      return
    }
    updateScrollState()
    track.addEventListener("scroll", updateScrollState, { passive: true })
    const resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(track)
    return () => {
      track.removeEventListener("scroll", updateScrollState)
      resizeObserver.disconnect()
    }
  }, [updateScrollState])

  // Avanza casi una pantalla de tarjetas; sin animación si el usuario pidió menos movimiento.
  function scrollByPage(direction: 1 | -1) {
    const track = trackRef.current
    if (!track) {
      return
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: reduceMotion ? "auto" : "smooth" })
  }

  const arrowClassName =
    "inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-primary shadow-xs transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40"

  return (
    <section id="temporada" aria-labelledby="temporada-titulo" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              {eyebrow}
            </span>
            <h2
              id="temporada-titulo"
              className="font-serif text-3xl font-bold text-foreground text-balance sm:text-4xl lg:text-5xl"
            >
              {title}
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">{description}</p>
          </div>

          <div className="hidden shrink-0 gap-2 md:flex">
            <button
              type="button"
              className={arrowClassName}
              onClick={() => scrollByPage(-1)}
              disabled={!canScrollPrev}
              aria-controls="temporada-lista"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
              <span className="sr-only">Diseños anteriores</span>
            </button>
            <button
              type="button"
              className={arrowClassName}
              onClick={() => scrollByPage(1)}
              disabled={!canScrollNext}
              aria-controls="temporada-lista"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
              <span className="sr-only">Más diseños</span>
            </button>
          </div>
        </div>

        {/* py y -my: espacio para que la elevación y la sombra no se recorten dentro del scroll. */}
        <ul
          id="temporada-lista"
          ref={trackRef}
          aria-label={title}
          className="-my-4 flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain py-4 [scrollbar-width:thin]"
        >
          {items.map((item) => (
            <li key={item.id} className={slideClassName}>
              <ShowcaseCard item={item} />
            </li>
          ))}

          <li className={slideClassName}>
            <Link
              href="/productos"
              className="group flex h-full min-h-64 flex-col justify-end gap-3 rounded-2xl border border-border bg-primary/5 p-6 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="font-serif text-2xl font-bold text-foreground">
                Ver los {totalDesigns} diseños
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                Ir al catálogo
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  )
}
