export function StatusBadge() {
  return (
    <div className="border-primary/30 bg-card absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full border-2 px-3 py-1.5 shadow-sm">
      <div className="relative">
        <div className="size-2 animate-pulse rounded-full bg-green-500" />
      </div>
      <span className="text-primary text-xs font-bold tracking-wider uppercase">ACTIVE</span>
    </div>
  );
}
