import { ShowcaseCard, type SeasonShowcaseItem } from "@/components/custom/showcase-card"

interface DesignGridSectionProps {
  id: string
  eyebrow: string
  title: string
  description: string
  items: SeasonShowcaseItem[]
}

// Sección de la portada con una rejilla de diseños ("Los más pedidos", "Lo más nuevo").
// Va después de otra sección con padding inferior, por eso solo lleva pb-24.
export function DesignGridSection({ id, eyebrow, title, description, items }: DesignGridSectionProps) {
  const titleId = `${id}-titulo`

  return (
    <section id={id} aria-labelledby={titleId} className="pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            {eyebrow}
          </span>
          <h2 id={titleId} className="font-serif text-3xl font-bold text-foreground text-balance sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </div>

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.id}>
              <ShowcaseCard item={item} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
