import { useState, useMemo } from "react";
import type { TabId } from "./types";
import { Header } from "./components/Header";
import { TabBar } from "./components/TabBar";
import { TodayView } from "./views/TodayView";
import { WeekView } from "./views/WeekView";
import { HistoryView } from "./views/HistoryView";
import { FineView } from "./views/FineView";
import { useHabitStore } from "./store/useHabitStore";
import { useToday } from "./hooks/useToday";
import { useWeek } from "./hooks/useWeek";
import { calculateFines } from "./logic/fines";
import { getWeekBounds, getWeekKey, fromDateStr, toDateStr } from "./logic/dates";
import { addDays } from "date-fns";
import { CONTRACT_START } from "./constants/habits";

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("today");
  const todayStr = useToday();
  const { weekKey: currentWeekKey } = useWeek(todayStr);
  const [viewedWeekKey, setViewedWeekKey] = useState<string | null>(null);
  const [viewedDayStr, setViewedDayStr] = useState<string | null>(null);
  const { days, getDay, setModifier, toggleCompletion } = useHabitStore();
  const [payments, setPayments] = useState<number>(() => {
    try { return Number(localStorage.getItem("habit-contract:paid") ?? "0"); } catch { return 0; }
  });

  const weekKey = viewedWeekKey ?? currentWeekKey;
  const { start: weekStart, end: weekEnd } = getWeekBounds(weekKey);

  const activeDayStr = viewedDayStr ?? todayStr;
  const activeDayRecord = getDay(activeDayStr);

  const fineReport = useMemo(() => calculateFines(days), [days]);
  const outstanding = Math.max(0, fineReport.total - payments);

  function handleDayOffset(delta: number) {
    const current = fromDateStr(activeDayStr);
    const next = toDateStr(addDays(current, delta));
    setViewedDayStr(next === todayStr ? null : next);
  }

  function handleWeekOffset(delta: number) {
    const current = fromDateStr(weekStart);
    const newStart = addDays(current, delta * 7);
    setViewedWeekKey(getWeekKey(newStart));
  }

  function handlePayment(amount: number) {
    const next = payments + amount;
    setPayments(next);
    try { localStorage.setItem("habit-contract:paid", String(next)); } catch { /* empty */ }
  }

  const contractStartWeekKey = getWeekKey(fromDateStr(CONTRACT_START));
  const canGoPrevWeek = weekKey > contractStartWeekKey;
  const canGoNextWeek = weekKey < currentWeekKey;

  const canGoPrevDay = activeDayStr > CONTRACT_START;
  const canGoNextDay = activeDayStr < todayStr;
  const isToday = activeDayStr === todayStr;

  return (
    <div className="flex flex-col h-dvh w-full max-w-lg mx-auto bg-[#f8f7f5]">
      <Header fineTotal={outstanding} />

      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        {activeTab === "today" && (
          <TodayView
            dateStr={activeDayStr}
            record={activeDayRecord}
            isToday={isToday}
            onModifierChange={(mod) => setModifier(activeDayStr, mod)}
            onToggle={(habitId) => toggleCompletion(activeDayStr, habitId)}
            onPrevDay={canGoPrevDay ? () => handleDayOffset(-1) : undefined}
            onNextDay={canGoNextDay ? () => handleDayOffset(1) : undefined}
            onGoToToday={() => setViewedDayStr(null)}
          />
        )}
        {activeTab === "week" && (
          <WeekView
            weekKey={weekKey}
            weekStart={weekStart}
            weekEnd={weekEnd}
            todayStr={todayStr}
            days={days}
            onToggle={(dateStr, habitId) => toggleCompletion(dateStr, habitId)}
            onModifierChange={(dateStr, mod) => setModifier(dateStr, mod)}
            onPrevWeek={canGoPrevWeek ? () => handleWeekOffset(-1) : undefined}
            onNextWeek={canGoNextWeek ? () => handleWeekOffset(1) : undefined}
            isCurrentWeek={weekKey === currentWeekKey}
            onGoToCurrentWeek={() => setViewedWeekKey(null)}
          />
        )}
        {activeTab === "history" && (
          <HistoryView
            days={days}
            onModifierChange={(dateStr, mod) => setModifier(dateStr, mod)}
            onToggle={(dateStr, habitId) => toggleCompletion(dateStr, habitId)}
          />
        )}
        {activeTab === "fines" && (
          <FineView
            days={days}
            payments={payments}
            outstanding={outstanding}
            onRecordPayment={handlePayment}
          />
        )}
      </main>

      <TabBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;
