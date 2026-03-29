import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@borecore/database";
import { scanResults } from "@borecore/database/schema";
import { eq, and } from "drizzle-orm";

const MOCK_SENDERS = [
  { email: "newsletter@medium.com", name: "Medium", count: 47, hasUnsubscribe: true, listUnsubscribe: "<mailto:unsub@medium.com>", provider: "gmail" },
  { email: "noreply@github.com", name: "GitHub", count: 130, hasUnsubscribe: false, provider: "gmail" },
  { email: "deals@producthunt.com", name: "Product Hunt", count: 22, hasUnsubscribe: true, listUnsubscribe: "<https://producthunt.com/unsubscribe>", provider: "gmail" },
  { email: "weekly@tldr.tech", name: "TLDR Newsletter", count: 89, hasUnsubscribe: true, listUnsubscribe: "<mailto:unsub@tldr.tech>", provider: "gmail" },
  { email: "updates@notion.so", name: "Notion", count: 15, hasUnsubscribe: true, listUnsubscribe: "<https://notion.so/unsubscribe>", provider: "gmail" },
];

async function fetchMessageIds(accessToken: string, limit: number): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;

  while (ids.length < limit) {
    const params = new URLSearchParams({
      maxResults: String(Math.min(500, limit - ids.length)),
    });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message ?? "Gmail API error");
    }
    const data = await res.json();
    const msgs: { id: string }[] = data.messages ?? [];
    ids.push(...msgs.map((m: { id: string }) => m.id));
    if (!data.nextPageToken || msgs.length === 0) break;
    pageToken = data.nextPageToken;
  }

  return ids.slice(0, limit);
}

async function fetchMetadataBatch(accessToken: string, ids: string[]): Promise<any[]> {
  const BATCH = 50;
  const results: any[] = [];

  for (let i = 0; i < ids.length; i += BATCH) {
    const batch = ids.slice(i, i + BATCH);
    const msgs = await Promise.all(
      batch.map(async (id) => {
        try {
          const res = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=List-Unsubscribe&metadataHeaders=Date`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          if (!res.ok) return null;
          return res.json();
        } catch {
          return null;
        }
      })
    );
    results.push(...msgs.filter(Boolean));
  }

  return results;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { mailboxEmail, forceRescan = false } = await req.json();
  const userId = session.user.id;
  const email = mailboxEmail ?? session.user.email ?? "";
  const accessToken = (session as any).accessToken as string | undefined;

  // 1. Check DB cache
  if (!forceRescan) {
    const existing = await db
      .select()
      .from(scanResults)
      .where(and(eq(scanResults.userId, userId), eq(scanResults.mailboxEmail, email)))
      .limit(1);

    if (existing.length > 0) {
      const cached = existing[0]!;
      if (cached.nextScanAt > new Date()) {
        console.log("[scan] returning cached result for", email);
        return NextResponse.json({
          senders: cached.senders,
          totalScanned: cached.totalScanned,
          scannedAt: cached.scannedAt,
          nextScanAt: cached.nextScanAt,
          cached: true,
        });
      }
    }
  }

  console.log("[scan] running fresh scan for", email);

  // 2. No valid cache — mock fallback if no token
  if (!accessToken) {
    const now = new Date();
    const nextScanAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    return NextResponse.json({
      senders: MOCK_SENDERS,
      totalScanned: MOCK_SENDERS.length,
      scannedAt: now,
      nextScanAt,
      mock: true,
    });
  }

  // 3. Full Gmail scan
  try {
    const ids = await fetchMessageIds(accessToken, 1000);
    const messages = await fetchMetadataBatch(accessToken, ids);

    const senderMap = new Map<string, { name: string; count: number; listUnsubscribe?: string; lastEmailDate?: string }>();

    for (const msg of messages) {
      const headers: { name: string; value: string }[] = msg?.payload?.headers ?? [];
      const from = headers.find((h) => h.name === "From")?.value ?? "";
      const listUnsub = headers.find((h) => h.name === "List-Unsubscribe")?.value;
      const date = headers.find((h) => h.name === "Date")?.value;

      const emailMatch = from.match(/<(.+?)>/) ?? from.match(/([^\s]+@[^\s]+)/);
      const nameMatch = from.match(/^(.+?)\s*</);
      const senderEmail = emailMatch?.[1]?.toLowerCase().trim();
      if (!senderEmail) continue;

      const name = nameMatch?.[1]?.replace(/"/g, "").trim() ?? senderEmail.split("@")[0] ?? senderEmail;
      const existing = senderMap.get(senderEmail);
      senderMap.set(senderEmail, {
        name: existing?.name ?? name,
        count: (existing?.count ?? 0) + 1,
        listUnsubscribe: existing?.listUnsubscribe ?? listUnsub,
        lastEmailDate: existing?.lastEmailDate ?? date,
      });
    }

    const senders = Array.from(senderMap.entries())
      .map(([senderEmail, data]) => ({
        email: senderEmail,
        name: data.name,
        count: data.count,
        hasUnsubscribe: !!data.listUnsubscribe,
        listUnsubscribe: data.listUnsubscribe,
        lastEmailDate: data.lastEmailDate,
        provider: "gmail" as const,
      }))
      .filter((s) => s.hasUnsubscribe || s.count >= 2)
      .sort((a, b) => b.count - a.count);

    const now = new Date();
    const nextScanAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    // 4. Upsert in DB
    await db
      .insert(scanResults)
      .values({ userId, mailboxEmail: email, scannedAt: now, nextScanAt, totalScanned: ids.length, senders: senders as any })
      .onConflictDoUpdate({
        target: [scanResults.userId, scanResults.mailboxEmail],
        set: { scannedAt: now, nextScanAt, totalScanned: ids.length, senders: senders as any },
      });

    return NextResponse.json({ senders, totalScanned: ids.length, scannedAt: now, nextScanAt });
  } catch (err: any) {
    console.error("[scan] Gmail API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
