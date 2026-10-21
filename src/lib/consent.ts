// Consent Mode v2: layout.tsx declara todo negado por defecto y aplica la elección guardada
// antes de cargar GTM; el banner (cookie-consent.tsx) la pide y la actualiza.
export const CONSENT_STORAGE_KEY = "inspiraarte-consent";
// Subir la versión vuelve a mostrar el banner a todos (p. ej. si cambian los usos de cookies).
export const CONSENT_VERSION = 1;
// El enlace "Preferencias de cookies" del footer reabre el banner con este evento.
export const CONSENT_OPEN_EVENT = "inspiraarte:open-consent";

export type ConsentChoice = "granted" | "denied";

export interface StoredConsent {
  v: number;
  choice: ConsentChoice;
  at: string;
}

export function readStoredConsent(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredConsent) : null;
    return parsed?.v === CONSENT_VERSION && (parsed.choice === "granted" || parsed.choice === "denied")
      ? parsed
      : null;
  } catch {
    return null;
  }
}

export function consentState(choice: ConsentChoice): Record<string, ConsentChoice> {
  return {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  };
}

// Script en línea para layout.tsx (beforeInteractive): mismo default de siempre y, si ya hay
// una elección vigente, el update antes de que GTM dispare sus etiquetas.
export const consentInitScript = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
try {
  var stored = JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}) || 'null');
  if (stored && stored.v === ${CONSENT_VERSION} && stored.choice === 'granted') {
    gtag('consent', 'update', ${JSON.stringify(consentState("granted"))});
  }
} catch (e) {}`;
