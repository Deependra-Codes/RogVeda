import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import { type CurrencyCode, formatMoneyFromUsdCents } from "@/lib/currency";
import type { RoomType } from "@/supabase/types";

import type { SearchHospitalResult } from "../types/search";

type HospitalSelectionControlsProps = Readonly<{
  doctors: SearchHospitalResult["doctors"];
  availableRoomTypes: RoomType[];
  selectedDoctorId: string;
  selectedRoomType: RoomType;
  onDoctorChange: (doctorId: string) => void;
  onRoomChange: (roomType: RoomType) => void;
}>;

type HospitalPricePanelProps = Readonly<{
  bookingHref: string;
  currency: CurrencyCode;
  selectedPriceUsdCents: number;
  selectedDoctorName?: string;
  selectedRoomType: RoomType;
  shouldReduceMotion: boolean;
}>;

export function HospitalSelectionControls({
  doctors,
  availableRoomTypes,
  selectedDoctorId,
  selectedRoomType,
  onDoctorChange,
  onRoomChange,
}: HospitalSelectionControlsProps) {
  return (
    <div className="flex flex-col justify-center gap-5 border-t border-border bg-[rgba(228,236,232,0.45)] p-5 lg:col-span-3 lg:border-r lg:border-t-0 lg:p-6">
      <div className="space-y-2">
        <p className="type-label text-ink/45">Refine Selection</p>
        <p className="type-body-s text-ink/60">
          Compare the surgeon and room pathway that fits the patient profile best.
        </p>
      </div>

      <label className="space-y-2">
        <span className="type-label pl-0.5 text-ink/50">Surgeon</span>
        <select
          className="select-field"
          value={selectedDoctorId}
          onChange={(event) => onDoctorChange(event.target.value)}
        >
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} ({doctor.yearsExperience} yrs)
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="type-label pl-0.5 text-ink/50">Room</span>
        <select
          className="select-field"
          value={selectedRoomType}
          onChange={(event) => onRoomChange(event.target.value as RoomType)}
        >
          {availableRoomTypes.map((roomType) => (
            <option key={roomType} value={roomType}>
              {roomType}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function HospitalPricePanel({
  bookingHref,
  currency,
  selectedPriceUsdCents,
  selectedDoctorName,
  selectedRoomType,
  shouldReduceMotion,
}: HospitalPricePanelProps) {
  return (
    <div className="flex flex-col gap-5 border-t border-border bg-[linear-gradient(180deg,rgba(255,250,242,0.96),rgba(241,228,209,0.38))] p-5 lg:col-span-2 lg:justify-center lg:border-t-0 lg:p-6">
      <HospitalPriceSummary
        currency={currency}
        selectedPriceUsdCents={selectedPriceUsdCents}
        selectedDoctorName={selectedDoctorName}
        selectedRoomType={selectedRoomType}
        shouldReduceMotion={shouldReduceMotion}
      />

      <motion.div
        className="w-full"
        whileHover={shouldReduceMotion ? undefined : { y: -2 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      >
        <Link
          href={bookingHref}
          className="btn-primary flex min-h-12 w-full items-center justify-center gap-2 whitespace-nowrap text-center text-[15px]"
        >
          Book Now
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            className="opacity-75"
          >
            <path
              d="M5 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </motion.div>
      <HospitalPriceFootnote />
    </div>
  );
}

function HospitalPriceSummary({
  currency,
  selectedPriceUsdCents,
  selectedDoctorName,
  selectedRoomType,
  shouldReduceMotion,
}: Omit<HospitalPricePanelProps, "bookingHref">) {
  return (
    <div data-testid="hospital-price-panel">
      <p className="type-label mb-1.5 text-brass/75">Live Estimate</p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.h3
          key={`${selectedPriceUsdCents}-${currency}`}
          className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.18, ease: "easeOut" }}
        >
          {formatMoneyFromUsdCents(selectedPriceUsdCents, currency)}
        </motion.h3>
      </AnimatePresence>
      <p className="mt-2 type-body-s text-ink/60">
        {selectedDoctorName ? `${selectedDoctorName} / ${selectedRoomType}` : selectedRoomType}
      </p>
      <p className="mt-3 type-body-s text-ink/58">
        Transparent package estimate with no hidden coordination fee in the trial flow.
      </p>
    </div>
  );
}

function HospitalPriceFootnote() {
  return (
    <div className="border-t border-border pt-4">
      <p className="type-body-s text-ink/55">
        Continue to a booking review page that rechecks the final quote before saving.
      </p>
    </div>
  );
}
