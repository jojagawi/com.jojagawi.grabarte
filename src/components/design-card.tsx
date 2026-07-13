import Link from 'next/link'
import Image from 'next/image'
import type { Design } from '@/lib/designs'
import { Download } from 'lucide-react'

export function DesignCard({ design }: { design: Design }) {
  return (
    <Link
      href={`/diseno/${design.slug}`}
      className="group relative flex flex-col overflow-hidden border border-border bg-card transition-colors hover:border-primary/60"
    >
      {/* corner ticks */}
      <span className="absolute left-0 top-0 z-10 size-3 border-l border-t border-primary/0 transition-colors group-hover:border-primary" />
      <span className="absolute right-0 top-0 z-10 size-3 border-r border-t border-primary/0 transition-colors group-hover:border-primary" />

      <div className="relative aspect-square overflow-hidden bg-black blueprint-grid-fine">
        <Image
          src={design.thumb || '/placeholder.svg'}
          alt={design.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {design.materials.map((m) => (
            <span
              key={m}
              className="border border-primary/40 bg-background/80 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan backdrop-blur-sm"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium leading-tight text-foreground text-balance">
            {design.name}
          </h3>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {design.category}
          </span>
        </div>

        <div className="mt-auto flex flex-wrap gap-1">
          {design.formats.slice(0, 5).map((f) => (
            <span
              key={f}
              className="border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-foreground"
            >
              .{f.toLowerCase()}
            </span>
          ))}
          {design.formats.length > 5 && (
            <span className="px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
              +{design.formats.length - 5}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 font-mono text-[11px] text-muted-foreground">
          <span>{design.author}</span>
          <span className="flex items-center gap-1">
            <Download className="size-3" />
            {design.downloads.toLocaleString('es')}
          </span>
        </div>
      </div>
    </Link>
  )
}
