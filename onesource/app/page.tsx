import Link from "next/link";

const learningPoints = [
  {
    title: "Why creatives earn attention",
    body: "Study the emotional triggers, visual choices, and hooks that repeatedly pull people into ecommerce creatives.",
  },
  {
    title: "Which patterns repeat",
    body: "See when signals appear often enough to become useful structures instead of isolated observations.",
  },
  {
    title: "How signals work together",
    body: "Trace how emotions, hooks, CTAs, niches, and platforms reinforce each other across a dataset.",
  },
];

const signals = ["Emotions", "Hooks", "CTAs", "Platforms", "Niches"];
const currentSystem = ["Signals", "Patterns", "Governance", "Verification"];

export default function Home() {
  return (
    <main
      className="min-h-screen bg-[#1d1d1d] text-[#f2eadf]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(242,234,223,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(242,234,223,0.055) 1px, transparent 1px), linear-gradient(rgba(242,234,223,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(242,234,223,0.025) 1px, transparent 1px)",
        backgroundSize: "48px 48px, 48px 48px, 12px 12px, 12px 12px",
      }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-7 sm:px-8">
        <header className="flex items-start justify-between border-b border-[#f2eadf]/70 pb-4">
          <Link
            href="/"
            className="relative border border-[#f2eadf]/80 px-7 py-3 text-lg tracking-wide text-[#f2eadf]"
          >
            <span className="absolute -left-1.5 -top-1.5 h-3 w-3 border-l border-t border-[#f2eadf]/80" />
            <span className="absolute -right-1.5 -top-1.5 h-3 w-3 border-r border-t border-[#f2eadf]/80" />
            <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 border-b border-l border-[#f2eadf]/80" />
            <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 border-b border-r border-[#f2eadf]/80" />
            OneSource
          </Link>

          <nav className="flex border border-[#f2eadf]/55 text-xs uppercase tracking-[0.18em] text-[#f2eadf] sm:text-sm">
            <Link
              href="/gallery"
              className="px-5 py-3 transition hover:bg-[#f2eadf] hover:text-[#1d1d1d]"
            >
              Gallery
            </Link>
            <Link
              href="/admin"
              className="border-l border-[#f2eadf]/55 px-5 py-3 transition hover:bg-[#f2eadf] hover:text-[#1d1d1d]"
            >
              Admin
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 gap-10 border-b border-[#f2eadf]/55 py-10 lg:grid-cols-[1fr_1.02fr_0.92fr] lg:items-center">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.28em] text-[#d8d0c2]">
              Creative Genome / Attention Intelligence
            </p>

            <h1 className="relative w-fit text-6xl font-semibold leading-none tracking-tight text-[#f2eadf] sm:text-7xl">
              OneSource
              <span className="absolute -left-2 top-0 h-5 w-5 border-l border-t border-[#f2eadf]/70" />
              <span className="absolute -right-3 bottom-1 h-5 w-5 border-b border-r border-[#f2eadf]/70" />
            </h1>

            <p className="mt-7 max-w-xl text-2xl leading-snug text-[#f2eadf]">
              Structured intelligence for internet attention patterns.
            </p>

            <p className="mt-6 max-w-lg text-base leading-8 text-[#b8b2a8]">
              OneSource studies ecommerce creatives by turning hooks, emotions,
              visual language, CTAs, platforms, and niches into reusable
              attention signals. The goal is to understand why creative
              patterns work, not to generate more noise.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/gallery"
                className="border border-[#f2eadf] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#f2eadf] transition hover:bg-[#f2eadf] hover:text-[#1d1d1d]"
              >
                Open Intelligence
              </Link>
              <Link
                href="/admin"
                className="border border-[#f2eadf]/60 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#d8d0c2] transition hover:border-[#f2eadf] hover:text-[#f2eadf]"
              >
                Add Creative
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[420px] border border-[#f2eadf]/25">
            <div className="absolute inset-8 rounded-full border border-[#f2eadf]/80" />
            <div className="absolute inset-12 rounded-full border border-[#f2eadf]/45" />
            <div className="absolute left-1/2 top-0 h-full border-l border-dashed border-[#f2eadf]/30" />
            <div className="absolute left-0 top-1/2 w-full border-t border-dashed border-[#f2eadf]/30" />
            <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f2eadf]/75 bg-[#1d1d1d] text-center">
              <div className="flex h-full items-center justify-center text-sm font-semibold">
                OneSource
              </div>
            </div>

            {signals.map((signal, index) => {
              const positions = [
                "left-1/2 top-8 -translate-x-1/2",
                "right-8 top-1/2 -translate-y-1/2",
                "bottom-10 right-[22%]",
                "bottom-10 left-[22%]",
                "left-8 top-1/2 -translate-y-1/2",
              ];

              return (
                <div
                  key={signal}
                  className={`absolute ${positions[index]} flex h-20 w-20 items-center justify-center rounded-full border border-[#f2eadf]/80 bg-[#1d1d1d] px-2 text-center text-[11px] uppercase tracking-wide text-[#f2eadf]`}
                >
                  {signal}
                </div>
              );
            })}
          </div>

          <aside className="border border-[#f2eadf]/70 p-6">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-[#f2eadf]">
              What it helps you understand
            </p>
            <div className="divide-y divide-[#f2eadf]/35">
              {learningPoints.map((point) => (
                <div
                  key={point.title}
                  className="grid gap-4 py-5 sm:grid-cols-[88px_1fr]"
                >
                  <div className="flex h-16 w-16 items-center justify-center border border-[#f2eadf]/65 text-xl">
                    {point.title.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#f2eadf]">
                      {point.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#b8b2a8]">
                      {point.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-8 py-7 lg:grid-cols-[0.55fr_1fr] lg:items-center">
          <p className="text-xs uppercase tracking-[0.22em] text-[#f2eadf]">
            Current system
          </p>
          <div className="grid gap-3 sm:grid-cols-4">
            {currentSystem.map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex min-h-16 flex-1 items-center justify-center border border-[#f2eadf]/65 px-3 text-center text-xs uppercase tracking-[0.12em] text-[#f2eadf]">
                  {item}
                </div>
                {index < currentSystem.length - 1 && (
                  <span className="hidden text-[#f2eadf]/70 sm:block">→</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
