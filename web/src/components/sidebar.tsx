import { CopyIcon } from "lucide-react"
import { IconButton } from "./ui/icon-button"
import { WebhooksList } from "./webhooks-list"
import { Suspense, useEffect, useState } from "react"
import { ScrollArea } from "./ui/scroll-area"
import { toast } from "../lib/toast"
import { useNavigate } from "@tanstack/react-router"

const WEBHOOK_URL = "https://4469-177-37-185-51.ngrok-free.app/capture"

export function Sidebar() {
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()
  const [isPressed, setIsPressed] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(WEBHOOK_URL)

      setCopied(true)
      toast.success("URL copiada para a área de transferência")

      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      toast.danger("Não foi possível copiar a URL")
    }
  }

  function handleClick() {
    setIsPressed(true)

    setTimeout(() => {
      navigate({ to: "/" })
    }, 120)
  }

  const [loadingStep, setLoadingStep] = useState(0);
  const messages = [
    "Iniciando motor de análise neural...",
    "Escaneando estruturas de payloads capturados...",
    "Extraindo metadados dos headers HTTP...",
    "Cruzando inconsistências entre múltiplos eventos...",
    "Identificando tipos primitivos e objetos aninhados...",
    "Detectando padrões de Enums e Union Types...",
    "Mapeando campos opcionais vs obrigatórios...",
    "Construindo definições de Schema Zod...", 
    "Injetando tipagem estática TypeScript...",
    "Aplicando regras de transformação de dados...", 
    "Refinando sintaxe e indentação do código...", 
    "Finalizando contrato de dados agnóstico...",
    "Preparando saída no editor..."
  ];

  useEffect(() => {
    if (isGenerating) {
      setLoadingStep(0);
      const interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev === messages.length - 1) return prev;
          return prev + 1;
        });
      }, 2600);

      return () => clearInterval(interval);
    }
  }, [isGenerating, messages.length]);

  return (
    <div className="flex h-screen flex-col">
      <div className="px-2 py-4">
        <button
          onClick={handleClick}
          className={`
          group flex items-baseline transition-all duration-200
          hover:opacity-80 active:scale-95
          ${isPressed ? "scale-95 opacity-70" : ""}
        `}
        >
          <span className="font-semibold text-zinc-100 transition-colors duration-200 group-hover:text-emerald-400">
            webhook
          </span>
          <span className="font-normal text-zinc-400 transition-colors duration-200 group-hover:text-zinc-300">
            .inspect
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-center bg-zinc-800/80 rounded-2xl gap-1 p-2 text-xs font-mono text-zinc-300">
          <span className="truncate">{WEBHOOK_URL}</span>
        </div>

        <IconButton
          onClick={handleCopy}
          className={`
            transition-all duration-200
            ${copied ? "bg-emerald-600/20 text-emerald-400" : ""}
          `}
          icon={
            <CopyIcon
              className={`size-4 transition-transform ${copied ? "scale-110" : ""
                }`}
            />
          }
        />
      </div>

      {isGenerating && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-md">
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />
            <div className="relative flex size-20 items-center justify-center rounded-full border border-indigo-500/30 bg-zinc-900 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              <div className="size-12 rounded-full border-t-2 border-indigo-500 animate-spin" />
              <div className="absolute size-2 bg-indigo-500 rounded-full animate-ping" />
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-indigo-500 animate-bounce" />
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">IA Processing</span>
            </div>

            <div className="h-6 overflow-hidden">
              <p key={loadingStep} className="text-sm font-mono text-zinc-300 animate-in slide-in-from-bottom-2 duration-300">
                <span className="text-zinc-600 mr-2">&gt;</span>
                {messages[loadingStep]}
              </p>
            </div>
          </div>

          <div className="mt-8 w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1] transition-all duration-500 ease-out"
              style={{ width: `${((loadingStep + 1) / messages.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-2">
          <Suspense fallback={<SidebarListSkeleton />}>
            <WebhooksList handleGeneratedHandler={setIsGenerating} />
          </Suspense>
        </div>
      </ScrollArea>
    </div>
  )
}

function SidebarListSkeleton() {
  return (
    <div className="space-y-2 p-2 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-12 rounded-lg bg-zinc-800"
        />
      ))}
    </div>
  )
}