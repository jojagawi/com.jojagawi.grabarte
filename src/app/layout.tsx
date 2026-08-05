import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { buildMetadataBase } from "@/lib/metadata";
import { Footer } from "@/components/structure/footer";
import { Header } from "@/components/structure/header";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: buildMetadataBase(),
  title: "InspiraArte | Personalización sin límites: del diseño a la realidad",
  description:
    "Descubre nuestro catálogo de productos personalizados. Expertos en corte y grabado láser en MDF, acrílico y cuero, y personalización de termos. ¡Haz tu pedido!",
  openGraph: {
    title: "InspiraArte | Personalización sin límites: del diseño a la realidad",
    description:
      "Descubre nuestro catálogo de productos personalizados. Expertos en corte y grabado láser en MDF, acrílico y cuero, y personalización de termos. ¡Haz tu pedido!",
    url: "/",
    type: "website",
    locale: "es_MX",
    siteName: "InspiraArte",
    images: [
      {
        url: "/dam/dafault-image-product.webp",
        alt: "Productos personalizados de InspiraArte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InspiraArte | Personalización sin límites: del diseño a la realidad",
    description:
      "Descubre nuestro catálogo de productos personalizados. Expertos en corte y grabado láser en MDF, acrílico y cuero, y personalización de termos. ¡Haz tu pedido!",
    images: ["/dam/dafault-image-product.webp"],
  },
  icons: {
    icon: [
      {
        url: "/dam/logos/favicon-100.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/dam/logos/favicon-100.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/dam/logos/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/dam/logos/favicon-200.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`bg-background` + dmSans.className + " " + playfair.className}
    >
      <body
        className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}
      >
        <main className="min-h-screen">
          <Header />
          {children}
          <Footer />
          {process.env.NEXT_GTM && (
            <GoogleTagManager gtmId={process.env.NEXT_GTM} />
          )}
        </main>
      </body>
    </html>
  );
}
