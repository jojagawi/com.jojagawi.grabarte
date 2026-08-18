"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const canShowByAcl = (acl?: AclKey) => {
    if (!acl) return true;
    return ACL_FLAGS[acl];
  };
  const visibleNavigation = navigation.filter((item) => canShowByAcl(item.acl));
  const canShowAdmin = canShowByAcl("ADD_DESIGNS");

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
            {canShowAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto px-0 py-0 text-sm font-medium text-muted-foreground hover:bg-transparent hover:text-[#4290A3]"
                  >
                    Administrar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/agregar">Agregar producto</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Catalogos</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem asChild>
                        <Link href="/catalogos/categorias">Categorias</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/catalogos/calificaciones">Calificaciones</Link>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
                {canShowAdmin && (
                  <div className="flex flex-col gap-4">
                    <span className="text-lg font-medium text-foreground">Administrar</span>
                    <Link
                      href="/agregar"
                      onClick={() => setIsOpen(false)}
                      className="pl-4 text-base font-medium text-muted-foreground hover:text-[#4290A3] transition-colors"
                    >
                      Agregar producto
                    </Link>
                    <div className="flex flex-col gap-2 pl-4">
                      <span className="text-base font-medium text-muted-foreground">Catalogos</span>
                      <Link
                        href="/catalogos/categorias"
                        onClick={() => setIsOpen(false)}
                        className="pl-4 text-base font-medium text-muted-foreground hover:text-[#4290A3] transition-colors"
                      >
                        Categorias
                      </Link>
                      <Link
                        href="/catalogos/calificaciones"
                        onClick={() => setIsOpen(false)}
                        className="pl-4 text-base font-medium text-muted-foreground hover:text-[#4290A3] transition-colors"
                      >
                        Calificaciones
                      </Link>
                    </div>
                  </div>
                )}
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
