import { useState, useEffect } from 'react'
import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { webhookDetailsSchema } from '../http/schemas/webhooks'
import { WebhookDetailHeader } from './webhook-detail-header'
import { SectionTitle } from './section-title'
import { SectionDataTable } from './section-data-table'
import { CodeBlock } from './ui/code-block'
import { ScrollArea } from './ui/scroll-area'
import { useRouter, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Copy, Check, Loader2, Play, Pencil, Eye, Sparkles, Terminal, Globe, Code2, Share } from 'lucide-react'
import Editor from '@monaco-editor/react'

import { toast } from '../lib/toast'

interface WebhookDetailsProps {
  id: string
}

export function WebhookDetails({ id }: WebhookDetailsProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [isCopied, setIsCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [replayUrl, setReplayUrl] = useState("http://localhost:3333/capture")
  const [editableBody, setEditableBody] = useState("")

  const { data } = useSuspenseQuery({
    queryKey: ['webhook', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/api/webhooks/${id}`)
      if (!response.ok) throw new Error('Failed to fetch webhook details')
      const json = await response.json()
      const parsed = webhookDetailsSchema.safeParse(json)
      if (!parsed.success) throw new Error('Invalid webhook response format')
      return parsed.data
    },
  })

  useEffect(() => {
    if (data?.body) {
      setEditableBody(data.body)
    }
  }, [data])

  const { mutate: handleReplay, isPending: isReplaying } = useMutation({
    mutationFn: async () => {
      const cleanHeaders = { ...data.headers };
      delete cleanHeaders['content-type'];
      delete cleanHeaders['Content-Type'];
      delete cleanHeaders['content-length'];
      delete cleanHeaders['host'];

      const fullTargetUrl = `${replayUrl.replace(/\/$/, '')}${data.pathname}`;

      const response = await fetch(fullTargetUrl, {
        method: data.method,
        headers: {
          ...cleanHeaders,
          'Content-Type': 'application/json',
          'x-inspect-replay': 'true',
        },
        body: editableBody,
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);
      return await response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
      toast.success("Evento replicado e novo registro criado!")
      navigate({ to: '/webhooks/$id', params: { id: data.id } })
    },
    onError: (err: Error) => toast.danger(`Erro no Replay: ${err.message}`)
  });

  async function handleCopyBody() {
    if (!editableBody) return
    await navigator.clipboard.writeText(editableBody)
    setIsCopied(true)
    toast.success("Corpo copiado!")
    setTimeout(() => setIsCopied(false), 2000)
  }

  function handlePrettify() {
    try {
      const obj = JSON.parse(editableBody)
      const formatted = JSON.stringify(obj, null, 2)
      setEditableBody(formatted)
      toast.success("JSON formatado!")
    } catch (err) {
      toast.danger("JSON inválido para formatação.")
    }
  }

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

  const queryParams = Object.entries(data.queryParams || {}).map(([key, value]) => ({
    key,
    value: String(value),
  }))

  const getExportCommands = (data: any, targetUrl: string) => {
    const method = data.method.toUpperCase();
    const headers = {
      ...data.headers,
      'Content-Type': 'application/json',
      'x-inspect-replay': 'true'
    };

    // cURL
    const curlHeaders = Object.entries(headers)
      .map(([k, v]) => `-H "${k}: ${v}"`)
      .join(' ');
    const curl = `curl -X ${method} "${targetUrl}" ${curlHeaders} ${data.body ? `-d '${data.body}'` : ''}`;

    // Fetch
    const fetchCode = `fetch("${targetUrl}", {
      method: "${method}",
      headers: ${JSON.stringify(headers, null, 2)},
      body: ${data.body ? `JSON.stringify(${data.body})` : 'null'}
    });`;

    // Axios
    const axiosCode = `import axios from 'axios';

    axios({
      url: "${targetUrl}",
      method: "${method}",
      headers: ${JSON.stringify(headers, null, 2)},
      data: ${data.body || 'null'}
    });`;

    return { curl, fetchCode, axiosCode };
  };

  const { curl, fetchCode, axiosCode } = getExportCommands(data, `${replayUrl.replace(/\/$/, '')}${data.pathname}`);

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência!`);
  };

  return (
    <div className="relative flex h-full flex-col">
      <WebhookDetailHeader
        method={data.method}
        pathname={data.pathname}
        ip={data.ip}
        createdAt={data.createdAt}
      />

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-6 pb-24">
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

          {data.body !== null && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <SectionTitle>Request Body {isEditing && <span className="text-amber-500 text-xs ml-2">(Editando)</span>}</SectionTitle>

                <div className="flex items-center gap-2">

                  <div className="relative group">
                    <button className="flex items-center gap-2 rounded-md bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 border border-zinc-700 hover:bg-zinc-700 transition-colors">
                      <Share className="size-3.5" />
                      Exportar
                    </button>

                    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="w-48 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900 p-1 shadow-xl">
                        <button
                          onClick={() => copyToClipboard(curl, 'cURL')}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors rounded-sm"
                        >
                          <Terminal className="size-3.5" />
                          Copiar como cURL
                        </button>

                        <button
                          onClick={() => copyToClipboard(fetchCode, 'Fetch')}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors rounded-sm"
                        >
                          <Globe className="size-3.5" />
                          Copiar como Fetch
                        </button>

                        <button
                          onClick={() => copyToClipboard(axiosCode, 'Axios')}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors rounded-sm"
                        >
                          <Code2 className="size-3.5" />
                          Copiar como Axios
                        </button>
                      </div>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={replayUrl}
                    onChange={(e) => setReplayUrl(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-[11px] text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64 transition-all"
                    placeholder="URL de destino..."
                  />

                  {isEditing && (
                    <button
                      onClick={handlePrettify}
                      className="flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-500 border border-emerald-500/20 transition-all hover:bg-emerald-500/20 active:scale-95"
                      title="Formatar JSON"
                    >
                      <Sparkles className="size-3.5" />
                      Prettify
                    </button>
                  )}

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium border transition-all active:scale-95 ${isEditing
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                      }`}
                  >
                    {isEditing ? <Eye className="size-3.5" /> : <Pencil className="size-3.5" />}
                    {isEditing ? 'Visualizar' : 'Editar'}
                  </button>

                  <button
                    onClick={() => handleReplay()}
                    disabled={isReplaying}
                    className="flex items-center gap-2 rounded-md bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400 transition-all hover:bg-indigo-500/20 active:scale-95 border border-indigo-500/20 disabled:opacity-50"
                  >
                    {isReplaying ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5 fill-current" />}
                    {isReplaying ? 'Enviando...' : 'Replay'}
                  </button>

                  <button
                    onClick={handleCopyBody}
                    className="flex items-center gap-2 rounded-md bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
                  >
                    {isCopied ? <Check className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
                    {isCopied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              <div className="relative w-full rounded-mdoverflow-hidden">
                <div className="relative w-full rounded-md overflow-hidden min-h-[400px]">
                  {isEditing ? (
                    <Editor
                      height="400px"
                      defaultLanguage="json"
                      theme="vs-dark"
                      value={editableBody}
                      onChange={(value) => setEditableBody(value || "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        formatOnPaste: true,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 16, bottom: 16 },
                        backgroundColor: '#09090b'
                      }}
                    />
                  ) : (
                    <ScrollArea className="w-full h-[400px]">
                      <CodeBlock code={editableBody} />
                      <div className="min-w-max p-4">
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <button
        onClick={() => router.history.back()}
        className="group absolute bottom-6 left-6 flex items-center gap-2 rounded-xl bg-zinc-800/90 backdrop-blur-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 shadow-lg transition-all hover:bg-zinc-700"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        Voltar
      </button>
    </div>
  )
}