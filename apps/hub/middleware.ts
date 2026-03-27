import { auth } from "@borecore/auth";
import { NextResponse } from "next/server";

// Force Node.js runtime — le middleware lit les sessions depuis la DB
// via DrizzleAdapter, ce qui requiert des modules Node.js (postgres, bcryptjs).
// L'Edge Runtime ne supporte pas ces APIs.
export const runtime = "nodejs";

/**
 * Middleware de protection des routes.
 * Redirige vers /login si l'utilisateur n'est pas authentifié
 * et tente d'accéder à /workspace/* ou /library/*.
 *
 * callbackUrl est passé en query param pour restaurer la destination
 * après connexion.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (auth as any)(function middleware(req: any) {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    const isProtected =
        pathname.startsWith("/workspace") ||
        pathname.startsWith("/library");

    if (isProtected && !isLoggedIn) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }
});

export const config = {
    matcher: ["/workspace/:path*", "/library/:path*"],
};
