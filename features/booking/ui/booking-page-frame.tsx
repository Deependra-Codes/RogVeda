export function BookingPageFrame({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.06),transparent_28%),radial-gradient(circle_at_top_right,rgba(180,83,9,0.06),transparent_24%),var(--bg)] px-4 py-8 font-sans sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 sm:gap-8">{children}</div>
    </main>
  );
}
