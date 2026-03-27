import { handlers } from "@/auth";

/**
 * Route handler NextAuth v5 — Next.js 15 compatible
 *
 * Gère tous les endpoints OAuth :
 *   GET  /api/auth/session
 *   GET  /api/auth/providers
 *   GET  /api/auth/csrf
 *   GET  /api/auth/callback/google   ← callback OAuth Google
 *   POST /api/auth/signin/google
 *   POST /api/auth/signout
 *
 * On enveloppe explicitement les handlers plutôt que de les ré-exporter
 * directement (export const { GET, POST } = handlers) pour satisfaire
 * le système de types strict de Next.js 15 :
 *   — les paramètres de route dynamique sont désormais `Promise<Params>`
 *   — les types inférés de next-auth v5 beta peuvent diverger de RouteHandler
 * L'utilisation de `Parameters<typeof handlers.GET>` garantit que les
 * signatures restent synchronisées avec ce qu'exporte auth.js.
 */
export async function GET(...args: Parameters<typeof handlers.GET>) {
    return handlers.GET(...args);
}

export async function POST(...args: Parameters<typeof handlers.POST>) {
    return handlers.POST(...args);
}
