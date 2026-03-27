import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createProvider } from "@borecore/app-mail/providers/factory";

/**
 * POST /api/mail/unsubscribe
 *
 * Désabonne d'un expéditeur et crée un filtre Gmail.
 *
 * Corps attendu :
 *   {
 *     accountId: string,
 *     senderEmail: string,
 *     unsubscribeLink?: string,
 *     provider?: "gmail" | "outlook"
 *   }
 *
 * Logique (deux étapes indépendantes) :
 *   1. Tente le désabonnement List-Unsubscribe (URL ou mailto)
 *   2. Crée un filtre Gmail pour archiver les futurs mails
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await auth();
        const accessToken = (session as { accessToken?: string } | null)?.accessToken;

        const body = await req.json() as {
            accountId: string;
            senderEmail: string;
            unsubscribeLink?: string;
            provider?: "gmail" | "outlook";
        };

        const { accountId, senderEmail, unsubscribeLink, provider = "gmail" } = body;

        if (!accountId || !senderEmail) {
            return NextResponse.json(
                { error: "accountId et senderEmail requis" },
                { status: 400 }
            );
        }

        const mailProvider = createProvider(provider);
        const result = await mailProvider.unsubscribe(
            senderEmail,
            accountId,
            accessToken,
            unsubscribeLink,
        );

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
