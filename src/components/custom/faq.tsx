"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { faqEntries } from "@/lib/faq-data"

const faqs = faqEntries

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#3ACBFE]/10 text-[#4290A3] text-sm font-medium mb-4">
            Preguntas Frecuentes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            ¿Tienes dudas? <span className="text-[#4290A3]">Te las resolvemos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Aquí encontrarás las respuestas a las preguntas más comunes.
            Si no encuentras lo que buscas, escríbenos directamente.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={cn(
                "bg-white rounded-xl border border-border overflow-hidden transition-all",
                openIndex === index && "shadow-lg shadow-[#4290A3]/5"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-medium text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-[#4290A3] transition-transform shrink-0",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === index ? "max-h-96" : "max-h-0"
                )}
              >
                <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Help */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            ¿Aún tienes preguntas?{" "}
            <a href="/contacto" className="text-[#4290A3] font-medium hover:underline">
              Escríbenos
            </a>
            {" "}y te respondemos en menos de 24 horas.
          </p>
        </div>
      </div>
    </section>
  )
}
