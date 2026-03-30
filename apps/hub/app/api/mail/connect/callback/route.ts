import { NextRequest, NextResponse } from "next/server";
import { db } from "@borecore/database";
import { userMailboxes } from "@borecore/database/schema";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const primaryUserId = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code || !primaryUserId) {
    return NextResponse.redirect(new URL("/workspace/mail?error=oauth", req.url));
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/mail/connect/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.access_token) throw new Error("No access token");

    // Get email from Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const userInfo = await userRes.json();
    const email: string = userInfo.email;

    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000)
      : null;

    await db
      .insert(userMailboxes)
      .values({
        primaryUserId,
        email,
        provider: "gmail",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? null,
        expiresAt,
      })
      .onConflictDoUpdate({
        target: [userMailboxes.primaryUserId, userMailboxes.email],
        set: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token ?? null,
          expiresAt,
        },
      });

    console.log("[connect/callback] mailbox added:", email, "for user:", primaryUserId);
    return NextResponse.redirect(new URL("/workspace/mail?connected=true", req.url));
  } catch (err: any) {
    console.error("[connect/callback] error:", err);
    return NextResponse.redirect(new URL("/workspace/mail?error=oauth", req.url));
  }
}
