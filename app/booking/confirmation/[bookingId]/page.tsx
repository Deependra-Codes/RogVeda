import { BookingConfirmationPage } from "@/features/booking/public";
import type { RouteSearchParams } from "@/lib/route-search";

export const dynamic = "force-dynamic";

type BookingConfirmationRouteProps = Readonly<{
  params: Promise<{
    bookingId: string;
  }>;
  searchParams: Promise<RouteSearchParams>;
}>;

export default async function BookingConfirmationRoute({
  params,
  searchParams,
}: BookingConfirmationRouteProps) {
  const [{ bookingId }, resolvedSearchParams] = await Promise.all([params, searchParams]);

  return <BookingConfirmationPage bookingId={bookingId} searchParams={resolvedSearchParams} />;
}
