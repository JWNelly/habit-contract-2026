import type { DayRecord, HabitId } from "../types";
import { getWeekFitnessCompletions, deriveWeekSummary } from "../logic/weekly";

interface Props {
  weekKey: string;
  days: Record<string, DayRecord>;
  onToggle: (dateStr: string, habitId: HabitId) => void;
  selectedDate: string;
}

interface FitnessItem {
  id: HabitId;
  label: string;
  icon: string;
  description: string;
}

const INDIVIDUAL: FitnessItem[] = [
  { id: "run-bike", label: "Run / Bike", icon: "🏃", description: "At least one run or bike ride" },
  { id: "climbing", label: "Climbing", icon: "🧗", description: "At least one climbing session" },
  { id: "gym", label: "Gym", icon: "💪", description: "At least one gym session" },
];

const TRAVEL_WORKOUT: FitnessItem = {
  id: "travel-workout",
  label: "Travel Workout",
  icon: "✈️",
  description: "100 pushups • 100 squats • Climber Core • 20 pullups (if available)",
};

const MISC_WORKOUT: FitnessItem = {
  id: "misc-workout",
  label: "Misc Workout",
  icon: "🏋️",
  description: "Any additional workout — no fine, just for tracking",
};

export function FitnessTracker({ weekKey, days, onToggle, selectedDate }: Props) {
  const summary = deriveWeekSummary(weekKey, days);
  const completed = getWeekFitnessCompletions(weekKey, days);

  const illnessWaivers = summary.fitnessWaiversFromIllness;
  let waiversLeft = illnessWaivers;

  function renderItem(item: FitnessItem, waived = false, doneOverride?: boolean) {
    const done = doneOverride ?? completed.has(item.id);
    return (
      <button
        key={item.id}
        onClick={() => !waived && onToggle(selectedDate, item.id)}
        disabled={waived}
        className={`w-full flex items-center gap-3 py-3 px-4 text-left transition-colors ${
          waived ? "opacity-50" : "active:bg-gray-50"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 transition-colors ${
            done ? "bg-green-100" : waived ? "bg-gray-100" : "bg-gray-100"
          }`}
        >
          {done ? "✅" : item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${done ? "text-gray-400 line-through" : waived ? "text-gray-400" : "text-gray-900"}`}>
            {item.label}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
          {waived && <p className="text-xs text-yellow-600 mt-0.5">Waived — illness</p>}
        </div>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl mx-4 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Weekly Fitness</p>
        {illnessWaivers > 0 && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
            {illnessWaivers} waiver{illnessWaivers > 1 ? "s" : ""} from illness
          </span>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {summary.hasTravelDay && (
          <div className="px-4 py-2 bg-blue-50">
            <p className="text-xs text-blue-700">
              Travel week: complete the travel workout OR each individual session.
            </p>
          </div>
        )}

        {summary.hasTravelDay && renderItem(TRAVEL_WORKOUT)}

        {INDIVIDUAL.map((item) => {
          const done = completed.has(item.id);
          let isWaived = false;
          if (!done && waiversLeft > 0) {
            isWaived = true;
            waiversLeft--;
          }
          return renderItem(item, isWaived);
        })}

        {renderItem(MISC_WORKOUT, false, days[selectedDate]?.completions["misc-workout"] ?? false)}
      </div>
    </div>
  );
}
