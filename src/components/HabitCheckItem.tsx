import type { HabitId } from "../types";
import { HABIT_MAP } from "../constants/habits";

interface Props {
  habitId: HabitId;
  checked: boolean;
  waived?: boolean;
  note?: string;
  onToggle: () => void;
}

export function HabitCheckItem({ habitId, checked, waived, note, onToggle }: Props) {
  const habit = HABIT_MAP[habitId];
  if (!habit) return null;

  if (waived) {
    return (
      <div className="flex items-start gap-3 py-3 px-4 opacity-50">
        <div className="w-6 h-6 mt-0.5 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
          <span className="text-xs text-gray-400">—</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-400 line-through">{habit.label}</p>
          <p className="text-xs text-gray-400 mt-0.5">Waived</p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onToggle}
      className="w-full flex items-start gap-3 py-3 px-4 active:bg-gray-50 transition-colors text-left"
    >
      <div
        className={`w-6 h-6 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          checked
            ? "bg-indigo-600 border-indigo-600"
            : "border-gray-300"
        }`}
      >
        {checked && (
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${checked ? "text-gray-400 line-through" : "text-gray-900"}`}>
          {habit.label}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 leading-snug">
          {note ?? habit.description}
        </p>
      </div>
    </button>
  );
}
