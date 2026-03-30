CREATE TABLE "unsubscribe_history" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL,
  "mailbox_email" text NOT NULL,
  "sender_email" text NOT NULL,
  "sender_name" text NOT NULL,
  "unsubscribed_at" timestamp DEFAULT now() NOT NULL,
  "method" text DEFAULT 'http' NOT NULL,
  CONSTRAINT "unsubscribe_history_user_id_mailbox_email_sender_email_unique" UNIQUE("user_id","mailbox_email","sender_email")
);
