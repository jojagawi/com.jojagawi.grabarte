// reCAPTCHA v3 compartido por los formularios que envían a Lambdas
// (calificaciones y contacto). La Lambda verifica el token y la acción.

export const googleSiteKey = process.env.NEXT_PUBLIC_GOOGLE_SITE_KEY?.trim() || "";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function getRecaptchaToken(siteKey: string, action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error("reCAPTCHA no esta disponible."));
      return;
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha
        ?.execute(siteKey, { action })
        .then((token) => {
          if (!token) {
            reject(new Error("No se pudo generar token de reCAPTCHA."));
            return;
          }
          resolve(token);
        })
        .catch(() => reject(new Error("No se pudo completar la validacion reCAPTCHA.")));
    });
  });
}
