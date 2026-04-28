import type { DayRecord, DayModifier, HabitId } from "../types";
import { HabitCheckItem } from "./HabitCheckItem";
import { DayModifierSelector } from "./DayModifierSelector";
import { getDailyApplicableHabits } from "../logic/applicability";
import { formatDisplayDate } from "../logic/dates";
import { HABIT_MAP } from "../constants/habits";

interface Props {
  dateStr: string;
  record: DayRecord;
  onClose: () => void;
  onModifierChange: (modifier: DayModifier) => void;
  onToggle: (habitId: HabitId) => void;
}

export function DayDetailDrawer({ dateStr, record, onClose, onModifierChange, onToggle }: Props) {
  const applicable = getDailyApplicableHabits(dateStr, record);

  // Also show weekly habits completed on this day
  const weeklyHabits: HabitId[] = ["run-bike", "climbing", "gym", "travel-workout", "guitar-recording", "cooking"];
  const weeklyDone = weeklyHabits.filter((id) => record.completions[id]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl shadow-xl max-h-[85dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-4 pb-2 pt-1 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">{formatDisplayDate(dateStr)}</h3>
          <button onClick={onClose} className="text-gray-400 p-1">✕</button>
        </div>

        <DayModifierSelector value={record.modifier} onChange={onModifierChange} />

        <div className="bg-white rounded-2xl mx-4 divide-y divide-gray-100 mb-4">
          <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Daily Habits</p>
          {applicable.map((h) => (
            <HabitCheckItem
              key={h.id}
              habitId={h.id}
              checked={record.completions[h.id] ?? false}
              waived={h.waived}
              note={h.note}
              onToggle={() => !h.waived && onToggle(h.id)}
            />
          ))}
        </div>

        {weeklyDone.length > 0 && (
          <div className="mx-4 mb-6 px-3 py-2 bg-gray-50 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 mb-1">Logged on this day:</p>
            {weeklyDone.map((id) => (
              <p key={id} className="text-xs text-gray-600">✓ {HABIT_MAP[id]?.label}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
