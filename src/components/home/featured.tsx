import Link from 'next/link'
import { DESIGNS } from '@/lib/designs'
import { DesignCard } from '@/components/design-card'
import { ArrowRight } from 'lucide-react'

export function Featured() {
  const featured = DESIGNS.slice(0, 4)
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
              / Destacados
            </span>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Diseños populares
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-cyan"
          >
            Ver todo
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((d) => (
            <DesignCard key={d.id} design={d} />
          ))}
        </div>
      </div>
    </section>
  )
}
