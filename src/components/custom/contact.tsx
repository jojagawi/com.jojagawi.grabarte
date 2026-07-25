"use client"

import { useState, useRef } from "react"
import { Send, Upload, X, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ContactMethods } from "@/components/custom/contact-methods"
import { sendGTMEvent } from "@next/third-parties/google";

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...newFiles].slice(0, 5)) // Max 5 files
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const name = String(formData.get("name") ?? "").trim()

    // Simulate form submission
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        sendGTMEvent({ event: "formContactSend", value: name })
        resolve()
      }, 2000)
    })

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <section id="contacto" className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00B003]/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-[#00B003]" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              ¡Mensaje enviado!
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Recibimos tu solicitud. Te contactaremos en menos de 24 horas para comenzar a crear algo increíble juntos.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="border-[#4290A3] text-[#4290A3] hover:bg-[#4290A3]/10"
            >
              Enviar otra solicitud
            </Button>
          </div>
        </div>
      </section>
    )
  }

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
          <div className="bg-muted/50 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Tu nombre"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+52 55 1234 5678"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occasion">Ocasión</Label>
                  <select
                    id="occasion"
                    name="occasion"
                    className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="navidad">Navidad</option>
                    <option value="dia-padre">Día del Padre</option>
                    <option value="dia-madre">Día de la Madre</option>
                    <option value="boda">Boda</option>
                    <option value="xv">XV Años</option>
                    <option value="cumple">Cumpleaños</option>
                    <option value="graduacion">Graduación</option>
                    <option value="corporativo">Corporativo</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">¿Qué producto te interesa? *</Label>
                <select
                  id="product"
                  name="product"
                  required
                  className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                >
                  <option value="">Selecciona un producto</option>
                  <option value="termo">Termo personalizado</option>
                  <option value="llavero">Llaveros</option>
                  <option value="cartera">Cartera/Carpeta de piel</option>
                  <option value="mdf">Figuras decorativas MDF</option>
                  <option value="varios">Varios productos</option>
                  <option value="otro">Otro (especificar)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Cuéntanos más detalles *</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Describe tu idea: qué diseño quieres, para quién es, cuántas piezas necesitas, fecha de entrega ideal..."
                  className="bg-white min-h-[120px]"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Archivos de referencia (opcional)</Label>
                <label
                  htmlFor="reference-files"
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-[#4290A3] transition-colors cursor-pointer bg-white block"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arrastra tus archivos aquí o{" "}
                    <span className="text-[#4290A3] font-medium">
                      haz clic para subir
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, PDF (máx. 5 archivos, 10MB c/u)
                  </p>
                  <input
                    id="reference-files"
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-border"
                      >
                        <span className="text-sm text-foreground truncate flex-1">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-2 p-1 hover:bg-muted rounded"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#4290A3] hover:bg-[#1FA4A7] text-white h-12"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar solicitud
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Al enviar, aceptas nuestro{" "}
                <a
                  href="/aviso-de-privacidad"
                  className="text-[#4290A3] hover:underline"
                >
                  aviso de privacidad
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
