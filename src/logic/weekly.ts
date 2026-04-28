import type { DayRecord, WeekSummary, HabitId } from "../types";
import { getDaysInWeek, getWeekBounds, fromDateStr, getWeekKey } from "./dates";
import { isWaiverEligible } from "./applicability";

export function deriveWeekSummary(
  weekKey: string,
  days: Record<string, DayRecord>
): WeekSummary {
  const weekDays = getDaysInWeek(weekKey);
  const { start, end } = getWeekBounds(weekKey);

  let illnessDayCount = 0;
  let asteriskWaiverCount = 0;
  let hasTravelDay = false;

  for (const d of weekDays) {
    const rec = days[d];
    if (!rec) continue;
    const mod = rec.modifier;
    if (mod === "illness") illnessDayCount++;
    if (mod === "travel") hasTravelDay = true;
    if (isWaiverEligible(mod)) asteriskWaiverCount++;
  }

  return {
    weekKey,
    startDate: start,
    endDate: end,
    asteriskWaiverActive: asteriskWaiverCount >= 3,
    illnessDayCount,
    fitnessWaiversFromIllness: illnessDayCount,
    hasTravelDay,
  };
}

// Returns which fitness habits were completed this week across all days
export function getWeekFitnessCompletions(
  weekKey: string,
  days: Record<string, DayRecord>
): Set<HabitId> {
  const weekDays = getDaysInWeek(weekKey);
  const completed = new Set<HabitId>();
  for (const d of weekDays) {
    const rec = days[d];
    if (!rec) continue;
    const fitnessIds: HabitId[] = ["run-bike", "climbing", "gym", "travel-workout"];
    for (const id of fitnessIds) {
      if (rec.completions[id]) completed.add(id);
    }
  }
  return completed;
}

// Returns whether a weekly non-fitness habit is completed this week
export function isWeeklyHabitComplete(
  habitId: HabitId,
  weekKey: string,
  days: Record<string, DayRecord>
): boolean {
  const weekDays = getDaysInWeek(weekKey);
  return weekDays.some((d) => days[d]?.completions[habitId] === true);
}

// Returns the missed weekly habits for a week (used for fine calculation)
// Only called for completed weeks (Sunday has passed)
export function getMissedWeeklyHabits(
  weekKey: string,
  days: Record<string, DayRecord>
): HabitId[] {
  const summary = deriveWeekSummary(weekKey, days);
  const missed: HabitId[] = [];
  const fitnessCompleted = getWeekFitnessCompletions(weekKey, days);

  // Check if the entire week is fully waived
  const weekDays = getDaysInWeek(weekKey);
  const allWaived = weekDays.every((d) => {
    const rec = days[d];
    return !rec || isWaiverEligible(rec.modifier);
  });

  if (allWaived) return [];

  if (summary.hasTravelDay && !fitnessCompleted.has("travel-workout")) {
    // On travel weeks, travel-workout substitutes all 3
    // But if they did the individual ones, that's fine too
    const indivDone =
      fitnessCompleted.has("run-bike") &&
      fitnessCompleted.has("climbing") &&
      fitnessCompleted.has("gym");
    if (!indivDone) {
      // Count how many fitness components are missing vs. waived from illness
      let requiredFitness = 3;
      requiredFitness = Math.max(0, requiredFitness - summary.fitnessWaiversFromIllness);
      const doneCount = [
        fitnessCompleted.has("run-bike"),
        fitnessCompleted.has("climbing"),
        fitnessCompleted.has("gym"),
        fitnessCompleted.has("travel-workout"),
      ].filter(Boolean).length;

      // travel-workout counts as all 3
      if (fitnessCompleted.has("travel-workout")) {
        // satisfied
      } else if (doneCount < requiredFitness) {
        // Each missing fitness component is a fine
        if (!fitnessCompleted.has("run-bike")) missed.push("run-bike");
        if (!fitnessCompleted.has("climbing")) missed.push("climbing");
        if (!fitnessCompleted.has("gym")) missed.push("gym");
      }
    }
  } else {
    // Non-travel week: need all 3 minus illness waivers
    const needed: HabitId[] = ["run-bike", "climbing", "gym"];
    let waivers = summary.fitnessWaiversFromIllness;
    for (const id of needed) {
      if (!fitnessCompleted.has(id)) {
        if (waivers > 0) {
          waivers--;
        } else {
          missed.push(id);
        }
      }
    }
  }

  // Guitar recording (asterisk)
  if (!summary.asteriskWaiverActive && !isWeeklyHabitComplete("guitar-recording", weekKey, days)) {
    missed.push("guitar-recording");
  }

  // Cooking (asterisk)
  if (!summary.asteriskWaiverActive && !isWeeklyHabitComplete("cooking", weekKey, days)) {
    missed.push("cooking");
  }

  return missed;
}

// Returns all ISO weeks between two dates
export function getWeeksInRange(startDate: string, endDate: string): string[] {
  const start = fromDateStr(startDate);
  const end = fromDateStr(endDate);
  const weeks: string[] = [];
  const seen = new Set<string>();
  let cur = new Date(start);
  while (cur <= end) {
    const wk = getWeekKey(cur);
    if (!seen.has(wk)) {
      seen.add(wk);
      weeks.push(wk);
    }
    cur = new Date(cur.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
  return weeks;
}
