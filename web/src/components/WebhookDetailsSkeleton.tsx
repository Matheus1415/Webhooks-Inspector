export function WebhookDetailsSkeleton() {
  return (
    <div className="flex h-full flex-col animate-pulse">
      <div className="border-b border-zinc-800 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="h-6 w-16 rounded-md bg-zinc-800" />
          <div className="h-6 w-64 rounded-md bg-zinc-800" />
        </div>

        <div className="mt-3 flex gap-6">
          <div className="h-4 w-24 rounded-md bg-zinc-800" />
          <div className="h-4 w-32 rounded-md bg-zinc-800" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-8 p-6">
          
          <SectionSkeleton rows={4} />

          <SectionSkeleton rows={6} />

          <SectionSkeleton rows={3} />

          <div className="space-y-4">
            <div className="h-5 w-40 rounded-md bg-zinc-800" />
            <div className="h-48 w-full rounded-xl bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <div className="h-5 w-36 rounded-md bg-zinc-800" />

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4"
          >
            <div className="h-4 w-32 rounded-md bg-zinc-800" />
            <div className="h-4 w-1/2 rounded-md bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
