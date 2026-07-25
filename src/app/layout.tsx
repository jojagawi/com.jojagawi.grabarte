import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/structure/header";
import { Footer } from "@/components/structure/footer";
import { GoogleTagManager } from "@next/third-parties/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "InspirArte | Personalización sin límites: del diseño a la realidad",
  description:
    "Descubre nuestro catálogo de productos personalizados. Expertos en corte y grabado láser en MDF, acrílico y cuero, y personalización de termos. ¡Haz tu pedido!",
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
    <html lang="es" className={`bg-background`}>
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
