import { useMemo, useState } from "react";
import type { DayRecord } from "../types";
import { calculateFines } from "../logic/fines";
import { HABIT_MAP } from "../constants/habits";
import { getWeekBounds, formatShortDate } from "../logic/dates";

interface Props {
  days: Record<string, DayRecord>;
  payments: number;
  outstanding: number;
  onRecordPayment: (amount: number) => void;
}

export function FineView({ days, payments, outstanding, onRecordPayment }: Props) {
  const report = useMemo(() => calculateFines(days), [days]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentInput, setPaymentInput] = useState("");

  const weekEntries = Object.entries(report.byWeek).sort(([a], [b]) => a.localeCompare(b));
  const habitEntries = Object.entries(report.byHabit)
    .sort(([, a], [, b]) => b - a)
    .filter(([, amt]) => amt > 0);

  function handleSubmitPayment() {
    const amount = parseFloat(paymentInput);
    if (!isNaN(amount) && amount > 0) {
      onRecordPayment(amount);
      setPaymentInput("");
      setShowPaymentForm(false);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-xl font-bold text-gray-900">Fines</h2>
        <p className="text-xs text-gray-500 mt-0.5">$1 per missed applicable habit</p>
      </div>

      {/* Outstanding balance */}
      <div className={`mx-4 rounded-2xl px-5 py-5 mb-3 ${outstanding === 0 ? "bg-green-50" : "bg-red-50"}`}>
        <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
        <p className={`text-4xl font-bold mt-1 ${outstanding === 0 ? "text-green-600" : "text-red-600"}`}>
          ${outstanding.toFixed(2)}
        </p>
        {outstanding === 0 && report.total === 0 && (
          <p className="text-sm text-green-600 mt-1">No fines accrued — keep it up! 🎉</p>
        )}
        {outstanding === 0 && report.total > 0 && (
          <p className="text-sm text-green-600 mt-1">All paid up! 🎉</p>
        )}
      </div>

      {/* Accrued vs paid summary */}
      {(report.total > 0 || payments > 0) && (
        <div className="mx-4 bg-white rounded-2xl shadow-sm overflow-hidden mb-3">
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm text-gray-600">Total fines accrued</p>
              <p className="text-sm font-semibold text-red-600">${report.total.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm text-gray-600">Total paid to Billy</p>
              <p className="text-sm font-semibold text-green-600">−${payments.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Record payment button / form */}
      {report.total > 0 && (
        <div className="mx-4 mb-4">
          {!showPaymentForm ? (
            <button
              onClick={() => setShowPaymentForm(true)}
              className="w-full py-3 rounded-2xl bg-indigo-600 text-white text-sm font-semibold active:bg-indigo-700 transition-colors"
            >
              Record a Payment to Billy
            </button>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-900">Record Payment</p>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-lg">$</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={paymentInput}
                  onChange={(e) => setPaymentInput(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowPaymentForm(false); setPaymentInput(""); }}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPayment}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {report.total > 0 && (
        <>
          {/* By habit breakdown */}
          <div className="bg-white rounded-2xl mx-4 shadow-sm overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900">By Habit</p>
            </div>
            <div className="divide-y divide-gray-100">
              {habitEntries.map(([habitId, amt]) => {
                const habit = HABIT_MAP[habitId];
                return (
                  <div key={habitId} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{habit?.label ?? habitId}</p>
                      <p className="text-xs text-gray-500">{habit?.frequency}</p>
                    </div>
                    <p className="text-sm font-semibold text-red-600">${amt}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By week breakdown */}
          {weekEntries.length > 0 && (
            <div className="bg-white rounded-2xl mx-4 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">By Week</p>
              </div>
              <div className="divide-y divide-gray-100">
                {weekEntries.map(([weekKey, amt]) => {
                  const { start, end } = getWeekBounds(weekKey);
                  return (
                    <div key={weekKey} className="flex items-center justify-between px-4 py-3">
                      <p className="text-sm font-medium text-gray-800">
                        {formatShortDate(start)} – {formatShortDate(end)}
                      </p>
                      <p className="text-sm font-semibold text-red-600">${amt}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
