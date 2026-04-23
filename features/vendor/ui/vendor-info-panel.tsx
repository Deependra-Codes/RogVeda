type VendorInfoPanelProps = Readonly<{
  title: string;
  body: string;
  tone?: "info" | "success" | "error";
}>;

export function VendorInfoPanel({ title, body, tone = "info" }: VendorInfoPanelProps) {
  const toneClasses = {
    info: "border-border bg-paper",
    success: "border-success/20 bg-success/[0.06]",
    error: "border-danger/20 bg-danger/[0.06]",
  };

  const titleClasses = {
    info: "text-ink",
    success: "text-success",
    error: "text-danger",
  };

  return (
    <section className={`rounded-[22px] border p-4 sm:p-5 shadow-sm ${toneClasses[tone]}`}>
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
            tone === "success" ? "bg-success" : tone === "error" ? "bg-danger" : "bg-ink/30"
          }`}
        />
        <div>
          <p className={`text-sm font-semibold ${titleClasses[tone]}`}>{title}</p>
          <p className="mt-1 type-body-s text-ink/60">{body}</p>
        </div>
      </div>
    </section>
  );
}
