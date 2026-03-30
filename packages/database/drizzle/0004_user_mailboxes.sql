CREATE TABLE "user_mailboxes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"primary_user_id" text NOT NULL,
	"email" text NOT NULL,
	"provider" text DEFAULT 'gmail' NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"expires_at" timestamp,
	"added_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_mailboxes_primary_user_id_email_unique" UNIQUE("primary_user_id","email")
);
