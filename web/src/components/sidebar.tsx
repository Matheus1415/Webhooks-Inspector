import { CopyIcon } from "lucide-react"
import { IconButton } from "./ui/icon-button"
import { WebhooksList } from "./webhooks-list"
import { Suspense, useState } from "react"
import { ScrollArea } from "./ui/scroll-area"
import { toast } from "../lib/toast"
import { useNavigate } from "@tanstack/react-router"

const WEBHOOK_URL = "http://localhost:3333/api/capture"

export function Sidebar() {
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()
  const [isPressed, setIsPressed] = useState(false)

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

      <ScrollArea className="flex-1">
        <div className="p-2">
          <Suspense fallback={<SidebarListSkeleton />}>
            <WebhooksList />
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