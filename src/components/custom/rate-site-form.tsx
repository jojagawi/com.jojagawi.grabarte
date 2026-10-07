"use client";

import { FormEvent, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Script from "next/script";
import { sendGTMEvent } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getRecaptchaToken, googleSiteKey } from "@/lib/recaptcha";

type RateFormState = {
  name: string;
  product: string;
  description: string;
  rating: string;
};

export type RateableProduct = {
  id: number;
  name: string;
};

interface RateSiteFormProps {
  /** Diseños publicados: ?id= solo se acepta si corresponde a uno de ellos. */
  products: RateableProduct[];
}

type SubmitState = {
  ok: boolean;
  message: string;
};

const initialFormState: RateFormState = {
  name: "",
  product: "",
  description: "",
  rating: "5",
};

const ratesSubmitUrl =
  process.env.NEXT_PUBLIC_RATES_LAMBDA_URL?.trim() || "/api/rates";
const ratesSubmitApiKey = process.env.NEXT_PUBLIC_RATES_LAMBDA_API_KEY?.trim() || "";
const recaptchaAction = "add_client_rate";

// Export estático: el ?id= se lee en el cliente (useSearchParams obligaría a un Suspense).
// En el HTML prerenderado no hay query string, así que el servidor reporta "".
function subscribeToLocation(): () => void {
  return () => {};
}

function getLocationSearch(): string {
  return window.location.search;
}

function getServerLocationSearch(): string {
  return "";
}

function findProductById(products: RateableProduct[], search: string): RateableProduct | null {
  const rawId = new URLSearchParams(search).get("id")?.trim() ?? "";
  if (!/^\d+$/u.test(rawId)) {
    return null;
  }

  return products.find((product) => product.id === Number(rawId)) ?? null;
}

export function RateSiteForm({ products }: RateSiteFormProps) {
  const [formState, setFormState] = useState<RateFormState>(initialFormState);
  const locationSearch = useSyncExternalStore(subscribeToLocation, getLocationSearch, getServerLocationSearch);
  const ratedProduct = useMemo(() => findProductById(products, locationSearch), [products, locationSearch]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState | null>(null);

  const ratingPreview = useMemo(() => Number(formState.rating) || 0, [formState.rating]);

  useEffect(() => {
    sendGTMEvent({
      event: "form_rate_load",
      form_name: "RateSiteForm",
      ...(ratedProduct ? { design_id: ratedProduct.id } : {}),
    });
  }, [ratedProduct]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState(null);

    try {
      if (!googleSiteKey) {
        sendGTMEvent({
          event: "form_rate_error",
          form_name: "RateSiteForm",
          error_type: "missing_recaptcha_site_key",
        });
        setSubmitState({
          ok: false,
          message: "No hay configuración de reCAPTCHA para este formulario.",
        });
        return;
      }

      const recaptchaToken = await getRecaptchaToken(googleSiteKey, recaptchaAction);

      sendGTMEvent({
        event: "form_rate_send",
        form_name: "RateSiteForm",
        form_action: recaptchaAction,
      });

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (ratesSubmitApiKey) {
        headers["x-api-key"] = ratesSubmitApiKey;
      }

      const response = await fetch(ratesSubmitUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: formState.name,
          product: ratedProduct?.name ?? formState.product,
          description: formState.description,
          rating: Number(formState.rating),
          ...(ratedProduct ? { designId: ratedProduct.id } : {}),
          recaptchaToken,
          action: recaptchaAction,
        }),
      });

      const responseBody = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        sendGTMEvent({
          event: "form_rate_error",
          form_name: "RateSiteForm",
          error_type: "submit_failed",
          status_code: response.status,
        });
        setSubmitState({
          ok: false,
          message:
            responseBody?.message || "No pudimos guardar tu calificación. Intenta de nuevo.",
        });
        return;
      }

      sendGTMEvent({
        event: "form_rate_saved",
        form_name: "RateSiteForm",
      });

      setSubmitState({
        ok: true,
        message: "Gracias. Tu calificación fue enviada correctamente.",
      });
      setFormState(initialFormState);
    } catch {
      sendGTMEvent({
        event: "form_rate_error",
        form_name: "RateSiteForm",
        error_type: "network_or_runtime",
      });
      setSubmitState({
        ok: false,
        message: "No se pudo enviar la calificación en este momento.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20">
      {googleSiteKey && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${googleSiteKey}`}
          strategy="afterInteractive"
        />
      )}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Agregar calificación
            </h1>
            <p className="mt-3 text-muted-foreground">
              Comparte tu experiencia con InspiraArte. Nos ayuda a mejorar y a orientar
              a nuevos clientes.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="rate-name">Nombre</Label>
              <Input
                id="rate-name"
                name="name"
                required
                maxLength={120}
                value={formState.name}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Ej. Maria Perez"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate-product">Producto</Label>
              {ratedProduct ? (
                // Ligado al diseño por ?id=: el nombre no se edita para que coincida con el catálogo.
                <Input id="rate-product" name="product" value={ratedProduct.name} readOnly aria-readonly="true" />
              ) : (
                <Input
                  id="rate-product"
                  name="product"
                  required
                  maxLength={120}
                  value={formState.product}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      product: event.target.value,
                    }))
                  }
                  placeholder="Ej. Termo personalizado"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate-description">Descripcion</Label>
              <Textarea
                id="rate-description"
                name="description"
                required
                maxLength={1200}
                className="min-h-32"
                value={formState.description}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Cuentanos como fue tu experiencia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate-rating">Calificacion (1 a 5)</Label>
              <select
                id="rate-rating"
                name="rating"
                className="focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-[3px]"
                value={formState.rating}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    rating: event.target.value,
                  }))
                }
              >
                <option value="5">5 - Excelente</option>
                <option value="4">4 - Muy bueno</option>
                <option value="3">3 - Bueno</option>
                <option value="2">2 - Regular</option>
                <option value="1">1 - Malo</option>
              </select>
              <p className="text-xs text-muted-foreground">Vista previa: {"★".repeat(ratingPreview)}</p>
            </div>

            {submitState && (
              <p
                className={submitState.ok ? "text-sm text-[#00B003]" : "text-sm text-destructive"}
                role="status"
              >
                {submitState.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white hover:bg-inspirarte-petroleum-deep sm:w-auto"
            >
              {isSubmitting ? "Enviando..." : "Enviar calificación"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}


