import type { DayRecord, HabitId } from "../types";
import { FINE_RATE, CONTRACT_START } from "../constants/habits";
import { getMissedDailyHabits } from "./applicability";
import { getMissedWeeklyHabits, getWeeksInRange } from "./weekly";
import { getWeekBounds, today, fromDateStr, getWeekKey } from "./dates";

export interface FineLine {
  type: "daily" | "weekly";
  date?: string; // for daily
  weekKey?: string; // for weekly
  habitId: HabitId;
  amount: number;
}

export interface FineReport {
  total: number;
  lines: FineLine[];
  byWeek: Record<string, number>;
  byHabit: Record<string, number>;
}

function isWeekComplete(weekKey: string): boolean {
  const { end } = getWeekBounds(weekKey);
  const todayStr = today();
  return end < todayStr;
}

export function calculateFines(days: Record<string, DayRecord>): FineReport {
  const lines: FineLine[] = [];
  const todayStr = today();

  // Daily fines: iterate every day from contract start to yesterday
  const contractStart = fromDateStr(CONTRACT_START);
  const cur = new Date(contractStart);
  const todayDate = fromDateStr(todayStr);

  while (cur < todayDate) {
    const dateStr = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
    const record = days[dateStr] ?? { date: dateStr, modifier: "normal", completions: {} };
    const missed = getMissedDailyHabits(dateStr, record);
    for (const id of missed) {
      lines.push({ type: "daily", date: dateStr, habitId: id, amount: FINE_RATE });
    }
    cur.setDate(cur.getDate() + 1);
  }

  // Weekly fines: only for completed weeks
  const allWeeks = getWeeksInRange(CONTRACT_START, todayStr);
  for (const weekKey of allWeeks) {
    if (!isWeekComplete(weekKey)) continue;
    const missed = getMissedWeeklyHabits(weekKey, days);
    for (const id of missed) {
      lines.push({ type: "weekly", weekKey, habitId: id, amount: FINE_RATE });
    }
  }

  const total = lines.reduce((sum, l) => sum + l.amount, 0);

  const byWeek: Record<string, number> = {};
  const byHabit: Record<string, number> = {};

  for (const line of lines) {
    const wk = line.weekKey ?? (line.date ? getWeekForDate(line.date) : "unknown");
    byWeek[wk] = (byWeek[wk] ?? 0) + line.amount;
    byHabit[line.habitId] = (byHabit[line.habitId] ?? 0) + line.amount;
  }

  return { total, lines, byWeek, byHabit };
}

function getWeekForDate(dateStr: string): string {
  return getWeekKey(fromDateStr(dateStr));
}
