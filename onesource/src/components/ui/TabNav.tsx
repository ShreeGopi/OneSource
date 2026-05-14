// ============================================================
// OneSource — Tab Navigation
// Reusable horizontal tab bar for intelligence sections.
// ============================================================

"use client";

export type TabItem = {
  id: string;
  label: string;
  count?: number;
};

export function TabNav({
  tabs,
  active,
  onChange,
}: {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="mb-6 flex gap-0 overflow-x-auto border-b border-[#22201c]/15 [scrollbar-width:none] md:overflow-visible [&::-webkit-scrollbar]:hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          data-tab-id={tab.id}
          onClick={() => onChange(tab.id)}
          className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm transition-all sm:px-5 ${
            active === tab.id
              ? "border-[#22201c] text-[#22201c] font-medium"
              : "border-transparent text-[#7c7265] hover:text-[#3a352d]"
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                active === tab.id
                  ? "bg-[#22201c] text-[#fffaf1]"
                  : "bg-[#efe8dc] text-[#8a8174]"
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
