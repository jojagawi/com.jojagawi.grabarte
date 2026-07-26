import Link from "next/link"
import { MapPin } from "lucide-react"
import Image from "next/image";
import { FaInstagram } from "@react-icons/all-files/fa/FaInstagram";
import { FaFacebookF } from "@react-icons/all-files/fa/FaFacebookF";
import { FaWhatsapp } from "@react-icons/all-files/fa/FaWhatsapp";
import { FaEnvelope } from "@react-icons/all-files/fa/FaEnvelope";
import { SiTiktok } from "@react-icons/all-files/si/SiTiktok";

export function Footer() {

  return (
    <footer id="legales" className="bg-[#585106] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#4290A3] flex items-center justify-center">
                <Image
                  src="/dam/logos/logo.svg"
                  alt="Logo InspirArte"
                  width={20}
                  height={20}
                  className="w-5 h-5 filter-[brightness(0)_invert(1)]"
                />
              </div>
              <span className="font-serif text-xl font-bold">
                Inspir<span className="text-[#3ACBFE]">Arte</span>
              </span>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed">
              Materializamos tus ideas con precisión y detalle.
            </p>
            <div className="flex gap-4">
              {process.env.NEXT_PUBLIC_INSTAGRAM && (
                <Link
                  href={process.env.NEXT_PUBLIC_INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#4290A3] transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5" />
                </Link>
              )}
              {process.env.NEXT_PUBLIC_FACEBOOK && (
                <Link
                  href={process.env.NEXT_PUBLIC_FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#4290A3] transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-5 h-5" />
                </Link>
              )}
              {process.env.NEXT_PUBLIC_TIKTOK && (
                <Link
                  href={process.env.NEXT_PUBLIC_TIKTOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#4290A3] transition-colors"
                  aria-label="Tiktok"
                >
                  <SiTiktok className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navegación</h3>
            <ul className="space-y-3">
              {[
                { name: "Inicio", href: "/" },
                { name: "Productos", href: "/productos" },
                { name: "Proceso", href: "/proceso" },
                { name: "FAQ", href: "/faq" },
                { name: "Contacto", href: "/contacto" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-[#3ACBFE] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Productos</h3>
            <ul className="space-y-3">
              {[
                "Termos Personalizados",
                "Llaveros Grabados",
                "Carteras y Carpetas",
                "Figuras Decorativas MDF",
                "Regalos Corporativos",
              ].map((product) => (
                <li key={product}>
                  <span className="text-white/80 text-sm">{product}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-4">
              {process.env.NEXT_PUBLIC_EMAIL && (
                <li className="flex items-center gap-3">
                  <FaEnvelope className="w-5 h-5 text-[#3ACBFE]" />
                  <span className="text-white/80 text-sm">
                    <Link
                      rel="noopener noreferrer"
                      href={"mailto:" + process.env.NEXT_PUBLIC_EMAIL}
                    >
                      {process.env.NEXT_PUBLIC_EMAIL}
                    </Link>
                  </span>
                </li>
              )}
              {process.env.NEXT_PUBLIC_WHATSAPP && (
                <li className="flex items-center gap-3">
                  <FaWhatsapp className="w-5 h-5 text-[#3ACBFE]" />
                  <span className="text-white/80 text-sm">
                    <Link
                      rel="noopener noreferrer"
                      href={
                        "https://wa.me/" +
                        process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "")
                      }
                    >
                      {process.env.NEXT_PUBLIC_WHATSAPP}
                    </Link>
                  </span>
                </li>
              )}
              {process.env.NEXT_PUBLIC_DIR && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#3ACBFE] shrink-0" />
                  <span className="text-white/80 text-sm">
                    {process.env.NEXT_PUBLIC_DIR}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} LaserCraft MX. Todos los derechos
              reservados.
            </p>
            <div className="flex gap-6">
              <Link
                href="/aviso-de-privacidad"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Aviso de Privacidad
              </Link>
              <Link
                href="/terminos-y-condiciones"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
