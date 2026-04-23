import { VendorLoginPage } from "@/features/vendor/public";
import type { RouteSearchParams } from "@/lib/route-search";

type VendorLoginRouteProps = Readonly<{
  searchParams: Promise<RouteSearchParams>;
}>;

export default async function VendorLoginRoute({ searchParams }: VendorLoginRouteProps) {
  return <VendorLoginPage searchParams={await searchParams} />;
}
