interface Props {
  amount: number;
}

export function FineBadge({ amount }: Props) {
  if (amount === 0) return null;
  return (
    <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
      ${amount} owed
    </span>
  );
}
