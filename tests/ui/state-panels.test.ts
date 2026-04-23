import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  EmptySearchState,
  SearchErrorState,
} from "../../features/patient-search/ui/search-state-panels";
import { VendorEmptyStatePanel } from "../../features/vendor/ui/vendor-state-panels";

describe("route state panels", () => {
  it("renders the patient search empty and error guidance with recovery actions", () => {
    const emptyMarkup = renderToStaticMarkup(createElement(EmptySearchState));
    const errorMarkup = renderToStaticMarkup(
      createElement(SearchErrorState, { message: "Supabase is temporarily unavailable." }),
    );

    expect(emptyMarkup).toContain("No Matches Yet");
    expect(emptyMarkup).toContain("Back To Search");
    expect(emptyMarkup).toContain('href="/"');
    expect(errorMarkup).toContain("Temporary Issue");
    expect(errorMarkup).toContain("Retry Search");
    expect(errorMarkup).toContain("Supabase is temporarily unavailable.");
  });

  it("renders the vendor dashboard empty guidance without mutating demo data", () => {
    const markup = renderToStaticMarkup(createElement(VendorEmptyStatePanel));

    expect(markup).toContain("No bookings yet");
    expect(markup).toContain(
      "Bookings will appear here after a patient confirms from the booking review route.",
    );
  });
});
