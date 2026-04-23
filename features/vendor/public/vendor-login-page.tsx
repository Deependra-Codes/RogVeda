import type { RouteSearchParams } from "@/lib/route-search";

import { vendorLoginAction } from "../server/vendor-login-action";
import { getVendorLoginErrorMessage, readVendorLoginError } from "../types/contracts";
import { VendorLoginContent, VendorLoginVisualPanel } from "../ui/vendor-login-sections";

type VendorLoginPageProps = Readonly<{
  searchParams: RouteSearchParams;
}>;

export function VendorLoginPage({ searchParams }: VendorLoginPageProps) {
  const errorCode = readVendorLoginError(searchParams.error);
  const errorMessage = errorCode ? getVendorLoginErrorMessage(errorCode) : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.06),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(180,83,9,0.06),transparent_22%),var(--bg)] px-4 py-8 font-sans sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-[1200px] overflow-hidden rounded-[32px] border border-border bg-paper shadow-elevated lg:grid lg:grid-cols-12">
        <VendorLoginVisualPanel />
        <VendorLoginContent errorMessage={errorMessage} loginAction={vendorLoginAction} />
      </div>
    </main>
  );
}
