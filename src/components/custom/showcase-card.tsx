import Link from "next/link"
import Image from "next/image"
import { PersonalizableTag } from "@/components/custom/product-personalization"

// Tarjeta de un diseño del catálogo: la usan la vitrina de la portada y /temporada/[slug].

export interface SeasonShowcaseItem {
  id: number
  name: string
  href: string
  image: string
  occasion: string | null
  isCustomizable: boolean
  productionTime: string | null
}

export function ShowcaseCard({ item }: { item: SeasonShowcaseItem }) {
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
