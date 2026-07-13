import Link from 'next/link'
import { Layers, Square, Hexagon, Coffee } from 'lucide-react'

const MATERIALS = [
  {
    name: 'MDF',
    icon: Layers,
    desc: 'Cajas, decoración y maquetas. Espesores de 2 a 9mm.',
    href: '/catalogo?material=MDF',
  },
  {
    name: 'Cuero',
    icon: Square,
    desc: 'Carteras, llaveros y accesorios grabados.',
    href: '/catalogo?material=Cuero',
  },
  {
    name: 'Metal',
    icon: Hexagon,
    desc: 'Paneles, señalética y piezas de precisión.',
    href: '/catalogo?material=Metal',
  },
  {
    name: 'Termo Yeti',
    icon: Coffee,
    desc: 'Grabado rotativo personalizado para termos.',
    href: '/catalogo?material=Termo+Yeti',
  },
]

export function Materials() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
              / Materiales
            </span>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Para cada superficie
            </h2>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {MATERIALS.map((m) => (
            <Link
              key={m.name}
              href={m.href}
              className="group relative bg-background p-6 transition-colors hover:bg-card"
            >
              <m.icon className="size-7 text-cyan transition-transform group-hover:scale-110" />
              <h3 className="mt-5 font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
                {m.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {m.desc}
              </p>
              <span className="mt-4 inline-block font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-cyan">
                Ver diseños →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
