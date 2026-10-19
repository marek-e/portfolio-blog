export function StatusBadge() {
  return (
    <div className="glass flex items-center gap-2 rounded-full px-2.5 py-1">
      <span className="relative flex size-2">
        <span className="bg-pastel-mint absolute inset-0 rounded-full motion-safe:animate-ping" />
        <span className="relative size-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
      </span>
      <span className="text-foreground/80 font-mono text-[0.65rem] font-medium tracking-[0.14em] uppercase">
        Active
      </span>
    </div>
  );
}
