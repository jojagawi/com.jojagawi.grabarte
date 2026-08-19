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

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="py-24 bg-linear-to-br from-[#4290A3]/5 to-[#1FA4A7]/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#585106]/10 text-[#585106] text-sm font-medium mb-4">
            Testimonios
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Lo que dicen{" "}
            <span className="text-[#4290A3]">nuestros clientes</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Cada proyecto es una historia de éxito. Conoce las experiencias de
            quienes ya confiaron en nosotros.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#00B003] text-[#00B003]"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#4290A3] to-[#1FA4A7] flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
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
                <span className="text-xs text-[#4290A3] font-medium">
                  {testimonial.product}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild className="bg-[#4290A3] hover:bg-[#1FA4A7] text-white">
            <Link href="/agregar-calificacion">Agregar mi calificacion</Link>
          </Button>
        </div>

        {/* Bottom Stats */}
        {/*
        //TODO Agregar cuando se tengan estadísticas
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-white rounded-2xl border border-border">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#4290A3]">500+</div>
            <div className="text-sm text-muted-foreground mt-1">Clientes satisfechos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#1FA4A7]">1000+</div>
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
