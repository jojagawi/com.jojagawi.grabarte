"use client"

import { type ChangeEvent, type DragEvent, type FormEvent, useEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import Script from "next/script"
import { sendGTMEvent } from "@next/third-parties/google"
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Download, FileSpreadsheet, FileText, ImageIcon, Paperclip, X } from "lucide-react"
import { FaWhatsapp } from "@react-icons/all-files/fa/FaWhatsapp"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getRecaptchaToken, googleSiteKey } from "@/lib/recaptcha"
import {
  buildWhatsappQuoteHref,
  businessDaysUntil,
  formatNeededBy,
  parseLeadDays,
  toIsoDate,
} from "@/lib/quote-request"

// Envía a la Lambda de contacto (.aws/lambda/contact). Mismo patrón que RateSiteForm:
// reCAPTCHA v3 + x-api-key opcional. Los adjuntos suben directo a S3 con URLs firmadas.
const contactSubmitUrl = process.env.NEXT_PUBLIC_CONTACT_LAMBDA_URL?.trim() || ""
const contactSubmitApiKey = process.env.NEXT_PUBLIC_CONTACT_LAMBDA_API_KEY?.trim() || ""

const FORM_NAME = "ContactForm"
const MAX_FILES = 5
const MAX_FILE_BYTES = 10 * 1024 * 1024
const MAX_DETAILS_LENGTH = 2000
// A partir de aquí el contador se anuncia: avisa antes de que el texto se corte.
const DETAILS_WARNING_REMAINING = 200

// Referencias (fotos, PDF) y listas de nombres para eventos (Excel, CSV, Word, texto).
// Debe coincidir con ALLOWED_FILE_TYPES de .aws/lambda/contact/lambda-contact-handler.mjs.
const FILE_TYPES_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  pdf: "application/pdf",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xls: "application/vnd.ms-excel",
  csv: "text/csv",
  txt: "text/plain",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
const ALLOWED_FILE_TYPES = new Set(Object.values(FILE_TYPES_BY_EXTENSION))
const SPREADSHEET_TYPES = new Set([
  FILE_TYPES_BY_EXTENSION.xlsx,
  FILE_TYPES_BY_EXTENSION.xls,
  FILE_TYPES_BY_EXTENSION.csv,
])
const fileAccept = Object.keys(FILE_TYPES_BY_EXTENSION)
  .map((extension) => `.${extension}`)
  .join(",")

// Ocasiones agrupadas como el catálogo (eventos y temporadas). Deben coincidir con
// OCCASIONS de la Lambda; un valor que no esté ahí se descarta en silencio.
const occasionGroups = [
  {
    label: "Eventos",
    options: ["Cumpleaños", "XV años", "Boda", "Primera comunión", "Confirmación", "Graduación", "Aniversario"],
  },
  {
    label: "Temporadas",
    options: [
      "Día del amor y la amistad",
      "Día de las madres",
      "Día del maestro",
      "Día del padre",
      "Día de muertos",
      "Navidad",
    ],
  },
  { label: "Otras", options: ["Empresa / regalo corporativo", "Otra"] },
]
// Ocasiones donde cada pieza suele llevar un nombre distinto: se destaca la lista.
const EVENT_OCCASIONS = new Set([...occasionGroups[0].options, "Empresa / regalo corporativo"])
const EVENT_QUANTITY_THRESHOLD = 10
// Días hábiles para que el cliente revise y apruebe la propuesta de diseño antes de producir.
const DESIGN_APPROVAL_DAYS = 2
// Margen sobre el tiempo estándar con el que una fecha ya se considera justa.
const TIGHT_DATE_MARGIN_DAYS = 3
// A partir de aquí los tiempos de la ficha pueden no aplicar; no se suma una cifra inventada.
const VOLUME_QUANTITY_THRESHOLD = 50
const NAME_LIST_TEMPLATE = "/plantillas/lista-de-nombres.csv"

// "120 aprox." → 120; null si no hay número.
function parseQuantity(value: string): number | null {
  const match = /\d+/u.exec(value.replace(/[.,](?=\d{3}\b)/gu, ""))
  return match ? Number(match[0]) : null
}

// Materiales de CatMaterials con nombre de cliente. Se envía como productType.
const materials = [
  "MDF / madera",
  "Termo",
  "Acrílico",
  "Metal",
  "Impresión 3D",
  "Papel",
  "Piedra",
  "Caucho / sellos",
  "Aún no lo sé",
]

// DESIGN.md: campos de 40px, Papel Cálido de fondo y esquinas de 10px (rounded-md).
const fieldClassName = "h-10 rounded-md bg-background"
const selectClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"

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
  // retryable: false cuando reintentar no sirve (p. ej. falta configuración).
  | { kind: "error"; message: string; retryable: boolean }
  | {
      kind: "success"
      name: string
      email: string
      product: string | null
      quantity: string
      neededBy: string
      occasion: string
      attachments: string[]
      urgent: boolean
    }

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

// Tiempos del diseño tal como vienen de la ficha (texto libre de la BD).
export type QuoteLeadTime = {
  production: string | null
  shipping: string | null
}

interface ContactFormProps {
  requestedProduct: string | null
  leadTime?: QuoteLeadTime | null
  // Cantidad y fecha escritas hasta ahora, para que WhatsApp las lleve.
  onDraftChange?: (draft: { quantity: string; neededBy: string }) => void
  onSentChange?: (sent: boolean) => void
}

function subscribeToNothing(): () => void {
  return () => {}
}

// "Hoy" solo existe en el cliente; el HTML estático se genera sin fecha mínima.
const readToday = () => toIsoDate(new Date())
const readNoDate = () => ""

// "Hasta 5 días hábiles" viene capitalizado de la BD; tras "Producción:" va en minúscula.
function lowerFirst(text: string): string {
  return text.charAt(0).toLocaleLowerCase("es-MX") + text.slice(1)
}

// Windows a veces no informa el tipo (o reporta CSV como Excel); la extensión lo resuelve.
function resolveFileType(file: File): string {
  if (ALLOWED_FILE_TYPES.has(file.type)) {
    return file.type
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? ""
  return FILE_TYPES_BY_EXTENSION[extension] ?? file.type
}

function formatFileSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function validateFields(fields: ContactFields, today: string): FieldErrors {
  const errors: FieldErrors = {}
  // Las fechas ISO (aaaa-mm-dd) se comparan bien como texto.
  if (fields.neededBy && today && fields.neededBy < today) {
    errors.neededBy = "Esa fecha ya pasó. Elige una a partir de hoy."
  }
  if (!fields.details.trim()) {
    errors.details = "Cuéntanos qué necesitas para poder cotizarlo."
  }
  if (!fields.name.trim()) {
    errors.name = "Escribe tu nombre."
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "Escribe un correo válido, por ejemplo nombre@correo.com."
  }
  return errors
}

// Sujeto de la frase según lo que se pudo interpretar ("Producción y envío toman").
function describeLeadTime(leadTime: QuoteLeadTime | null | undefined): string {
  const production = parseLeadDays(leadTime?.production) !== null
  const shipping = parseLeadDays(leadTime?.shipping) !== null
  if (production && shipping) {
    return "Producción y envío toman"
  }
  return production ? "La producción toma" : "El envío toma"
}

// Suma producción + envío en días hábiles; null si la BD no trae algo interpretable.
function getLeadDays(leadTime: QuoteLeadTime | null | undefined): number | null {
  const production = parseLeadDays(leadTime?.production)
  const shipping = parseLeadDays(leadTime?.shipping)
  if (production === null && shipping === null) {
    return null
  }

  return (production ?? 0) + (shipping ?? 0)
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

export function ContactForm({ requestedProduct, leadTime, onDraftChange, onSentChange }: ContactFormProps) {
  const [fields, setFields] = useState<ContactFields>(initialFields)
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<FieldErrors>({})
  const [phase, setPhase] = useState<SubmitPhase>({ kind: "idle" })
  const successHeadingRef = useRef<HTMLHeadingElement>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  // Recordatorio de cantidad y fecha: se muestra una vez; el segundo envío sigue sin ellos.
  const [orderNudgeShown, setOrderNudgeShown] = useState(false)
  const [isDraggingFiles, setIsDraggingFiles] = useState(false)
  const today = useSyncExternalStore(subscribeToNothing, readToday, readNoDate)

  const isBusy = phase.kind === "uploading" || phase.kind === "sending"
  const detailsRemaining = MAX_DETAILS_LENGTH - fields.details.length
  const leadDays = getLeadDays(leadTime)
  const daysAvailable = fields.neededBy && today ? businessDaysUntil(fields.neededBy, new Date()) : null
  const quantityNumber = parseQuantity(fields.quantity)
  const isVolumeOrder = quantityNumber !== null && quantityNumber > VOLUME_QUANTITY_THRESHOLD
  // Tiempo estándar = aprobar la propuesta + producción y envío de la ficha.
  const standardDays = leadDays === null ? null : leadDays + DESIGN_APPROVAL_DAYS
  // Dos niveles, ninguno bloquea: "short" no llega al tiempo estándar; "tight" llega con poco margen.
  const dateFit: "short" | "tight" | null =
    errors.neededBy || standardDays === null || daysAvailable === null || fields.neededBy < today
      ? null
      : daysAvailable < standardDays
        ? "short"
        : daysAvailable < standardDays + TIGHT_DATE_MARGIN_DAYS
          ? "tight"
          : null
  const isTightDate = dateFit !== null
  const missingOrderData = [!fields.quantity.trim() && "quantity", !fields.neededBy && "neededBy"].filter(
    (field): field is "quantity" | "neededBy" => Boolean(field),
  )
  const isEventOrder =
    EVENT_OCCASIONS.has(fields.occasion) || (quantityNumber !== null && quantityNumber > EVENT_QUANTITY_THRESHOLD)
  const showOrderNudge = orderNudgeShown && missingOrderData.length > 0 && phase.kind === "idle"
  // Solo los campos que bloquean el envío; el aviso de archivos no impide enviar.
  const invalidCount = (Object.keys(errors) as Array<keyof FieldErrors>).filter(
    (field) => field !== "files" && errors[field],
  ).length
  const errorWhatsappHref = buildWhatsappQuoteHref({
    product: requestedProduct,
    quantity: fields.quantity,
    neededBy: fields.neededBy,
    occasion: fields.occasion,
    details: fields.details,
  })

  useEffect(() => {
    sendGTMEvent({ event: "form_contact_load", form_name: FORM_NAME, has_product: Boolean(requestedProduct) })
  }, [requestedProduct])

  useEffect(() => {
    onDraftChange?.({ quantity: fields.quantity, neededBy: fields.neededBy })
  }, [fields.quantity, fields.neededBy, onDraftChange])

  // El formulario se desmonta al enviar: el foco pasa al mensaje de éxito para no perderse.
  useEffect(() => {
    if (phase.kind === "success") {
      successHeadingRef.current?.focus()
    }
    onSentChange?.(phase.kind === "success")
  }, [phase.kind, onSentChange])

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
    addFiles(selected)
  }

  function handleFilesDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDraggingFiles(false)
    if (isBusy || files.length >= MAX_FILES) {
      return
    }
    addFiles(Array.from(event.dataTransfer.files))
  }

  function addFiles(selected: File[]) {
    const rejected = selected.filter(
      (file) => !ALLOWED_FILE_TYPES.has(resolveFileType(file)) || file.size > MAX_FILE_BYTES || file.size === 0,
    )
    const accepted = selected.filter((file) => !rejected.includes(file))
    const next = [...files, ...accepted].slice(0, MAX_FILES)

    let message: string | undefined
    if (rejected.length > 0) {
      message = `No se agregó ${rejected.map((file) => file.name).join(", ")}. Usa JPG, PNG, PDF, Excel, CSV, Word o texto de hasta 10 MB.`
    } else if (files.length + accepted.length > MAX_FILES) {
      message = `Puedes adjuntar hasta ${MAX_FILES} archivos; quita uno para agregar otro.`
    }

    setFiles(next)
    setErrors((current) => ({ ...current, files: message }))
  }

  // Al entrar a "Tus datos" sin cantidad o fecha: es el momento natural de recordarlas,
  // antes del botón de envío y sin detenerlo.
  function handleContactDataFocus() {
    if (!orderNudgeShown && missingOrderData.length > 0) {
      setOrderNudgeShown(true)
      sendGTMEvent({ event: "form_contact_nudge", form_name: FORM_NAME, missing: missingOrderData.join(",") })
    }
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))
    setErrors((current) => ({ ...current, files: undefined }))
  }

  function reportError(errorType: string, message: string, retryable = true) {
    sendGTMEvent({ event: "form_contact_error", form_name: FORM_NAME, error_type: errorType })
    setPhase({ kind: "error", message, retryable })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // El botón usa aria-disabled (no disabled) para conservar el foco; aquí se evita el doble envío.
    if (isBusy) {
      return
    }

    setSubmitAttempted(true)
    const validationErrors = validateFields(fields, today)
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
        false,
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
          files: files.map((file) => ({ name: file.name, type: resolveFileType(file), size: file.size })),
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
        // La fecha no alcanza el tiempo estándar: el equipo la revisa primero.
        urgent: dateFit === "short",
        attachmentKeys,
        pageUrl: window.location.href,
      })

      if (!ok) {
        reportError("submit_failed", data?.message || "No pudimos enviar tu solicitud. Intenta de nuevo.")
        return
      }

      sendGTMEvent({ event: "form_contact_saved", form_name: FORM_NAME })
      // Se guarda lo enviado para confirmarlo en pantalla; el formulario se limpia.
      setPhase({
        kind: "success",
        name: fields.name.trim().split(/\s+/)[0] ?? "",
        email: fields.email.trim(),
        product: requestedProduct,
        quantity: fields.quantity.trim(),
        neededBy: fields.neededBy,
        occasion: fields.occasion,
        attachments: files.map((file) => file.name),
        urgent: dateFit === "short",
      })
      setFields(initialFields)
      setFiles([])
    } catch {
      reportError("network_or_runtime", "No se pudo enviar tu solicitud en este momento. Revisa tu conexión e intenta de nuevo.")
    }
  }

  if (phase.kind === "success") {
    const successSummary = [
      // El producto ya está a la vista en la tarjeta "Cotizaste": no se repite aquí.
      { label: "Cantidad", value: phase.quantity },
      { label: "Lo necesitas para el", value: formatNeededBy(phase.neededBy) },
      { label: "Ocasión", value: phase.occasion },
      {
        label: "Archivos",
        value: phase.attachments.join(", "),
      },
      { label: "Te respondemos a", value: phase.email },
      { label: "Prioridad", value: phase.urgent ? "Por tu fecha, la revisamos primero" : "" },
    ].filter((item): item is { label: string; value: string } => Boolean(item.value))
    const successWhatsappHref = buildWhatsappQuoteHref({
      product: phase.product,
      quantity: phase.quantity,
      neededBy: phase.neededBy,
      occasion: phase.occasion,
    })

    return (
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <CheckCircle2 aria-hidden="true" className="mb-4 size-10 text-inspirarte-green" />
        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className="font-serif text-2xl font-bold text-foreground outline-none"
        >
          {phase.name ? `¡Gracias, ${phase.name}!` : "¡Gracias!"} Recibimos tu solicitud
        </h2>
        <p className="mt-3 text-muted-foreground">
          Te respondemos en menos de 24 horas por correo o WhatsApp con una propuesta de diseño antes de producir.
        </p>

        {/* Confirma lo que se envió: es lo que el cliente necesita recordar mientras espera. */}
        {successSummary.length > 0 && (
          <dl className="mt-6 space-y-2 rounded-xl bg-muted/60 px-4 py-3 text-sm">
            {successSummary.map((item) => (
              <div key={item.label} className="flex flex-wrap gap-x-2">
                <dt className="text-muted-foreground">{item.label}:</dt>
                <dd className="min-w-0 font-medium text-foreground [overflow-wrap:anywhere]">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button asChild className="h-11 bg-primary text-primary-foreground hover:bg-inspirarte-petroleum-deep">
            <Link href="/productos">{phase.product ? "Cotizar otro producto" : "Seguir viendo el catálogo"}</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 border-primary text-primary hover:bg-primary/10"
            onClick={() => {
              // Una solicitud nueva empieza limpia: sin resumen de errores ni recordatorio ya visto.
              setSubmitAttempted(false)
              setOrderNudgeShown(false)
              setPhase({ kind: "idle" })
            }}
          >
            {phase.product ? "Otra solicitud de este diseño" : "Enviar otra solicitud"}
          </Button>
        </div>

        {successWhatsappHref && (
          <p className="mt-4 text-sm text-muted-foreground">
            ¿Te urge?{" "}
            <a
              href={successWhatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
            >
              <FaWhatsapp aria-hidden="true" className="size-4 text-inspirarte-green" />
              Escríbenos por WhatsApp
            </a>
          </p>
        )}
      </div>
    )
  }

  const errorId = (field: keyof FieldErrors) => (errors[field] ? `contact-${field}-error` : undefined)

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-8">
      {googleSiteKey && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${googleSiteKey}`} strategy="afterInteractive" />
      )}

      <p className="text-sm text-muted-foreground">Los campos con * son obligatorios.</p>

      {/* Primero el pedido (decide si es viable), al final cómo contactarte. */}
      <fieldset className="min-w-0 space-y-5">
        <legend className="font-serif text-xl font-bold text-foreground">Tu pedido</legend>
        <p className="-mt-3 text-sm text-muted-foreground">
          Con la cantidad y la fecha te cotizamos en una sola respuesta.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-quantity">
              Cantidad aproximada
            </Label>
            <Input
              id="contact-quantity"
              name="quantity"
              maxLength={40}
              placeholder="Ej. 1, 50 o 120 piezas"
              className={fieldClassName}
              value={fields.quantity}
              onChange={(event) => updateField("quantity", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-neededBy">
              ¿Para cuándo lo necesitas?
            </Label>
            <Input
              id="contact-neededBy"
              name="neededBy"
              type="date"
              min={today || undefined}
              aria-invalid={Boolean(errors.neededBy)}
              aria-describedby={[errorId("neededBy") ?? "contact-neededBy-hint", isTightDate ? "contact-neededBy-warning" : ""]
                .filter(Boolean)
                .join(" ")}
              className={fieldClassName}
              value={fields.neededBy}
              onChange={(event) => updateField("neededBy", event.target.value)}
            />
            {errors.neededBy && (
              <p id="contact-neededBy-error" className="text-sm text-destructive">
                {errors.neededBy}
              </p>
            )}
          </div>

          {/* Tiempos y aviso a todo el ancho: en escritorio no dejan un hueco bajo la cantidad. */}
          <div className="-mt-3 space-y-2 sm:col-span-2">
            {!errors.neededBy && (
              <p id="contact-neededBy-hint" className="text-sm text-muted-foreground">
                {leadTime
                  ? [
                      leadTime.production && `Producción: ${lowerFirst(leadTime.production)}`,
                      leadTime.shipping && `Envío: ${lowerFirst(leadTime.shipping)}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")
                  : "Con tu fecha te confirmamos si llegamos a tiempo."}
              </p>
            )}
            {/* Región siempre montada: así el aviso se anuncia al aparecer. */}
            <div aria-live="polite">
              {dateFit && leadDays !== null && standardDays !== null && daysAvailable !== null && (
                <div
                  id="contact-neededBy-warning"
                  className={`flex gap-2.5 rounded-md border p-3 text-sm ${
                    dateFit === "short"
                      ? "border-inspirarte-olive/60 bg-inspirarte-olive/15"
                      : "border-inspirarte-olive/25 bg-inspirarte-olive/10"
                  }`}
                >
                  {dateFit === "short" ? (
                    <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-inspirarte-olive" />
                  ) : (
                    <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-inspirarte-olive" />
                  )}
                  <div className="space-y-1">
                    <p className={dateFit === "short" ? "font-semibold text-foreground" : "font-medium text-inspirarte-olive"}>
                      {dateFit === "short"
                        ? "Con esta fecha no alcanzamos el tiempo estándar"
                        : "Fecha justa para este diseño"}
                    </p>
                    <p className="text-foreground">
                      Contando {DESIGN_APPROVAL_DAYS} días para aprobar la propuesta, este diseño toma unos {standardDays}{" "}
                      días hábiles ({describeLeadTime(leadTime).toLowerCase()} hasta {leadDays}). Para tu fecha{" "}
                      {daysAvailable === 0
                        ? "no quedan días hábiles"
                        : daysAvailable === 1
                          ? "queda 1 día hábil"
                          : `quedan ${daysAvailable} días hábiles`}
                      .{" "}
                      {dateFit === "short"
                        ? "Envía tu solicitud y la revisamos primero; si prefieres, confírmala por WhatsApp."
                        : "Envía tu solicitud pronto; si urge, confírmala por WhatsApp."}
                    </p>
                    {isVolumeOrder && (
                      <p className="text-foreground">
                        En volumen el tiempo puede aumentar; lo confirmamos en tu cotización.
                      </p>
                    )}
                    {errorWhatsappHref && (
                      <a
                        href={errorWhatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="-my-2 inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
                      >
                        <FaWhatsapp aria-hidden="true" className="size-4 text-inspirarte-green" />
                        Confirmar por WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              )}
              {/* Fecha holgada pero pedido grande: se avisa sin alarmar. */}
              {!dateFit && isVolumeOrder && leadTime && fields.neededBy && (
                <p className="text-sm text-muted-foreground">
                  En volumen el tiempo puede aumentar; lo confirmamos en tu cotización.
                </p>
              )}
            </div>
          </div>

          <div className={`space-y-2 ${requestedProduct ? "sm:col-span-2" : ""}`}>
            <Label htmlFor="contact-occasion">Ocasión</Label>
            <select
              id="contact-occasion"
              name="occasion"
              className={selectClassName}
              value={fields.occasion}
              onChange={(event) => updateField("occasion", event.target.value)}
            >
              <option value="">Selecciona una opción</option>
              {occasionGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((occasion) => (
                    <option key={occasion} value={occasion}>
                      {occasion}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Si viene de una ficha, el producto ya está arriba ("Estás cotizando"); no se vuelve a preguntar. */}
          {!requestedProduct && (
            <div className="space-y-2">
              <Label htmlFor="contact-productType">¿En qué material lo imaginas?</Label>
              <select
                id="contact-productType"
                name="productType"
                aria-describedby="contact-productType-hint"
                className={selectClassName}
                value={fields.productType}
                onChange={(event) => updateField("productType", event.target.value)}
              >
                <option value="">Selecciona una opción</option>
                {materials.map((material) => (
                  <option key={material} value={material}>
                    {material}
                  </option>
                ))}
              </select>
              <p id="contact-productType-hint" className="text-sm text-muted-foreground">
                Si aún no lo sabes, déjalo así y te sugerimos opciones.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-details">Cuéntanos más detalles *</Label>
          <Textarea
            id="contact-details"
            name="details"
            required
            maxLength={MAX_DETAILS_LENGTH}
            placeholder={
              isEventOrder
                ? "Tipo y fecha del evento, texto que se repite en todas las piezas, colores…"
                : "Para quién es, qué texto o logo lleva, colores, medidas…"
            }
            aria-invalid={Boolean(errors.details)}
            aria-describedby={[errorId("details"), "contact-details-count"].filter(Boolean).join(" ")}
            className="min-h-32 rounded-md bg-background"
            value={fields.details}
            onChange={(event) => updateField("details", event.target.value)}
          />
          <div className="flex items-start justify-between gap-3 text-sm">
            {errors.details ? (
              <p id="contact-details-error" className="text-destructive">
                {errors.details}
              </p>
            ) : (
              <p className="text-muted-foreground">
                {/* En modo evento la lista tiene su propio bloque abajo; aquí no se repite. */}
                {isEventOrder ? "" : "¿Muchos nombres o textos? Adjunta la lista abajo."}
              </p>
            )}
            <p
              id="contact-details-count"
              aria-live={detailsRemaining <= DETAILS_WARNING_REMAINING ? "polite" : "off"}
              className={`shrink-0 tabular-nums ${detailsRemaining <= DETAILS_WARNING_REMAINING ? "text-foreground" : "text-muted-foreground"}`}
            >
              {detailsRemaining <= DETAILS_WARNING_REMAINING && (
                <span aria-hidden="true">
                  {fields.details.length} / {MAX_DETAILS_LENGTH}
                </span>
              )}
              <span className="sr-only">
                {detailsRemaining <= DETAILS_WARNING_REMAINING
                  ? `Te quedan ${detailsRemaining} caracteres.`
                  : `Máximo ${MAX_DETAILS_LENGTH} caracteres.`}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p id="contact-files-title" className="text-sm font-medium leading-none text-foreground">
            Lista de nombres o referencias
          </p>
          {/* En eventos o pedidos grandes, la lista es lo que el taller necesita: se dice directo. */}
          {isEventOrder && (
            <div className="space-y-1 text-sm">
              <p className="text-foreground">¿Cada pieza lleva un nombre distinto?</p>
              <ol className="list-inside list-decimal space-y-0.5 text-muted-foreground marker:text-primary">
                <li>
                  <a
                    href={NAME_LIST_TEMPLATE}
                    download
                    className="-my-3 inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
                  >
                    <Download aria-hidden="true" className="size-4" />
                    Descarga la plantilla (CSV)
                  </a>
                </li>
                <li>Llénala y revisa la ortografía de cada nombre.</li>
                <li>Adjúntala aquí abajo.</li>
              </ol>
            </div>
          )}
          <div
            onDragOver={(event) => {
              event.preventDefault()
              setIsDraggingFiles(true)
            }}
            onDragLeave={(event) => {
              // Solo al salir de la zona, no al pasar entre sus hijos.
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setIsDraggingFiles(false)
              }
            }}
            onDrop={handleFilesDrop}
            className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-dashed p-3 transition-colors ${
              isDraggingFiles
                ? "border-primary bg-primary/5"
                : isEventOrder
                  ? "border-primary/40 bg-background"
                  : "border-border bg-background"
            }`}
          >
            {/* Input nativo oculto a la vista pero accesible; la etiqueta hace de botón del sistema. */}
            <input
              id="contact-files"
              name="files"
              type="file"
              multiple
              accept={fileAccept}
              disabled={files.length >= MAX_FILES || isBusy}
              aria-describedby={["contact-files-hint", errorId("files")].filter(Boolean).join(" ")}
              aria-labelledby="contact-files-title"
              className="peer sr-only"
              onChange={handleFilesSelected}
            />
            <label
              htmlFor="contact-files"
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-primary bg-background px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10 peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
            >
              <Paperclip aria-hidden="true" className="size-4" />
              Elegir archivos
            </label>
            <span className="text-sm text-muted-foreground tabular-nums">
              {isDraggingFiles ? "Suelta los archivos aquí" : files.length === 0 ? (
                <>
                  Ningún archivo<span className="max-sm:hidden"> · o arrástralos aquí</span>
                </>
              ) : (
                `${files.length} de ${MAX_FILES}`
              )}
            </span>
          </div>
          {errors.files && (
            <p id="contact-files-error" className="text-sm text-destructive">
              {errors.files}
            </p>
          )}
          {files.length > 0 && (
            <ul className="space-y-2">
              {files.map((file, index) => {
                const fileType = resolveFileType(file)
                const FileIcon = fileType.startsWith("image/")
                  ? ImageIcon
                  : SPREADSHEET_TYPES.has(fileType)
                    ? FileSpreadsheet
                    : FileText
                return (
                  <li
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <FileIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate text-foreground">{file.name}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">{formatFileSize(file.size)}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      disabled={isBusy}
                      className="-my-2 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                    >
                      <X aria-hidden="true" className="size-4" />
                      <span className="sr-only">Quitar {file.name}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          <p id="contact-files-hint" className="text-sm text-muted-foreground">
            Listas en Excel, CSV, Word o texto; fotos o ideas en JPG, PNG o PDF. Hasta {MAX_FILES} archivos de 10 MB
            cada uno.
          </p>
          {/* Fuera del modo evento, la plantilla queda a mano sin ocupar el primer plano. */}
          {!isEventOrder && (
            <a
              href={NAME_LIST_TEMPLATE}
              download
              className="-my-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              <Download aria-hidden="true" className="size-4" />
              Descargar plantilla de lista de nombres (CSV)
            </a>
          )}
        </div>
      </fieldset>

      {/* El divisor va en un elemento aparte: un borde en el fieldset parte la leyenda. */}
      <hr className="border-border" />
      <fieldset className="min-w-0 space-y-5" onFocus={handleContactDataFocus}>
        <legend className="font-serif text-xl font-bold text-foreground">Tus datos</legend>
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
            <Label htmlFor="contact-email">Correo electrónico *</Label>
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

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="contact-phone">Teléfono / WhatsApp</Label>
            <Input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              maxLength={40}
              aria-describedby="contact-phone-hint"
              className={`${fieldClassName} sm:max-w-[calc(50%-0.625rem)]`}
              value={fields.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
            <p id="contact-phone-hint" className="text-sm text-muted-foreground">
              Opcional. Si lo dejas, también te respondemos por WhatsApp.
            </p>
          </div>
        </div>
      </fieldset>

      {/* Recordatorio de cantidad y fecha: aparece al entrar a "Tus datos" y se coloca debajo, para no mover
          el campo que se está llenando. */}
      <div aria-live="polite">
        {showOrderNudge && (
          <div className="space-y-2 rounded-md border border-border bg-muted/60 p-3 text-sm">
            <p className="text-foreground">
              {missingOrderData.length === 2
                ? "¿Cuántas piezas necesitas y para cuándo?"
                : missingOrderData[0] === "quantity"
                  ? "¿Cuántas piezas necesitas?"
                  : "¿Para cuándo lo necesitas?"}{" "}
              Con {missingOrderData.length === 2 ? "esos datos" : "ese dato"} te cotizamos en una sola respuesta; si no, te
              lo preguntamos después.
            </p>
            <div className="flex flex-wrap gap-x-4">
              <button
                type="button"
                onClick={() => document.getElementById(`contact-${missingOrderData[0]}`)?.focus()}
                className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {missingOrderData.length === 2 ? "Agregar cantidad y fecha" : "Agregarlo"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div aria-live="polite" className="text-sm">
        {phase.kind === "uploading" && (
          <p className="text-muted-foreground">
            Subiendo archivos ({phase.current} de {phase.total})…
          </p>
        )}
        {phase.kind === "sending" && <p className="sr-only">Enviando tu solicitud…</p>}
        {/* Tras un envío con errores: el foco va al primero, esto dice cuántos faltan. */}
        {submitAttempted && invalidCount > 0 && phase.kind !== "error" && (
          <p className="text-destructive">
            {invalidCount === 1
              ? "Falta 1 dato: revisa el campo marcado."
              : `Faltan ${invalidCount} datos: revisa los campos marcados.`}
          </p>
        )}
      </div>

      {phase.kind === "error" && (
        <div role="alert" className="flex gap-2.5 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div className="space-y-1">
            <p className="font-medium text-destructive">{phase.message}</p>
            {phase.retryable && (
              <p className="text-foreground">Tus datos siguen aquí; no tienes que volver a escribirlos.</p>
            )}
            {errorWhatsappHref && (
              <a
                href={errorWhatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="-my-2 inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
              >
                <FaWhatsapp aria-hidden="true" className="size-4 text-inspirarte-green" />
                Enviar por WhatsApp con tus datos
              </a>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Button
          type="submit"
          aria-disabled={isBusy}
          className="h-11 w-full bg-primary text-primary-foreground hover:bg-inspirarte-petroleum-deep aria-disabled:cursor-progress aria-disabled:opacity-70 sm:w-auto sm:px-6"
        >
          {isBusy ? "Enviando…" : phase.kind === "error" && phase.retryable ? "Reintentar envío" : "Enviar solicitud"}
        </Button>
        {/* Mismas promesas que "Qué sigue" y /proceso; en móvil esa columna queda después del formulario. */}
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {["Sin costo ni compromiso", "Respuesta en menos de 24 h", "Ves la propuesta antes de producir"].map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <CheckCircle2 aria-hidden="true" className="size-3.5 shrink-0 text-inspirarte-green" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Protegido con reCAPTCHA. Consulta nuestro{" "}
          <Link href="/aviso-de-privacidad" className="underline underline-offset-4 hover:text-foreground">
            Aviso de privacidad
          </Link>
          .
        </p>
      </div>
    </form>
  )
}
