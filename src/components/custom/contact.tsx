"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MessageSquare, Palette, Truck, X } from "lucide-react"
import { FaWhatsapp } from "@react-icons/all-files/fa/FaWhatsapp"
import { ContactForm, type QuoteLeadTime } from "@/components/custom/contact-form"
import { ContactMethods } from "@/components/custom/contact-methods"
import { buildWhatsappQuoteHref } from "@/lib/quote-request"

const MAX_PRODUCT_LENGTH = 200
const MAX_LEAD_TIME_LENGTH = 80
// Solo miniaturas del bucket de vistas previas: la URL la puede escribir cualquiera.
const PREVIEW_PATH_PATTERN = /^preview\/[A-Za-z0-9._-]+\.(webp|png|jpe?g)$/u
// Solo rutas internas de fichas: evita convertir la tarjeta en un enlace a cualquier sitio.
const PRODUCT_PATH_PATTERN = /^\/productos\/\d+-[a-z0-9-]+\/?$/u
const mediaBaseUrl = `${process.env.NEXT_PUBLIC_S3_PROTOCOL || "http"}://${process.env.NEXT_PUBLIC_S3 || "dam.inspiraarte.com"}`

// Lo que pasa después de enviar, con las mismas promesas de /proceso y del mensaje de éxito.
const nextSteps = [
  { title: "Te respondemos en menos de 24 horas", detail: "Por correo o WhatsApp.", icon: MessageSquare },
  {
    title: "Recibes una propuesta de diseño",
    detail: "La revisas y la ajustamos contigo antes de producir.",
    icon: Palette,
  },
  { title: "Producimos y enviamos", detail: "Con tu aprobación, a cualquier parte de México.", icon: Truck },
]

function subscribeToNothing(): () => void {
  return () => {}
}

// Lee los parámetros que envía la ficha de producto. Se validan aquí porque la URL
// la puede escribir cualquiera; React escapa el texto al pintarlo.
function readParam(name: string, maxLength: number): string | null {
  const value = new URLSearchParams(window.location.search).get(name)?.trim()
  if (!value) {
    return null
  }

  // Si se recorta, que se note: un corte a media palabra parece un error.
  return value.length > maxLength ? `${value.slice(0, maxLength - 1).trimEnd()}…` : value
}

function readImagePath(): string | null {
  const value = readParam("imagen", 300)
  return value && PREVIEW_PATH_PATTERN.test(value) ? value : null
}

function readProductPath(): string | null {
  const value = readParam("ficha", 300)
  return value && PRODUCT_PATH_PATTERN.test(value) ? value : null
}

const readRequestedProduct = () => readParam("producto", MAX_PRODUCT_LENGTH)
const readProductionTime = () => readParam("produccion", MAX_LEAD_TIME_LENGTH)
const readShippingTime = () => readParam("envio", MAX_LEAD_TIME_LENGTH)
const readNothing = () => null

// "IA-0239 · Porta Post-it" → referencia y nombre; si no trae referencia, todo es nombre.
function splitProductSubject(subject: string): { reference: string | null; name: string } {
  const match = /^(IA-\d+)\s*·\s*(.+)$/u.exec(subject)
  return match ? { reference: match[1], name: match[2] } : { reference: null, name: subject }
}

type OrderDraft = { quantity: string; neededBy: string }

export function Contact() {
  // En el HTML estático no hay query string (null); en el cliente se lee de la URL.
  const productFromUrl = useSyncExternalStore(subscribeToNothing, readRequestedProduct, readNothing)
  const productionTime = useSyncExternalStore(subscribeToNothing, readProductionTime, readNothing)
  const shippingTime = useSyncExternalStore(subscribeToNothing, readShippingTime, readNothing)
  const imagePath = useSyncExternalStore(subscribeToNothing, readImagePath, readNothing)
  const productPath = useSyncExternalStore(subscribeToNothing, readProductPath, readNothing)
  // El visitante puede quitar el producto si quiere cotizar otra cosa.
  const [productDismissed, setProductDismissed] = useState(false)
  const [sent, setSent] = useState(false)
  // Cantidad y fecha que ya escribió: viajan a WhatsApp si cambia de canal.
  const [draft, setDraft] = useState<OrderDraft>({ quantity: "", neededBy: "" })
  const dismissButtonRef = useRef<HTMLButtonElement>(null)
  const restoreButtonRef = useRef<HTMLButtonElement>(null)
  // El botón pulsado desaparece; el foco pasa al control que deshace la acción.
  const pendingFocus = useRef<"dismiss" | "restore" | null>(null)

  useEffect(() => {
    const target = pendingFocus.current === "restore" ? restoreButtonRef : dismissButtonRef
    if (pendingFocus.current) {
      target.current?.focus()
      pendingFocus.current = null
    }
  }, [productDismissed])

  const requestedProduct = productDismissed ? null : productFromUrl
  const product = requestedProduct ? splitProductSubject(requestedProduct) : null
  // Los tiempos son del producto: si lo quita, dejan de aplicar.
  const leadTime: QuoteLeadTime | null =
    requestedProduct && (productionTime || shippingTime)
      ? { production: productionTime, shipping: shippingTime }
      : null
  const whatsappHref = buildWhatsappQuoteHref({ product: requestedProduct, ...draft })

  return (
    <section id="contacto" className="bg-background pt-24 pb-24 lg:pt-28">
      {/* Un solo orden en todos los tamaños: título → pieza y formulario → qué sigue.
          En escritorio la columna de "qué sigue" acompaña al formulario mientras se llena. */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-12 lg:px-8">
        <header className="min-w-0 lg:col-start-1 lg:row-start-1">
          <span className="mb-4 inline-block rounded-full bg-inspirarte-green/10 px-4 py-1 text-sm font-medium text-inspirarte-green">
            {requestedProduct || sent ? "Cotización" : "Contacto"}
          </span>
          {/* El título sigue al visitante: ya enviada, con una pieza elegida o con una idea por contar. */}
          <h1 className="font-serif text-3xl font-bold text-balance text-foreground sm:text-4xl lg:text-5xl">
            {sent ? (
              "Solicitud enviada"
            ) : requestedProduct ? (
              <>
                Cuéntanos cómo <span className="text-primary">lo quieres</span>
              </>
            ) : (
              <>
                Hagamos realidad <span className="text-primary">tu idea</span>
              </>
            )}
          </h1>
          {/* Si ya eligió una pieza (o ya envió), pedirle que cuente "qué producto necesita" sobra. */}
          {!requestedProduct && !sent && (
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Cuéntanos qué producto necesitas, para quién es y cualquier detalle que nos ayude a entender tu visión. Si
              tienes imágenes de referencia, ¡adjúntalas!
            </p>
          )}
        </header>

        <div className="min-w-0 space-y-3 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {product && requestedProduct && (
            <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-3 pr-1 sm:p-4 sm:pr-2">
              {imagePath && (
                <Image
                  src={`${mediaBaseUrl}/${imagePath}`}
                  alt=""
                  width={72}
                  height={72}
                  className="size-16 shrink-0 rounded-xl bg-muted object-cover sm:size-18"
                />
              )}
              <div className="min-w-0 flex-1 self-center">
                <p className="text-sm text-muted-foreground">
                  {sent ? "Cotizaste" : "Estás cotizando"}
                  {product.reference && (
                    <>
                      {" "}
                      <span className="tabular-nums">{product.reference}</span>
                    </>
                  )}
                </p>
                <p className="font-semibold text-foreground [overflow-wrap:anywhere]">
                  {productPath ? (
                    <Link href={productPath} className="underline-offset-4 hover:text-primary hover:underline">
                      {product.name}
                      <span className="sr-only"> (ver ficha)</span>
                    </Link>
                  ) : (
                    product.name
                  )}
                </p>
                {/* WhatsApp como alternativa visible; el formulario sigue siendo la acción principal. */}
                {whatsappHref && !sent && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-my-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    <FaWhatsapp aria-hidden="true" className="size-4 text-inspirarte-green" />
                    Cotizar por WhatsApp
                  </a>
                )}
              </div>
              {!sent && (
                <button
                  type="button"
                  ref={dismissButtonRef}
                  onClick={() => {
                    pendingFocus.current = "restore"
                    setProductDismissed(true)
                  }}
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <X aria-hidden="true" className="size-4" />
                  <span className="sr-only">Quitar producto</span>
                </button>
              )}
            </div>
          )}
          {/* Quitar el producto no debe ser definitivo: se puede recuperar sin recargar. */}
          {productDismissed && productFromUrl && !sent && (
            <p role="status" className="flex flex-wrap items-center gap-x-2 px-1 text-sm text-muted-foreground">
              Quitaste el producto de la ficha.
              <button
                type="button"
                ref={restoreButtonRef}
                onClick={() => {
                  pendingFocus.current = "dismiss"
                  setProductDismissed(false)
                }}
                className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Volver a agregarlo
              </button>
            </p>
          )}
          <ContactForm
            requestedProduct={requestedProduct}
            leadTime={leadTime}
            onDraftChange={setDraft}
            onSentChange={setSent}
          />
        </div>

        <aside
          aria-labelledby="que-sigue"
          className="min-w-0 space-y-10 lg:sticky lg:top-24 lg:col-start-1 lg:row-start-2 lg:self-start"
        >
          <div>
            <h2 id="que-sigue" className="font-serif text-2xl font-bold text-foreground">
              {sent ? "Qué sigue ahora" : "Qué sigue después de enviar tu solicitud"}
            </h2>
            <ol className="mt-5 space-y-4">
              {nextSteps.map((step, index) => {
                const Icon = step.icon
                // Ya enviada, el primer paso es lo que viene: se marca como el siguiente.
                const isNext = sent && index === 0
                return (
                  <li key={step.title} className="flex gap-3" aria-current={isNext ? "step" : undefined}>
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                        isNext ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <div className="min-w-0 pt-1.5">
                      {isNext && <p className="text-xs font-medium text-primary">Siguiente paso</p>}
                      <p className="font-medium leading-snug text-foreground">{step.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{step.detail}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
            <p className="mt-5 text-sm text-muted-foreground">
              Cotizar no tiene costo ni compromiso.{" "}
              <Link
                href="/proceso"
                className="inline-flex min-h-11 items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
              >
                Ver el proceso completo
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </Link>
            </p>
          </div>

          <div className="border-t border-border pt-8">
            <h2 className="font-serif text-2xl font-bold text-foreground">¿Prefieres escribirnos directo?</h2>
            <div className="mt-5">
              <ContactMethods whatsappHref={whatsappHref} />
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
