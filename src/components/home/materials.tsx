import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby";
import { Layers, Square, Hexagon, Coffee } from 'lucide-react'
import { MyQueryMaterialsQuery } from "../../__generated__/types";

const iconMap: Record<string, React.ElementType> = {
  Layers: Layers,
  Square: Square,
  Hexagon: Hexagon,
  Coffee: Coffee,
};

const Materials = () => {


  const queryData: MyQueryMaterialsQuery = useStaticQuery(graphql`
    query MyQueryMaterials {
      allSqliteCatMaterials {
        nodes {
          id
          name
          slug
          description
          icon
        }
      }
    }
  `);
  const MATERIALS = queryData.allSqliteCatMaterials.nodes;


  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
              / Materiales
            </span>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Para cada superficie
            </h2>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {MATERIALS.map((m) => {
            const Icon = m.icon ? iconMap[m.icon] : Layers;
            return (
              <Link
                key={m.id}
                to={m.slug ? m.slug : "/"}
                className="group relative bg-background p-6 transition-colors hover:bg-card"
              >
                <Icon className="size-7 text-cyan transition-transform group-hover:scale-110" />
                <h3 className="mt-5 font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
                  {m.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {m.description}
                </p>
                <span className="mt-4 inline-block font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-cyan">
                  Ver diseños →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Materials;
