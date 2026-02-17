import { createFileRoute } from '@tanstack/react-router'
import { WebhookIcon } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="relative flex h-full items-center justify-center bg-zinc-900">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center gap-5 backdrop-blur-sm p-10 text-center">
          
          <div className="flex size-14 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <WebhookIcon className="size-6" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-zinc-100 tracking-tight">
              No webhook selected
            </h3>

            <p className="max-w-sm text-sm text-zinc-400 leading-relaxed">
              Select a webhook from the list to inspect headers, payload and
              request metadata.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
