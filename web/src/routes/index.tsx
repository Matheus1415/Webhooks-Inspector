import { createFileRoute } from "@tanstack/react-router"
import { Sidebar } from "../components/sidebar"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  return (
    <div className="h-screen bg-zinc-900 text-zinc-200 flex">
      <div className="w-1/5 min-w-[200px] max-w-[400px] border-r border-zinc-800 p-4">
        <Sidebar />
      </div>

      <div className="flex-1 p-4">
        Right Panel
      </div>
    </div>
  )
}
