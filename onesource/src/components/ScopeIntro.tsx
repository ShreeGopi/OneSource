"use client";

import Link from "next/link";

type ScopeIntroProps = {
  eyebrow: string;
  title: string;
  body: string;
  detail?: string;
  primaryHref?: string;
  onPrimaryClick?: () => void;
  primaryLabel: string;
};

const activeContexts = [
  "Amazon",
  "Flipkart",
  "TikTok",
  "Meta ads",
  "Landing pages",
  "Ecommerce stores",
];

const futureContexts = [
  "Search ecosystems",
  "Creator platforms",
  "SaaS pages",
  "Media systems",
  "Information feeds",
  "App marketplaces",
];

export function ScopeIntro({
  eyebrow,
  title,
  body,
  detail,
  primaryHref,
  onPrimaryClick,
  primaryLabel,
}: ScopeIntroProps) {
  const primaryClassName =
    "rounded-md bg-[#22201c] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#fffaf1] transition hover:bg-[#3a352d]";

  return (
    <section
      className="min-h-[100dvh] bg-[#f5f1e8] px-5 py-5 text-[#22201c] sm:px-8"
      style={{
        backgroundImage:
          "linear-gradient(rgba(34,32,28,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,32,28,0.04) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="mx-auto grid min-h-[calc(100dvh-2.5rem)] max-w-6xl grid-rows-[auto_1fr]">
        <header className="flex items-center justify-between border-b border-[#22201c]/15 pb-4">
          <p className="rounded-md border border-[#22201c]/12 bg-[#fffaf1]/72 px-4 py-2 text-sm font-semibold shadow-sm shadow-[#22201c]/5">
            OneSource
          </p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#7c7265]">
            Current scope
          </p>
        </header>

        <div className="grid items-center gap-8 py-8 lg:grid-cols-[1fr_0.82fr]">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[#8f7652] sm:text-xs">
              {eyebrow}
            </p>
            <h1 className="max-w-[28ch] text-[clamp(2.25rem,3.1vw,2.5rem)] font-semibold leading-[1.02] tracking-tight">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#5f574f] sm:text-lg">
              {body}
            </p>
            {detail && (
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#6f675d]">
                {detail}
              </p>
            )}

            <div className="mt-7">
              {onPrimaryClick ? (
                <button
                  type="button"
                  onClick={onPrimaryClick}
                  className={primaryClassName}
                >
                  {primaryLabel}
                </button>
              ) : (
                <a href={primaryHref} className={primaryClassName}>
                  {primaryLabel}
                </a>
              )}
            </div>

            <Link
              href="/"
              className="mt-5 inline-flex text-xs font-semibold uppercase tracking-[0.14em] text-[#7c7265] transition hover:text-[#22201c]"
            >
              Back to OneSource
            </Link>
          </div>

          <div className="rounded-2xl border border-[#22201c]/10 bg-[#fffaf1]/76 p-5 shadow-sm shadow-[#22201c]/5">
            <div className="mb-5 rounded-xl border border-[#22201c]/8 bg-[#f8f4ec]/75 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#7c7265]">
                Active now
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                Ecommerce creative analysis
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[#8f7652]">
                  Starting environments
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeContexts.map((context) => (
                    <span
                      key={context}
                      className="rounded-full border border-[#22201c]/10 bg-[#f8f4ec] px-3 py-1.5 text-xs font-semibold text-[#3a352d]"
                    >
                      {context}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[#8a8174]">
                  Future environments
                </p>
                <div className="flex flex-wrap gap-2">
                  {futureContexts.map((context) => (
                    <span
                      key={context}
                      className="rounded-full border border-[#22201c]/8 bg-[#f5f1e8]/60 px-3 py-1.5 text-xs font-medium text-[#8a8174]"
                    >
                      {context}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
