import { Check, Copy, Download, Loader2, Wand2, X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { webhookListSchema } from '../http/schemas/webhooks'
import { WebhooksListItem } from './webhooks-list-item'
import {
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { CodeBlock } from './ui/code-block'
import { toast } from '../lib/toast'
import { ScrollArea } from './ui/scroll-area'
import { Scrollbar } from '@radix-ui/react-scroll-area'

export function WebhooksList() {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver>(null)

  const [checkedWebhooksIds, setCheckedWebhooksIds] = useState<string[]>([])
  const [generatedHandlerCode, setGeneratedHandlerCode] = useState<string | null>()
  const [copied, setCopied] = useState(false)

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['webhooks'],
      queryFn: async ({ pageParam }) => {
        const url = new URL('http://localhost:3333/api/webhooks')

        if (pageParam) {
          url.searchParams.set('cursor', pageParam)
        }

        const response = await fetch(url)
        const data = await response.json()

        return webhookListSchema.parse(data)
      },
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ?? undefined
      },
      initialPageParam: undefined as string | undefined,
    })

  const webhooks = data.pages.flatMap((page) => page.webhooks)

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        threshold: 0.1,
      },
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  function handleCheckWebhook(checkedWebhookId: string) {
    if (checkedWebhooksIds.includes(checkedWebhookId)) {
      setCheckedWebhooksIds(state => {
        return state.filter(webhookId => webhookId !== checkedWebhookId)
      })
    } else {
      setCheckedWebhooksIds(state => [...state, checkedWebhookId])
    }
  }

  async function handleGenerateHandler() {
    const response = await fetch('http://localhost:3333/api/generate', {
      method: 'POST',
      body: JSON.stringify({ webhookIds: checkedWebhooksIds }),
      headers: {
        'Content-Type': 'application/json'
      },
    })

    type GenerateResponse = { code: string }

    const data: GenerateResponse = await response.json()

    setGeneratedHandlerCode(data.code)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedHandlerCode || "")
    setCopied(true)
    toast.success("Código copiado para a área de transferência!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([generatedHandlerCode || ""], { type: "text/typescript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "webhook-handler.ts"
    a.click()
    URL.revokeObjectURL(url)
  }

  const hasAnyWebhookChecked = checkedWebhooksIds.length > 0

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          <button
            disabled={!hasAnyWebhookChecked}
            className="bg-indigo-400 mb-3 text-white w-full rounded-lg flex items-center justify-center gap-3 font-medium text-sm py-2 disabled:opacity-50"
            onClick={() => handleGenerateHandler()}
          >
            <Wand2 className="size-4" />
            Gerar handler
          </button>

          {webhooks.map((webhook) => {
            return (
              <WebhooksListItem
                key={webhook.id}
                webhook={webhook}
                onWebhookChecked={handleCheckWebhook}
                isWebhookChecked={checkedWebhooksIds.includes(webhook.id)}
              />
            )
          })}
        </div>

        {hasNextPage && (
          <div className="p-2" ref={loadMoreRef}>
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="size-5 animate-spin text-zinc-500" />
              </div>
            )}
          </div>
        )}
      </div>

      {!!generatedHandlerCode && (
        <Dialog.Root open onOpenChange={() => setGeneratedHandlerCode(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/60 inset-0 fixed z-50 animate-in fade-in" />

            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 outline-none">
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
                  <div className="flex flex-col">
                    <Dialog.Title className="text-sm font-semibold text-zinc-100">
                      Handler Gerado
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-zinc-500">
                      Copie ou baixe o código para integrar no seu projeto.
                    </Dialog.Description>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors flex items-center gap-2 text-xs font-medium"
                      title="Copiar código"
                    >
                      {copied ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
                      {copied ? "Copiado!" : "Copiar"}
                    </button>

                    <button
                      onClick={handleDownload}
                      className="p-2 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors"
                      title="Baixar .ts"
                    >
                      <Download className="size-4" />
                    </button>

                    <Dialog.Close className="p-2 rounded-md hover:bg-zinc-800 text-zinc-500 transition-colors">
                      <X className="size-4" />
                    </Dialog.Close>
                  </div>
                </div>

                <div className='bg-zinc-950 rounded-md border border-zinc-800'>
                  <ScrollArea className="h-[60vh] w-full ">
                    <div className="min-w-full w-max p-4">
                      <CodeBlock language="typescript" code={generatedHandlerCode} />
                      <Scrollbar orientation="horizontal" />
                    </div>
                  </ScrollArea>
                </div>

                <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                    TypeScript AI Generated
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {generatedHandlerCode.split('\n').length} linhas
                  </span>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </>
  )
}
