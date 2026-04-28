import type { DayModifier } from "../types";

interface Option {
  value: DayModifier;
  label: string;
  color: string;
}

const OPTIONS: Option[] = [
  { value: "normal", label: "Normal", color: "bg-gray-100 text-gray-700 border-gray-200" },
  { value: "travel", label: "✈️ Travel", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "illness", label: "🤒 Illness", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { value: "vacation", label: "🏖️ Vacation", color: "bg-green-50 text-green-700 border-green-200" },
  { value: "holiday", label: "🎉 Holiday", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "emergency", label: "🚨 Emergency", color: "bg-red-50 text-red-700 border-red-200" },
];

interface Props {
  value: DayModifier;
  onChange: (modifier: DayModifier) => void;
}

export function DayModifierSelector({ value, onChange }: Props) {
  return (
    <div className="px-4 py-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Day Type</p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              value === opt.value
                ? opt.color + " ring-2 ring-offset-1 ring-indigo-400"
                : "bg-gray-50 text-gray-500 border-gray-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
