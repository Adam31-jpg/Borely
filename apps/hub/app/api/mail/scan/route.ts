import { NextRequest, NextResponse } from "next/server";
import { createProvider } from "@borecore/app-mail/providers/factory";

/**
 * POST /api/mail/scan
 *
 * Lance le scan des promotions pour un compte donné.
 *
 * Corps attendu :
 *   { accountId: string, provider: "gmail" | "outlook", limit?: number }
 *
 * En production :
 *   1. Récupère le token depuis la DB via accountId (décrypté KMS)
 *   2. Instancie le bon provider
 *   3. Appelle fetchPromotions() avec le token
 *
 * V1 : Retourne les données simulées du GmailProvider
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
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
