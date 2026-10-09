import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { type ContactRequestItem, getLatestContactsFromAthena } from "@/lib/contacts-athena.server";

export const metadata: Metadata = buildPageMetadata({
  title: "Contactos recibidos | InspiraArte",
  description: "Panel interno para consultar las solicitudes de cotizacion enviadas desde /contacto.",
  path: "/catalogos/contactos",
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

// "2026-12-12" → "12 dic 2026" sin desfase de zona horaria.
function formatNeededBy(isoDate: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-MX", { dateStyle: "medium" });
}

function attachmentHref(contact: ContactRequestItem, key: string) {
  const fileName = key.split("/").pop() ?? "";
  return { fileName, href: `/api/contacts/${contact.id}/files/${encodeURIComponent(fileName)}` };
}

function orderSummary(contact: ContactRequestItem) {
  return [
    ["Producto", contact.requestedProduct],
    ["Material", contact.productType],
    ["Ocasión", contact.occasion],
    ["Cantidad", contact.quantity],
    ["Para el", contact.neededBy ? formatNeededBy(contact.neededBy) : ""],
  ].filter(([, value]) => value);
}

export default async function CatalogContactsPage() {
  const canEditDesigns = process.env.NEXT_PUBLIC_ACL_ADD_DESIGNS === "true";
  if (!canEditDesigns || process.env.NODE_ENV !== "development") {
    notFound();
  }

  let rows: ContactRequestItem[] = [];
  let errorMessage = "";

  try {
    rows = await getLatestContactsFromAthena(150);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "No fue posible consultar Athena.";
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">Contactos recibidos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Solicitudes de cotización de /contacto, consultadas con Athena sobre los JSON guardados en S3.
          {rows.length > 0 && ` Mostrando las ${rows.length} más recientes.`}
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
                <th className="px-4 py-3 text-left font-semibold text-foreground">Contacto</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Pedido</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Detalles</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Archivos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={5}>
                    No se encontraron solicitudes.
                  </td>
                </tr>
              ) : (
                rows.map((contact) => (
                  <tr key={contact.id || `${contact.email}-${contact.createdAt}`} className="align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatDate(contact.createdAt)}
                      {contact.urgent && (
                        // La fecha pedida no alcanza el tiempo estándar del diseño.
                        <span className="mt-1 block w-fit rounded bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">
                          Urgente
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{contact.name || "-"}</p>
                      {contact.email && (
                        <a href={`mailto:${contact.email}`} className="block text-primary underline-offset-4 hover:underline">
                          {contact.email}
                        </a>
                      )}
                      {contact.phone && <p className="text-muted-foreground">{contact.phone}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {orderSummary(contact).length > 0 ? (
                        <dl className="space-y-0.5">
                          {orderSummary(contact).map(([label, value]) => (
                            <div key={label} className="flex gap-1.5">
                              <dt className="text-muted-foreground">{label}:</dt>
                              <dd className="text-foreground">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="min-w-64 max-w-xl whitespace-pre-line px-4 py-3 text-foreground">
                      {contact.details || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {contact.attachments.length > 0 ? (
                        <ul className="space-y-1">
                          {contact.attachments.map((key) => {
                            const { fileName, href } = attachmentHref(contact, key);
                            return (
                              <li key={key}>
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary underline-offset-4 hover:underline"
                                >
                                  {fileName}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
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
