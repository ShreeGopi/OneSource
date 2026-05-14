import Link from "next/link";

const learningPoints = [
  {
    marker: "01",
    title: "Why creatives earn attention",
    body: "The signals that pull people into a creative.",
  },
  {
    marker: "02",
    title: "Which patterns repeat",
    body: "The structures that show up again and again.",
  },
  {
    marker: "03",
    title: "How signals connect",
    body: "The relationships behind persuasion systems.",
  },
];

const signalNodes = [
  {
    label: "Emotions",
    code: "EM",
    x: 86,
    y: 136,
    path: "M148 136 C178 140 206 166 220 195",
  },
  {
    label: "Hooks",
    code: "HK",
    x: 96,
    y: 238,
    path: "M158 238 C184 228 206 214 220 205",
  },
  {
    label: "Visuals",
    code: "VI",
    x: 84,
    y: 320,
    path: "M146 320 C176 276 206 232 220 212",
  },
  {
    label: "CTAs",
    code: "CT",
    x: 430,
    y: 128,
    path: "M368 128 C330 134 306 164 300 195",
  },
  {
    label: "Platforms",
    code: "PL",
    x: 440,
    y: 240,
    path: "M378 240 C350 230 320 214 302 205",
  },
  {
    label: "Niches",
    code: "NI",
    x: 430,
    y: 316,
    path: "M368 316 C338 274 312 232 302 212",
  },
];

const systemLayers = [
  {
    label: "Signal Layer",
    items: "Emotions, hooks, visuals, CTAs",
  },
  {
    label: "Intelligence Layer",
    items: "Patterns, relationships, structures",
  },
  {
    label: "Exploration Layer",
    items: "Gallery, traversal, co-signals",
  },
];

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-[#f5f1e8] text-[#22201c]">
      <div
        className="mx-auto grid min-h-[100dvh] w-full max-w-7xl grid-rows-[auto_1fr_auto] px-4 py-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,32,28,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(34,32,28,0.045) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <header className="grid grid-cols-12 items-center gap-3 border-b border-[#22201c]/20 pb-3">
          <Link
            href="/"
            className="col-span-5 w-fit rounded-md border border-[#22201c]/20 bg-[#fffaf1]/75 px-4 py-2 text-sm font-semibold tracking-wide shadow-sm shadow-[#22201c]/5 sm:col-span-4 sm:px-5 sm:text-base lg:col-span-3"
          >
            OneSource
          </Link>

          <nav className="col-span-7 flex justify-self-end rounded-md border border-[#22201c]/15 bg-[#fffaf1]/65 text-[10px] uppercase tracking-[0.15em] text-[#3a352d] shadow-sm shadow-[#22201c]/5 sm:col-span-8 sm:text-xs lg:col-span-9">
            <Link
              href="/gallery"
              className="px-3 py-2 transition hover:bg-[#22201c] hover:text-[#fffaf1] sm:px-5"
            >
              Gallery
            </Link>
            <Link
              href="/admin"
              className="border-l border-[#22201c]/15 px-3 py-2 transition hover:bg-[#22201c] hover:text-[#fffaf1] sm:px-5"
            >
              Admin
            </Link>
          </nav>
        </header>

        <section className="grid min-h-0 grid-cols-12 items-center gap-4 py-4 lg:gap-5">
          <div className="col-span-12 min-w-0 md:col-span-5 lg:col-span-4">
            <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-[#7c7265] sm:text-xs">
              Structured Attention Intelligence
            </p>

            <h1 className="max-w-sm text-[clamp(2.55rem,5.4vw,4.45rem)] font-semibold leading-[0.92] tracking-tight">
              OneSource
            </h1>

            <p className="mt-4 max-w-md text-[clamp(1.1rem,2vw,1.42rem)] leading-tight text-[#3a352d]">
              Structured intelligence for internet attention patterns.
            </p>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#6f675d]">
              OneSource starts with ecommerce creatives as the first proving
              ground, then turns their signals into reusable intelligence for
              understanding internet attention patterns.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/gallery"
                className="rounded-md bg-[#22201c] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#fffaf1] transition hover:bg-[#3a352d] sm:px-5"
              >
                Open Intelligence
              </Link>
              <Link
                href="/admin"
                className="rounded-md border border-[#22201c]/20 bg-[#fffaf1]/70 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3a352d] transition hover:border-[#22201c]/45 sm:px-5"
              >
                Add Creative
              </Link>
            </div>
          </div>

          <div className="relative col-span-12 mx-auto aspect-[1.18/1] w-full max-w-[420px] md:col-span-7 lg:col-span-4 lg:max-w-[460px]">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 520 430"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="source-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#b9d8cf" stopOpacity="0.42" />
                  <stop offset="100%" stopColor="#b9d8cf" stopOpacity="0" />
                </radialGradient>
                {signalNodes.map((node, index) => (
                  <path key={node.label} id={`signal-path-${index}`} d={node.path} />
                ))}
              </defs>

              <circle cx="260" cy="202" r="96" fill="url(#source-glow)" />

              {signalNodes.map((node, index) => (
                <g key={node.label}>
                  <use href={`#signal-path-${index}`} className="circuit-path" />
                  <use
                    href={`#signal-path-${index}`}
                    className="circuit-light"
                    style={{ animationDelay: `${index * 0.58}s` }}
                  />
                </g>
              ))}
            </svg>

            <div
              className="source-node absolute z-10 -translate-x-1/2 -translate-y-1/2 px-6 py-3 text-base font-semibold"
              style={{
                left: `${(260 / 520) * 100}%`,
                top: `${(202 / 430) * 100}%`,
              }}
            >
              OneSource
            </div>

            {signalNodes.map((node) => (
              <div
                key={node.label}
                className="signal-node absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 px-3 py-2 text-[13px]"
                style={{
                  left: `${(node.x / 520) * 100}%`,
                  top: `${(node.y / 430) * 100}%`,
                }}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-md border border-[#22201c]/10 bg-[#f5f1e8]/60 text-[9px] font-semibold text-[#7c7265]">
                  {node.code}
                </span>
                <span>{node.label}</span>
              </div>
            ))}
          </div>

          <aside className="col-span-12 rounded-xl border border-[#22201c]/10 bg-[#fffaf1]/72 p-4 shadow-sm shadow-[#22201c]/5 md:col-span-12 lg:col-span-4">
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#7c7265] sm:text-xs">
              Understand
            </p>
            <div className="grid gap-2">
              {learningPoints.map((point) => (
                <div
                  key={point.title}
                  className="grid grid-cols-[2rem_1fr] gap-3 rounded-lg border border-[#22201c]/8 bg-[#f8f4ec]/75 p-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#22201c]/10 text-[10px] font-semibold text-[#8f7652]">
                    {point.marker}
                  </div>
                  <div>
                    <h2 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#2d2923]">
                      {point.title}
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-[#6f675d]">
                      {point.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid grid-cols-12 gap-3 border-t border-[#22201c]/15 py-3 lg:items-center">
          <p className="col-span-12 text-[10px] uppercase tracking-[0.2em] text-[#7c7265] sm:text-xs lg:col-span-3">
            Current system
          </p>
          <div className="col-span-12 grid gap-2 md:grid-cols-3 lg:col-span-9">
            {systemLayers.map((layer, index) => (
              <div
                key={layer.label}
                className="relative rounded-lg border border-[#22201c]/10 bg-[#fffaf1]/72 p-3 shadow-sm shadow-[#22201c]/5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#22201c] text-[10px] font-semibold text-[#fffaf1]">
                    {index + 1}
                  </span>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2d2923]">
                    {layer.label}
                  </h2>
                </div>
                <p className="text-xs leading-5 text-[#6f675d]">{layer.items}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .source-node {
          border: 1px solid rgba(127, 184, 200, 0.46);
          border-radius: 16px;
          background: rgba(255, 250, 241, 0.78);
          box-shadow:
            0 14px 34px rgba(34, 32, 28, 0.07),
            0 0 0 10px rgba(185, 216, 207, 0.1);
          backdrop-filter: blur(14px);
        }

        .signal-node {
          border: 1px solid rgba(34, 32, 28, 0.075);
          border-radius: 999px;
          background: rgba(255, 250, 241, 0.54);
          box-shadow: 0 8px 18px rgba(34, 32, 28, 0.055);
          backdrop-filter: blur(12px);
        }

        .circuit-path {
          stroke: rgba(95, 127, 132, 0.3);
          stroke-width: 1.45;
          stroke-linecap: round;
          fill: none;
        } 

        .circuit-light {
              stroke: rgb(0 0 0);
              stroke-width: 2.25;
              stroke-linecap: round;
              fill: none;
              opacity: 0;
              stroke-dasharray: 82 190;
              stroke-dashoffset: 190;
              filter: drop-shadow(0 0 5px rgba(143, 210, 193, 0.42));
              animation: circuit-flow 10.5s cubic-bezier(0.48, 0, 0.18, 1) infinite;
        }

        @keyframes circuit-flow {
          0% {
            opacity: 0;
            stroke-dashoffset: 190;
          }
          22% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.46;
          }
          76% {
            opacity: 0.16;
          }
          100% {
            opacity: 0;
            stroke-dashoffset: -56;
          }
        }
      `}</style>
    </main>
  );
}
