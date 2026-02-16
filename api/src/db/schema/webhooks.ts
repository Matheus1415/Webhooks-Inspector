import { pgTable, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const webhooks = pgTable("webhooks", {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuidv7()),

  method: text().notNull(),

  pathname: text().notNull(),

  ip: text().notNull(),

  contentType: text(),

  contentLength: integer(),

  queryParams: jsonb().$type<Record<string, string>>(),

  headers: jsonb().$type<Record<string, string>>().notNull(),

  body: text(),

  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
