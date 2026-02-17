import { Link } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import { IconButton } from './ui/icon-button'
import { Trash2Icon, Loader2 } from 'lucide-react'
import { Checkbox } from './ui/checkbox'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '../lib/toast'
import Swal from 'sweetalert2'

interface WebhookListItemProps {
  webhook: {
    id: string
    method: string
    pathname: string
    createdAt: Date
  }
  onWebhookChecked: (webhookId: string) => void
  isWebhookChecked: boolean
}

export function WebhooksListItem({ webhook, onWebhookChecked, isWebhookChecked }: WebhookListItemProps) {
  const queryClient = useQueryClient()

  const { mutate: deleteWebhook, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const result = await Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter esta ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#818cf8',
        cancelButtonColor: '#27272a',  
        confirmButtonText: 'Sim, deletar!',
        cancelButtonText: 'Cancelar',
        background: '#18181b',         
        color: '#f4f4f5',             
      })

      if (!result.isConfirmed) {
        throw new Error('ABORTED')
      }

      const response = await fetch(`http://localhost:3333/api/webhooks/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar o webhook')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['webhooks'],
      })
      toast.success("Webhook removido com sucesso")
    },
    onError: (error) => {
      if (error instanceof Error && error.message === 'ABORTED') return

      toast.danger(error instanceof Error ? error.message : "Erro ao deletar webhook")
    }
  })

  return (
    <div className={`group rounded-lg transition-colors duration-150 hover:bg-zinc-700/30 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-start gap-3 px-4 py-2.5">
        <Checkbox
          onCheckedChange={() => onWebhookChecked(webhook.id)}
          checked={isWebhookChecked}
          disabled={isDeleting}
        />

        <Link
          to="/webhooks/$id"
          params={{ id: webhook.id }}
          className="flex flex-1 min-w-0 items-start gap-3"
        >
          <span className="w-12 shrink-0 font-mono text-xs font-semibold text-zinc-300 text-right">
            {webhook.method}
          </span>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs text-zinc-200 leading-tight font-mono">
              {webhook.pathname}
            </p>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              {formatDistanceToNow(new Date(webhook.createdAt), { addSuffix: true })}
            </p>
          </div>
        </Link>

        <IconButton
          disabled={isDeleting}
          icon={
            isDeleting ? (
              <Loader2 className="size-3.5 text-zinc-400 animate-spin" />
            ) : (
              <Trash2Icon className="size-3.5 text-zinc-400" />
            )
          }
          className={`transition-opacity ${isDeleting ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          onClick={() => deleteWebhook(webhook.id)}
        />
      </div>
    </div>
  )
}