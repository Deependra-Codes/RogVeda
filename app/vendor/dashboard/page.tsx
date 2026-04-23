import { VendorDashboardPage } from "@/features/vendor/public";
import type { RouteSearchParams } from "@/lib/route-search";

export const dynamic = "force-dynamic";

type VendorDashboardRouteProps = Readonly<{
  searchParams: Promise<RouteSearchParams>;
}>;

export default async function VendorDashboardRoute({ searchParams }: VendorDashboardRouteProps) {
  return <VendorDashboardPage searchParams={await searchParams} />;
}
