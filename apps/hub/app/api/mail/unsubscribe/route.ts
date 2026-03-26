import { NextRequest, NextResponse } from "next/server";
import { createProvider } from "@borecore/app-mail/providers/factory";

/**
 * POST /api/mail/unsubscribe
 *
 * Désabonne d'un expéditeur et crée un filtre Gmail.
 *
 * Corps attendu :
 *   { accountId: string, senderId: string, provider?: "gmail" | "outlook" }
 *
 * Logique de nettoyage (deux étapes indépendantes) :
 *   1. Tente le désabonnement List-Unsubscribe :
 *      a. URL → HTTP POST (RFC 8058 one-click)
 *      b. mailto → envoi email de désabonnement
 *   2. Crée un filtre pour supprimer les prochains mails de cet expéditeur
 *      (indépendant du succès de l'étape 1)
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json() as {
            accountId: string;
            senderId: string;
            provider?: "gmail" | "outlook";
        };

        const { accountId, senderId, provider = "gmail" } = body;

        if (!accountId || !senderId) {
            return NextResponse.json(
                { error: "accountId et senderId requis" },
                { status: 400 }
            );
        }

        const mailProvider = createProvider(provider);
        const result = await mailProvider.unsubscribe(senderId, accountId);

        return NextResponse.json({
            ok: result.success,
            method: result.method,
            ...(result.error ? { error: result.error } : {}),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur inconnue";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
