import Link from "next/link";
import { FaWhatsapp } from "@react-icons/all-files/fa/FaWhatsapp";
import { FaEnvelope } from "@react-icons/all-files/fa/FaEnvelope";
import { FaClock } from "@react-icons/all-files/fa/FaClock";

export function ContactMethods() {
  const email = process.env.NEXT_PUBLIC_EMAIL;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP;
  const schedules = process.env.NEXT_PUBLIC_SCHEDULES;

  return (
    <div className="space-y-6 mb-8">
      {email && (
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#4290A3]/10 flex items-center justify-center shrink-0">
            <FaEnvelope className="w-5 h-5 text-[#4290A3]" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Email</h3>
            <p className="text-muted-foreground">
              <Link href={"mailto:" + email}>{email}</Link>
            </p>
          </div>
        </div>
      )}
      {whatsapp && (
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#00B003]/10 flex items-center justify-center shrink-0">
            <FaWhatsapp className="w-5 h-5 text-[#00B003]" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">WhatsApp</h3>
            <p className="text-muted-foreground">
              <Link
                href={
                  "https://wa.me/" +
                  process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "")
                }
              >
                {process.env.NEXT_PUBLIC_WHATSAPP}
              </Link>
            </p>
          </div>
        </div>
      )}
      {schedules && (
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1FA4A7]/10 flex items-center justify-center shrink-0">
            <FaClock className="w-5 h-5 text-[#1FA4A7]" />
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
