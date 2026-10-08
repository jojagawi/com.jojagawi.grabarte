"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type FaqItem = {
  id: number
  question: string
  answer: string
}

type FAQProps = {
  faqs: FaqItem[]
  /** Dentro de otra página: sin padding de sección ni contenedor propio. */
  embedded?: boolean
  /** Página propia (/faq): el título es el h1 y cada pregunta un h2. */
  isPageTitle?: boolean
}

export function FAQ({ faqs, embedded = false, isPageTitle = false }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const TitleTag = isPageTitle ? "h1" : "h2"
  const QuestionTag = isPageTitle ? "h2" : "h3"

  return (
    <section id="faq" className={cn(!embedded && "py-24 bg-muted/30")}>
      <div className={cn("mx-auto max-w-4xl", !embedded && "px-4 sm:px-6 lg:px-8")}>
        {/* Header */}
        <div className={cn("text-center", embedded ? "mb-10" : "mb-16")}>
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Preguntas Frecuentes
          </span>
          <TitleTag
            className={cn(
              "font-serif font-bold text-foreground mb-6 text-balance",
              // Dentro de una ficha no puede competir con el h1 del producto.
              embedded ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl lg:text-5xl"
            )}
          >
            ¿Tienes dudas? <span className="text-primary">Te las resolvemos</span>
          </TitleTag>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Aquí encontrarás las respuestas a las preguntas más comunes.
            Si no encuentras lo que buscas, escríbenos directamente.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            const panelId = `faq-panel-${faq.id}`
            return (
            <div
              key={faq.id}
              className={cn(
                "bg-white rounded-xl border border-border overflow-hidden transition-all",
                isOpen && "shadow-lg shadow-primary/5"
              )}
            >
              {/* El encabezado envuelve al botón (patrón de acordeón WAI-ARIA): la pregunta queda en el outline. */}
              <QuestionTag className="text-base">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full px-6 py-5 flex items-center justify-between text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="font-medium text-foreground pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-primary transition-transform shrink-0",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
              </QuestionTag>
              {/* grid-rows 0fr→1fr anima la altura real: las respuestas largas no se recortan. */}
              <div
                id={panelId}
                inert={!isOpen}
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-5 text-muted-foreground leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
            )
          })}
        </div>

        {/* Bottom Help */}
        <div className="mt-12 text-center" data-llms-skip>
          <p className="text-muted-foreground">
            ¿Aún tienes preguntas?{" "}
            <a href="/contacto" className="text-primary font-medium hover:underline">
              Escríbenos
            </a>
            {" "}y te respondemos en menos de 24 horas.
          </p>
        </div>
      </div>
    </section>
  )
}
