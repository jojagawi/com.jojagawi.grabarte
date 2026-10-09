import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
import { buildMetadataBase } from "@/lib/metadata";
import { buildOrganizationJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { BugsnagBoundary } from "@/components/structure/bugsnag-boundary";
import { Footer } from "@/components/structure/footer";
import { Header, type SeasonLink } from "@/components/structure/header";
import { getSeasonPages } from "@/lib/seasons.server";
import { PwaAnalytics } from "@/components/structure/pwa-analytics";
import { WebMcpInit } from "@/components/structure/webmcp-init";
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
    // Tarjeta genérica 1200×630 (la misma que usa buildPageMetadata por defecto).
    images: [
      {
        url: "/dam/og/inspiraarte.png",
        alt: "InspiraArte: productos personalizados con corte y grabado láser",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InspiraArte | Personalización sin límites: del diseño a la realidad",
    description:
      "Descubre nuestro catálogo de productos personalizados. Expertos en corte y grabado láser en MDF, acrílico y cuero, y personalización de termos. ¡Haz tu pedido!",
    images: ["/dam/og/inspiraarte.png"],
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

// "Productos por temporada" solo aparece en desarrollo: en el build no se consulta.
async function getDevSeasonLinks(): Promise<SeasonLink[]> {
  if (process.env.NODE_ENV !== "development") {
    return [];
  }
  return (await getSeasonPages()).map((season) => ({ slug: season.slug, name: season.label }));
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shouldRegisterServiceWorker = process.env.NODE_ENV === "production";
  const organizationJsonLd = buildOrganizationJsonLd();

  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`bg-background ${dmSans.className} ${playfair.className}`}
    >
      <body
        className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}
      >
        <main className="min-h-screen">
          <Header seasonLinks={await getDevSeasonLinks()} />
          {process.env.NEXT_GTM && (
            <Script id="google-consent-mode" strategy="beforeInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});`}
            </Script>
          )}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }}
          />
          <BugsnagBoundary>{children}</BugsnagBoundary>
          <Footer />
          <PwaAnalytics />
          <WebMcpInit />
          {process.env.NEXT_GTM && (
            <GoogleTagManager gtmId={process.env.NEXT_GTM} />
          )}
        </main>
        <Script id="register-service-worker" strategy="afterInteractive">
          {`if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  const swPath = "/service-worker.js";
  const swAbsoluteUrl = new URL(swPath, window.location.origin).href;

  if (${shouldRegisterServiceWorker}) {
    navigator.serviceWorker
      .register(swPath, { scope: "/" })
      .catch((error) => {
        console.error("[SW] Error al registrar service worker", error);
      });
  } else {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          const matchesScope = registration.scope.startsWith(window.location.origin + "/");
          const matchesScriptUrl =
            registration.active?.scriptURL === swAbsoluteUrl ||
            registration.installing?.scriptURL === swAbsoluteUrl ||
            registration.waiting?.scriptURL === swAbsoluteUrl;

          if (matchesScope && matchesScriptUrl) {
            registration.unregister().catch((error) => {
              console.error("[SW] Error al desregistrar service worker", error);
            });
          }
        });
      })
      .catch((error) => {
        console.error("[SW] Error al listar registros de service worker", error);
      });
  }
}`}
        </Script>
      </body>
    </html>
  );
}
