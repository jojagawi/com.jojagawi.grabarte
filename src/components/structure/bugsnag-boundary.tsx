"use client"

import React, { type ReactNode } from "react"
import Link from "next/link"
import Bugsnag from "@bugsnag/js"
import BugsnagPluginReact from "@bugsnag/plugin-react"
import BugsnagPerformance from "@bugsnag/browser-performance"

const apiKey = process.env.NEXT_PUBLIC_BUGSNAG?.trim() ?? ""

// El sitio es un export estático: Bugsnag solo corre en el navegador. Este módulo
// también se evalúa al prerenderizar en el build, por eso la guarda de `window`.
// Sin clave (por ejemplo en un entorno local sin .env) no se inicia nada.
if (typeof window !== "undefined" && apiKey && !Bugsnag.isStarted()) {
  Bugsnag.start({
    apiKey,
    plugins: [new BugsnagPluginReact()],
    releaseStage: process.env.NODE_ENV,
  })
  BugsnagPerformance.start({
    apiKey,
    releaseStage: process.env.NODE_ENV,
  })
}

const BugsnagErrorBoundary = Bugsnag.isStarted()
  ? Bugsnag.getPlugin("react")?.createErrorBoundary(React)
  : undefined

interface ErrorFallbackProps {
  clearError: () => void
}

// Lo que ve el visitante si una página falla al renderizar. El error ya quedó en Bugsnag.
function ErrorFallback({ clearError }: ErrorFallbackProps) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="font-serif text-3xl font-bold text-foreground">Algo salió mal al cargar esta página</h1>
      <p className="text-muted-foreground">
        Ya nos llegó el aviso. Intenta de nuevo; si sigue pasando, escríbenos y te ayudamos con tu pedido.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={clearError}
          className="inline-flex h-11 items-center justify-center rounded-[10px] bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-inspirarte-petroleum-deep focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/contacto"
          className="inline-flex h-11 items-center justify-center rounded-[10px] border border-primary px-5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Contactarnos
        </Link>
      </div>
    </section>
  )
}

interface BugsnagBoundaryProps {
  children: ReactNode
}

export function BugsnagBoundary({ children }: BugsnagBoundaryProps) {
  if (!BugsnagErrorBoundary) {
    return <>{children}</>
  }

  return <BugsnagErrorBoundary FallbackComponent={ErrorFallback}>{children}</BugsnagErrorBoundary>
}
