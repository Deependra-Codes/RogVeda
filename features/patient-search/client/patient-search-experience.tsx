"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode, createContext, useContext, useState } from "react";

import { type CurrencyCode, currencyOptions, formatConversionHint } from "@/lib/currency";

type PatientSearchExperienceProps = Readonly<{
  children: ReactNode;
  hospitalCount: number;
}>;

type PatientSearchCurrencyContextValue = Readonly<{
  currency: CurrencyCode;
}>;

const patientSearchCurrencyContext = createContext<PatientSearchCurrencyContextValue | null>(null);

export function PatientSearchExperience({ children, hospitalCount }: PatientSearchExperienceProps) {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  return (
    <patientSearchCurrencyContext.Provider value={{ currency }}>
      <section className="space-y-8">
        <PatientSearchToolbar
          currency={currency}
          hospitalCount={hospitalCount}
          onCurrencyChange={setCurrency}
        />
        {children}
      </section>
    </patientSearchCurrencyContext.Provider>
  );
}

function PatientSearchToolbar({
  currency,
  hospitalCount,
  onCurrencyChange,
}: Readonly<{
  currency: CurrencyCode;
  hospitalCount: number;
  onCurrencyChange: (currency: CurrencyCode) => void;
}>) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="panel-soft sticky top-3 z-20 flex flex-col gap-5 bg-[rgba(255,250,242,0.92)] px-5 py-4 sm:static sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:justify-between"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-[620px]">
        <div className="flex flex-wrap items-center gap-3">
          <p className="type-label text-accent/72">Live Comparison</p>
          <span className="status-chip">Guest Browsing</span>
        </div>
        <h2 className="mt-3 type-heading-l text-ink">
          {hospitalCount} hospitals ready to compare side by side
        </h2>
        <p className="mt-2 type-body-s text-ink/62">
          Lowest valid doctor and room combinations are loaded first. Currency browsing uses the
          static trial conversion: {formatConversionHint()}.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="type-label text-ink/45">Display Currency</p>
        <div className="inline-flex w-fit rounded-pill border border-border bg-paper/80 p-1 shadow-inner backdrop-blur-sm">
          {currencyOptions.map((option) => (
            <motion.button
              key={option}
              type="button"
              layout
              aria-pressed={currency === option}
              whileHover={shouldReduceMotion ? undefined : { y: -1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              transition={shouldReduceMotion ? undefined : { duration: 0.18, ease: "easeOut" }}
              className={`min-h-10 min-w-[56px] rounded-pill px-5 text-sm font-bold transition-all duration-200 ${
                currency === option
                  ? "bg-accent text-white shadow-cta"
                  : "text-ink/55 hover:bg-ink/[0.04] hover:text-ink/80"
              }`}
              onClick={() => onCurrencyChange(option)}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function usePatientSearchCurrency() {
  const value = useContext(patientSearchCurrencyContext);
  if (!value) {
    throw new Error("usePatientSearchCurrency must be used within PatientSearchExperience");
  }

  return value;
}
