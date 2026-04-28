import { useMemo } from "react";
import { getWeekKey, getWeekBounds, fromDateStr } from "../logic/dates";

export function useWeek(dateStr: string) {
  return useMemo(() => {
    const date = fromDateStr(dateStr);
    const weekKey = getWeekKey(date);
    const { start, end } = getWeekBounds(weekKey);
    return { weekKey, start, end };
  }, [dateStr]);
}
