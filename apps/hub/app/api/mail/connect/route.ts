// SETUP REQUIRED: Add these URIs to Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client
// Authorized redirect URIs:
//   - http://localhost:3001/api/mail/connect/callback  (development)
//   - https://yourdomain.com/api/mail/connect/callback (production)
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@borecore/database";
import { userMailboxes } from "@borecore/database/schema";
import { eq } from "drizzle-orm";

const MAX_MAILBOXES = 3;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Check current extra mailbox count (primary counts as 1)
  const existing = await db
    .select({ id: userMailboxes.id })
    .from(userMailboxes)
    .where(eq(userMailboxes.primaryUserId, session.user.id));

  if (existing.length + 1 >= MAX_MAILBOXES) {
    return NextResponse.redirect(new URL("/workspace/mail?error=limit", req.url));
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/mail/connect/callback`,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "email",
      "profile",
    ].join(" "),
    access_type: "offline",
    prompt: "select_account consent",
    state: session.user.id,
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
