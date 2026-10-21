"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CONSENT_OPEN_EVENT,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  type ConsentChoice,
  consentState,
  readStoredConsent,
} from "@/lib/consent";
import { trackEvent } from "@/lib/analytics";

function applyConsent(choice: ConsentChoice): void {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", consentState(choice));
  }
  // Evento para que GTM pueda reaccionar al cambio (p. ej. disparar etiquetas pendientes).
  trackEvent("consent_update", { consent_analytics: choice, consent_ads: choice });
}

let sessionChoice: ConsentChoice | null = null;
// Reabierto desde el footer aunque ya haya una elección guardada.
let reopened = false;
const CONSENT_CHANGE_EVENT = "inspiraarte:consent-change";

function subscribe(onChange: () => void): () => void {
  const reopen = () => {
    reopened = true;
    onChange();
  };
  window.addEventListener(CONSENT_OPEN_EVENT, reopen);
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
    window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  };
}

const readIsOpen = () => reopened || (sessionChoice === null && readStoredConsent() === null);
// En el HTML estático no se sabe si ya eligió: el banner aparece al hidratar.
const readClosed = () => false;

// Sin una elección vigente aparece abajo; no bloquea la página. La elección se guarda en
// el navegador y layout.tsx la aplica en las visitas siguientes antes de cargar GTM.
export function CookieConsent() {
  const isOpen = useSyncExternalStore(subscribe, readIsOpen, readClosed);

  const choose = (choice: ConsentChoice) => {
    try {
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({ v: CONSENT_VERSION, choice, at: new Date().toISOString() }),
      );
    } catch {
      // Sin almacenamiento (modo privado estricto) la elección vale solo para esta visita.
      sessionChoice = choice;
    }
    applyConsent(choice);
    reopened = false;
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <section
      aria-labelledby="cookies-titulo"
      data-track-location="cookie_banner"
      data-llms-skip
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lg backdrop-blur sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md sm:rounded-2xl sm:border sm:pb-4"
    >
      <h2 id="cookies-titulo" className="font-medium text-foreground">
        Usamos cookies
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Nos ayudan a medir qué partes del sitio te sirven y a mejorar nuestras campañas. Las necesarias
        para que el sitio funcione siempre están activas.{" "}
        <Link
          href="/aviso-de-privacidad#cookies"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Aviso de privacidad
        </Link>
      </p>
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="h-11 sm:h-9" onClick={() => choose("denied")}>
          Solo necesarias
        </Button>
        <Button
          type="button"
          className="h-11 bg-primary text-primary-foreground hover:bg-inspirarte-petroleum-deep sm:h-9"
          onClick={() => choose("granted")}
        >
          Aceptar
        </Button>
      </div>
    </section>
  );
}

// Botón del footer para cambiar la elección en cualquier momento.
export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
    >
      Preferencias de cookies
    </button>
  );
}
