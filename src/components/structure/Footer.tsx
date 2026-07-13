import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import { MyQueryFooterQuery } from "../../__generated__/types";

const Footer = () => {

  const queryData: MyQueryFooterQuery = useStaticQuery(graphql`
    query MyQueryFooter {
      allSqliteCatMaterials {
        nodes {
          id
          name
          slug
        }
      }
    }
  `);
  const materials = queryData.allSqliteCatMaterials.nodes

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center border border-primary/60 font-mono text-sm font-bold text-primary">
                GB
              </span>
              <span className="font-mono text-sm font-semibold tracking-[0.2em] text-foreground">
                Grab <span className="text-cyan">Arte</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Biblioteca de modelos para corte láser en MDF, cuero, metal y
              termos tipo Yeti. Archivos listos para tu máquina.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-cyan">
                Navegar
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link to="/catalogo" className="text-muted-foreground hover:text-foreground">
                    Catálogo
                  </Link>
                </li>

                {process.env.GATSBY_ENV === "development" &&
                  <li>
                  <Link to="/subir" className="text-muted-foreground hover:text-foreground">
                    Subir diseño
                  </Link>
                </li>
                }
                <li>
                  <Link to="/faq" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-cyan">
                Materiales
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {materials.map((material) => (
                  <li key={material.id}>
                    <Link to={"/material/" + material.slug}>
                      {material.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 sm:flex-row">
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} GrabArte.mx — Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
