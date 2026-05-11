// ============================================================
// OneSource — Signal Tag
// Signals are NOT tags.
// They are exploration nodes inside an intelligence graph.
// ============================================================

"use client";

export type SignalType =
  | "emotion"
  | "hook"
  | "visual"
  | "platform"
  | "niche"
  | "pattern"
  | "cta";

export type Signal = {
  type: SignalType;
  value: string;
};

// ── Semantic Node Styles ─────────────────────────────────────

const NODE_STYLES: Record<
  SignalType,
  {
    accent: string;
    border: string;
    glow: string;
    text: string;
    bg: string;
    activeBg: string;
  }
> = {
  emotion: {
    accent: "bg-fuchsia-400",
    border: "border-fuchsia-900/40",
    glow: "hover:shadow-[0_0_20px_rgba(217,70,239,0.08)]",
    text: "text-fuchsia-100",
    bg: "bg-[#0f0a12]",
    activeBg: "bg-[#1b1020]",
  },

  hook: {
    accent: "bg-sky-400",
    border: "border-sky-900/40",
    glow: "hover:shadow-[0_0_20px_rgba(14,165,233,0.08)]",
    text: "text-sky-100",
    bg: "bg-[#0a1014]",
    activeBg: "bg-[#0f1c24]",
  },

  visual: {
    accent: "bg-teal-400",
    border: "border-teal-900/40",
    glow: "hover:shadow-[0_0_20px_rgba(20,184,166,0.08)]",
    text: "text-teal-100",
    bg: "bg-[#091211]",
    activeBg: "bg-[#10201d]",
  },

  platform: {
    accent: "bg-zinc-400",
    border: "border-zinc-800",
    glow: "hover:shadow-[0_0_20px_rgba(161,161,170,0.06)]",
    text: "text-zinc-100",
    bg: "bg-[#101010]",
    activeBg: "bg-[#181818]",
  },

  niche: {
    accent: "bg-amber-400",
    border: "border-amber-900/40",
    glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]",
    text: "text-amber-100",
    bg: "bg-[#141006]",
    activeBg: "bg-[#221907]",
  },

  pattern: {
    accent: "bg-violet-400",
    border: "border-violet-900/40",
    glow: "hover:shadow-[0_0_20px_rgba(139,92,246,0.08)]",
    text: "text-violet-100",
    bg: "bg-[#110d18]",
    activeBg: "bg-[#1b1326]",
  },

  cta: {
    accent: "bg-emerald-400",
    border: "border-emerald-900/40",
    glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]",
    text: "text-emerald-100",
    bg: "bg-[#09120d]",
    activeBg: "bg-[#102019]",
  },
};

// ── Component ────────────────────────────────────────────────

type SignalTagProps = {
  value: string;
  type: SignalType;
  active?: boolean;
  onClick?: (signal: Signal) => void;
  size?: "sm" | "md";
};

export function SignalTag({
  value,
  type,
  active = false,
  onClick,
  size = "sm",
}: SignalTagProps) {
  const style = NODE_STYLES[type];

  function handleClick() {
    onClick?.({ type, value });
  }

  return (
    <button
      onClick={handleClick}
      title={`Explore ${value}`}
      className={`
        group
        relative
        overflow-hidden
        transition-all
        duration-200
        border
        ${style.border}
        ${style.glow}
        ${style.text}
        ${active ? style.activeBg : style.bg}
        hover:-translate-y-[1px]
        hover:border-white/10

        ${
          size === "md"
            ? "px-3 py-2 rounded-2xl"
            : "px-2.5 py-1.5 rounded-xl"
        }
      `}
    >
      {/* top graph line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />

      {/* node layout */}
      <div className="flex items-center gap-2">

        {/* graph node */}
        <div className="relative flex items-center justify-center shrink-0">
          <div
            className={`
              w-2 h-2 rounded-full
              ${style.accent}
            `}
          />

          {active && (
            <div
              className={`
                absolute w-4 h-4 rounded-full
                ${style.accent}
                opacity-20 animate-ping
              `}
            />
          )}
        </div>

        {/* label */}
        <span
          className={`
            tracking-wide
            transition-colors
            duration-200
            ${
              size === "md"
                ? "text-xs"
                : "text-[11px]"
            }
            ${
              active
                ? "text-white"
                : "text-gray-300 group-hover:text-white"
            }
          `}
        >
          {value}
        </span>

        {/* active indicator */}
        {active && (
          <div className="w-1 h-1 rounded-full bg-white/70 ml-1" />
        )}
      </div>

      {/* subtle intelligence grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:6px_6px]" />
    </button>
  );
}

// ── Group Wrapper ────────────────────────────────────────────

type SignalTagGroupProps = {
  values: string[];
  type: SignalType;
  activeValue?: string;
  onTagClick?: (signal: Signal) => void;
};

export function SignalTagGroup({
  values,
  type,
  activeValue,
  onTagClick,
}: SignalTagGroupProps) {
  if (!values || values.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <SignalTag
          key={value}
          value={value}
          type={type}
          active={activeValue === value}
          onClick={onTagClick}
        />
      ))}
    </div>
  );
}