import { useState, useEffect } from "react";
import { today } from "../logic/dates";

export function useToday(): string {
  const [dateStr, setDateStr] = useState(() => today());

  useEffect(() => {
    function scheduleNextTick() {
      const now = new Date();
      const msUntilMidnight =
        new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
      return setTimeout(() => {
        setDateStr(today());
        scheduleNextTick();
      }, msUntilMidnight);
    }
    const t = scheduleNextTick();
    return () => clearTimeout(t);
  }, []);

  return dateStr;
}
