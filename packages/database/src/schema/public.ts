import {
    pgTable,
    text,
    timestamp,
    boolean,
    integer,
    primaryKey,
} from "drizzle-orm/pg-core";

/**
 * Public schema — Auth.js v5 compatible + tables métier Borely.
 *
 * Noms SQL des tables Auth.js v5 (DrizzleAdapter defaults PostgreSQL) :
 *   "user", "account", "session", "verificationToken"
 * Les noms d'export TypeScript (users, accounts…) ne changent pas —
 * seul le nom SQL (premier arg de pgTable) doit correspondre aux defaults
 * de @auth/drizzle-adapter pour que DrizzleAdapter(db) fonctionne sans
 * passer les tables manuellement.
 */

// ─── Auth.js v5 — Table user ───────────────────────────────────────────────

export const users = pgTable("user", {
    id:            text("id").notNull().primaryKey(),
    name:          text("name"),
    email:         text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image:         text("image"),
    passwordHash:  text("password_hash"),
    createdAt:     timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Auth.js v5 — Table account ────────────────────────────────────────────

export const accounts = pgTable(
    "account",
    {
        userId:            text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
        type:              text("type").notNull(),
        provider:          text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token:     text("refresh_token"),
        access_token:      text("access_token"),
        expires_at:        integer("expires_at"),
        token_type:        text("token_type"),
        scope:             text("scope"),
        id_token:          text("id_token"),
        session_state:     text("session_state"),
    },
    (account) => [
        primaryKey({ columns: [account.provider, account.providerAccountId] }),
    ],
);

// ─── Auth.js v5 — Table session ────────────────────────────────────────────

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId:       text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    expires:      timestamp("expires", { mode: "date" }).notNull(),
});

// ─── Auth.js v5 — Table verificationToken ─────────────────────────────────

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token:      text("token").notNull(),
        expires:    timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => [
        primaryKey({ columns: [vt.identifier, vt.token] }),
    ],
);

// ─── Métier — Catalogue des apps ───────────────────────────────────────────

export const appsCatalog = pgTable("apps_catalog", {
    id:             text("id").notNull().primaryKey(),
    slug:           text("slug").notNull().unique(),
    name:           text("name").notNull(),
    description:    text("description"),
    category:       text("category").notNull(),
    price:          integer("price_cents").notNull(),
    pricingModel:   text("pricing_model").notNull(),
    creemProductId: text("creem_product_id"),
    isActive:       boolean("is_active").default(true).notNull(),
    createdAt:      timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Métier — Achats (lifetime) ────────────────────────────────────────────

export const purchases = pgTable("purchases", {
    id:           text("id").notNull().primaryKey(),
    userId:       text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    appSlug:      text("app_slug").notNull(),
    purchasedAt:  timestamp("purchased_at", { withTimezone: true }).defaultNow().notNull(),
    creemOrderId: text("creem_order_id"),
});

// ─── Métier — Tokens OAuth chiffrés (KMS) ─────────────────────────────────

export const userOAuthTokens = pgTable("user_oauth_tokens", {
    id:                    text("id").notNull().primaryKey(),
    userId:                text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    provider:              text("provider").notNull(),
    encryptedAccessToken:  text("encrypted_access_token").notNull(),
    encryptedRefreshToken: text("encrypted_refresh_token").notNull(),
    encryptedDek:          text("encrypted_dek").notNull(),
    iv:                    text("iv").notNull(),
    tokenExpiresAt:        timestamp("token_expires_at", { withTimezone: true }),
    createdAt:             timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt:             timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
