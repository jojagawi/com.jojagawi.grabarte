import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export type TestimonialItem = {
  id: number | string
  name: string
  role: string
  content: string
  rating: number
  product: string
}

type TestimonialsProps = {
  testimonials: TestimonialItem[]
}

// Columnas según cuántos testimonios hay, para no dejar huecos en la rejilla.
const gridColumnsByCount: Record<number, string> = {
  1: "max-w-xl mx-auto",
  2: "md:grid-cols-2 max-w-4xl mx-auto",
  3: "md:grid-cols-2 lg:grid-cols-3",
}

// Iniciales del primer y último nombre: "María de los Ángeles" → "MÁ".
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) {
    return "?"
  }
  const first = words[0][0]
  const last = words.length > 1 ? words[words.length - 1][0] : ""
  return `${first}${last}`.toUpperCase()
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) {
    return null
  }

  const gridColumns = gridColumnsByCount[testimonials.length] ?? "md:grid-cols-2 lg:grid-cols-4"

  return (
    <section className="py-24 bg-linear-to-br from-primary/5 to-inspirarte-teal/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-inspirarte-olive/10 text-inspirarte-olive text-sm font-medium mb-4">
            Testimonios
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Lo que dicen{" "}
            <span className="text-primary">nuestros clientes</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Cada proyecto es una historia de éxito. Conoce las experiencias de
            quienes ya confiaron en nosotros.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className={`grid gap-6 ${gridColumns}`}>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 border border-border"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                <span className="sr-only">Calificación: {testimonial.rating} de 5</span>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden="true"
                    className={
                      i < testimonial.rating
                        ? "w-4 h-4 fill-inspirarte-green text-inspirarte-green"
                        : "w-4 h-4 text-border"
                    }
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="w-10 h-10 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm"
                >
                  {getInitials(testimonial.name)}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Product Badge */}
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-xs text-primary font-medium">
                  {testimonial.product}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            <Link href="/agregar-calificacion">Agregar mi calificación</Link>
          </Button>
        </div>

        {/* Bottom Stats */}
        {/*
        //TODO Agregar cuando se tengan estadísticas
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-white rounded-2xl border border-border">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground mt-1">Clientes satisfechos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-inspirarte-teal">1000+</div>
            <div className="text-sm text-muted-foreground mt-1">Productos entregados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#00B003]">98%</div>
            <div className="text-sm text-muted-foreground mt-1">Tasa de satisfacción</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#585106]">4.9★</div>
            <div className="text-sm text-muted-foreground mt-1">Calificación promedio</div>
          </div>
      </div>
      */}
      </div>
    </section>
  );
}
