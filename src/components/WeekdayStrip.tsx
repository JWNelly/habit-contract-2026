import type { DayRecord } from "../types";
import { getDaysInWeek, formatDayOfWeek, formatDayNum, today } from "../logic/dates";
import { getDailyApplicableHabits } from "../logic/applicability";

interface Props {
  weekKey: string;
  days: Record<string, DayRecord>;
  selectedDate: string;
  onSelect: (date: string) => void;
}

function getDayStatus(dateStr: string, days: Record<string, DayRecord>) {
  const todayStr = today();
  if (dateStr > todayStr) return "future";
  const record = days[dateStr] ?? { date: dateStr, modifier: "normal", completions: {} };
  const applicable = getDailyApplicableHabits(dateStr, record);
  const required = applicable.filter((h) => !h.waived);
  if (required.length === 0) return "waived";
  const allDone = required.every((h) => record.completions[h.id]);
  const anyDone = required.some((h) => record.completions[h.id]);
  if (allDone) return "done";
  if (anyDone) return "partial";
  return "missed";
}

const STATUS_COLORS: Record<string, string> = {
  future: "bg-gray-100 text-gray-400",
  done: "bg-green-500 text-white",
  partial: "bg-yellow-400 text-white",
  missed: "bg-red-400 text-white",
  waived: "bg-gray-200 text-gray-500",
};

interface StripProps extends Props {
  todayStr: string;
}

export function WeekdayStrip({ weekKey, days, selectedDate, onSelect, todayStr }: StripProps) {
  const weekDays = getDaysInWeek(weekKey);

  return (
    <div className="flex gap-1 px-4 py-3">
      {weekDays.map((dateStr) => {
        const status = getDayStatus(dateStr, days);
        const isSelected = dateStr === selectedDate;
        const isToday = dateStr === todayStr;

        return (
          <button
            key={dateStr}
            onClick={() => onSelect(dateStr)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
              isSelected ? "ring-2 ring-indigo-500 ring-offset-1" : ""
            }`}
          >
            <span className="text-xs text-gray-500">{formatDayOfWeek(dateStr)}</span>
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${STATUS_COLORS[status]}`}
            >
              {formatDayNum(dateStr)}
            </span>
            {isToday && (
              <span className="w-1 h-1 rounded-full bg-indigo-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}
