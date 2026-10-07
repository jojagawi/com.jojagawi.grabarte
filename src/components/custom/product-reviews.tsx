import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/components/custom/testimonials";
import type { ProductRateItem } from "@/lib/rates-athena.server";

interface ProductReviewsProps {
  designId: number;
  productName: string;
  reviews: ProductRateItem[];
}

function formatReviewDate(isoValue: string): string | null {
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" }).format(date);
}

function StarRow({ rating, className }: { rating: number; className: string }) {
  return (
    <div className="flex gap-1">
      <span className="sr-only">Calificación: {rating} de 5</span>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={index < Math.round(rating) ? `${className} fill-inspirarte-green text-inspirarte-green` : `${className} text-border`}
        />
      ))}
    </div>
  );
}

export function getAverageRating(reviews: ProductRateItem[]): number {
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

// Opiniones aprobadas en /catalogos/calificaciones que llegaron con ?id= de este diseño.
export function ProductReviews({ designId, productName, reviews }: ProductReviewsProps) {
  const rateHref = `/agregar-calificacion?id=${designId}`;

  if (reviews.length === 0) {
    return (
      <section aria-labelledby="opiniones" className="rounded-2xl border border-border bg-white p-8 text-center">
        <h2 id="opiniones" className="font-serif text-2xl font-bold text-foreground">
          ¿Ya tienes este producto?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Cuéntanos qué te pareció. Tu opinión ayuda a otros clientes a decidir.
        </p>
        <Button asChild variant="outline" className="mt-6 h-11 border-primary text-primary hover:bg-primary/10">
          <Link href={rateHref}>Calificar este producto</Link>
        </Button>
      </section>
    );
  }

  const averageRating = getAverageRating(reviews);

  return (
    <section aria-labelledby="opiniones">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Opiniones
          </span>
          <h2 id="opiniones" className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Lo que opinan de {productName}
          </h2>
          <div className="mt-4 flex items-center gap-3">
            <StarRow rating={averageRating} className="size-5" />
            <p className="text-sm text-muted-foreground">
              {averageRating.toLocaleString("es-MX")} de 5 · {reviews.length}{" "}
              {reviews.length === 1 ? "opinión" : "opiniones"}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="h-11 shrink-0 border-primary text-primary hover:bg-primary/10">
          <Link href={rateHref}>Calificar este producto</Link>
        </Button>
      </div>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => {
          const reviewDate = formatReviewDate(review.createdAt);
          return (
            <li key={review.id} className="rounded-2xl border border-border bg-white p-6">
              <StarRow rating={review.rating} className="size-4" />
              <p className="mt-4 mb-6 leading-relaxed text-foreground">&ldquo;{review.description}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                >
                  {getInitials(review.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{review.name}</p>
                  {reviewDate && <p className="text-xs text-muted-foreground">{reviewDate}</p>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
