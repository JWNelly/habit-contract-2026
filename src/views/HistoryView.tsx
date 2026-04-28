import { useState } from "react";
import type { DayRecord, DayModifier, HabitId } from "../types";
import { MonthGrid } from "../components/MonthGrid";
import { DayDetailDrawer } from "../components/DayDetailDrawer";
import { getContractMonths } from "../logic/dates";
import { CONTRACT_START, CONTRACT_END } from "../constants/habits";

interface Props {
  days: Record<string, DayRecord>;
  onModifierChange: (dateStr: string, modifier: DayModifier) => void;
  onToggle: (dateStr: string, habitId: HabitId) => void;
}

export function HistoryView({ days, onModifierChange, onToggle }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const months = getContractMonths(CONTRACT_START, CONTRACT_END);

  const selectedRecord = selectedDate
    ? days[selectedDate] ?? { date: selectedDate, modifier: "normal" as DayModifier, completions: {} }
    : null;

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-xl font-bold text-gray-900">History</h2>
        <p className="text-xs text-gray-500 mt-0.5">Tap a day to view details</p>
      </div>

      {months.map(({ year, month }) => (
        <MonthGrid
          key={`${year}-${month}`}
          year={year}
          month={month}
          days={days}
          onSelectDate={setSelectedDate}
          selectedDate={selectedDate}
        />
      ))}

      {selectedDate && selectedRecord && (
        <DayDetailDrawer
          dateStr={selectedDate}
          record={selectedRecord}
          onClose={() => setSelectedDate(null)}
          onModifierChange={(mod) => onModifierChange(selectedDate, mod)}
          onToggle={(id) => onToggle(selectedDate, id)}
        />
      )}
    </div>
  );
}
