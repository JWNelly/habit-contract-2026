import { supabase } from "./supabase";
import type { DayRecord } from "../types";

export async function fetchAllDays(userId: string): Promise<Record<string, DayRecord>> {
  const { data, error } = await supabase
    .from("day_records")
    .select("date, modifier, modifier_note, completions")
    .eq("user_id", userId);

  if (error || !data) return {};

  const result: Record<string, DayRecord> = {};
  for (const row of data) {
    result[row.date] = {
      date: row.date,
      modifier: row.modifier,
      modifierNote: row.modifier_note ?? undefined,
      completions: row.completions ?? {},
    };
  }
  return result;
}

export async function upsertDay(userId: string, record: DayRecord): Promise<void> {
  await supabase.from("day_records").upsert({
    user_id: userId,
    date: record.date,
    modifier: record.modifier,
    modifier_note: record.modifierNote ?? null,
    completions: record.completions,
    updated_at: new Date().toISOString(),
  });
}

export async function fetchPayments(userId: string): Promise<number> {
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("user_id", userId)
    .eq("key", "payments")
    .single();

  return (data?.value as number) ?? 0;
}

export async function upsertPayments(userId: string, amount: number): Promise<void> {
  await supabase.from("settings").upsert({
    user_id: userId,
    key: "payments",
    value: amount,
  });
}
