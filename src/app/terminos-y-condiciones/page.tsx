import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones | InspiraArte",
  description:
    "Consulta las condiciones de uso del sitio, solicitudes de cotización, pedidos personalizados y limitaciones de responsabilidad de InspiraArte.",
  keywords: [
    "términos y condiciones",
    "condiciones de uso",
    "cotización",
    "InspiraArte",
  ],
  openGraph: {
    title: "Términos y condiciones | InspiraArte",
    description: "Condiciones generales de uso y contratación de InspiraArte.",
    type: "website",
    locale: "es_MX",
  },
};

export default function TerminosYCondiciones() {
  const updateDate = "28 de julio de 2026";

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4290A3]/10 text-[#4290A3] text-sm font-medium">
            Documento legal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Terminos y condiciones
          </h1>
          <p className="text-muted-foreground text-base">Ultima actualizacion: {updateDate}</p>
          <p className="text-muted-foreground text-lg">
            Al acceder y utilizar este sitio, asi como al solicitar cotizaciones o pedidos con
            InspiraArte, aceptas las presentes condiciones.
          </p>
        </div>

        <article className="space-y-8 text-foreground">
          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">1. Aceptacion y alcance</h2>
            <p className="text-muted-foreground">
              Estos terminos regulan el uso de www.inspiraarte.com y las interacciones comerciales
              relacionadas con productos personalizados y solicitudes de cotizacion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">2. Naturaleza del servicio</h2>
            <p className="text-muted-foreground">
              InspiraArte ofrece productos personalizados y servicios de diseno/fabricacion sobre
              pedido. Las imagenes y descripciones son referenciales y pueden presentar variaciones
              razonables por proceso artesanal, materiales, resolucion de archivos o calibracion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">3. Cotizaciones, pedidos y disponibilidad</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>La cotizacion no constituye venta definitiva hasta su confirmacion expresa.</li>
              <li>Los tiempos de entrega son estimados y pueden variar por volumen o complejidad.</li>
              <li>Los pedidos pueden requerir anticipo para iniciar produccion.</li>
              <li>
                La aceptacion final del pedido puede condicionarse a validacion de arte y
                disponibilidad de materiales.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">4. Precios, pagos y facturacion</h2>
            <p className="text-muted-foreground">
              Los precios se informan en la cotizacion vigente y pueden cambiar sin previo aviso
              para solicitudes futuras. El pago y, en su caso, la facturacion se rigen por los
              datos y condiciones confirmadas al momento del pedido.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">5. Archivos del cliente y propiedad intelectual</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>
                El cliente declara contar con derechos o autorizaciones para usar marcas, imagenes,
                textos o disenos que proporcione.
              </li>
              <li>
                InspiraArte puede rechazar contenidos que infrinjan derechos de terceros o normas
                aplicables.
              </li>
              <li>
                Los derechos de terceros permanecen con sus titulares; InspiraArte no adquiere
                titularidad por el solo procesamiento del archivo.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">6. Cancelaciones, cambios y devoluciones</h2>
            <p className="text-muted-foreground">
              Por tratarse de productos personalizados, una vez iniciada la produccion puede no ser
              posible cancelar o devolver, salvo defecto imputable a InspiraArte o supuestos
              previstos en la ley aplicable. Cualquier ajuste debera solicitarse antes de aprobar el
              arte final.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">7. Uso permitido del sitio</h2>
            <p className="text-muted-foreground">Queda prohibido:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Usar el sitio para actividades ilicitas o fraudulentas.</li>
              <li>Intentar acceso no autorizado a sistemas, datos o cuentas.</li>
              <li>Enviar malware, spam o contenido que afecte la disponibilidad del servicio.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">8. Limitacion de responsabilidad</h2>
            <p className="text-muted-foreground">
              En la medida permitida por ley, InspiraArte no sera responsable por danos indirectos,
              incidentales o lucro cesante derivados del uso del sitio o de retrasos por causas
              fuera de su control razonable (por ejemplo, eventos de fuerza mayor, fallas de
              proveedores o servicios de terceros).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">9. Privacidad y datos personales</h2>
            <p className="text-muted-foreground">
              El tratamiento de datos personales se rige por el Aviso de Privacidad publicado en
              este sitio, conforme a la LFPDPPP y normativa mexicana aplicable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">10. Ley aplicable y jurisdiccion</h2>
            <p className="text-muted-foreground">
              Estos terminos se interpretan conforme a las leyes de los Estados Unidos Mexicanos. En
              caso de controversia, las partes procuraran solucion amistosa y, de ser necesario,
              acudiran a las autoridades competentes de Ciudad de Mexico, salvo disposicion legal en
              contrario.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">11. Contacto</h2>
            <p className="text-muted-foreground">
              Para dudas sobre estos terminos: contacto@inspiraarte.com.
            </p>
          </section>

          <section className="rounded-xl border border-border bg-muted/30 p-5">
            <p className="text-sm text-muted-foreground">
              Nota informativa: este documento funciona como base general y no reemplaza asesoria
              legal especializada. Se recomienda revision profesional para su version final.
            </p>
          </section>
        </article>
      </div>
    </section>
  );
}
