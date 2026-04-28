import { useState, useMemo, useEffect } from "react";
import type { TabId } from "./types";
import { Header } from "./components/Header";
import { TabBar } from "./components/TabBar";
import { TodayView } from "./views/TodayView";
import { WeekView } from "./views/WeekView";
import { HistoryView } from "./views/HistoryView";
import { FineView } from "./views/FineView";
import { LoginScreen } from "./components/LoginScreen";
import { useHabitStore } from "./store/useHabitStore";
import { useToday } from "./hooks/useToday";
import { useWeek } from "./hooks/useWeek";
import { useAuth } from "./hooks/useAuth";
import { calculateFines } from "./logic/fines";
import { getWeekBounds, getWeekKey, fromDateStr, toDateStr } from "./logic/dates";
import { addDays } from "date-fns";
import { CONTRACT_START } from "./constants/habits";
import { fetchPayments, upsertPayments } from "./lib/sync";

function App() {
  const { session, loading, signIn, signUp, signOut } = useAuth();
  const userId = session?.user.id ?? null;

  const [activeTab, setActiveTab] = useState<TabId>("today");
  const todayStr = useToday();
  const { weekKey: currentWeekKey } = useWeek(todayStr);
  const [viewedWeekKey, setViewedWeekKey] = useState<string | null>(null);
  const [viewedDayStr, setViewedDayStr] = useState<string | null>(null);
  const { days, synced, getDay, setModifier, toggleCompletion } = useHabitStore(userId);
  const [payments, setPayments] = useState<number>(() => {
    try { return Number(localStorage.getItem("habit-contract:paid") ?? "0"); } catch { return 0; }
  });

  // Fetch payments from Supabase when logged in
  useEffect(() => {
    if (!userId) return;
    fetchPayments(userId).then((remote) => {
      setPayments(remote);
      try { localStorage.setItem("habit-contract:paid", String(remote)); } catch { /* empty */ }
    });
  }, [userId]);

  const weekKey = viewedWeekKey ?? currentWeekKey;
  const { start: weekStart, end: weekEnd } = getWeekBounds(weekKey);

  const activeDayStr = viewedDayStr ?? todayStr;
  const activeDayRecord = getDay(activeDayStr);

  const fineReport = useMemo(() => calculateFines(days), [days]);
  const outstanding = Math.max(0, fineReport.total - payments);

  function handleDayOffset(delta: number) {
    const next = toDateStr(addDays(fromDateStr(activeDayStr), delta));
    setViewedDayStr(next === todayStr ? null : next);
  }

  function handleWeekOffset(delta: number) {
    const newStart = addDays(fromDateStr(weekStart), delta * 7);
    setViewedWeekKey(getWeekKey(newStart));
  }

  function handlePayment(amount: number) {
    const next = payments + amount;
    setPayments(next);
    try { localStorage.setItem("habit-contract:paid", String(next)); } catch { /* empty */ }
    if (userId) upsertPayments(userId, next);
  }

  const contractStartWeekKey = getWeekKey(fromDateStr(CONTRACT_START));
  const canGoPrevWeek = weekKey > contractStartWeekKey;
  const canGoNextWeek = weekKey < currentWeekKey;
  const canGoPrevDay = activeDayStr > CONTRACT_START;
  const canGoNextDay = activeDayStr < todayStr;
  const isToday = activeDayStr === todayStr;

  // Loading spinner (resolving auth session)
  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#f8f7f5]">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Login screen
  if (!session) {
    return (
      <div className="flex flex-col h-dvh w-full max-w-lg mx-auto bg-[#f8f7f5]">
        <LoginScreen onSignIn={signIn} onSignUp={signUp} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh w-full max-w-lg mx-auto bg-[#f8f7f5]">
      <Header fineTotal={outstanding} onSignOut={signOut} synced={synced} />

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
