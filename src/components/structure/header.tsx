"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Productos", href: "/productos" },
  { name: "Proceso", href: "/proceso" },
  { name: "FAQ", href: "/faq" },
  { name: "Contacto", href: "/contacto" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-[#4290A3] flex items-center justify-center group-hover:bg-[#1FA4A7] transition-colors">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-foreground">
              Inspir<span className="text-[#1FA4A7]">Arte</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
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
              <Link href="/contacto">
                ¡Cotiza ahora!
              </Link>
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
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                {navigation.map((item) => (
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
  )
}
