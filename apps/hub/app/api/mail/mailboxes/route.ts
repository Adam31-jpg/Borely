import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@borecore/database";
import { accounts, users, scanResults, userMailboxes } from "@borecore/database/schema";
import { eq } from "drizzle-orm";

const MAX_MAILBOXES = 3;

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Primary mailbox from OAuth account
  const userAccounts = await db
    .select({
      email: users.email,
      provider: accounts.provider,
    })
    .from(accounts)
    .innerJoin(users, eq(accounts.userId, users.id))
    .where(eq(accounts.userId, session.user.id));

  // Extra mailboxes added via /api/mail/connect
  const extraMailboxes = await db
    .select({ email: userMailboxes.email, provider: userMailboxes.provider })
    .from(userMailboxes)
    .where(eq(userMailboxes.primaryUserId, session.user.id));

  // Merge, deduplicate by email
  const allEmails: { email: string; provider: string }[] = [
    ...userAccounts.map((a) => ({ email: a.email ?? "", provider: a.provider })),
    ...extraMailboxes,
  ];
  const unique = Array.from(new Map(allEmails.map((m) => [m.email, m])).values()).filter(
    (m) => m.email
  );

  const scans = await db
    .select({
      mailboxEmail: scanResults.mailboxEmail,
      scannedAt: scanResults.scannedAt,
      nextScanAt: scanResults.nextScanAt,
      totalScanned: scanResults.totalScanned,
    })
    .from(scanResults)
    .where(eq(scanResults.userId, session.user.id));

  const scanMap = new Map(scans.map((s) => [s.mailboxEmail, s]));

  const mailboxes = unique.map((a) => ({
    email: a.email,
    provider: a.provider,
    scan: scanMap.get(a.email) ?? null,
  }));

  return NextResponse.json({
    mailboxes,
    canAddMore: mailboxes.length < MAX_MAILBOXES,
    max: MAX_MAILBOXES,
  });
}
