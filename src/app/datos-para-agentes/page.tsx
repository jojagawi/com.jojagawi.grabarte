import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/metadata";
import {
  API_CATALOG_PATH,
  AUTH_MD_PATH,
  API_STATUS_PATH,
  OPENAPI_PATH,
  PUBLIC_DATA_FILES,
  TOOLS_MANIFEST_PATH,
} from "@/lib/public-api";
import { getWebMcpToolManifest } from "@/lib/webmcp-setup";

// Documentación (service-doc) de la API pública que anuncia /.well-known/api-catalog.
export const metadata: Metadata = buildPageMetadata({
  title: "Datos para agentes y desarrolladores | InspiraArte",
  description:
    "Consulta el catálogo, las temporadas, los materiales y las preguntas frecuentes de InspiraArte en JSON de solo lectura, con especificación OpenAPI y herramientas WebMCP.",
  path: "/datos-para-agentes",
  keywords: ["API", "OpenAPI", "WebMCP", "datos abiertos", "InspiraArte"],
});

const codeClassName = "rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground";
const linkClassName = "text-primary underline underline-offset-4 hover:text-primary/80";

export default function DatosParaAgentes() {
  const tools = getWebMcpToolManifest();

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        <header className="space-y-4">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Desarrolladores
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Datos para agentes y desarrolladores
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Los datos públicos de InspiraArte están disponibles en JSON de solo lectura, sin autenticación.
            Son archivos estáticos que se actualizan cada vez que publicamos el sitio. Para cotizar un pedido,
            usa el <Link href="/contacto" className={linkClassName}>formulario de contacto</Link>.
          </p>
        </header>

        <article className="space-y-10 text-foreground">
          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">Descubrimiento</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                Catálogo de APIs (RFC 9727): <a href={API_CATALOG_PATH} className={linkClassName}>{API_CATALOG_PATH}</a>
              </li>
              <li>
                Especificación OpenAPI 3.1: <a href={OPENAPI_PATH} className={linkClassName}>{OPENAPI_PATH}</a>
              </li>
              <li>
                Estado: <a href={API_STATUS_PATH} className={linkClassName}>{API_STATUS_PATH}</a> responde{" "}
                <code className={codeClassName}>{'{"status":"pass"}'}</code> cuando la API está publicada.
              </li>
              <li>
                Autenticación de agentes: <a href={AUTH_MD_PATH} className={linkClassName}>{AUTH_MD_PATH}</a> (acceso
                anónimo, sin registro ni credenciales)
              </li>
              <li>
                Índice para modelos de lenguaje: <a href="/llms.txt" className={linkClassName}>/llms.txt</a>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">Endpoints</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todos se piden con <code className={codeClassName}>GET</code> y responden{" "}
              <code className={codeClassName}>application/json</code>.
            </p>
            <ul className="space-y-4">
              {PUBLIC_DATA_FILES.map((file) => (
                <li key={file.path} className="space-y-1">
                  <a href={file.path} className={`${linkClassName} font-mono text-sm`}>
                    {file.path}
                  </a>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{file.title}.</span> {file.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">Herramientas WebMCP</h2>
            <p className="text-muted-foreground leading-relaxed">
              Al abrir cualquier página del sitio en un navegador compatible, se registran {tools.length} herramientas
              en <code className={codeClassName}>document.modelContext</code>. Sus esquemas están en{" "}
              <a href={TOOLS_MANIFEST_PATH} className={linkClassName}>{TOOLS_MANIFEST_PATH}</a>. Ninguna envía datos:{" "}
              <code className={codeClassName}>prepare_quote</code> solo llena el formulario de contacto y el visitante
              decide si lo envía.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <code className={codeClassName}>{tool.name}</code>: {tool.description}
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>
    </section>
  );
}
