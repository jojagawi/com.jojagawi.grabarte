import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HomeCta() {
  return (
    <section className="relative overflow-hidden blueprint-grid">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="relative mx-auto max-w-2xl border border-primary/40 bg-card p-8 text-center glow-cyan sm:p-12">
          <Upload className="mx-auto size-8 text-cyan" />
          <h2 className="mt-6 text-balance font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ¿Tienes un diseño para compartir?
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Sube tu modelo con miniatura, instrucciones y archivos de corte.
            Define materiales, dimensiones y formatos para que otros makers lo
            encuentren fácilmente.
          </p>
          <Link
            href="/subir"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'mt-8 font-mono text-xs uppercase tracking-widest',
            )}
          >
            <Upload className="size-4" />
            Subir mi diseño
          </Link>
        </div>
      </div>
    </section>
  )
}
