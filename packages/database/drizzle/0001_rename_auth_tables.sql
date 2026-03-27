-- Rename Auth.js tables to match @auth/drizzle-adapter defaults (PostgreSQL)
-- DrizzleAdapter(db) without explicit tables expects: "user", "account", "session", "verificationToken"
-- Previous migration created: "users", "accounts", "sessions", "verificationTokens"

ALTER TABLE "users" RENAME TO "user";
--> statement-breakpoint
ALTER TABLE "accounts" RENAME TO "account";
--> statement-breakpoint
ALTER TABLE "sessions" RENAME TO "session";
--> statement-breakpoint
ALTER TABLE "verificationTokens" RENAME TO "verificationToken";
