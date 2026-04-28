import type { DayRecord } from "../types";
import {
  getMonthDays,
  getDayOfWeek,
  formatDayNum,
  today,
  isWithinContract,
} from "../logic/dates";
import { CONTRACT_START, CONTRACT_END } from "../constants/habits";
import { getDailyApplicableHabits } from "../logic/applicability";

interface Props {
  year: number;
  month: number; // 1-indexed
  days: Record<string, DayRecord>;
  onSelectDate: (date: string) => void;
  selectedDate: string | null;
}

type DayStatus = "done" | "partial" | "missed" | "waived" | "future" | "outside";

function getDayStatus(dateStr: string, days: Record<string, DayRecord>): DayStatus {
  const todayStr = today();
  if (!isWithinContract(dateStr, CONTRACT_START, CONTRACT_END)) return "outside";
  if (dateStr > todayStr) return "future";
  const record = days[dateStr] ?? { date: dateStr, modifier: "normal", completions: {} };
  const applicable = getDailyApplicableHabits(dateStr, record);
  const required = applicable.filter((h) => !h.waived);
  if (required.length === 0) return "waived";
  const done = required.filter((h) => record.completions[h.id]).length;
  if (done === required.length) return "done";
  if (done > 0) return "partial";
  return "missed";
}

const STATUS_BG: Record<DayStatus, string> = {
  done: "bg-green-500 text-white",
  partial: "bg-yellow-400 text-white",
  missed: "bg-red-400 text-white",
  waived: "bg-gray-200 text-gray-500",
  future: "text-gray-400",
  outside: "text-gray-200",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function MonthGrid({ year, month, days, onSelectDate, selectedDate }: Props) {
  const monthDays = getMonthDays(year, month);
  const firstDay = getDayOfWeek(monthDays[0]); // 0=Sun
  // We want Mon-first grid: shift so Mon=0
  const offset = (firstDay + 6) % 7; // 0=Mon, 6=Sun

  const cells: (string | null)[] = [
    ...Array(offset).fill(null),
    ...monthDays,
  ];

  return (
    <div className="bg-white rounded-2xl mx-4 shadow-sm overflow-hidden mb-4">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-900">{MONTH_NAMES[month - 1]} {year}</p>
      </div>
      <div className="px-3 py-2">
        {/* Day labels */}
        <div className="grid grid-cols-7 mb-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} className="text-center text-xs text-gray-400 py-1">{d}</div>
          ))}
        </div>
        {/* Day cells */}
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((dateStr, i) => {
            if (!dateStr) return <div key={i} />;
            const status = getDayStatus(dateStr, days);
            const isSelected = dateStr === selectedDate;
            return (
              <button
                key={dateStr}
                onClick={() => status !== "outside" && status !== "future" && onSelectDate(dateStr)}
                disabled={status === "outside" || status === "future"}
                className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all ${
                  STATUS_BG[status]
                } ${isSelected ? "ring-2 ring-indigo-500 ring-offset-1" : ""}`}
              >
                {formatDayNum(dateStr)}
              </button>
            );
          })}
        </div>
      </div>
      {/* Legend */}
      <div className="px-3 py-2 border-t border-gray-100 flex gap-3 flex-wrap">
        {[
          { status: "done", label: "All done" },
          { status: "partial", label: "Partial" },
          { status: "missed", label: "Missed" },
          { status: "waived", label: "Waived" },
        ].map(({ status, label }) => (
          <div key={status} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-sm ${STATUS_BG[status as DayStatus]}`} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
