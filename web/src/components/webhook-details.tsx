import { useSuspenseQuery } from '@tanstack/react-query'
import { webhookDetailsSchema } from '../http/schemas/webhooks'
import { WebhookDetailHeader } from './webhook-detail-header'
import { SectionTitle } from './section-title'
import { SectionDataTable } from './section-data-table'
import { CodeBlock } from './ui/code-block'
import { ScrollArea } from './ui/scroll-area'
import { useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

interface WebhookDetailsProps {
  id: string
}

export function WebhookDetails({ id }: WebhookDetailsProps) {
  const router = useRouter()

  const { data } = useSuspenseQuery({
    queryKey: ['webhook', id],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3333/api/webhooks/${id}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch webhook details')
      }

      const json = await response.json()

      const parsed = webhookDetailsSchema.safeParse(json)

      if (!parsed.success) {
        console.log(parsed.error)
        throw new Error('Invalid webhook response format')
      }

      return parsed.data
    },
  })

  const overviewData = [
    { key: 'Method', value: data.method },
    { key: 'Status Code', value: data.statusCode ? String(data.statusCode) : '—' },
    { key: 'Content-Type', value: data.contentType || 'application/json' },
    { key: 'Content-Length', value: `${data.contentLength || 0} bytes` },
  ]

  const headers = Object.entries(data.headers).map(([key, value]) => ({
    key,
    value: String(value),
  }))

  const queryParams = Object.entries(data.queryParams || {}).map(
    ([key, value]) => ({
      key,
      value: String(value),
    }),
  )

  return (
    <div className="relative flex h-full flex-col">
      <WebhookDetailHeader
        method={data.method}
        pathname={data.pathname}
        ip={data.ip}
        createdAt={data.createdAt}
      />

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <SectionTitle>Request Overview</SectionTitle>
            <SectionDataTable data={overviewData} />
          </div>

          <div className="space-y-4">
            <SectionTitle>Headers</SectionTitle>
            <SectionDataTable data={headers} />
          </div>

          {queryParams.length > 0 && (
            <div className="space-y-4">
              <SectionTitle>Query Parameters</SectionTitle>
              <SectionDataTable data={queryParams} />
            </div>
          )}

          {!!data.body && (
            <div className="space-y-4">
              <SectionTitle>Request Body</SectionTitle>
              <CodeBlock code={data.body} />
            </div>
          )}
        </div>
      </ScrollArea>

      <button
        onClick={() => router.history.back()}
        className="
          group
          absolute bottom-6 left-6
          flex items-center gap-2
          rounded-xl
          bg-zinc-600/80
          backdrop-blur-md
          border border-zinc-700
          px-4 py-2
          text-sm text-zinc-300
          shadow-lg
          transition-all
          duration-300
          hover:bg-zinc-700
          hover:text-white
          hover:shadow-xl
          active:scale-95
        "
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        Voltar
      </button>
    </div>
  )
}
