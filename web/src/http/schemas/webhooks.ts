import { z } from 'zod'

export const webhookListItemSchema = z.object({
  id: z.uuidv7(),
  method: z.string(),
  pathname: z.string(),
  createdAt: z.coerce.date(),
})

export const webhookListSchema = z.object({
  webhooks: z.array(webhookListItemSchema),
  nextCursor: z.string().nullable(),
})

export const webhookDetailsSchema = z.object({
  id: z.string().uuid(),
  method: z.string(),
  pathname: z.string(),
  ip: z.string(),

  statusCode: z.number().optional().nullable(),

  contentType: z.string().optional().nullable(),
  contentLength: z.number().optional().nullable(),

  queryParams: z.record(z.string(), z.string()).optional().nullable(),

  headers: z.record(z.string(), z.string()),

  body: z.string().optional().nullable(),

  createdAt: z.coerce.date(),
})
