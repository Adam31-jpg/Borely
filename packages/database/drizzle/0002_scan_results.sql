CREATE TABLE "scan_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"mailbox_email" text NOT NULL,
	"scanned_at" timestamp DEFAULT now() NOT NULL,
	"next_scan_at" timestamp NOT NULL,
	"total_scanned" integer DEFAULT 0 NOT NULL,
	"senders" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "scan_results_user_id_mailbox_email_unique" UNIQUE("user_id","mailbox_email")
);
--> statement-breakpoint
ALTER TABLE "scan_results" ADD CONSTRAINT "scan_results_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
