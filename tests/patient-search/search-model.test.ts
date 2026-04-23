import { describe, expect, it } from "vitest";

import {
  type RawHospitalRow,
  mapHospitalRowsToSearchResults,
} from "../../features/patient-search/server/search-model";
import { convertUsdCents, formatConversionHint } from "../../lib/currency";

describe("patient search mapping", () => {
  it("picks the lowest default selection and preserves room ordering", () => {
    const rows: RawHospitalRow[] = [
      {
        id: "apollo",
        name: "Apollo Spectra",
        city: "Delhi",
        region_label: "South Delhi",
        procedure_name: "Total Knee Replacement",
        summary: "Dedicated international patient coordinator before arrival",
        image_token: "apollo-spectra",
        trust_signal_one: "Transparent estimate",
        trust_signal_two: "Visa support",
        trust_signal_three: "Human coordinator",
        doctors: [
          {
            id: "doctor-a",
            name: "Dr. Ramesh Kumar",
            years_experience: 16,
            pricing: [
              { room_type: "Private", amount_usd_cents: 450000 },
              { room_type: "General Ward", amount_usd_cents: 320000 },
            ],
          },
          {
            id: "doctor-b",
            name: "Dr. Priya Sharma",
            years_experience: 12,
            pricing: [
              { room_type: "Private", amount_usd_cents: 420000 },
              { room_type: "General Ward", amount_usd_cents: 300000 },
              { room_type: "Semi-Private", amount_usd_cents: 360000 },
            ],
          },
        ],
      },
    ];

    const [result] = mapHospitalRowsToSearchResults(rows);

    expect(result.defaultDoctorId).toBe("doctor-b");
    expect(result.defaultRoomType).toBe("General Ward");
    expect(result.lowestPriceUsdCents).toBe(300000);
    expect(result.roomTypes).toEqual(["General Ward", "Semi-Private", "Private"]);
    expect(result.doctors.map((doctor) => doctor.name)).toEqual([
      "Dr. Ramesh Kumar",
      "Dr. Priya Sharma",
    ]);
  });

  it("keeps conversion utilities aligned with the PRD rates", () => {
    expect(convertUsdCents(320000, "USD")).toBe(3200);
    expect(convertUsdCents(320000, "INR")).toBe(265600);
    expect(convertUsdCents(320000, "NGN")).toBe(4960000);
    expect(formatConversionHint()).toBe("1 USD = 83 INR = 1,550 NGN");
  });
});
