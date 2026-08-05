import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";

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
  imagePath: "/dam/dafault-image-product.webp",
  imageAlt: "Aviso de privacidad de InspiraArte",
});

export const llmstxt = {
  title: "Aviso de privacidad",
  description: "Tratamiento de datos personales y derechos ARCO.",
};

export default function AvisoDePrivacidad() {
  const updateDate = "28 de julio de 2026";

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4290A3]/10 text-[#4290A3] text-sm font-medium">
            Documento legal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Aviso de privacidad
          </h1>
          <p className="text-muted-foreground text-base">
            Ultima actualizacion: {updateDate}
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
              InspiraArte es responsable del tratamiento de datos personales recabados a traves de
              sus formularios, canales de contacto y solicitudes de cotizacion.
            </p>
            <p className="text-muted-foreground">
              Correo de contacto: contacto@inspiraarte.com. Domicilio referencial de operacion:
              Ciudad de Mexico, Mexico.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">2. Datos personales recabados</h2>
            <p className="text-muted-foreground">Podemos recabar, segun el canal utilizado:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Datos de identificacion y contacto (nombre, correo, telefono o WhatsApp).</li>
              <li>Datos de pedido o cotizacion (producto, cantidades, fecha estimada, mensaje).</li>
              <li>Archivos de referencia y diseno que el titular decida compartir.</li>
              <li>Datos tecnicos basicos de navegacion (por ejemplo, IP y eventos de analitica).</li>
            </ul>
            <p className="text-muted-foreground">
              InspiraArte no solicita deliberadamente datos personales sensibles para la operacion
              ordinaria del servicio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">3. Finalidades del tratamiento</h2>
            <p className="text-muted-foreground">Finalidades primarias:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Atender solicitudes de informacion, cotizacion y seguimiento de pedidos.</li>
              <li>Elaborar propuestas y producir articulos personalizados solicitados.</li>
              <li>Gestionar pagos, facturacion y cumplimiento de obligaciones legales.</li>
              <li>Brindar soporte y atencion postventa.</li>
            </ul>
            <p className="text-muted-foreground">Finalidades secundarias (opcionales):</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Mejorar la experiencia del sitio y analizar interacciones agregadas.</li>
              <li>Enviar novedades comerciales relacionadas con servicios de InspiraArte.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">4. Fundamento y marco normativo</h2>
            <p className="text-muted-foreground">
              El tratamiento se realiza conforme a la Ley Federal de Proteccion de Datos Personales
              en Posesion de los Particulares (LFPDPPP), su Reglamento y lineamientos aplicables en
              Mexico. Cuando resulte procedente por alcance territorial, se consideran principios de
              buenas practicas internacionales en materia de privacidad.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">5. Transferencias de datos</h2>
            <p className="text-muted-foreground">
              InspiraArte puede apoyarse en proveedores tecnologicos para hosting, almacenamiento de
              archivos, analitica y comunicaciones. Dichas transferencias se limitan a lo necesario
              para cumplir las finalidades descritas y bajo medidas contractuales razonables de
              seguridad y confidencialidad.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">6. Derechos ARCO y revocacion</h2>
            <p className="text-muted-foreground">
              El titular puede ejercer derechos de Acceso, Rectificacion, Cancelacion y Oposicion
              (ARCO), asi como revocar el consentimiento para finalidades secundarias, enviando su
              solicitud a contacto@inspiraarte.com con:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Nombre del titular y medio para comunicar respuesta.</li>
              <li>Descripcion clara de los datos o derecho a ejercer.</li>
              <li>Documentos para acreditar identidad o representacion legal.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">7. Medidas de seguridad y conservacion</h2>
            <p className="text-muted-foreground">
              Se aplican medidas administrativas, tecnicas y fisicas razonables para proteger los
              datos contra dano, perdida, alteracion, destruccion o acceso no autorizado. La
              conservacion se realiza solo por el tiempo necesario para cumplir finalidades
              contractuales, legales y de defensa de derechos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">8. Uso de cookies y tecnologias similares</h2>
            <p className="text-muted-foreground">
              El sitio puede utilizar cookies y tecnologias similares para funcionamiento tecnico,
              medicion de uso y mejora del servicio. Puedes gestionar cookies desde tu navegador.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-2xl">9. Cambios al aviso</h2>
            <p className="text-muted-foreground">
              InspiraArte puede actualizar este aviso para reflejar cambios legales, operativos o de
              servicio. La version vigente se publicara en esta misma pagina.
            </p>
          </section>

        </article>
      </div>
    </section>
  );
}
