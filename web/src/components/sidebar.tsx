import { CopyIcon } from 'lucide-react'
import { IconButton } from './ui/icon-button'
import { WebhooksList } from './webhooks-list'
import { Suspense } from 'react'
import { ScrollArea } from './ui/scroll-area'


export function Sidebar() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-5">
        <div className="flex items-baseline">
          <span className="font-semibold text-zinc-100">webhook</span>
          <span className="font-normal text-zinc-400">.inspect</span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-zinc-700 bg-zinc-800 px-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-1 text-xs font-mono text-zinc-300">
          <span className="truncate">
            http://localhost:3333/api/capture
          </span>
        </div>
        <IconButton icon={<CopyIcon className="size-4" />} />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          <Suspense fallback={<p className="p-4 text-sm text-zinc-400">Carregando...</p>}>
            <WebhooksList />
          </Suspense>
        </div>
      </ScrollArea>
    </div>
  )
}
