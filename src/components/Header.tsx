import { FineBadge } from "./FineBadge";

interface Props {
  fineTotal: number;
}

export function Header({ fineTotal }: Props) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div>
        <h1 className="text-lg font-bold text-gray-900 leading-tight">Habit Contract</h1>
        <p className="text-xs text-gray-400">Apr 28 – Jul 31, 2026</p>
      </div>
      <FineBadge amount={fineTotal} />
    </header>
  );
}
