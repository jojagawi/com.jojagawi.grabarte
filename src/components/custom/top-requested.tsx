import { ShowcaseCard, type SeasonShowcaseItem } from "@/components/custom/showcase-card"

interface TopRequestedProps {
  items: SeasonShowcaseItem[]
}

// "Los más pedidos": diseños publicados ordenados por pedidos ganados en HubSpot
// (Designs.requests). No muestra el número: el orden ya comunica la popularidad.
export function TopRequested({ items }: TopRequestedProps) {
  return (
    <section id="mas-pedidos" aria-labelledby="mas-pedidos-titulo" className="pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Los más pedidos
          </span>
          <h2
            id="mas-pedidos-titulo"
            className="font-serif text-3xl font-bold text-foreground text-balance sm:text-4xl"
          >
            Lo que más nos piden
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Los diseños con más pedidos de nuestros clientes. Ábrelos para ver qué puedes personalizar.
          </p>
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
