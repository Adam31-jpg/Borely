import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@borecore/database";
import { unsubscribeHistory } from "@borecore/database/schema";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const accessToken = (session as any).accessToken as string | undefined;
  const { senderEmail, senderName, listUnsubscribe } = await req.json();

  console.log("[unsub] body:", { senderEmail, senderName, listUnsubscribe });

  if (!senderEmail) {
    return NextResponse.json({ error: "senderEmail requis" }, { status: 400 });
  }

  // Parse List-Unsubscribe header value — format: "<https://...>, <mailto:...>"
  const httpMatch = listUnsubscribe?.match(/<(https?:\/\/[^>]+)>/);
  const mailtoMatch = listUnsubscribe?.match(/<mailto:([^>?]+)(?:\?([^>]*))?>/);

  const http = httpMatch?.[1] ?? null;
  const mailto = mailtoMatch
    ? { address: mailtoMatch[1]!, params: mailtoMatch[2] ?? "" }
    : null;

  console.log("[unsub] parsed:", { http, mailto });

  let method: "http" | "mailto" | "manual" = "manual";

  // 1. Try HTTP unsubscribe (one-click POST)
  if (http) {
    try {
      const res = await fetch(http, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "List-Unsubscribe=One-Click",
      });
      console.log("[unsub] http result:", res.status);
      if (res.ok || res.status === 301 || res.status === 302) {
        method = "http";
      }
    } catch (err) {
      console.warn("[unsub] http failed, trying mailto:", err);
    }
  }

  // 2. Try mailto via Gmail send API (only if HTTP didn't work)
  if (method === "manual" && mailto && accessToken) {
    try {
      const subject =
        new URLSearchParams(mailto.params).get("subject") ?? "Unsubscribe";
      const raw = Buffer.from(
        `To: ${mailto.address}\r\nSubject: ${subject}\r\n\r\nUnsubscribe`
      )
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const res = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ raw }),
        }
      );
      console.log("[unsub] mailto result:", res.status);
      if (res.ok) {
        method = "mailto";
      }
    } catch (err) {
      console.warn("[unsub] mailto failed:", err);
    }
  }

  // 3. Save to history (non-blocking)
  try {
    await db
      .insert(unsubscribeHistory)
      .values({
        userId: session.user.id,
        mailboxEmail: session.user.email ?? "",
        senderEmail,
        senderName: senderName ?? senderEmail,
        method,
      })
      .onConflictDoNothing();
  } catch (err) {
    console.warn("[unsub] history insert failed (non-blocking):", err);
  }

  return NextResponse.json({ success: true, method });
}
