import { BookingReviewPage } from "@/features/booking/public";
import type { RouteSearchParams } from "@/lib/route-search";

export const dynamic = "force-dynamic";

type BookingPageProps = Readonly<{
  searchParams: Promise<RouteSearchParams>;
}>;

export default async function BookingPage({ searchParams }: BookingPageProps) {
  return <BookingReviewPage searchParams={await searchParams} />;
}
