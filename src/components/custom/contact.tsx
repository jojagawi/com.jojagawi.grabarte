"use client"

import { useState, useRef } from "react"
import { Send, Upload, X, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

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
              Cuéntanos qué producto necesitas, para quién es y cualquier detalle que nos ayude a entender tu visión.
              Si tienes imágenes de referencia, ¡adjúntalas!
            </p>

            {/* Contact Methods */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#4290A3]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#4290A3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Email</h3>
                  <p className="text-muted-foreground">hola@lasercraftmx.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00B003]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#00B003]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">WhatsApp</h3>
                  <p className="text-muted-foreground">+52 55 1234 5678</p>
                  <p className="text-sm text-muted-foreground">Respuesta rápida de Lun a Sáb</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1FA4A7]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#1FA4A7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Horario</h3>
                  <p className="text-muted-foreground">Lunes a Viernes: 9am - 7pm</p>
                  <p className="text-muted-foreground">Sábados: 10am - 3pm</p>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-[#00B003]" />
                <span className="text-sm text-muted-foreground">Respuesta en 24h</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-[#00B003]" />
                <span className="text-sm text-muted-foreground">Sin compromiso</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-[#00B003]" />
                <span className="text-sm text-muted-foreground">Cotización gratis</span>
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
                    Arrastra tus archivos aquí o <span className="text-[#4290A3] font-medium">haz clic para subir</span>
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
                <a href="/aviso-de-privacidad" className="text-[#4290A3] hover:underline">aviso de privacidad</a>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
