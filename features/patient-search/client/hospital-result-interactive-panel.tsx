"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import type { RoomType } from "@/supabase/types";

import type { SearchDoctor, SearchHospitalResult } from "../types/search";
import {
  HospitalFactsPanel,
  HospitalMediaPanel,
  HospitalPricePanel,
  HospitalSelectionControls,
} from "../ui/hospital-result-card-sections";
import { usePatientSearchCurrency } from "./patient-search-experience";

type HospitalResultInteractivePanelProps = Readonly<{
  hospital: SearchHospitalResult;
}>;

export function HospitalResultInteractivePanel({ hospital }: HospitalResultInteractivePanelProps) {
  const { currency } = usePatientSearchCurrency();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [selectedDoctorId, setSelectedDoctorId] = useState(hospital.defaultDoctorId);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>(hospital.defaultRoomType);

  const availableRoomTypes = roomTypesForDoctor(hospital, selectedDoctorId);
  const resolvedRoomType = availableRoomTypes.includes(selectedRoomType)
    ? selectedRoomType
    : availableRoomTypes[0];
  const selectedPriceUsdCents = priceForSelection(hospital, selectedDoctorId, resolvedRoomType);
  const selectedDoctor = hospital.doctors.find((doctor) => doctor.id === selectedDoctorId);
  const bookingHref = buildBookingHref(hospital, selectedDoctor, resolvedRoomType, currency);

  return (
    <motion.article
      className="overflow-hidden rounded-panel border border-border bg-paper shadow-elevated lg:grid lg:grid-cols-12"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.5, ease: "easeOut" }}
    >
      <HospitalMediaPanel hospital={hospital} />
      <HospitalFactsPanel hospital={hospital} selectedDoctor={selectedDoctor} />
      <HospitalSelectionControls
        doctors={hospital.doctors}
        availableRoomTypes={availableRoomTypes}
        selectedDoctorId={selectedDoctorId}
        selectedRoomType={resolvedRoomType}
        onDoctorChange={(doctorId) => {
          const nextRoomTypes = roomTypesForDoctor(hospital, doctorId);
          setSelectedDoctorId(doctorId);
          setSelectedRoomType(
            nextRoomTypes.includes(resolvedRoomType)
              ? resolvedRoomType
              : (nextRoomTypes[0] ?? hospital.defaultRoomType),
          );
        }}
        onRoomChange={setSelectedRoomType}
      />
      <HospitalPricePanel
        bookingHref={bookingHref}
        currency={currency}
        selectedPriceUsdCents={selectedPriceUsdCents}
        selectedDoctorName={selectedDoctor?.name}
        selectedRoomType={resolvedRoomType}
        shouldReduceMotion={shouldReduceMotion}
      />
    </motion.article>
  );
}

function buildBookingHref(
  hospital: SearchHospitalResult,
  selectedDoctor: SearchDoctor | undefined,
  selectedRoomType: RoomType,
  currency: string,
) {
  const params = new URLSearchParams({
    hospitalId: hospital.id,
    doctorId: selectedDoctor?.id ?? "",
    roomType: selectedRoomType,
    currency,
  });

  return `/booking?${params.toString()}`;
}

function roomTypesForDoctor(hospital: SearchHospitalResult, doctorId: string) {
  return hospital.roomTypes.filter((roomType) =>
    hospital.pricing.some((option) => option.doctorId === doctorId && option.roomType === roomType),
  );
}

function priceForSelection(
  hospital: SearchHospitalResult,
  doctorId: string,
  roomType: RoomType | undefined,
) {
  return (
    hospital.pricing.find((option) => option.doctorId === doctorId && option.roomType === roomType)
      ?.amountUsdCents ?? hospital.lowestPriceUsdCents
  );
}
