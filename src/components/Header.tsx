import { FineBadge } from "./FineBadge";

interface Props {
  fineTotal: number;
  synced: boolean;
  onSignOut: () => void;
}

export function Header({ fineTotal, synced, onSignOut }: Props) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div>
        <h1 className="text-lg font-bold text-gray-900 leading-tight">Habit Contract</h1>
        <p className="text-xs text-gray-400">Apr 28 – Jul 31, 2026</p>
      </div>
      <div className="flex items-center gap-2">
        {!synced && (
          <span className="text-xs text-gray-400">syncing…</span>
        )}
        <FineBadge amount={fineTotal} />
        <button
          onClick={onSignOut}
          className="text-xs text-gray-400 active:text-gray-600 px-1 py-1"
          title="Sign out"
        >
          ⎋
        </button>
      </div>
    </header>
  );
}
