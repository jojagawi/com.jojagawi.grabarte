import React, {useState} from "react";
import { Link } from "gatsby"
import { cn } from '@/lib/utils'
import {Menu, X} from "lucide-react";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/faq", label: "FAQ" },
  ...(process.env.GATSBY_ENV === "development"
    ? [{ href: "/subir", label: "Subir diseño" }]
    : []),
];

const Header = () => {
  const pathname = "/"; //TODO Update value with useLocation() custom function
  const [open, setOpen] = useState(false)
  const handleToggle = () => setOpen((v) => !v);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center border border-primary/60 font-mono text-sm font-bold text-primary glow-cyan">
            CL
          </span>
          <span className="font-mono text-sm font-semibold tracking-[0.2em] text-foreground">
            CORTE<span className="text-cyan">.LAB</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'relative px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors',
                  active
                    ? 'text-cyan'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={handleToggle}
          className="text-foreground md:hidden"
          aria-label="Abrir menú"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-border bg-background px-4 py-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="px-2 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-cyan"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
