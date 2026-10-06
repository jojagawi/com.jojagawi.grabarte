import Link from "next/link";
import { FaWhatsapp } from "@react-icons/all-files/fa/FaWhatsapp";
import { FaEnvelope } from "@react-icons/all-files/fa/FaEnvelope";
import { FaClock } from "@react-icons/all-files/fa/FaClock";

interface ContactMethodsProps {
  // Enlace de WhatsApp con el contexto de la cotización; sin él, solo abre el chat.
  whatsappHref?: string | null;
}

export function ContactMethods({ whatsappHref }: ContactMethodsProps) {
  const email = process.env.NEXT_PUBLIC_EMAIL;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP;
  const schedules = process.env.NEXT_PUBLIC_SCHEDULES;

  return (
    <div className="space-y-5">
      {email && (
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <FaEnvelope aria-hidden="true" className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-foreground">Correo</h3>
            <p className="text-muted-foreground [overflow-wrap:anywhere]">
              <Link href={"mailto:" + email} className="font-medium text-primary underline-offset-4 hover:underline">
                {email}
              </Link>
            </p>
          </div>
        </div>
      )}
      {whatsapp && (
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-inspirarte-green/10 flex items-center justify-center shrink-0">
            <FaWhatsapp aria-hidden="true" className="w-5 h-5 text-inspirarte-green" />
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-foreground">WhatsApp</h3>
            <p className="text-muted-foreground">
              <a
                href={whatsappHref || `https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {whatsapp}
              </a>
            </p>
          </div>
        </div>
      )}
      {schedules && (
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-inspirarte-teal/10 flex items-center justify-center shrink-0">
            <FaClock aria-hidden="true" className="w-5 h-5 text-inspirarte-teal" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Horario</h3>
            {schedules.split("|").map((item, index) => (
              <p key={index} className="text-muted-foreground">
                {item}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
