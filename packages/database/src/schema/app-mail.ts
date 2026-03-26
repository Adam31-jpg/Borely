import {
    pgTable,
    pgSchema,
    uuid,
    text,
    timestamp,
    boolean,
    integer,
} from "drizzle-orm/pg-core";
import { users } from "./public";

/**
 * app_mail schema — isolated tables for the Mail Cleaner micro-app.
 * Rule: This schema never reads/writes from other app schemas.
 */
export const appMailSchema = pgSchema("app_mail");

export const scannedSenders = appMailSchema.table("scanned_senders", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    email: text("email").notNull(),
    name: text("name"),
    messageCount: integer("message_count").default(0),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
    isBlacklisted: boolean("is_blacklisted").default(false).notNull(),
    unsubscribeLink: text("unsubscribe_link"),
    scannedAt: timestamp("scanned_at", { withTimezone: true }).defaultNow().notNull(),
});

export const unsubscribeLog = appMailSchema.table("unsubscribe_log", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    senderEmail: text("sender_email").notNull(),
    method: text("method").notNull(), // "link" | "mailto" | "manual"
    status: text("status").notNull(), // "success" | "failed" | "pending"
    processedAt: timestamp("processed_at", { withTimezone: true }).defaultNow().notNull(),
});
