import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createProvider } from "@borecore/app-mail/providers/factory";

/**
 * POST /api/mail/scan
 *
 * Lance le scan des promotions pour un compte donné.
 *
 * Corps attendu :
 *   { accountId: string, provider: "gmail" | "outlook", limit?: number }
 *
 * Flux de production :
 *   1. Récupère l'accessToken depuis la session NextAuth (stocké en JWT)
 *   2. Instancie le bon provider via la factory
 *   3. Appelle fetchPromotions() avec le token déchiffré
 *
 * Fallback dev : si pas de token (env non configuré), retourne les données mock.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        // Récupération du token depuis la session NextAuth
        const session = await auth();
        const accessToken = (session as { accessToken?: string } | null)?.accessToken;

        const body = await req.json() as {
            accountId: string;
            provider?: "gmail" | "outlook";
            limit?: number;
        };

        const { accountId, provider = "gmail", limit = 5000 } = body;

        if (!accountId) {
            return NextResponse.json(
                { error: "accountId requis" },
                { status: 400 }
            );
        }

        const mailProvider = createProvider(provider);

        const senders = await mailProvider.fetchPromotions({
            accountId,
            limit,
            accessToken,
        });

        return NextResponse.json({
            ok: true,
            senders,
            totalScanned: limit,
            scannedAt: new Date().toISOString(),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur inconnue";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
