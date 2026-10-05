"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { ShowcaseCard, type SeasonShowcaseItem } from "@/components/custom/showcase-card"

export type { SeasonShowcaseItem }

export interface SeasonShowcaseLink {
  slug: string
  label: string
  // Diseños publicados de la temporada (incluye los que ya salen en el hero).
  count: number
}

interface SeasonShowcaseProps {
  eyebrow: string
  title: string
  description: string
  items: SeasonShowcaseItem[]
  totalDesigns: number
  // Con temporada activa, el carrusel cierra con una tarjeta por temporada en lugar del catálogo.
  seasonLinks: SeasonShowcaseLink[]
}

// Tarjeta de cierre: enlace a una página de temporada o al catálogo completo.
const closingCardClassName =
  "group flex h-full min-h-64 flex-col justify-end gap-3 rounded-2xl border border-border bg-primary/5 p-6 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"

// Ancho de tarjeta: asoma la siguiente en móvil para que se note que hay más.
const slideClassName = "w-[78%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"


export function SeasonShowcase({ eyebrow, title, description, items, totalDesigns, seasonLinks }: SeasonShowcaseProps) {
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

          {seasonLinks.length > 0 ? (
            seasonLinks.map((season) => (
              <li key={season.slug} className={slideClassName}>
                <Link href={`/temporada/${season.slug}`} className={closingCardClassName}>
                  <span className="font-serif text-2xl font-bold text-foreground">
                    Ver {season.count === 1 ? "el diseño" : `los ${season.count} diseños`} de {season.label}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    Ir a la temporada
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                    />
                  </span>
                </Link>
              </li>
            ))
          ) : (
            <li className={slideClassName}>
              <Link href="/productos" className={closingCardClassName}>
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
          )}
        </ul>
      </div>
    </section>
  )
}
