"use client"

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react"
import Script from "next/script"
import { sendGTMEvent } from "@next/third-parties/google"
import { CheckCircle2, FileText, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getRecaptchaToken, googleSiteKey } from "@/lib/recaptcha"

// Envía a la Lambda de contacto (.aws/lambda/contact). Mismo patrón que RateSiteForm:
// reCAPTCHA v3 + x-api-key opcional. Los adjuntos suben directo a S3 con URLs firmadas.
const contactSubmitUrl = process.env.NEXT_PUBLIC_CONTACT_LAMBDA_URL?.trim() || ""
const contactSubmitApiKey = process.env.NEXT_PUBLIC_CONTACT_LAMBDA_API_KEY?.trim() || ""
const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "") || ""

const FORM_NAME = "ContactForm"
const MAX_FILES = 5
const MAX_FILE_BYTES = 10 * 1024 * 1024
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"]

const occasions = ["Cumpleaños", "Aniversario", "Boda", "Graduación", "Corporación", "Otra"]
const productTypes = ["Termos", "Llaveros", "Placas", "Objetos MDF", "Otro"]

// DESIGN.md: campos de 40px, Papel Cálido de fondo y esquinas de 10px.
const fieldClassName = "h-10 rounded-[10px] bg-background"
const selectClassName =
  "h-10 w-full rounded-[10px] border border-input bg-background px-3 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"

type ContactFields = {
  name: string
  email: string
  phone: string
  occasion: string
  productType: string
  quantity: string
  neededBy: string
  details: string
}

type FieldErrors = Partial<Record<keyof ContactFields | "files", string>>

type SubmitPhase =
  | { kind: "idle" }
  | { kind: "uploading"; current: number; total: number }
  | { kind: "sending" }
  | { kind: "error"; message: string }
  | { kind: "success"; name: string }

type UploadTicket = {
  key: string
  url: string
  fields: Record<string, string>
}

const initialFields: ContactFields = {
  name: "",
  email: "",
  phone: "",
  occasion: "",
  productType: "",
  quantity: "",
  neededBy: "",
  details: "",
}

interface ContactFormProps {
  requestedProduct: string | null
}

function formatFileSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function validateFields(fields: ContactFields): FieldErrors {
  const errors: FieldErrors = {}
  if (!fields.name.trim()) {
    errors.name = "Escribe tu nombre."
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "Escribe un correo válido, por ejemplo nombre@correo.com."
  }
  if (!fields.details.trim()) {
    errors.details = "Cuéntanos qué necesitas para poder cotizarlo."
  }
  return errors
}

async function postToLambda<T>(body: Record<string, unknown>): Promise<{ ok: boolean; data: T | null }> {
  const headers: HeadersInit = { "Content-Type": "application/json" }
  if (contactSubmitApiKey) {
    headers["x-api-key"] = contactSubmitApiKey
  }

  const response = await fetch(contactSubmitUrl, { method: "POST", headers, body: JSON.stringify(body) })
  const data = (await response.json().catch(() => null)) as T | null
  return { ok: response.ok, data }
}

// Sube un archivo con la política firmada (POST multipart directo a S3).
async function uploadFile(ticket: UploadTicket, file: File): Promise<boolean> {
  const formData = new FormData()
  for (const [field, value] of Object.entries(ticket.fields)) {
    formData.append(field, value)
  }
  formData.append("file", file)

  const response = await fetch(ticket.url, { method: "POST", body: formData })
  return response.ok
}

export function ContactForm({ requestedProduct }: ContactFormProps) {
  const [fields, setFields] = useState<ContactFields>(initialFields)
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<FieldErrors>({})
  const [phase, setPhase] = useState<SubmitPhase>({ kind: "idle" })

  const isBusy = phase.kind === "uploading" || phase.kind === "sending"

  useEffect(() => {
    sendGTMEvent({ event: "form_contact_load", form_name: FORM_NAME, has_product: Boolean(requestedProduct) })
  }, [requestedProduct])

  function updateField(field: keyof ContactFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }))
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? [])
    // Permite volver a elegir el mismo archivo después de quitarlo.
    event.target.value = ""

    const rejected = selected.filter(
      (file) => !ALLOWED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_BYTES || file.size === 0,
    )
    const accepted = selected.filter((file) => !rejected.includes(file))
    const next = [...files, ...accepted].slice(0, MAX_FILES)

    let message: string | undefined
    if (rejected.length > 0) {
      message = `No se agregó ${rejected.map((file) => file.name).join(", ")}: solo JPG, PNG o PDF de hasta 10 MB.`
    } else if (files.length + accepted.length > MAX_FILES) {
      message = `Puedes adjuntar hasta ${MAX_FILES} archivos.`
    }

    setFiles(next)
    setErrors((current) => ({ ...current, files: message }))
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))
    setErrors((current) => ({ ...current, files: undefined }))
  }

  function reportError(errorType: string, message: string) {
    sendGTMEvent({ event: "form_contact_error", form_name: FORM_NAME, error_type: errorType })
    setPhase({ kind: "error", message })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationErrors = validateFields(fields)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      const firstInvalid = Object.keys(validationErrors)[0]
      document.getElementById(`contact-${firstInvalid}`)?.focus()
      return
    }

    if (!contactSubmitUrl || !googleSiteKey) {
      reportError(
        "missing_configuration",
        "El formulario no está disponible en este momento. Escríbenos por WhatsApp o correo y te atendemos igual.",
      )
      return
    }

    try {
      let requestId: string | undefined
      const attachmentKeys: string[] = []

      if (files.length > 0) {
        setPhase({ kind: "uploading", current: 0, total: files.length })
        const uploadToken = await getRecaptchaToken(googleSiteKey, "contact_upload")
        const { ok, data } = await postToLambda<{ requestId?: string; uploads?: UploadTicket[]; message?: string }>({
          action: "contact_upload",
          recaptchaToken: uploadToken,
          files: files.map((file) => ({ name: file.name, type: file.type, size: file.size })),
        })

        if (!ok || !data?.requestId || data.uploads?.length !== files.length) {
          reportError("upload_prepare_failed", data?.message || "No pudimos preparar la subida de tus archivos. Intenta de nuevo.")
          return
        }

        requestId = data.requestId
        for (const [index, ticket] of data.uploads.entries()) {
          setPhase({ kind: "uploading", current: index + 1, total: files.length })
          if (!(await uploadFile(ticket, files[index]))) {
            reportError(
              "upload_failed",
              `No se pudo subir ${files[index].name}. Revisa tu conexión o quita ese archivo e intenta de nuevo.`,
            )
            return
          }
          attachmentKeys.push(ticket.key)
        }
      }

      setPhase({ kind: "sending" })
      const submitToken = await getRecaptchaToken(googleSiteKey, "contact_submit")
      sendGTMEvent({ event: "form_contact_send", form_name: FORM_NAME, attachments: attachmentKeys.length })

      const { ok, data } = await postToLambda<{ message?: string }>({
        action: "contact_submit",
        recaptchaToken: submitToken,
        requestId,
        ...fields,
        requestedProduct: requestedProduct ?? "",
        attachmentKeys,
        pageUrl: window.location.href,
      })

      if (!ok) {
        reportError("submit_failed", data?.message || "No pudimos enviar tu solicitud. Intenta de nuevo.")
        return
      }

      sendGTMEvent({ event: "form_contact_saved", form_name: FORM_NAME })
      setPhase({ kind: "success", name: fields.name.trim().split(/\s+/)[0] ?? "" })
      setFields(initialFields)
      setFiles([])
    } catch {
      reportError("network_or_runtime", "No se pudo enviar tu solicitud en este momento. Revisa tu conexión e intenta de nuevo.")
    }
  }

  if (phase.kind === "success") {
    return (
      <div role="status" className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        <CheckCircle2 aria-hidden="true" className="mb-4 size-10 text-inspirarte-green" />
        <h2 className="font-serif text-2xl font-bold text-foreground">
          {phase.name ? `¡Gracias, ${phase.name}!` : "¡Gracias!"} Recibimos tu solicitud
        </h2>
        <p className="mt-3 text-muted-foreground">
          Te respondemos en menos de 24 horas por correo o WhatsApp con una propuesta de diseño antes de producir.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 h-10 border-primary text-primary hover:bg-primary/10"
          onClick={() => setPhase({ kind: "idle" })}
        >
          Enviar otra solicitud
        </Button>
      </div>
    )
  }

  const errorId = (field: keyof FieldErrors) => (errors[field] ? `contact-${field}-error` : undefined)

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-white p-5 sm:p-8">
      {googleSiteKey && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${googleSiteKey}`} strategy="afterInteractive" />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Nombre *</Label>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            maxLength={120}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errorId("name")}
            className={fieldClassName}
            value={fields.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
          {errors.name && (
            <p id="contact-name-error" className="text-sm text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">Email *</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            required
            placeholder="nombre@correo.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errorId("email")}
            className={fieldClassName}
            value={fields.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
          {errors.email && (
            <p id="contact-email-error" className="text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-phone">Teléfono / WhatsApp</Label>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={40}
            className={fieldClassName}
            value={fields.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-occasion">Ocasión</Label>
          <select
            id="contact-occasion"
            name="occasion"
            className={selectClassName}
            value={fields.occasion}
            onChange={(event) => updateField("occasion", event.target.value)}
          >
            <option value="">Selecciona una opción</option>
            {occasions.map((occasion) => (
              <option key={occasion} value={occasion}>
                {occasion}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-productType">¿Qué producto te interesa?</Label>
          <select
            id="contact-productType"
            name="productType"
            className={selectClassName}
            value={fields.productType}
            onChange={(event) => updateField("productType", event.target.value)}
          >
            <option value="">Selecciona una opción</option>
            {productTypes.map((productType) => (
              <option key={productType} value={productType}>
                {productType}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-quantity">Cantidad aproximada</Label>
          <Input
            id="contact-quantity"
            name="quantity"
            inputMode="numeric"
            maxLength={40}
            placeholder="Ej. 1, 50 o 120 piezas"
            className={fieldClassName}
            value={fields.quantity}
            onChange={(event) => updateField("quantity", event.target.value)}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact-neededBy">¿Para cuándo lo necesitas?</Label>
          <Input
            id="contact-neededBy"
            name="neededBy"
            type="date"
            className={`${fieldClassName} sm:max-w-60`}
            value={fields.neededBy}
            onChange={(event) => updateField("neededBy", event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-details">Cuéntanos más detalles *</Label>
        <Textarea
          id="contact-details"
          name="details"
          required
          maxLength={2000}
          placeholder="Para quién es, qué texto o logo lleva, colores, medidas…"
          aria-invalid={Boolean(errors.details)}
          aria-describedby={errorId("details")}
          className="min-h-32 rounded-[10px] bg-background"
          value={fields.details}
          onChange={(event) => updateField("details", event.target.value)}
        />
        {errors.details && (
          <p id="contact-details-error" className="text-sm text-destructive">
            {errors.details}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-files">Archivos de referencia</Label>
        <p id="contact-files-hint" className="text-sm text-muted-foreground">
          JPG, PNG o PDF; hasta {MAX_FILES} archivos de 10 MB cada uno.
        </p>
        <Input
          id="contact-files"
          name="files"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
          disabled={files.length >= MAX_FILES || isBusy}
          aria-describedby={["contact-files-hint", errorId("files")].filter(Boolean).join(" ")}
          className="h-auto cursor-pointer rounded-[10px] bg-background py-2 file:mr-3 file:cursor-pointer file:rounded-md file:bg-primary/10 file:px-3 file:text-primary"
          onChange={handleFilesSelected}
        />
        {errors.files && (
          <p id="contact-files-error" className="text-sm text-destructive">
            {errors.files}
          </p>
        )}
        {files.length > 0 && (
          <ul className="space-y-2">
            {files.map((file, index) => {
              const FileIcon = file.type === "application/pdf" ? FileText : ImageIcon
              return (
                <li
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  className="flex items-center gap-3 rounded-[10px] border border-border bg-background px-3 py-2 text-sm"
                >
                  <FileIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate text-foreground">{file.name}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">{formatFileSize(file.size)}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    disabled={isBusy}
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                  >
                    <X aria-hidden="true" className="size-4" />
                    <span className="sr-only">Quitar {file.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div aria-live="polite" className="min-h-5 text-sm">
        {phase.kind === "uploading" && (
          <p className="text-muted-foreground">
            Subiendo archivos ({phase.current} de {phase.total})…
          </p>
        )}
        {phase.kind === "sending" && <p className="text-muted-foreground">Enviando tu solicitud…</p>}
        {phase.kind === "error" && (
          <p className="text-destructive">
            {phase.message}
            {whatsappPhone && (
              <>
                {" "}
                <a
                  href={`https://wa.me/${whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  Escribir por WhatsApp
                </a>
              </>
            )}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          disabled={isBusy}
          className="h-11 w-full bg-primary text-primary-foreground hover:bg-inspirarte-petroleum-deep sm:w-auto sm:px-6"
        >
          {isBusy ? "Enviando…" : "Enviar solicitud"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Protegido con reCAPTCHA. * Campos obligatorios.
        </p>
      </div>
    </form>
  )
}
