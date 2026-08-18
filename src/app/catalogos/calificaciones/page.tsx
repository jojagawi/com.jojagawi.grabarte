import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { getLatestRatesFromAthena } from "@/lib/rates-athena.server";
import { RateStatusSwitch } from "@/components/custom/rate-status-switch";


export const metadata: Metadata = buildPageMetadata({
  title: "Calificaciones del catalogo | InspiraArte",
  description: "Panel interno para consultar calificaciones enviadas por clientes.",
  path: "/catalogos/calificaciones",
  noIndex: true,
});

function formatDate(isoValue: string) {
  if (!isoValue) return "-";
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) return isoValue;
  return date.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function CatalogRatesPage() {
  const canEditDesigns = process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
  if (!canEditDesigns || process.env.NODE_ENV !== "development") {
    notFound();
  }

  let rows = [] as Awaited<ReturnType<typeof getLatestRatesFromAthena>>;
  let errorMessage = "";

  try {
    rows = await getLatestRatesFromAthena(150);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "No fue posible consultar Athena.";
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Calificaciones recibidas
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Consulta de datos desde Athena sobre los JSON guardados en S3.
        </p>
      </header>

      {errorMessage ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Fecha</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Nombre</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Producto</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Calificacion</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Descripcion</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Origen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={7}>
                    No se encontraron calificaciones.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr key={item.id || `${item.name}-${item.createdAt}`}>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3 text-foreground">{item.name || "-"}</td>
                    <td className="px-4 py-3 text-foreground">{item.product || "-"}</td>
                    <td className="px-4 py-3 text-foreground">{item.rating || 0}</td>
                    <td className="px-4 py-3 text-foreground">
                      <RateStatusSwitch
                        rateId={item.id}
                        initialStatus={item.status}
                        name={item.name}
                      />
                    </td>
                    <td className="max-w-xl truncate px-4 py-3 text-muted-foreground" title={item.description}>
                      {item.description || "-"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.source || "web"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

