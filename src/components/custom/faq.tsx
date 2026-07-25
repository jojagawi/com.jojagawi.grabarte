"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "¿Cuánto tiempo tarda mi pedido?",
    answer: "El tiempo depende del producto y la cantidad. Generalmente, pedidos pequeños (1-10 piezas) están listos en 3-5 días hábiles. Para pedidos grandes o con diseños complejos, el tiempo puede ser de 7-15 días. Te confirmamos la fecha exacta al aprobar tu diseño.",
  },
  {
    question: "¿Cuál es el pedido mínimo?",
    answer: "¡No hay mínimo! Puedes pedir desde una sola pieza. Sin embargo, para pedidos de 10 piezas o más, ofrecemos descuentos especiales. Para eventos o corporativos (50+ piezas), tenemos precios muy atractivos.",
  },
  {
    question: "¿Qué formatos de imagen aceptan?",
    answer: "Aceptamos JPG, PNG, PDF y archivos vectoriales (AI, SVG, CDR). Para mejor calidad de grabado, te recomendamos enviar imágenes en alta resolución (300 DPI mínimo) o archivos vectoriales. Si solo tienes una foto o boceto, ¡no te preocupes! Nuestro equipo puede digitalizarlo.",
  },
  {
    question: "¿Hacen envíos a todo México?",
    answer: "¡Sí! Enviamos a toda la República Mexicana a través de paqueterías confiables. El costo de envío depende del destino y el tamaño del paquete. También ofrecemos recolección en nuestro taller en CDMX sin costo adicional.",
  },
  {
    question: "¿Puedo ver un diseño antes de producir?",
    answer: "¡Claro que sí! Siempre te enviamos una vista previa digital del diseño para tu aprobación antes de iniciar la producción. Puedes solicitar hasta 2 cambios sin costo adicional.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos transferencia bancaria, depósito en OXXO, tarjetas de crédito/débito y PayPal. Para iniciar tu pedido requerimos un anticipo del 50%, y el resto lo cubres al momento de la entrega o envío.",
  },
  {
    question: "¿Los productos tienen garantía?",
    answer: "Garantizamos la calidad de nuestro trabajo. Si tu producto llega dañado o con errores de producción, lo reponemos sin costo. Las imágenes del producto final siempre se envían antes del envío para tu tranquilidad.",
  },
  {
    question: "¿Trabajan con empresas o solo particulares?",
    answer: "¡Ambos! Trabajamos con personas que buscan un regalo especial, organizadores de eventos, empresas que necesitan merchandising y cualquier persona con una idea creativa. Emitimos facturas y ofrecemos precios especiales para clientes frecuentes o pedidos grandes.",
  },
]

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
                    "w-5 h-5 text-[#4290A3] transition-transform flex-shrink-0",
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
            <a href="#contacto" className="text-[#4290A3] font-medium hover:underline">
              Escríbenos
            </a>
            {" "}y te respondemos en menos de 24 horas.
          </p>
        </div>
      </div>
    </section>
  )
}
