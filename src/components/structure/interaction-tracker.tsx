"use client";

import { useEffect } from "react";
import { classifyLinkClick, trackEvent } from "@/lib/analytics";

// Un solo listener para los enlaces de todo el sitio (WhatsApp, correo, teléfono, redes,
// cotizar, tarjetas de producto, categorías, navegación): así los componentes de servidor
// no tienen que volverse de cliente para medir un clic. Ver docs/gtm-eventos.md.
// Un enlace con data-track="none" se omite (por ejemplo, cuando ya envía su propio evento).
export function InteractionTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 && event.button !== 1) {
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.closest("[data-track='none']")) {
        return;
      }
      const result = classifyLinkClick(anchor);
      if (result) {
        trackEvent(result.event, result.params);
      }
    };

    // auxclick cubre el clic con la rueda (abrir en otra pestaña).
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("auxclick", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("auxclick", onClick, { capture: true });
    };
  }, []);

  return null;
}
