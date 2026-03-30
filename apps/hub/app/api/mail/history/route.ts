import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@borecore/database";
import { unsubscribeHistory } from "@borecore/database/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const history = await db
    .select()
    .from(unsubscribeHistory)
    .where(eq(unsubscribeHistory.userId, session.user.id))
    .orderBy(desc(unsubscribeHistory.unsubscribedAt));

  return NextResponse.json({ history });
}
