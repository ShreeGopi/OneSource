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
    <div className="flex gap-0 border-b border-gray-800 mb-8 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-5 py-3 text-sm whitespace-nowrap transition-all border-b-2 -mb-px ${
            active === tab.id
              ? "text-white border-white font-medium"
              : "text-gray-500 border-transparent hover:text-gray-300"
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                active === tab.id
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gray-900 text-gray-600"
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