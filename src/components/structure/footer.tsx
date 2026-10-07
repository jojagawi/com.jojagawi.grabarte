import Link from "next/link"
import { MapPin } from "lucide-react"
import Image from "next/image";
import { FaInstagram } from "@react-icons/all-files/fa/FaInstagram";
import { FaFacebookF } from "@react-icons/all-files/fa/FaFacebookF";
import { FaWhatsapp } from "@react-icons/all-files/fa/FaWhatsapp";
import { FaEnvelope } from "@react-icons/all-files/fa/FaEnvelope";
import { SiTiktok } from "@react-icons/all-files/si/SiTiktok";
import { getCategoryPages, getCategoryPath } from "@/lib/categories.server";

const footerLinkClassName =
  "rounded-sm underline-offset-4 transition-colors hover:text-inspirarte-petroleum-deep hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

const socialLinkClassName =
  "w-11 h-11 rounded-full border border-border bg-white/70 text-foreground flex items-center justify-center transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

const contactIconClassName = "w-5 h-5 shrink-0 text-inspirarte-petroleum-deep"

const MAX_FOOTER_CATEGORIES = 5

// Las categorías con más diseños publicados: enlazan a su página desde todo el sitio.
async function getFooterCategories(): Promise<Array<{ name: string; href: string }>> {
  // Copia: getCategoryPages está memoizada y sort() muta el arreglo.
  return [...(await getCategoryPages())]
    .sort((a, b) => b.designs.length - a.designs.length || a.name.localeCompare(b.name, "es"))
    .slice(0, MAX_FOOTER_CATEGORIES)
    .map((category) => ({ name: category.name, href: getCategoryPath(category.slug) }))
}

export async function Footer() {
  const footerCategories = await getFooterCategories()

  return (
    // Madera clara de fondo (≈ rgb 246 229 213). Petróleo Profundo es el único tono de
    // acción que llega a AA sobre ella (4.69:1); el petróleo base (3.95:1) y el cian no.
    <footer
      id="legales"
      className="bg-background text-foreground"
      style={{
        backgroundImage: "url('/dam/background.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-48 h-16 rounded-lg  flex items-center justify-center">
                <Image
                  src="/dam/logos/logo.webp"
                  alt="Logo InspiraArte"
                  width={192}
                  height={64}
                  loading="lazy"
                  className="w-48 h-16"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed">
              Materializamos tus ideas con precisión y detalle.
            </p>
            <div className="flex gap-4">
              {process.env.NEXT_PUBLIC_INSTAGRAM && (
                <Link
                  href={process.env.NEXT_PUBLIC_INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClassName}
                  aria-label="Instagram"
                >
                  <FaInstagram aria-hidden="true" className="w-5 h-5" />
                </Link>
              )}
              {process.env.NEXT_PUBLIC_FACEBOOK && (
                <Link
                  href={process.env.NEXT_PUBLIC_FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClassName}
                  aria-label="Facebook"
                >
                  <FaFacebookF aria-hidden="true" className="w-5 h-5" />
                </Link>
              )}
              {process.env.NEXT_PUBLIC_TIKTOK && (
                <Link
                  href={process.env.NEXT_PUBLIC_TIKTOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClassName}
                  aria-label="Tiktok"
                >
                  <SiTiktok aria-hidden="true" className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Navegación</h2>
            <ul className="space-y-3">
              {[
                { name: "Inicio", href: "/" },
                { name: "Productos", href: "/productos" },
                { name: "Proceso", href: "/proceso" },
                { name: "Nosotros", href: "/nosotros" },
                { name: "FAQ", href: "/faq" },
                { name: "Contacto", href: "/contacto" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`${footerLinkClassName} text-sm`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Productos</h2>
            <ul className="space-y-3">
              {[...footerCategories, { name: "Ver todo el catálogo", href: "/productos" }].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`${footerLinkClassName} text-sm`}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Contacto</h2>
            <ul className="space-y-4">
              {process.env.NEXT_PUBLIC_EMAIL && (
                <li className="flex items-center gap-3">
                  <FaEnvelope aria-hidden="true" className={contactIconClassName} />
                  <span className="text-sm">
                    <Link
                      rel="noopener noreferrer"
                      className={footerLinkClassName}
                      href={"mailto:" + process.env.NEXT_PUBLIC_EMAIL}
                    >
                      {process.env.NEXT_PUBLIC_EMAIL}
                    </Link>
                  </span>
                </li>
              )}
              {process.env.NEXT_PUBLIC_WHATSAPP && (
                <li className="flex items-center gap-3">
                  <FaWhatsapp aria-hidden="true" className={contactIconClassName} />
                  <span className="text-sm">
                    <Link
                      rel="noopener noreferrer"
                      className={footerLinkClassName}
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
                  <MapPin aria-hidden="true" className={contactIconClassName} />
                  <span className="text-sm">{process.env.NEXT_PUBLIC_DIR}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © {new Date().getFullYear()} InspiraArte. Todos los derechos
              reservados.
            </p>
            <div className="flex gap-6">
              <Link
                href="/aviso-de-privacidad"
                className={`${footerLinkClassName} text-sm`}
              >
                Aviso de Privacidad
              </Link>
              <Link
                href="/terminos-y-condiciones"
                className={`${footerLinkClassName} text-sm`}
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
