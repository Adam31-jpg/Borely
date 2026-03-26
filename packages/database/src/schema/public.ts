import {
    pgTable,
    pgSchema,
    uuid,
    text,
    timestamp,
    boolean,
    integer,
} from "drizzle-orm/pg-core";

/**
 * Public schema — shared across all micro-apps.
 * Contains users, subscriptions, and the app catalog.
 */

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    cognitoSub: text("cognito_sub").unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const appsCatalog = pgTable("apps_catalog", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    category: text("category").notNull(),
    price: integer("price_cents").notNull(), // Price in cents
    pricingModel: text("pricing_model").notNull(), // "lifetime" | "subscription"
    creemProductId: text("creem_product_id"),
    isActive: boolean("is_active").defaultTo(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    appSlug: text("app_slug")
        .notNull()
        .references(() => appsCatalog.slug),
    status: text("status").notNull(), // "active" | "expired" | "cancelled"
    creemSubscriptionId: text("creem_subscription_id"),
    purchasedAt: timestamp("purchased_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userOAuthTokens = pgTable("user_oauth_tokens", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(), // "google"
    encryptedAccessToken: text("encrypted_access_token").notNull(),
    encryptedRefreshToken: text("encrypted_refresh_token").notNull(),
    encryptedDek: text("encrypted_dek").notNull(),
    iv: text("iv").notNull(),
    tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
