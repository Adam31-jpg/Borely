import { handlers } from "@/auth";

/**
 * Route handler NextAuth v5
 * Gère tous les endpoints OAuth :
 *   GET  /api/auth/session
 *   GET  /api/auth/providers
 *   GET  /api/auth/csrf
 *   GET  /api/auth/callback/google   ← callback OAuth Google
 *   POST /api/auth/signin/google
 *   POST /api/auth/signout
 */
export const { GET, POST } = handlers;
