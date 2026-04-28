import type { DayRecord, DayModifier, ApplicableHabit, HabitId } from "../types";
import { fromDateStr } from "./dates";
import { isWeekend } from "date-fns";

// Modifiers that fully waive fines (not just travel modifications)
export function isWaiverEligible(modifier: DayModifier): boolean {
  return ["illness", "vacation", "holiday", "emergency"].includes(modifier);
}

// Returns per-day applicable habits for daily/weekday habits only.
// Weekly habits (fitness, guitar-recording, cooking) are handled at week level.
export function getDailyApplicableHabits(
  dateStr: string,
  record: DayRecord
): ApplicableHabit[] {
  const date = fromDateStr(dateStr);
  const mod = record.modifier;
  const waiverDay = isWaiverEligible(mod);
  const isWeekdayDate = !isWeekend(date);
  const isTravel = mod === "travel";

  const results: ApplicableHabit[] = [];

  // Guitar practice: daily, waived on waiver days AND travel
  results.push({
    id: "guitar-practice",
    applies: true,
    waived: waiverDay || isTravel,
  });

  // Wake-up: daily, waived on waiver days AND travel
  results.push({
    id: "wake-up",
    applies: true,
    waived: waiverDay || isTravel,
  });

  // French: daily, NEVER waived for travel, waived for other waiver modifiers
  results.push({
    id: "french",
    applies: true,
    waived: waiverDay && !isTravel,
    note: isTravel ? "Not waived during travel" : undefined,
  });

  // Physics study: weekdays only, waived on waiver days
  // Travel: reduced to 30 min (noted in UI, same checkbox)
  results.push({
    id: "physics-study",
    applies: isWeekdayDate,
    waived: isWeekdayDate && waiverDay,
    travelMode: isWeekdayDate && isTravel,
    note: isWeekdayDate && isTravel ? "30 min required (travel)" : undefined,
  });

  return results.filter((h) => h.applies);
}

// Returns the set of habit IDs that are missed (applies + not completed + not waived)
// for daily habits on a given day
export function getMissedDailyHabits(
  dateStr: string,
  record: DayRecord
): HabitId[] {
  const applicable = getDailyApplicableHabits(dateStr, record);
  return applicable
    .filter((h) => !h.waived && !record.completions[h.id])
    .map((h) => h.id);
}
