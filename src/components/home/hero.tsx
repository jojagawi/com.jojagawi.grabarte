import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby";
import { buttonVariants } from "../ui/button";
import { ArrowRight, Search } from 'lucide-react'
import { cn } from "../../lib/utils";
import { MyQueryHeroQuery } from "../../__generated__/types";

const Hero = () => {

  const queryData: MyQueryHeroQuery = useStaticQuery(graphql`
    query MyQueryHero {
      allSqliteCatMaterials {
        totalCount
        nodes {
          id
          name
          slug
        }
      }
      allSqliteDesigns {
        totalCount
      }
    }
  `);
  const MATERIALS_COUNT = queryData.allSqliteCatMaterials.totalCount;
  const MATERIALS = queryData.allSqliteCatMaterials.nodes;

  const DESIGNS = queryData.allSqliteDesigns.totalCount;

  return (
    <section className="relative overflow-hidden border-b border-border blueprint-grid">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-scan absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-cyan">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          Biblioteca de objetos personalizados
        </div>

        <h1 className="mt-6 max-w-4xl text-balance font-heading text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Objetos listos para{" "}
          <span className="text-cyan text-glow">personalizar y adquirir</span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Diseños profesionales para MDF, cuero, metal y termos tipo Yeti. Busca
          por nombre o categoría y cotiza el tuyo.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/catalogo"
            className={cn(
              buttonVariants({ size: "lg" }),
              "font-mono text-xs uppercase tracking-widest",
            )}
          >
            <Search className="size-4" />
            Explorar catálogo
          </Link>
          {process.env.GATSBY_ENV === "development" && (
            <Link
              to="/subir"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-border font-mono text-xs uppercase tracking-widest",
              )}
            >
              Subir diseño
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>

        <div className="mt-14 grid max-w-2xl grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
          {[
            { value: `${DESIGNS}+`, label: "Diseños" },
            { value: `${MATERIALS_COUNT}+`, label: "Materiales" },
            { value: "100%", label: "Listos para personalizar" },
            { value: "100%", label: "Listos para cotizar" },
          ].map((s) => (
            <div key={s.label} className="bg-background p-4">
              <div className="font-mono text-2xl font-bold text-foreground">
                {s.value}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden border-t border-border bg-card py-3">
        <div className="flex w-max animate-marquee">
          {MATERIALS.map((material) => (
            <span
              key={material.id}
              className="mx-6 font-mono text-xs uppercase tracking-widest text-muted-foreground"
            >
              <span className="text-cyan">{material.name}</span> /
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}


export default Hero;
