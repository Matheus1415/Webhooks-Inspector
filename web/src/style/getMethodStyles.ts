export function getMethodStyles(method: string) {
  switch (method.toUpperCase()) {
    case "GET":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"

    case "POST":
      return "bg-blue-500/15 text-blue-400 border-blue-500/30"

    case "PUT":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30"

    case "PATCH":
      return "bg-purple-500/15 text-purple-400 border-purple-500/30"

    case "DELETE":
      return "bg-red-500/15 text-red-400 border-red-500/30"

    default:
      return "bg-zinc-700 text-zinc-300 border-zinc-600"
  }
}
