import type { HabitDefinition } from "../types";

export const CONTRACT_START = "2026-04-28";
export const CONTRACT_END = "2026-07-31";

export const FINE_RATE = 1; // $1 per missed habit

export const HABITS: HabitDefinition[] = [
  {
    id: "guitar-practice",
    label: "Guitar Practice",
    shortLabel: "Guitar",
    frequency: "daily",
    isAsterisk: false,
    description: "20 minutes of guitar routine exercises",
  },
  {
    id: "wake-up",
    label: "Wake-Up Habit",
    shortLabel: "Wake-up",
    frequency: "daily",
    isAsterisk: false,
    description: "Out of bed within 10 min of alarm; don't return for 1 hour",
  },
  {
    id: "french",
    label: "French Practice",
    shortLabel: "French",
    frequency: "daily",
    isAsterisk: false,
    description: "Babbel, French media, or a French conversation",
  },
  {
    id: "physics-study",
    label: "Physics Study",
    shortLabel: "Physics",
    frequency: "weekday",
    isAsterisk: false,
    description: "2 hrs: 1hr textbooks/notes + 1hr research/papers/Qiskit (30 min on travel days)",
  },
  {
    id: "run-bike",
    label: "Run / Bike Ride",
    shortLabel: "Run/Bike",
    frequency: "weekly",
    isAsterisk: false,
    isFitnessComponent: true,
    description: "At least one run or bike ride this week",
  },
  {
    id: "climbing",
    label: "Climbing Session",
    shortLabel: "Climbing",
    frequency: "weekly",
    isAsterisk: false,
    isFitnessComponent: true,
    description: "At least one climbing session this week",
  },
  {
    id: "gym",
    label: "Gym Session",
    shortLabel: "Gym",
    frequency: "weekly",
    isAsterisk: false,
    isFitnessComponent: true,
    description: "At least one gym session this week",
  },
  {
    id: "travel-workout",
    label: "Travel Workout",
    shortLabel: "Travel WO",
    frequency: "weekly",
    isAsterisk: false,
    isFitnessComponent: true,
    description: "100 pushups, 100 squats, Climber Core Workout, 20 pullups (if available)",
  },
  {
    id: "guitar-recording",
    label: "Guitar Recording",
    shortLabel: "Recording",
    frequency: "weekly",
    isAsterisk: true,
    description: "Record yourself playing and send to someone or post publicly (public performance counts)",
  },
  {
    id: "cooking",
    label: "Cooking Challenge",
    shortLabel: "Cooking",
    frequency: "weekly",
    isAsterisk: true,
    description: "Cook a meal you haven't cooked before, or cook for at least 2 people",
  },
];

export const HABIT_MAP: Record<string, HabitDefinition> = Object.fromEntries(
  HABITS.map((h) => [h.id, h])
);

export const FITNESS_HABIT_IDS = ["run-bike", "climbing", "gym"] as const;

export const MODIFIER_LABELS: Record<string, string> = {
  normal: "Normal",
  travel: "Travel",
  illness: "Illness / Injury",
  vacation: "Vacation",
  holiday: "Holiday",
  emergency: "Emergency",
};
