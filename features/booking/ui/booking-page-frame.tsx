export function BookingPageFrame({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,109,104,0.06),transparent_28%),radial-gradient(circle_at_top_right,rgba(162,103,34,0.06),transparent_24%),linear-gradient(180deg,rgba(255,250,242,0.7),rgba(244,238,227,0.96))] px-4 py-8 font-sans sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 sm:gap-8">{children}</div>
    </main>
  );
}
