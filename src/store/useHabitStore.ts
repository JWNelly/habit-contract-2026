import { useState, useCallback, useEffect, useRef } from "react";
import type { DayRecord, DayModifier, HabitId } from "../types";
import { loadDays, saveDays } from "./storage";
import { fetchAllDays, upsertDay } from "../lib/sync";

export function useHabitStore(userId: string | null) {
  const [days, setDays] = useState<Record<string, DayRecord>>(() => loadDays());
  const [synced, setSynced] = useState(false);
  const userIdRef = useRef(userId);
  userIdRef.current = userId;

  // On login, fetch from Supabase and replace local state
  useEffect(() => {
    if (!userId) return;
    setSynced(false);
    fetchAllDays(userId).then((remote) => {
      setDays((local) => {
        // Merge: remote wins for any date it has; keep local-only dates
        const merged = { ...local, ...remote };
        saveDays(merged);
        return merged;
      });
      setSynced(true);
    });
  }, [userId]);

  // Persist to localStorage on every change
  useEffect(() => {
    saveDays(days);
  }, [days]);

  const getDay = useCallback(
    (dateStr: string): DayRecord =>
      days[dateStr] ?? { date: dateStr, modifier: "normal", completions: {} },
    [days]
  );

  const setModifier = useCallback((dateStr: string, modifier: DayModifier, note?: string) => {
    setDays((prev) => {
      const existing = prev[dateStr] ?? { date: dateStr, modifier: "normal", completions: {} };
      const updated = { ...existing, modifier, modifierNote: note };
      const next = { ...prev, [dateStr]: updated };
      if (userIdRef.current) upsertDay(userIdRef.current, updated);
      return next;
    });
  }, []);

  const toggleCompletion = useCallback((dateStr: string, habitId: HabitId) => {
    setDays((prev) => {
      const existing = prev[dateStr] ?? { date: dateStr, modifier: "normal", completions: {} };
      const updated = {
        ...existing,
        completions: { ...existing.completions, [habitId]: !existing.completions[habitId] },
      };
      const next = { ...prev, [dateStr]: updated };
      if (userIdRef.current) upsertDay(userIdRef.current, updated);
      return next;
    });
  }, []);

  const setCompletion = useCallback((dateStr: string, habitId: HabitId, done: boolean) => {
    setDays((prev) => {
      const existing = prev[dateStr] ?? { date: dateStr, modifier: "normal", completions: {} };
      const updated = {
        ...existing,
        completions: { ...existing.completions, [habitId]: done },
      };
      const next = { ...prev, [dateStr]: updated };
      if (userIdRef.current) upsertDay(userIdRef.current, updated);
      return next;
    });
  }, []);

  return { days, synced, getDay, setModifier, toggleCompletion, setCompletion };
}
