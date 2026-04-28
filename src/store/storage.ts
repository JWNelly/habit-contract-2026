import type { DayRecord } from "../types";

const DAYS_KEY = "habit-contract:days";

export function loadDays(): Record<string, DayRecord> {
  try {
    const raw = localStorage.getItem(DAYS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, DayRecord>;
  } catch {
    return {};
  }
}

export function saveDays(days: Record<string, DayRecord>): void {
  try {
    localStorage.setItem(DAYS_KEY, JSON.stringify(days));
  } catch {
    // localStorage full or unavailable
  }
}
