// Fecha visible de última actualización: la misma que el <lastmod> del sitemap
// (scripts/build-sitemap-lastmod.ts), para que buscadores y visitantes vean una sola fecha.

const updatedDateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Mexico_City",
});

export function formatUpdatedDate(date: Date): string {
  return updatedDateFormatter.format(date);
}

// La fecha más reciente de la lista; null si no hay ninguna válida.
export function latestDate(dates: Array<Date | null | undefined>): Date | null {
  return dates.reduce<Date | null>(
    (max, date) => (date && !Number.isNaN(date.getTime()) && (!max || date > max) ? date : max),
    null,
  );
}

interface UpdatedDateProps {
  date: Date | null;
  className?: string;
}

export function UpdatedDate({ date, className }: UpdatedDateProps) {
  if (!date) {
    return null;
  }

  return (
    <p className={className ?? "text-sm text-muted-foreground"}>
      Actualizado el <time dateTime={date.toISOString()}>{formatUpdatedDate(date)}</time>
    </p>
  );
}
