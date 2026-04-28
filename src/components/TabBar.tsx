import type { TabId } from "../types";

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: "today", label: "Today", icon: "✓" },
  { id: "week", label: "Week", icon: "📅" },
  { id: "history", label: "History", icon: "📆" },
  { id: "fines", label: "Fines", icon: "$" },
];

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="bg-white border-t border-gray-200 flex sticky bottom-0 z-50 shadow-[0_-1px_3px_rgba(0,0,0,0.06)]">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors ${
            active === tab.id
              ? "text-indigo-600"
              : "text-gray-400 active:text-gray-600"
          }`}
        >
          <span className="text-base leading-none">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
