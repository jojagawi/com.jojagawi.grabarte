import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { TERMS_AND_CONDITIONS } from "@/lib/legal";

export const metadata: Metadata = buildPageMetadata({
  title: "Términos y condiciones | InspiraArte",
  description:
    "Consulta las condiciones de uso del sitio, solicitudes de cotización, pedidos personalizados y limitaciones de responsabilidad de InspiraArte.",
  path: "/terminos-y-condiciones",
  keywords: [
    "términos y condiciones",
    "condiciones de uso",
    "cotización",
    "InspiraArte",
  ],
  imagePath: "/dam/default-image-product.webp",
  imageAlt: "Términos y condiciones de InspiraArte",
});

export const llmstxt = {
  title: "Términos y condiciones",
  description: "Condiciones de uso del sitio y contratación de pedidos personalizados.",
};

export default function TerminosYCondiciones() {
  const updateDate = TERMS_AND_CONDITIONS.updatedLabel;

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Documento legal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Términos y condiciones
          </h1>
          <p className="text-muted-foreground text-base">Última actualización: {updateDate}</p>
          <p className="text-muted-foreground text-lg">
            Al acceder y utilizar este sitio, así como al solicitar cotizaciones o pedidos con
            InspiraArte, aceptas las presentes condiciones.
          </p>
        </div>

        <article className="space-y-8 text-foreground">
          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">1. Aceptación y alcance</h2>
            <p className="text-muted-foreground">
              Estos términos regulan el uso de www.inspiraarte.com y las interacciones comerciales
              relacionadas con productos personalizados y solicitudes de cotización.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">2. Naturaleza del servicio</h2>
            <p className="text-muted-foreground">
              InspiraArte ofrece productos personalizados y servicios de diseño/fabricación sobre
              pedido. Las imágenes y descripciones son referenciales y pueden presentar variaciones
              razonables por proceso artesanal, materiales, resolución de archivos o calibración.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">3. Cotizaciones, pedidos y disponibilidad</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>La cotización no constituye venta definitiva hasta su confirmación expresa.</li>
              <li>Los tiempos de entrega son estimados y pueden variar por volumen o complejidad.</li>
              <li>Los pedidos pueden requerir anticipo para iniciar producción.</li>
              <li>
                La aceptación final del pedido puede condicionarse a validación de arte y
                disponibilidad de materiales.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">4. Precios, pagos y facturación</h2>
            <p className="text-muted-foreground">
              Los precios se informan en la cotización vigente y pueden cambiar sin previo aviso
              para solicitudes futuras. El pago y, en su caso, la facturación se rigen por los
              datos y condiciones confirmadas al momento del pedido.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">5. Archivos del cliente y propiedad intelectual</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>
                El cliente declara contar con derechos o autorizaciones para usar marcas, imágenes,
                textos o diseños que proporcione.
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
            <h2 className="font-semibold text-2xl">6. Calificaciones, opiniones y fotos</h2>
            <p className="text-muted-foreground">
              Al enviar una calificación en el sitio, con o sin foto del producto:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>
                Declaras que tu opinión refleja tu experiencia real con InspiraArte o con el producto
                calificado, y que la foto es tuya o cuentas con autorización para compartirla.
              </li>
              <li>
                Conservas la titularidad de tu comentario y de tu foto, y autorizas a InspiraArte, de
                forma gratuita y no exclusiva, a publicarlos en este sitio junto con el nombre que
                escribiste, así como a recortar o ajustar el tamaño de la foto para mostrarla.
              </li>
              <li>
                InspiraArte revisa cada calificación antes de publicarla y puede no publicar o retirar
                las que contengan datos personales de terceros, lenguaje ofensivo, publicidad,
                contenido ajeno al producto o que infrinjan derechos de terceros. No modificamos el
                texto de las opiniones publicadas.
              </li>
              <li>
                Puedes pedir en cualquier momento que retiremos tu calificación o tu foto escribiendo a
                contacto@inspiraarte.com.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">7. Cancelaciones, cambios y devoluciones</h2>
            <p className="text-muted-foreground">
              Por tratarse de productos personalizados, una vez iniciada la producción puede no ser
              posible cancelar o devolver, salvo defecto imputable a InspiraArte o supuestos
              previstos en la ley aplicable. Cualquier ajuste deberá solicitarse antes de aprobar el
              arte final.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">8. Uso permitido del sitio</h2>
            <p className="text-muted-foreground">Queda prohibido:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Usar el sitio para actividades ilícitas o fraudulentas.</li>
              <li>Intentar acceso no autorizado a sistemas, datos o cuentas.</li>
              <li>Enviar malware, spam o contenido que afecte la disponibilidad del servicio.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">9. Limitación de responsabilidad</h2>
            <p className="text-muted-foreground">
              En la medida permitida por ley, InspiraArte no será responsable por daños indirectos,
              incidentales o lucro cesante derivados del uso del sitio o de retrasos por causas
              fuera de su control razonable (por ejemplo, eventos de fuerza mayor, fallas de
              proveedores o servicios de terceros).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">10. Privacidad y datos personales</h2>
            <p className="text-muted-foreground">
              El tratamiento de datos personales, incluidas las calificaciones y fotos, se rige por
              el Aviso de Privacidad publicado en este sitio, conforme a la LFPDPPP y normativa
              mexicana aplicable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">11. Ley aplicable y jurisdicción</h2>
            <p className="text-muted-foreground">
              Estos términos se interpretan conforme a las leyes de los Estados Unidos Mexicanos. En
              caso de controversia, las partes procurarán solución amistosa y, de ser necesario,
              acudirán a las autoridades competentes de Ciudad de México, salvo disposición legal en
              contrario.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">12. Contacto</h2>
            <p className="text-muted-foreground">
              Para dudas sobre estos términos: contacto@inspiraarte.com.
            </p>
          </section>

        </article>
      </div>
    </section>
  );
}
