"use client";

import { type ReactNode, useEffect, useState } from "react";

interface ProductQuoteBarProps {
  // id del bloque de acciones dentro de la ficha; la barra se oculta mientras se ve.
  actionsId: string;
  children: ReactNode;
}

// Barra fija en móvil: la acción queda al alcance del pulgar, pero se retira cuando
// los botones de la ficha ya están a la vista (no duplica) y al llegar al footer
// (no tapa sus enlaces). Sin JS se queda visible.
export function ProductQuoteBar({ actionsId, children }: ProductQuoteBarProps) {
  const [actionsVisible, setActionsVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const actions = document.getElementById(actionsId);
    const footer = document.querySelector("footer");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === actions) {
          setActionsVisible(entry.isIntersecting);
        } else {
          setFooterVisible(entry.isIntersecting);
        }
      }
    });

    if (actions) {
      observer.observe(actions);
    }
    if (footer) {
      observer.observe(footer);
    }

    return () => observer.disconnect();
  }, [actionsId]);

  const hidden = actionsVisible || footerVisible;

  return (
    <div
      inert={hidden}
      aria-hidden={hidden}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur ease-out motion-safe:transition-transform motion-safe:duration-300 md:hidden ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      {children}
    </div>
  );
}
