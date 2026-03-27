/**
 * GmailProvider — Implémentation Gmail de IMailProvider
 *
 * Scopes OAuth requis :
 *   - gmail.readonly       : scan des en-têtes + lecture messages
 *   - gmail.modify         : création de filtres après désabonnement
 *
 * En-tête analysé : List-Unsubscribe (RFC 2369)
 * Format supporté : <https://...> ou <mailto:...>
 *
 * ⚠️ Ce provider s'exécute côté SERVEUR uniquement (route API Next.js).
 * L'accessToken est récupéré depuis la DB (KMS decrypted) via accountId.
 */

import type {
    IMailProvider,
    ProviderSession,
    ScanOptions,
    UnsubscribeResult,
    ProviderType,
} from "./types";
import type { ScannedSender } from "../types";

const GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me";

/** Regex pour extraire les URLs et emails du header List-Unsubscribe */
const RE_UNSUBSCRIBE_URL = /<(https?:\/\/[^>]+)>/i;
const RE_UNSUBSCRIBE_MAIL = /<mailto:([^>]+)>/i;

/** Domaine extrait d'une adresse email */
function domainFromEmail(email: string): string {
    return email.split("@")[1] ?? email;
}

/** Parse "Display Name <email@domain.com>" → { name, email } */
function parseFromHeader(raw: string): { name: string; email: string } {
    const match = raw.match(/^(.*?)\s*<([^>]+)>$/);
    if (match) {
        return { name: (match[1] ?? "").trim().replace(/^["']|["']$/g, ""), email: match[2]!.trim().toLowerCase() };
    }
    return { name: raw.trim(), email: raw.trim().toLowerCase() };
}

/** Récupère la valeur d'un header Gmail par nom (case-insensitive) */
function getHeader(headers: Array<{ name: string; value: string }>, name: string): string {
    return headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

export class GmailProvider implements IMailProvider {
    readonly providerType: ProviderType = "gmail";

    /**
     * Lance le flux OAuth Google.
     * Le flux réel est géré par NextAuth — cette méthode n'est pas utilisée.
     */
    async connect(): Promise<ProviderSession> {
        throw new Error(
            "connect() s'effectue via NextAuth — utiliser /api/auth/signin?provider=google"
        );
    }

    /**
     * Récupère les expéditeurs de promotions via l'API Gmail.
     *
     * Algorithme :
     * 1. Liste les messages du label CATEGORY_PROMOTIONS (jusqu'à `limit`)
     * 2. Récupère les en-têtes From + List-Unsubscribe en batch (pages de 50)
     * 3. Groupe par adresse email d'expéditeur
     * 4. Filtre : garde uniquement les expéditeurs avec List-Unsubscribe
     *
     * @param options.limit   — Nombre max de messages à analyser
     * @param options.accountId — ID du compte
     * @param options.accessToken — OAuth token (requis en production)
     */
    async fetchPromotions(options: ScanOptions): Promise<ScannedSender[]> {
        const { limit, accessToken } = options;

        // Fallback vers les données simulées si pas de token (dev local)
        if (!accessToken) {
            return MOCK_SENDERS;
        }

        const authHeader = { Authorization: `Bearer ${accessToken}` };

        // ── Étape 1 : Lister les messages CATEGORY_PROMOTIONS ──
        const messageIds: string[] = [];
        let pageToken: string | undefined;

        while (messageIds.length < limit) {
            const maxResults = Math.min(500, limit - messageIds.length);
            const url = new URL(`${GMAIL_API}/messages`);
            url.searchParams.set("labelIds", "CATEGORY_PROMOTIONS");
            url.searchParams.set("maxResults", String(maxResults));
            if (pageToken) url.searchParams.set("pageToken", pageToken);

            const resp = await fetch(url.toString(), { headers: authHeader });
            if (!resp.ok) {
                const err = await resp.text();
                throw new Error(`Gmail list error ${resp.status}: ${err}`);
            }
            const data = await resp.json() as {
                messages?: Array<{ id: string }>;
                nextPageToken?: string;
            };

            if (!data.messages?.length) break;
            messageIds.push(...data.messages.map((m) => m.id));
            pageToken = data.nextPageToken;
            if (!pageToken) break;
        }

        // ── Étape 2 : Récupérer les en-têtes par batch de 50 ──
        const BATCH_SIZE = 50;
        const senderMap = new Map<string, {
            displayName: string;
            email: string;
            messageCount: number;
            lastSeenAt: string;
            unsubscribeLink: string;
        }>();

        for (let i = 0; i < messageIds.length; i += BATCH_SIZE) {
            const batch = messageIds.slice(i, i + BATCH_SIZE);
            const results = await Promise.allSettled(
                batch.map((id) =>
                    fetch(`${GMAIL_API}/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=List-Unsubscribe&metadataHeaders=Date`, {
                        headers: authHeader,
                    }).then((r) => r.json() as Promise<{
                        id: string;
                        internalDate: string;
                        payload: { headers: Array<{ name: string; value: string }> };
                    }>)
                )
            );

            for (const result of results) {
                if (result.status !== "fulfilled") continue;
                const msg = result.value;
                const headers = msg.payload?.headers ?? [];

                const unsubscribeLink = getHeader(headers, "List-Unsubscribe");
                if (!unsubscribeLink) continue; // Skip si pas d'en-tête List-Unsubscribe

                const fromRaw = getHeader(headers, "From");
                const { name, email } = parseFromHeader(fromRaw);
                if (!email) continue;

                const dateMs = msg.internalDate ? Number(msg.internalDate) : Date.now();
                const dateStr = new Date(dateMs).toISOString().slice(0, 10);

                const existing = senderMap.get(email);
                if (existing) {
                    existing.messageCount++;
                    if (dateStr > existing.lastSeenAt) existing.lastSeenAt = dateStr;
                } else {
                    senderMap.set(email, {
                        displayName: name || email,
                        email,
                        messageCount: 1,
                        lastSeenAt: dateStr,
                        unsubscribeLink,
                    });
                }
            }
        }

        // ── Étape 3 : Convertir en ScannedSender[] ──
        return Array.from(senderMap.entries()).map(([email, data], idx) => ({
            id: String(idx + 1),
            email,
            displayName: data.displayName,
            messageCount: data.messageCount,
            lastSeenAt: data.lastSeenAt,
            unsubscribeLink: data.unsubscribeLink,
            selected: false,
        }));
    }

    /**
     * Désabonne d'un expéditeur en 2 étapes :
     *
     * Étape 1 — Désabonnement List-Unsubscribe :
     *   a. Si URL → requête POST vers l'URL (RFC 8058 one-click)
     *   b. Si email → envoi d'un email vide via gmail.users.messages.send
     *
     * Étape 2 — Filtre Gmail (indépendant du succès de l'étape 1) :
     *   POST .../users/me/settings/filters
     *   Déplace les futurs mails de cet expéditeur vers la corbeille.
     */
    async unsubscribe(
        senderEmail: string,
        _accountId: string,
        accessToken?: string,
        unsubscribeLink?: string,
    ): Promise<UnsubscribeResult> {
        // Sans token → simuler le succès (dev)
        if (!accessToken) {
            return { success: true, method: "filter-only" };
        }

        const authHeader = { Authorization: `Bearer ${accessToken}` };
        let method: UnsubscribeResult["method"] = "filter-only";

        // ── Étape 1 : Tenter le désabonnement ──
        if (unsubscribeLink) {
            const urlMatch = unsubscribeLink.match(RE_UNSUBSCRIBE_URL);
            const mailMatch = unsubscribeLink.match(RE_UNSUBSCRIBE_MAIL);

            if (urlMatch?.[1]) {
                try {
                    await fetch(urlMatch[1], { method: "POST" });
                    method = "list-unsubscribe-url";
                } catch {
                    // Continue même si l'URL échoue — le filtre sera quand même créé
                }
            } else if (mailMatch?.[1]) {
                try {
                    // Construire un email vide vers l'adresse de désabonnement
                    const to = mailMatch[1]!.split("?")[0]!;
                    const subject = mailMatch[1]!.includes("subject=")
                        ? decodeURIComponent(mailMatch[1]!.split("subject=")[1]?.split("&")[0] ?? "Unsubscribe")
                        : "Unsubscribe";
                    const raw = btoa(`To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/plain\r\n\r\n`).replace(/\+/g, "-").replace(/\//g, "_");
                    await fetch(`${GMAIL_API}/messages/send`, {
                        method: "POST",
                        headers: { ...authHeader, "Content-Type": "application/json" },
                        body: JSON.stringify({ raw }),
                    });
                    method = "list-unsubscribe-email";
                } catch {
                    // Continue même si l'email échoue
                }
            }
        }

        // ── Étape 2 : Créer un filtre Gmail ──
        try {
            await fetch(`${GMAIL_API}/settings/filters`, {
                method: "POST",
                headers: { ...authHeader, "Content-Type": "application/json" },
                body: JSON.stringify({
                    criteria: { from: senderEmail },
                    action: {
                        removeLabelIds: ["INBOX"],
                        addLabelIds: ["TRASH"],
                    },
                }),
            });
        } catch {
            // Le filtre est best-effort
        }

        return { success: true, method };
    }
}

/** Données simulées — Utilisées quand accessToken est absent (dev local) */
const MOCK_SENDERS: ScannedSender[] = [
    { id: "1", email: "newsletter@netflix.com", displayName: "Netflix", messageCount: 47, lastSeenAt: "2026-03-24", unsubscribeLink: "<https://unsubscribe.netflix.com/xyz>", selected: false },
    { id: "2", email: "noreply@amazon.fr", displayName: "Amazon", messageCount: 123, lastSeenAt: "2026-03-25", unsubscribeLink: "<https://unsubscribe.amazon.fr/abc>", selected: false },
    { id: "3", email: "deals@cdiscount.com", displayName: "Cdiscount", messageCount: 89, lastSeenAt: "2026-03-23", unsubscribeLink: "<https://unsubscribe.cdiscount.com/def>", selected: false },
    { id: "4", email: "info@linkedin.com", displayName: "LinkedIn", messageCount: 201, lastSeenAt: "2026-03-25", unsubscribeLink: "<https://unsubscribe.linkedin.com/ghi>", selected: false },
    { id: "5", email: "promo@booking.com", displayName: "Booking.com", messageCount: 34, lastSeenAt: "2026-03-20", unsubscribeLink: "<https://unsubscribe.booking.com/jkl>", selected: false },
    { id: "6", email: "newsletter@medium.com", displayName: "Medium", messageCount: 67, lastSeenAt: "2026-03-22", unsubscribeLink: "<https://unsubscribe.medium.com/mno>", selected: false },
    { id: "7", email: "receipts@uber.com", displayName: "Uber", messageCount: 15, lastSeenAt: "2026-03-18", unsubscribeLink: "<https://unsubscribe.uber.com/pqr>", selected: false },
    { id: "8", email: "noreply@spotify.com", displayName: "Spotify", messageCount: 29, lastSeenAt: "2026-03-21", unsubscribeLink: "<https://unsubscribe.spotify.com/stu>", selected: false },
    { id: "9", email: "info@leboncoin.fr", displayName: "Leboncoin", messageCount: 56, lastSeenAt: "2026-03-19", unsubscribeLink: "<https://unsubscribe.leboncoin.fr/vwx>", selected: false },
];

/** Extrait le domaine d'un email expéditeur */
export { domainFromEmail };
