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
    accent: "bg-[#c56fba]",
    border: "border-[#d9bad5]",
    glow: "hover:shadow-[0_10px_24px_rgba(34,32,28,0.08)]",
    text: "text-[#5a3555]",
    bg: "bg-[#fffaf1]/72",
    activeBg: "bg-[#f4e3f1]",
  },

  hook: {
    accent: "bg-[#4f9bb8]",
    border: "border-[#b9d5df]",
    glow: "hover:shadow-[0_10px_24px_rgba(34,32,28,0.08)]",
    text: "text-[#2f5360]",
    bg: "bg-[#fffaf1]/72",
    activeBg: "bg-[#e7f1f4]",
  },

  visual: {
    accent: "bg-[#4fa99a]",
    border: "border-[#bbd8d2]",
    glow: "hover:shadow-[0_10px_24px_rgba(34,32,28,0.08)]",
    text: "text-[#335f57]",
    bg: "bg-[#fffaf1]/72",
    activeBg: "bg-[#e6f0ed]",
  },

  platform: {
    accent: "bg-[#8a8174]",
    border: "border-[#d8cec0]",
    glow: "hover:shadow-[0_10px_24px_rgba(34,32,28,0.08)]",
    text: "text-[#5d554b]",
    bg: "bg-[#fffaf1]/72",
    activeBg: "bg-[#eee7dc]",
  },

  niche: {
    accent: "bg-[#c58d3f]",
    border: "border-[#dec69d]",
    glow: "hover:shadow-[0_10px_24px_rgba(34,32,28,0.08)]",
    text: "text-[#735527]",
    bg: "bg-[#fffaf1]/72",
    activeBg: "bg-[#f3e8d0]",
  },

  pattern: {
    accent: "bg-[#8f7bb5]",
    border: "border-[#cdc3df]",
    glow: "hover:shadow-[0_10px_24px_rgba(34,32,28,0.08)]",
    text: "text-[#51436c]",
    bg: "bg-[#fffaf1]/72",
    activeBg: "bg-[#ebe5f3]",
  },

  cta: {
    accent: "bg-[#4b9b72]",
    border: "border-[#bad4c5]",
    glow: "hover:shadow-[0_10px_24px_rgba(34,32,28,0.08)]",
    text: "text-[#365d46]",
    bg: "bg-[#fffaf1]/72",
    activeBg: "bg-[#e6efe9]",
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
        hover:border-[#22201c]/20
        hover:shadow-sm
        hover:shadow-[#22201c]/8

        ${size === "md"
          ? "px-3 py-2 rounded-2xl"
          : "px-2.5 py-1.5 rounded-xl"
        }
      `}
    >
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
            ${size === "md"
              ? "text-xs"
              : "text-[11px]"
            }
            ${active
              ? "text-[#22201c]"
              : "text-[#3a352d] group-hover:text-[#22201c]"
            }
          `}
        >
          {value}
        </span>

        {/* active indicator */}
        {active && (
          <div className="w-1 h-1 rounded-full bg-[#22201c]/45 ml-1" />
        )}
      </div>

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
