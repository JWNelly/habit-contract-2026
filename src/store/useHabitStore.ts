import { useState, useCallback, useEffect } from "react";
import type { DayRecord, DayModifier, HabitId } from "../types";
import { loadDays, saveDays } from "./storage";

export function useHabitStore() {
  const [days, setDays] = useState<Record<string, DayRecord>>(() => loadDays());

  // Persist on every change
  useEffect(() => {
    saveDays(days);
  }, [days]);

  const getDay = useCallback(
    (dateStr: string): DayRecord => {
      return days[dateStr] ?? { date: dateStr, modifier: "normal", completions: {} };
    },
    [days]
  );

  const setModifier = useCallback(
    (dateStr: string, modifier: DayModifier, note?: string) => {
      setDays((prev) => {
        const existing = prev[dateStr] ?? { date: dateStr, modifier: "normal", completions: {} };
        return {
          ...prev,
          [dateStr]: { ...existing, modifier, modifierNote: note },
        };
      });
    },
    []
  );

  const toggleCompletion = useCallback(
    (dateStr: string, habitId: HabitId) => {
      setDays((prev) => {
        const existing = prev[dateStr] ?? { date: dateStr, modifier: "normal", completions: {} };
        const current = existing.completions[habitId] ?? false;
        return {
          ...prev,
          [dateStr]: {
            ...existing,
            completions: { ...existing.completions, [habitId]: !current },
          },
        };
      });
    },
    []
  );

  const setCompletion = useCallback(
    (dateStr: string, habitId: HabitId, done: boolean) => {
      setDays((prev) => {
        const existing = prev[dateStr] ?? { date: dateStr, modifier: "normal", completions: {} };
        return {
          ...prev,
          [dateStr]: {
            ...existing,
            completions: { ...existing.completions, [habitId]: done },
          },
        };
      });
    },
    []
  );

  return { days, getDay, setModifier, toggleCompletion, setCompletion };
}
