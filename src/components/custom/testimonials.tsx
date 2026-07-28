import { Star } from "lucide-react"

const testimonials = [
  {
    name: "María González",
    role: "Organizadora de eventos",
    content: "Pedí 150 llaveros para una boda y quedaron hermosos. El equipo fue súper atento con los cambios de diseño. ¡100% recomendados!",
    rating: 5,
    product: "Llaveros para boda",
  },
  {
    name: "Carlos Rodríguez",
    role: "Emprendedor",
    content: "Uso sus termos grabados como regalo corporativo para mis clientes. La calidad del grabado es impecable y siempre entregan a tiempo.",
    rating: 5,
    product: "Termos corporativos",
  },
  {
    name: "Ana Martínez",
    role: "Mamá creativa",
    content: "Las figuras de MDF para el cumpleaños de mi hija fueron el hit de la fiesta. Personalizaron todo con su nombre y los colores que quería.",
    rating: 5,
    product: "Decoración cumpleaños",
  },
  {
    name: "Roberto Sánchez",
    role: "Profesor",
    content: "Regalé carteras grabadas a mis compañeros de trabajo. El detalle del grabado en piel es muy elegante. Excelente relación calidad-precio.",
    rating: 5,
    product: "Carteras de piel",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#4290A3]/5 to-[#1FA4A7]/5">
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
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4290A3] to-[#1FA4A7] flex items-center justify-center text-white font-semibold text-sm">
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
