import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@borecore/database";
import { accounts, scanResults } from "@borecore/database/schema";
import { eq } from "drizzle-orm";

const MAX_MAILBOXES = 3;

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const userAccounts = await db
    .select({
      email: accounts.providerAccountId,
      provider: accounts.provider,
    })
    .from(accounts)
    .where(eq(accounts.userId, session.user.id));

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

  const mailboxes = userAccounts.map((a) => ({
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
