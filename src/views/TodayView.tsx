import type { DayRecord, DayModifier, HabitId } from "../types";
import { DayModifierSelector } from "../components/DayModifierSelector";
import { HabitCheckItem } from "../components/HabitCheckItem";
import { getDailyApplicableHabits } from "../logic/applicability";
import { formatDisplayDate } from "../logic/dates";

interface Props {
  dateStr: string;
  record: DayRecord;
  isToday: boolean;
  onModifierChange: (modifier: DayModifier) => void;
  onToggle: (habitId: HabitId) => void;
  onPrevDay?: () => void;
  onNextDay?: () => void;
  onGoToToday: () => void;
}

export function TodayView({
  dateStr, record, isToday, onModifierChange, onToggle,
  onPrevDay, onNextDay, onGoToToday,
}: Props) {
  const applicable = getDailyApplicableHabits(dateStr, record);
  const completed = applicable.filter((h) => !h.waived && record.completions[h.id]).length;
  const required = applicable.filter((h) => !h.waived).length;
  const allDone = required > 0 && completed === required;

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* Date header with navigation */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <button
          onClick={onPrevDay}
          disabled={!onPrevDay}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 disabled:opacity-30 active:bg-gray-100 flex-shrink-0 text-lg"
        >
          ‹
        </button>
        <div className="flex-1 min-w-0 text-center">
          <h2 className="text-xl font-bold text-gray-900 leading-tight">{formatDisplayDate(dateStr)}</h2>
          {!isToday && (
            <button onClick={onGoToToday} className="text-xs text-indigo-500 mt-0.5">
              ← Back to today
            </button>
          )}
        </div>
        <button
          onClick={onNextDay}
          disabled={!onNextDay}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 disabled:opacity-30 active:bg-gray-100 flex-shrink-0 text-lg"
        >
          ›
        </button>
      </div>

      {/* Status + progress bar */}
      <div className="px-4 mb-3">
        {required === 0 ? (
          <p className="text-sm text-amber-600 font-medium mb-2">All habits waived today</p>
        ) : allDone ? (
          <p className="text-sm text-green-600 font-medium mb-2">All done! 🎉</p>
        ) : (
          <p className="text-sm text-gray-500 mb-2">{completed} / {required} daily habits done</p>
        )}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: required > 0 ? `${(completed / required) * 100}%` : "0%" }}
          />
        </div>
      </div>

      {/* Day type selector */}
      <DayModifierSelector value={record.modifier} onChange={onModifierChange} />

      {/* Travel note */}
      {record.modifier === "travel" && (
        <div className="mx-4 mb-3 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700">
            <strong>Travel day:</strong> Guitar & wake-up waived. Physics reduced to 30 min. French still required. Fitness can be substituted with travel workout (Week tab).
          </p>
        </div>
      )}

      {/* Waiver note */}
      {["illness", "vacation", "holiday", "emergency"].includes(record.modifier) && (
        <div className="mx-4 mb-3 px-3 py-2 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-xs text-amber-700">
            <strong>{record.modifier === "illness" ? "Illness" : record.modifier === "vacation" ? "Vacation" : record.modifier === "holiday" ? "Holiday" : "Emergency"}:</strong>{" "}
            All daily habits waived today. 3+ waiver days this week will also waive guitar recording & cooking.
          </p>
        </div>
      )}

      {/* Habits list */}
      <div className="bg-white rounded-2xl mx-4 divide-y divide-gray-100 shadow-sm">
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
        {applicable.length === 0 && (
          <div className="py-8 text-center text-gray-400 text-sm">
            No daily habits apply today.
          </div>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        Weekly habits (fitness, recording, cooking) → Week tab
      </p>
    </div>
  );
}
