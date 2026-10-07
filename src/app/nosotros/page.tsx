import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildPageMetadata } from "@/lib/metadata";
import { buildAboutPageJsonLd, serializeJsonLd } from "@/lib/structured-data";

const description =
  "InspiraArte es un taller de corte y grabado láser en Ciudad de México, fundado en 2026. Diseñamos y producimos regalos y productos personalizados.";

export const metadata: Metadata = buildPageMetadata({
  title: "Nosotros: taller de corte láser en CDMX | InspiraArte",
  description,
  path: "/nosotros",
  keywords: ["InspiraArte", "taller de corte láser", "grabado láser CDMX", "productos personalizados", "Ciudad de México"],
  imageAlt: "Taller de corte y grabado láser InspiraArte en Ciudad de México",
});

export const llmstxt = {
  title: "Nosotros",
  description: "Quiénes somos, qué hacemos hoy y hacia dónde crece el taller.",
};

const aboutJsonLd = buildAboutPageJsonLd({
  path: "/nosotros/",
  name: "Nosotros | InspiraArte",
  description,
});

// Lo que el taller garantiza hoy en cada pedido (mismos compromisos que /faq y /proceso).
const commitments = [
  "Respondemos tu solicitud en menos de 24 horas.",
  "Te enviamos una propuesta de diseño para aprobar antes de producir.",
  "Puedes pedir desde una sola pieza, sin pedido mínimo.",
  "Enviamos a toda la República Mexicana o puedes recoger en CDMX.",
];

const roadmap = [
  { title: "Impresión 3D", text: "Figuras, piezas y prototipos que el láser no puede hacer." },
  { title: "Impresión", text: "Para sumar color y fotografía a tus piezas." },
  { title: "Plotter de corte", text: "Vinil y etiquetas para decorar y marcar." },
];

export default function Nosotros() {
  return (
    <section className="py-24 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(aboutJsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        <header className="space-y-4">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Nosotros
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Un taller de corte láser en CDMX que convierte tus ideas en piezas únicas
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            InspiraArte es un taller de corte y grabado láser en la Ciudad de México, fundado en 2026.
            Diseñamos y producimos regalos, recuerdos para eventos y artículos con el logo de tu empresa,
            desde una sola pieza.
          </p>
        </header>

        <article className="space-y-10 text-foreground">
          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">¿Quiénes somos?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Somos un equipo dedicado al corte y grabado láser. Empezamos en 2026 con una idea sencilla:
              que cualquier persona pueda tener una pieza hecha a su medida, sin pedidos mínimos y viendo
              el diseño antes de que se produzca. Somos un taller nuevo, así que cada pedido lo cuidamos
              de principio a fin.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">¿Qué hacemos?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cortamos y grabamos con láser piezas personalizadas: adornos y decoración de temporada,
              altares y piezas para Día de muertos, regalos con nombre, artículos de oficina y recuerdos
              para bodas, XV años, primeras comuniones y graduaciones. También hacemos regalos corporativos con tu
              logo.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Puedes partir de un diseño de nuestro{" "}
              <Link href="/productos" className="text-primary font-medium hover:underline underline-offset-4">
                catálogo
              </Link>{" "}
              o traernos tu idea, una foto o un boceto: lo convertimos en un diseño listo para producir.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">¿Cómo trabajamos?</h2>
            <ul className="space-y-2 text-muted-foreground">
              {commitments.map((commitment) => (
                <li key={commitment} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {commitment}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground">
              Conoce el paso a paso en{" "}
              <Link href="/proceso" className="text-primary font-medium hover:underline underline-offset-4">
                cómo pedir tu producto personalizado
              </Link>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">¿Dónde estamos?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nuestro taller está en la Ciudad de México. Desde aquí enviamos a toda la República
              Mexicana, y si estás en CDMX puedes recoger tu pedido en el taller sin costo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl">¿Qué sigue para InspiraArte?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Hoy nos especializamos en corte y grabado láser, y estamos creciendo para ofrecerte más
              técnicas en el mismo lugar:
            </p>
            <ul className="grid gap-4 sm:grid-cols-3">
              {roadmap.map((item) => (
                <li key={item.title} className="rounded-xl border border-border bg-muted/30 p-5">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <div className="flex flex-col gap-6 rounded-2xl bg-primary p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">Sé de nuestros primeros clientes</h2>
            <p className="mt-2 text-white">Cuéntanos tu idea y te enviamos una propuesta sin costo ni compromiso.</p>
          </div>
          <Link
            href="/contacto"
            className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-6 font-semibold text-primary transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Cotizar mi idea
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
