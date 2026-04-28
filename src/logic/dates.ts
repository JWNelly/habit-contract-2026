import {
  format,
  parseISO,
  getISOWeek,
  getISOWeekYear,
  startOfISOWeek,
  addDays,
  isWeekend,
  isWithinInterval,
  getDay,
} from "date-fns";

export function toDateStr(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function fromDateStr(str: string): Date {
  return parseISO(str);
}

export function isWeekday(date: Date): boolean {
  return !isWeekend(date);
}

export function getWeekKey(date: Date): string {
  const year = getISOWeekYear(date);
  const week = getISOWeek(date);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

export function getWeekBounds(weekKey: string): { start: string; end: string } {
  // Parse "2026-W18" into a date in that week, then get Mon/Sun
  const [yearStr, wStr] = weekKey.split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(wStr, 10);

  // Jan 4 is always in week 1
  const jan4 = new Date(year, 0, 4);
  const startOfWeek1 = startOfISOWeek(jan4);
  const weekStart = addDays(startOfWeek1, (week - 1) * 7);

  return {
    start: toDateStr(weekStart),
    end: toDateStr(addDays(weekStart, 6)),
  };
}

export function getDaysInWeek(weekKey: string): string[] {
  const { start } = getWeekBounds(weekKey);
  const startDate = fromDateStr(start);
  return Array.from({ length: 7 }, (_, i) => toDateStr(addDays(startDate, i)));
}

export function formatDisplayDate(dateStr: string): string {
  return format(parseISO(dateStr), "EEEE, MMMM d");
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), "MMM d");
}

export function formatDayOfWeek(dateStr: string): string {
  return format(parseISO(dateStr), "EEE");
}

export function formatDayNum(dateStr: string): string {
  return format(parseISO(dateStr), "d");
}

export function formatMonth(dateStr: string): string {
  return format(parseISO(dateStr), "MMMM yyyy");
}

export function isWithinContract(dateStr: string, start: string, end: string): boolean {
  try {
    return isWithinInterval(parseISO(dateStr), {
      start: parseISO(start),
      end: parseISO(end),
    });
  } catch {
    return false;
  }
}

export function getDayOfWeek(dateStr: string): number {
  // 0=Sun, 1=Mon, ..., 6=Sat
  return getDay(parseISO(dateStr));
}

export function getMonthDays(year: number, month: number): string[] {
  // Returns all days in a given month (month is 1-indexed)
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const days: string[] = [];
  let cur = first;
  while (cur <= last) {
    days.push(toDateStr(cur));
    cur = addDays(cur, 1);
  }
  return days;
}

export function today(): string {
  return toDateStr(new Date());
}

export function getContractMonths(start: string, end: string): Array<{ year: number; month: number }> {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  const months: Array<{ year: number; month: number }> = [];
  let cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  while (cur <= endDate) {
    months.push({ year: cur.getFullYear(), month: cur.getMonth() + 1 });
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }
  return months;
}
