type BookingDetailBlockProps = Readonly<{
  label: string;
  value: string;
  emphasis?: boolean;
  mono?: boolean;
}>;

export function BookingDetailBlock({ label, value, emphasis, mono }: BookingDetailBlockProps) {
  return (
    <div className="flex flex-col gap-1.5 py-1">
      <p className="type-label text-ink/50">{label}</p>
      <p
        className={`text-[15px] leading-[1.6] break-words ${
          emphasis
            ? "font-bold text-ink tabular-nums"
            : mono
              ? "font-medium text-ink/85 font-mono text-[13px] tracking-wide"
              : "font-medium text-ink/85"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
