import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FaWhatsapp } from "@react-icons/all-files/fa/FaWhatsapp"
import { Button } from "@/components/ui/button"

interface QuoteDoor {
  id: string
  title: string
  description: string
  checklistTitle: string
  checklist: string[]
  quoteLabel: string
  quoteSubject: string
  whatsappMessage: string
}

// Eventos y empresas casi no tienen piezas públicas: estas puertas llevan a cotizar
// con el contexto ya escrito en lugar de prometer un catálogo que todavía no existe.
// Solo usar datos que el sitio ya respalda (volumen, mayoreo, propuesta previa).
const doors: QuoteDoor[] = [
  {
    id: "evento",
    title: "Recuerdos para tu evento",
    description:
      "Bodas, XV años, primeras comuniones y graduaciones. Desde unas cuantas piezas hasta pedidos grandes para todos tus invitados, con la fecha de tu evento como límite.",
    checklistTitle: "Para cotizar, cuéntanos:",
    checklist: [
      "Tipo de evento y fecha",
      "Cuántas piezas necesitas",
      "Nombres, fecha o frase para grabar",
    ],
    quoteLabel: "Cotizar para mi evento",
    quoteSubject: "Recuerdos para evento",
    whatsappMessage:
      "Hola, quiero cotizar recuerdos para mi evento.\n\nTipo de evento: \nCantidad: \nFecha del evento: ",
  },
  {
    id: "empresa",
    title: "Artículos con el logo de tu empresa",
    description:
      "Regalos corporativos, de fin de año o promocionales con tu identidad, con precio de mayoreo según la cantidad.",
    checklistTitle: "Para cotizar, cuéntanos:",
    checklist: [
      "Cantidad y fecha de entrega",
      "Tu logo, de preferencia en vector (SVG, AI o PDF)",
      "Para quién es: clientes, equipo o un evento",
    ],
    quoteLabel: "Cotizar para mi empresa",
    quoteSubject: "Artículos con logo para empresa",
    whatsappMessage:
      "Hola, quiero cotizar artículos con el logo de mi empresa.\n\nCantidad: \nFecha de entrega: \n¿Tienes el logo en vector?: ",
  },
]

function buildWhatsappHref(message: string): string | null {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "")
  return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : null
}

export function QuoteDoors() {
  return (
    <section id="eventos-y-empresas" aria-labelledby="eventos-titulo" className="pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Pedidos en cantidad
          </span>
          <h2
            id="eventos-titulo"
            className="font-serif text-3xl font-bold text-foreground text-balance sm:text-4xl"
          >
            ¿Lo necesitas para un evento o tu empresa?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Diseñamos la pieza contigo y te enviamos una propuesta antes de producir.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {doors.map((door) => {
            const whatsappHref = buildWhatsappHref(door.whatsappMessage)

            return (
              <article
                key={door.id}
                aria-labelledby={`puerta-${door.id}`}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-8"
              >
                <h3 id={`puerta-${door.id}`} className="font-serif text-2xl font-bold text-foreground">
                  {door.title}
                </h3>
                <p className="mt-3 text-muted-foreground">{door.description}</p>

                <p className="mt-6 text-sm font-medium text-foreground">{door.checklistTitle}</p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  {door.checklist.map((entry) => (
                    <li key={entry} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      {entry}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                  <Button
                    asChild
                    className="group bg-primary text-primary-foreground hover:bg-inspirarte-petroleum-deep"
                  >
                    <Link href={`/contacto?producto=${encodeURIComponent(door.quoteSubject)}`}>
                      {door.quoteLabel}
                      <ArrowRight
                        aria-hidden="true"
                        className="ml-1 size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </Link>
                  </Button>
                  {whatsappHref && (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      <FaWhatsapp aria-hidden="true" className="size-4" />
                      Preguntar por WhatsApp
                    </a>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
