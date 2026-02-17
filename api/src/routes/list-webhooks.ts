import { webhooks } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "@/db";
import { and, lt, desc, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";

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
          method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).optional(),
          date: z
            .string()
            .date()
            .transform((value) => new Date(value))
            .optional(),
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
      const { limit, cursor, date, method } = request.query;

      const filters = [];

      // Cursor (paginação)
      if (cursor) {
        filters.push(lt(webhooks.id, Number(cursor)));
      }

      // Filtro por method
      if (method) {
        filters.push(eq(webhooks.method, method));
      }

      // Filtro por data
      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        filters.push(
          and(
            gte(webhooks.createdAt, startOfDay),
            lte(webhooks.createdAt, endOfDay),
          ),
        );
      }

      const results = await db
        .select({
          id: webhooks.id,
          method: webhooks.method,
          pathname: webhooks.pathname,
          createdAt: webhooks.createdAt,
        })
        .from(webhooks)
        .where(filters.length ? and(...filters) : undefined)
        .orderBy(desc(webhooks.id))
        .limit(Number(limit) + 1);

      const hasNextPage = results.length > limit;

      const items = hasNextPage ? results.slice(0, -1) : results;

      const nextCursor = hasNextPage ? items[items.length - 1].id : null;

      return {
        webhooks: items,
        nextCursor,
      };
    },
  );
};
