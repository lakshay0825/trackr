export function DemoLoading({ label = 'Loading…' }) {
  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 animate-pulse rounded-full bg-zinc-400"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  )
}
