import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Clock, MapPin, Palette, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PersonalizableTag } from "@/components/custom/product-personalization"

const defaultHeroImage = "/dam/default-image-product.webp"

export type HeroDesignItem = {
  id: number
  name: string
  description: string
  image: string
  featuredImage: string
  secondaryImage: string
  categories: string[]
  href: string
  quoteHref: string
  isCustomizable: boolean
  productionTime: string | null
}

// Hechos que ya promete el sitio (FAQ, /contacto y ficha de producto); no agregar cifras nuevas aquí.
const quoteFacts = [
  { icon: Clock, text: "Respuesta en menos de 24 horas" },
  { icon: Palette, text: "Propuesta de diseño antes de producir" },
  { icon: Truck, text: "Envío a todo México" },
]

type HeroProps = {
  designs: HeroDesignItem[]
}

type HeroTileProps = {
  design: HeroDesignItem
  featured?: boolean
  wide?: boolean
}

// DESIGN.md "The Lift On Interest Rule": plana con borde en reposo; se eleva en hover
// y cuando el enlace del nombre recibe foco de teclado.
const tileClassName =
  "group relative h-full overflow-hidden rounded-2xl border border-border bg-card transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 has-[h3_a:focus-visible]:-translate-y-1 has-[h3_a:focus-visible]:shadow-xl has-[h3_a:focus-visible]:shadow-primary/10 has-[h3_a:focus-visible]:ring-3 has-[h3_a:focus-visible]:ring-ring/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"

// Toda la tarjeta abre la ficha (enlace estirado sobre el nombre); el botón de
// cotizar queda por encima para llevar el producto a /contacto.
function HeroTile({ design, featured = false, wide = false }: HeroTileProps) {
  const aspectClassName = featured ? "aspect-4/3" : wide ? "aspect-2/1" : "aspect-square"

  return (
    <article className={tileClassName}>
      <div className={`relative isolate flex flex-col justify-end ${aspectClassName}`}>
        <Image
          src={featured ? design.featuredImage : design.secondaryImage}
          alt={`Foto de ${design.name}`}
          fill
          loading={featured ? "eager" : "lazy"}
          fetchPriority={featured ? "high" : "auto"}
          sizes={featured || wide ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
          className="-z-10 object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

        {design.isCustomizable && (
          <PersonalizableTag className="absolute left-3 top-3" />
        )}

        {/* Sin position: el ::after del enlace se estira sobre toda la tarjeta. */}
        <div className={featured ? "p-5" : "p-3"}>
          <h3 className={`font-medium text-white ${featured ? "text-lg" : "text-sm line-clamp-2"}`}>
            <Link
              href={design.href}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {design.name}
            </Link>
          </h3>

          {featured && (
            <>
              <p className="mt-1 max-w-prose text-sm text-white/85 line-clamp-2">
                {design.description}
              </p>
              {design.productionTime && (
                <p className="mt-1 text-sm text-white/85">
                  Producción: {design.productionTime}
                </p>
              )}
              <Button
                asChild
                className="relative z-10 mt-4 h-11 sm:h-9 bg-primary text-primary-foreground hover:bg-inspirarte-petroleum-deep group/quote"
              >
                <Link href={design.quoteHref}>
                  Cotizar este diseño
                  <ArrowRight
                    aria-hidden="true"
                    className="ml-1 size-4 transition-transform group-hover/quote:translate-x-1 motion-reduce:transition-none"
                  />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

// Sin diseños disponibles: imagen genérica, sin enlace ni promesas sobre un producto.
function HeroFallbackTile() {
  return (
    <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border bg-card">
      <Image
        src={defaultHeroImage}
        alt="Pieza personalizada de InspiraArte"
        fill
        loading="eager"
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  )
}

export function Hero({ designs }: HeroProps) {
  const featuredDesign = designs[0]
  const secondaryDesigns = designs.slice(1, 3)

  return (
    <section
      id="inicio"
      className="relative flex min-h-svh flex-col pt-16 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-primary/5" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23367A8A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative flex flex-1 items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              {/* La etiqueta va dentro del h1: el encabezado lleva la búsqueda ("regalos personalizados")
                  y el lugar, y el titular grande queda igual. */}
              <h1 className="flex flex-col items-start gap-8 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-sans text-sm font-medium leading-normal">
                  <MapPin aria-hidden="true" className="w-4 h-4" />
                  Regalos personalizados en Ciudad de México
                </span>
                <span>
                  Transforma tus ideas en{" "}
                  <span className="text-primary">regalos únicos</span>
                </span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Diseñamos y producimos piezas personalizadas en MDF, acrílico,
                metal y más, con corte y grabado láser. Para regalar, para tu
                evento o con el logo de tu empresa.
              </p>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-inspirarte-petroleum-deep text-white group"
                  >
                    <Link href="/contacto">
                      Cotizar mi idea
                      <ArrowRight aria-hidden="true" className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform motion-reduce:transition-none" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Link href="/productos">Ver productos</Link>
                  </Button>
                </div>

                <ul className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-6">
                  {quoteFacts.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-2">
                      <Icon aria-hidden="true" className="size-4 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              {/*
              //TODO Agregar cuando se tengan estadísticas
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-inspirarte-teal">500+</div>
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
                  <div className="text-3xl font-bold text-primary">5★</div>
                  <div className="text-sm text-muted-foreground">
                    Calificación
                  </div>
                </div>
              </div>
              */}
            </div>

            {/* Hero Image Grid */}
            <div>
              <h2 className="sr-only">Piezas destacadas</h2>
              <ul className="grid grid-cols-2 gap-4">
                <li className="col-span-2">
                  {featuredDesign ? <HeroTile design={featuredDesign} featured /> : <HeroFallbackTile />}
                </li>

                {secondaryDesigns.map((design) => (
                  <li key={design.id} className={secondaryDesigns.length === 1 ? "col-span-2" : undefined}>
                    <HeroTile design={design} wide={secondaryDesigns.length === 1} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
