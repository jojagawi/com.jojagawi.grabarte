"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const ACL_FLAGS = {
  ADD_DESIGNS: process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true",
} as const;

type AclKey = keyof typeof ACL_FLAGS;

type NavItem = {
  name: string;
  href: string;
  acl?: AclKey;
};

const navigation: NavItem[] = [
  { name: "Inicio", href: "/" },
  { name: "Productos", href: "/productos" },
  { name: "Proceso", href: "/proceso" },
  { name: "FAQ", href: "/faq" },
  { name: "Contacto", href: "/contacto" },
  { name: "Agregar", href: "/agregar", acl: "ADD_DESIGNS" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const canShowByAcl = (acl?: AclKey) => {
    if (!acl) return true;
    return ACL_FLAGS[acl];
  };
  const visibleNavigation = navigation.filter((item) => canShowByAcl(item.acl));

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-border"
      style={{
        backgroundImage: "url('/dam/background.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {visibleNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-[#4290A3] transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Button
              asChild
              className="bg-[#4290A3] hover:bg-[#1FA4A7] text-white"
            >
              <Link href="/contacto">¡Cotiza ahora!</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75 sm:w-100">
              <div className="flex flex-col gap-6 mt-8">
                {visibleNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-foreground hover:text-[#4290A3] transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
                <Button
                  asChild
                  className="bg-[#4290A3] hover:bg-[#1FA4A7] text-white mt-4"
                >
                  <Link href="/contacto" onClick={() => setIsOpen(false)}>
                    ¡Cotiza ahora!
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
