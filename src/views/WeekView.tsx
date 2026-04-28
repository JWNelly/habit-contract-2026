import { useState } from "react";
import type { DayRecord, DayModifier, HabitId } from "../types";
import { WeekdayStrip } from "../components/WeekdayStrip";
import { FitnessTracker } from "../components/FitnessTracker";
import { HabitCheckItem } from "../components/HabitCheckItem";
import { DayModifierSelector } from "../components/DayModifierSelector";
import { deriveWeekSummary, isWeeklyHabitComplete } from "../logic/weekly";
import { formatShortDate } from "../logic/dates";

interface Props {
  weekKey: string;
  weekStart: string;
  weekEnd: string;
  todayStr: string;
  days: Record<string, DayRecord>;
  onToggle: (dateStr: string, habitId: HabitId) => void;
  onModifierChange: (dateStr: string, modifier: DayModifier) => void;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
  isCurrentWeek: boolean;
  onGoToCurrentWeek: () => void;
}

const ASTERISK_HABITS: { id: HabitId; label: string; description: string }[] = [
  {
    id: "guitar-recording",
    label: "Guitar Recording *",
    description: "Record yourself playing and send to someone or post publicly (public performance counts)",
  },
  {
    id: "cooking",
    label: "Cooking Challenge *",
    description: "Cook a new meal or cook for at least 2 people",
  },
];

export function WeekView({
  weekKey, weekStart, weekEnd, todayStr, days, onToggle, onModifierChange,
  onPrevWeek, onNextWeek, isCurrentWeek, onGoToCurrentWeek,
}: Props) {
  const [selectedDate, setSelectedDate] = useState(
    todayStr >= weekStart && todayStr <= weekEnd ? todayStr : weekEnd
  );
  const summary = deriveWeekSummary(weekKey, days);
  const selectedRecord = days[selectedDate] ?? { date: selectedDate, modifier: "normal" as DayModifier, completions: {} };

  // Keep selectedDate in sync when week changes
  const clampedDate = selectedDate < weekStart ? weekStart : selectedDate > weekEnd ? weekEnd : selectedDate;

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* Week header with navigation */}
      <div className="px-4 pt-4 pb-1 flex items-center gap-2">
        <button
          onClick={onPrevWeek}
          disabled={!onPrevWeek}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 disabled:opacity-30 active:bg-gray-100"
        >
          ‹
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-lg font-bold text-gray-900 leading-tight">
            {formatShortDate(weekStart)} – {formatShortDate(weekEnd)}
          </h2>
          {!isCurrentWeek && (
            <button onClick={onGoToCurrentWeek} className="text-xs text-indigo-500 mt-0.5">
              ← Back to current week
            </button>
          )}
        </div>
        <button
          onClick={onNextWeek}
          disabled={!onNextWeek}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 disabled:opacity-30 active:bg-gray-100"
        >
          ›
        </button>
      </div>

      {summary.asteriskWaiverActive && (
        <p className="text-xs text-amber-600 px-4 font-medium mt-1">
          ⚡ Asterisk habits waived this week (3+ waiver days)
        </p>
      )}

      {/* Day strip */}
      <WeekdayStrip
        weekKey={weekKey}
        days={days}
        selectedDate={clampedDate}
        onSelect={setSelectedDate}
        todayStr={todayStr}
      />

      {/* Day modifier for selected day (useful for past week editing) */}
      <div className="mx-4 mb-3 bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 pt-3 pb-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {formatShortDate(clampedDate)} — Day Type
          </p>
        </div>
        <DayModifierSelector
          value={selectedRecord.modifier}
          onChange={(mod) => onModifierChange(clampedDate, mod)}
        />
      </div>

      <div className="space-y-4">
        {/* Fitness tracker */}
        <FitnessTracker
          weekKey={weekKey}
          days={days}
          onToggle={onToggle}
          selectedDate={clampedDate}
        />

        {/* Asterisk weekly habits */}
        <div className="bg-white rounded-2xl mx-4 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">Weekly Goals</p>
            <p className="text-xs text-gray-500 mt-0.5">
              * Waived if 3+ waiver-eligible days (illness, vacation, holiday, emergency)
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {ASTERISK_HABITS.map((habit) => {
              const done = isWeeklyHabitComplete(habit.id, weekKey, days);
              const waived = summary.asteriskWaiverActive;
              return (
                <HabitCheckItem
                  key={habit.id}
                  habitId={habit.id}
                  checked={done}
                  waived={waived}
                  onToggle={() => !waived && onToggle(clampedDate, habit.id)}
                />
              );
            })}
          </div>
        </div>

        {/* Help text */}
        <div className="mx-4 px-3 py-2 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500">
            Habits log on <strong>{formatShortDate(clampedDate)}</strong>. Tap a different day in the strip above to log on a different day.
          </p>
        </div>
      </div>
    </div>
  );
}
