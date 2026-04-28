export type HabitId =
  | "guitar-practice"
  | "wake-up"
  | "french"
  | "run-bike"
  | "climbing"
  | "gym"
  | "travel-workout"
  | "guitar-recording"
  | "cooking"
  | "physics-study";

export type HabitFrequency = "daily" | "weekly" | "weekday";

export interface HabitDefinition {
  id: HabitId;
  label: string;
  shortLabel: string;
  frequency: HabitFrequency;
  isAsterisk: boolean;
  description: string;
  isFitnessComponent?: boolean;
}

export type DayModifier =
  | "normal"
  | "travel"
  | "illness"
  | "vacation"
  | "holiday"
  | "emergency";

export interface DayRecord {
  date: string; // "YYYY-MM-DD"
  modifier: DayModifier;
  modifierNote?: string;
  completions: Partial<Record<HabitId, boolean>>;
}

export interface ApplicableHabit {
  id: HabitId;
  applies: boolean;
  waived: boolean;
  travelMode?: boolean; // physics: 30min instead of 2hr
  note?: string;
}

export interface WeekSummary {
  weekKey: string; // "2026-W18"
  startDate: string; // "YYYY-MM-DD" Monday
  endDate: string; // "YYYY-MM-DD" Sunday
  asteriskWaiverActive: boolean;
  illnessDayCount: number;
  fitnessWaiversFromIllness: number;
  hasTravelDay: boolean;
}

export type TabId = "today" | "week" | "history" | "fines";
