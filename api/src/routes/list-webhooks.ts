import { webhooks } from "@/db/schema"
import { createSelectSchema } from "drizzle-zod"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "@/db"
import { desc, lt } from "drizzle-orm"
import { z } from "zod"

export const listWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/webhooks",
    {
      schema: {
        summary: "List webhooks",
        tags: ["Webhooks"],
        querystring: z.object({
          limit: z.coerce.number().min(1).max(100).default(20),
          cursor: z.string().optional(),
        }),
        response: {
          200: z.object({
            webhooks: z.array(
              createSelectSchema(webhooks).pick({
                id: true,
                method: true,
                pathname: true,
                createdAt: true,
              }),
            ),
            nextCursor: z.string().nullable(),
          }),
        },
      },
    },
    async (request) => {
      const { limit, cursor } = request.query

      const results = await db
        .select({
          id: webhooks.id,
          method: webhooks.method,
          pathname: webhooks.pathname,
          createdAt: webhooks.createdAt,
        })
        .from(webhooks)
        .where(cursor ? lt(webhooks.id, cursor) : undefined)
        .orderBy(desc(webhooks.id))
        .limit(limit + 1)

      const hasNextPage = results.length > limit

      const items = hasNextPage ? results.slice(0, -1) : results

      const nextCursor = hasNextPage
        ? items[items.length - 1].id
        : null

      return {
        webhooks: items,
        nextCursor,
      }
    },
  )
}
