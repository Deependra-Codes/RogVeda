export default function RootLoading() {
  return (
    <main className="min-h-screen bg-bg pb-12">
      <section className="h-[72svh] min-h-[520px] animate-pulse bg-[linear-gradient(140deg,rgba(30,27,22,0.5),rgba(30,27,22,0.24))]" />
      <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <section className="h-24 animate-pulse rounded-panel border border-border bg-paper/80" />
        <section className="h-56 animate-pulse rounded-panel border border-border bg-paper/80" />
        <section className="h-56 animate-pulse rounded-panel border border-border bg-paper/80" />
        <section className="h-56 animate-pulse rounded-panel border border-border bg-paper/80" />
      </div>
    </main>
  );
}
