"use client";

import { useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { Printer } from "lucide-react";
import { FaEnvelope } from "@react-icons/all-files/fa/FaEnvelope";
import { FaWhatsapp } from "@react-icons/all-files/fa/FaWhatsapp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getSocialNetworks } from "@/components/custom/social-links";
import { type QueryProduct, useQueryProduct } from "@/lib/query-product";

type FlyerSize = "half-letter" | "letter";

const flyerSizes: Record<FlyerSize, { label: string; page: string; className: string }> = {
  "half-letter": { label: "Media carta (14 × 21.6 cm)", page: "5.5in 8.5in", className: "w-[5.5in] h-[8.5in]" },
  letter: { label: "Carta (21.6 × 27.9 cm)", page: "letter", className: "w-[8.5in] h-[11in]" },
};

const selectClassName =
  "focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:ring-[3px]";

interface ProductFlyerProps {
  products: QueryProduct[];
  /** URL pública de /gracias/; el QR le agrega ?id=<id del diseño>. */
  thanksUrl: string;
}

export function ProductFlyer({ products, thanksUrl }: ProductFlyerProps) {
  // ?id= preselecciona el diseño (enlace "Flyer con QR" de la ficha del producto).
  const queryProduct = useQueryProduct(products);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [size, setSize] = useState<FlyerSize>("half-letter");

  const productId = selectedId ?? queryProduct?.id ?? products[0]?.id ?? null;
  const product = products.find((item) => item.id === productId) ?? null;
  const qrValue = product ? `${thanksUrl}?id=${product.id}` : thanksUrl;
  const email = process.env.NEXT_PUBLIC_EMAIL;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP;
  const socialNetworks = getSocialNetworks();
  const isLetter = size === "letter";

  return (
    <section className="pt-28 pb-20 print:p-0">
      {/* Tamaño de hoja del flyer elegido; sin márgenes para que el diseño ocupe la hoja completa. */}
      <style>{`@page { size: ${flyerSizes[size].page}; margin: 0; }`}</style>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 print:hidden">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">Flyers con QR</h1>
        <p className="mt-3 text-muted-foreground">
          El QR abre la página de gracias con los datos de contacto, redes sociales y el enlace para calificar
          el producto elegido.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="flyer-product">Producto</Label>
            <select
              id="flyer-product"
              className={selectClassName}
              value={productId ?? ""}
              onChange={(event) => setSelectedId(Number(event.target.value))}
            >
              {products.map((item) => (
                <option key={item.id} value={item.id}>
                  #{item.id} · {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="flyer-size">Tamaño</Label>
            <select
              id="flyer-size"
              className={selectClassName}
              value={size}
              onChange={(event) => setSize(event.target.value as FlyerSize)}
            >
              {Object.entries(flyerSizes).map(([value, option]) => (
                <option key={value} value={value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="button"
            onClick={() => window.print()}
            disabled={!product}
            className="bg-primary text-white hover:bg-inspirarte-petroleum-deep"
          >
            <Printer aria-hidden="true" />
            Imprimir
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground [overflow-wrap:anywhere]">
          Enlace del QR: <span className="font-mono">{qrValue}</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          En el cuadro de impresión elige el mismo tamaño de papel, escala 100 % y activa “Gráficos de fondo”.
        </p>
      </div>

      <div className="mt-10 flex justify-center overflow-x-auto px-4 print:mt-0 print:block print:overflow-visible print:px-0">
        <article
          aria-label="Vista previa del flyer"
          className={`${flyerSizes[size].className} flex shrink-0 flex-col items-center justify-between bg-white text-center text-foreground shadow-lg ring-1 ring-border [print-color-adjust:exact] print:shadow-none print:ring-0 ${isLetter ? "p-[0.8in]" : "p-[0.5in]"}`}
        >
          <header className="flex flex-col items-center gap-3">
            <Image
              src="/dam/logos/logo.webp"
              alt="Logo InspiraArte"
              width={192}
              height={64}
              className={isLetter ? "h-20 w-60" : "h-14 w-42"}
            />
            <h2 className={`font-serif font-bold leading-tight ${isLetter ? "text-5xl" : "text-3xl"}`}>
              ¡Gracias por tu compra!
            </h2>
            <p className={`text-muted-foreground ${isLetter ? "text-xl" : "text-base"}`}>
              Escanea el código para calificar tu producto, seguirnos en redes y contactarnos.
            </p>
          </header>

          <div className="flex flex-col items-center gap-3">
            <div className="rounded-2xl border-2 border-primary p-3">
              <QRCodeSVG
                value={qrValue}
                size={isLetter ? 288 : 192}
                level="M"
                marginSize={1}
                title={`QR para calificar ${product?.name ?? "tu producto"}`}
              />
            </div>
            {product && (
              <p className={`font-medium ${isLetter ? "text-2xl" : "text-lg"}`}>
                {product.name}
                <span className="block text-sm font-normal text-muted-foreground">Producto #{product.id}</span>
              </p>
            )}
          </div>

          <footer className={`w-full space-y-2 border-t border-border pt-4 ${isLetter ? "text-lg" : "text-sm"}`}>
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
              {whatsapp && (
                <li className="flex items-center gap-2">
                  <FaWhatsapp aria-hidden="true" className="h-4 w-4 text-inspirarte-green" />
                  {whatsapp}
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2">
                  <FaEnvelope aria-hidden="true" className="h-4 w-4 text-primary" />
                  {email}
                </li>
              )}
            </ul>
            {socialNetworks.length > 0 && (
              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
                {socialNetworks.map(({ name, handle, Icon }) => (
                  <li key={name} className="flex items-center gap-2">
                    <Icon aria-hidden={true} className="h-4 w-4" />
                    <span className="sr-only">{name}:</span>
                    {handle}
                  </li>
                ))}
              </ul>
            )}
            <p className="font-medium text-primary">{new URL(thanksUrl).host}</p>
          </footer>
        </article>
      </div>
    </section>
  );
}
