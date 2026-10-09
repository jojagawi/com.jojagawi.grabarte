import { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/metadata";
import { PRIVACY_NOTICE } from "@/lib/legal";

export const metadata: Metadata = buildPageMetadata({
  title: "Aviso de privacidad | InspiraArte",
  description:
    "Conoce cómo tratamos tus datos personales en InspiraArte conforme a la legislación mexicana aplicable y buenas prácticas internacionales de privacidad.",
  path: "/aviso-de-privacidad",
  keywords: [
    "aviso de privacidad",
    "LFPDPPP",
    "datos personales",
    "derechos ARCO",
    "InspiraArte",
  ],
});

export default function AvisoDePrivacidad() {
  const updateDate = PRIVACY_NOTICE.updatedLabel;

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Documento legal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Aviso de privacidad
          </h1>
          <p className="text-muted-foreground text-base">
            Última actualización: {updateDate}
          </p>
          <p className="text-muted-foreground text-lg">
            Este aviso describe la forma en que InspiraArte recopila, usa, conserva y protege datos
            personales de clientes, prospectos y visitantes del sitio.
          </p>
        </div>

        <article className="space-y-8 text-foreground">
          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">1. Responsable del tratamiento</h2>
            <p className="text-muted-foreground">
              InspiraArte es responsable del tratamiento de datos personales recabados a través de
              sus formularios de cotización y de calificaciones, y de sus canales de contacto.
            </p>
            <p className="text-muted-foreground">
              Correo de contacto: contacto@inspiraarte.com. Domicilio referencial de operación:
              Ciudad de México, México.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">2. Datos personales recabados</h2>
            <p className="text-muted-foreground">Podemos recabar, según el canal utilizado:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Datos de identificación y contacto (nombre, correo, teléfono o WhatsApp).</li>
              <li>Datos de pedido o cotización (producto, cantidades, fecha estimada, mensaje).</li>
              <li>Archivos de referencia y diseño que el titular decida compartir.</li>
              <li>
                Datos de calificaciones y opiniones: el nombre con el que firmas, el producto, la
                calificación, tu comentario y, si decides adjuntarla, una foto del producto.
              </li>
              <li>Datos técnicos básicos de navegación (por ejemplo, IP y eventos de analítica).</li>
            </ul>
            <p className="text-muted-foreground">
              InspiraArte no solicita deliberadamente datos personales sensibles para la operación
              ordinaria del servicio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">3. Finalidades del tratamiento</h2>
            <p className="text-muted-foreground">Finalidades primarias:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Atender solicitudes de información, cotización y seguimiento de pedidos.</li>
              <li>Elaborar propuestas y producir artículos personalizados solicitados.</li>
              <li>Gestionar pagos, facturación y cumplimiento de obligaciones legales.</li>
              <li>Brindar soporte y atención postventa.</li>
              <li>
                Revisar las calificaciones recibidas y publicar en el sitio las aprobadas, con el
                nombre, comentario, calificación y foto que compartas, como referencia para otros
                clientes.
              </li>
              <li>Proteger los formularios contra uso automatizado y abuso.</li>
            </ul>
            <p className="text-muted-foreground">Finalidades secundarias (opcionales):</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Mejorar la experiencia del sitio y analizar interacciones agregadas.</li>
              <li>Enviar novedades comerciales relacionadas con servicios de InspiraArte.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">4. Calificaciones, opiniones y fotos</h2>
            <p className="text-muted-foreground">
              Para enviar una calificación debes aceptar este aviso y los{" "}
              <Link href="/terminos-y-condiciones" className="text-primary underline underline-offset-4">
                términos y condiciones
              </Link>
              . Guardamos la fecha y la versión del aviso que aceptaste como constancia de tu
              consentimiento.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>
                Revisamos cada calificación antes de publicarla. Solo se muestran en el sitio las
                aprobadas, junto con el nombre que escribiste; te sugerimos usar tu nombre de pila o
                tus iniciales.
              </li>
              <li>
                Si adjuntas una foto, tu navegador la optimiza antes de enviarla y elimina sus
                metadatos (por ejemplo, la ubicación GPS y el modelo del teléfono). La foto se
                almacena en servidores de Amazon Web Services y es accesible mediante un enlace
                único desde que se sube; en el sitio solo aparece cuando aprobamos la calificación.
              </li>
              <li>
                Te pedimos no incluir en la foto rostros, datos o imágenes de otras personas sin su
                autorización. Podemos rechazar fotos o comentarios que no correspondan al producto o
                que contengan datos personales de terceros.
              </li>
              <li>
                Puedes pedir en cualquier momento que retiremos tu calificación o tu foto escribiendo
                a contacto@inspiraarte.com; las eliminamos del sitio y de nuestro almacenamiento.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">5. Fundamento y marco normativo</h2>
            <p className="text-muted-foreground">
              El tratamiento se realiza conforme a la Ley Federal de Protección de Datos Personales
              en Posesión de los Particulares (LFPDPPP), su Reglamento y lineamientos aplicables en
              México. Cuando resulte procedente por alcance territorial, se consideran principios de
              buenas prácticas internacionales en materia de privacidad.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">6. Transferencias de datos</h2>
            <p className="text-muted-foreground">
              InspiraArte se apoya en proveedores tecnológicos que tratan datos por nuestra cuenta,
              solo para las finalidades descritas:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Amazon Web Services: hospedaje del sitio y almacenamiento de solicitudes, archivos, calificaciones y fotos.</li>
              <li>Google: reCAPTCHA para proteger los formularios, y Google Tag Manager y analítica para medir el uso del sitio.</li>
              <li>HubSpot y Slack: seguimiento interno de las solicitudes de cotización.</li>
              <li>Bugsnag: registro de errores técnicos del sitio.</li>
            </ul>
            <p className="text-muted-foreground">
              Dichas transferencias se limitan a lo necesario para cumplir las finalidades descritas
              y bajo medidas contractuales razonables de seguridad y confidencialidad.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">7. Derechos ARCO y revocación</h2>
            <p className="text-muted-foreground">
              El titular puede ejercer derechos de Acceso, Rectificación, Cancelación y Oposición
              (ARCO), así como revocar el consentimiento para finalidades secundarias o para la
              publicación de su calificación y foto, enviando su solicitud a contacto@inspiraarte.com
              con:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Nombre del titular y medio para comunicar respuesta.</li>
              <li>Descripción clara de los datos o derecho a ejercer.</li>
              <li>Documentos para acreditar identidad o representación legal.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">8. Medidas de seguridad y conservación</h2>
            <p className="text-muted-foreground">
              Se aplican medidas administrativas, técnicas y físicas razonables para proteger los
              datos contra daño, pérdida, alteración, destrucción o acceso no autorizado. La
              conservación se realiza solo por el tiempo necesario para cumplir finalidades
              contractuales, legales y de defensa de derechos. Las calificaciones y sus fotos se
              conservan mientras estén publicadas o hasta que solicites su eliminación.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">9. Uso de cookies y tecnologías similares</h2>
            <p className="text-muted-foreground">
              El sitio puede utilizar cookies y tecnologías similares para funcionamiento técnico,
              medición de uso y mejora del servicio. Puedes gestionar cookies desde tu navegador.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">10. Cambios al aviso</h2>
            <p className="text-muted-foreground">
              InspiraArte puede actualizar este aviso para reflejar cambios legales, operativos o de
              servicio. La versión vigente se publicará en esta misma página.
            </p>
          </section>

        </article>
      </div>
    </section>
  );
}
