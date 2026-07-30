"use client"

import { CheckCircle2 } from "lucide-react"
import { ContactMethods } from "@/components/custom/contact-methods"

export function Contact() {
  return (
    <section id="contacto" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-[#00B003]/10 text-[#00B003] text-sm font-medium mb-4">
              Contacto
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              Hagamos realidad <span className="text-[#4290A3]">tu idea</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Cuéntanos qué producto necesitas, para quién es y cualquier
              detalle que nos ayude a entender tu visión. Si tienes imágenes de
              referencia, ¡adjúntalas!
            </p>

            {/* Contact Methods */}
            <ContactMethods />

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-[#00B003]" />
                <span className="text-sm text-muted-foreground">
                  Respuesta en 24h
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-[#00B003]" />
                <span className="text-sm text-muted-foreground">
                  Sin compromiso
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-[#00B003]" />
                <span className="text-sm text-muted-foreground">
                  Cotización gratis
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-muted/50 rounded-2xl p-2 sm:p-4 lg:p-6">
            <iframe
              title="Formulario de contacto"
              src="https://form.jotform.com/262094096661058"
              className="w-full rounded-xl bg-white border-0"
              style={{ minHeight: 780 }}
              allow="geolocation; microphone; camera; fullscreen"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
