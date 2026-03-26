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

/** Regex pour extraire les URLs et emails du header List-Unsubscribe */
const RE_UNSUBSCRIBE_URL = /<(https?:\/\/[^>]+)>/i;
const RE_UNSUBSCRIBE_MAIL = /<mailto:([^>]+)>/i;

/** Domaine extrait d'une adresse email */
function domainFromEmail(email: string): string {
    return email.split("@")[1] ?? email;
}

export class GmailProvider implements IMailProvider {
    readonly providerType: ProviderType = "gmail";

    /**
     * Lance le flux OAuth Google.
     *
     * En production : redirige vers /api/auth/signin?provider=google
     * (géré par NextAuth avec les scopes gmail.readonly + gmail.modify)
     *
     * Retourne la session depuis la DB après callback OAuth.
     */
    async connect(): Promise<ProviderSession> {
        // Le flux OAuth est géré par NextAuth côté serveur.
        // Le client poste à /api/auth/signin?callbackUrl=/workspace/mail
        // Cette méthode est appelée après que le callback ait créé la session.
        throw new Error(
            "connect() s'effectue via NextAuth — utiliser /api/auth/signin?provider=google"
        );
    }

    /**
     * Récupère les expéditeurs de promotions via l'API Gmail.
     *
     * Algorithme :
     * 1. Liste les messages du label CATEGORY_PROMOTIONS (jusqu'à `limit`)
     * 2. Récupère les en-têtes From + List-Unsubscribe en batch (batchGet)
     * 3. Groupe par adresse email d'expéditeur
     * 4. Filtre : garde uniquement les expéditeurs avec List-Unsubscribe
     *
     * @param options.limit   — Nombre max de messages à analyser
     * @param options.accountId — ID du compte (pour récupérer le bon token)
     */
    async fetchPromotions(options: ScanOptions): Promise<ScannedSender[]> {
        const { limit, accountId } = options;

        // ── Étape 1 : Récupérer le token depuis la DB (via route API) ──
        // En production : await db.getDecryptedToken(accountId)
        // Pour cette V1 : les données sont injectées par la route API
        // qui dispose du token NextAuth.

        // ── Structure de l'appel Gmail API ──
        // GET https://gmail.googleapis.com/gmail/v1/users/me/messages
        //   ?q=in:promotions&maxResults={limit}&labelIds=CATEGORY_PROMOTIONS
        //
        // Pour chaque message :
        // GET .../users/me/messages/{id}?format=metadata
        //   &metadataHeaders=From&metadataHeaders=List-Unsubscribe

        // ── Données simulées pour le prototype ──
        // À remplacer par les appels réels quand le token OAuth est configuré.
        void limit; // utilisé dans le vrai appel
        void accountId;

        return MOCK_SENDERS;
    }

    /**
     * Désabonne d'un expéditeur en 2 étapes :
     *
     * Étape 1 — Désabonnement List-Unsubscribe :
     *   a. Si URL → requête POST vers l'URL (RFC 8058 one-click)
     *   b. Si email → envoi d'un email vide à l'adresse de désabonnement
     *
     * Étape 2 — Filtre Gmail (indépendant du succès de l'étape 1) :
     *   POST .../users/me/settings/filters
     *   { criteria: { from: "sender@domain.com" }, action: { removeLabelIds: ["INBOX"], addLabelIds: ["TRASH"] } }
     */
    async unsubscribe(
        senderId: string,
        _accountId: string
    ): Promise<UnsubscribeResult> {
        const sender = MOCK_SENDERS.find((s) => s.id === senderId);
        if (!sender) {
            return { success: false, method: "filter-only", error: "Expéditeur introuvable" };
        }

        // ── Étape 1 : Tenter le désabonnement List-Unsubscribe ──
        const urlMatch = sender.unsubscribeLink.match(RE_UNSUBSCRIBE_URL);
        const mailMatch = sender.unsubscribeLink.match(RE_UNSUBSCRIBE_MAIL);

        let method: UnsubscribeResult["method"] = "filter-only";

        if (urlMatch) {
            // En production : fetch(urlMatch[1], { method: "POST" })
            method = "list-unsubscribe-url";
        } else if (mailMatch) {
            // En production : envoyer un email vide via gmail.users.messages.send
            method = "list-unsubscribe-email";
        }

        // ── Étape 2 : Créer un filtre Gmail ──
        // En production :
        // await gmail.users.settings.filters.create({
        //   userId: "me",
        //   resource: {
        //     criteria: { from: sender.email },
        //     action: { removeLabelIds: ["INBOX"], addLabelIds: ["TRASH"] }
        //   }
        // });

        return { success: true, method };
    }
}

/** Données simulées — À remplacer par les appels Gmail API réels */
const MOCK_SENDERS: ScannedSender[] = [
    {
        id: "1",
        email: "newsletter@netflix.com",
        displayName: "Netflix",
        messageCount: 47,
        lastSeenAt: "2026-03-24",
        unsubscribeLink: "<https://unsubscribe.netflix.com/xyz>",
        selected: false,
    },
    {
        id: "2",
        email: "noreply@amazon.fr",
        displayName: "Amazon",
        messageCount: 123,
        lastSeenAt: "2026-03-25",
        unsubscribeLink: "<https://unsubscribe.amazon.fr/abc>",
        selected: false,
    },
    {
        id: "3",
        email: "deals@cdiscount.com",
        displayName: "Cdiscount",
        messageCount: 89,
        lastSeenAt: "2026-03-23",
        unsubscribeLink: "<https://unsubscribe.cdiscount.com/def>",
        selected: false,
    },
    {
        id: "4",
        email: "info@linkedin.com",
        displayName: "LinkedIn",
        messageCount: 201,
        lastSeenAt: "2026-03-25",
        unsubscribeLink: "<https://unsubscribe.linkedin.com/ghi>",
        selected: false,
    },
    {
        id: "5",
        email: "promo@booking.com",
        displayName: "Booking.com",
        messageCount: 34,
        lastSeenAt: "2026-03-20",
        unsubscribeLink: "<https://unsubscribe.booking.com/jkl>",
        selected: false,
    },
    {
        id: "6",
        email: "newsletter@medium.com",
        displayName: "Medium",
        messageCount: 67,
        lastSeenAt: "2026-03-22",
        unsubscribeLink: "<https://unsubscribe.medium.com/mno>",
        selected: false,
    },
    {
        id: "7",
        email: "receipts@uber.com",
        displayName: "Uber",
        messageCount: 15,
        lastSeenAt: "2026-03-18",
        unsubscribeLink: "<https://unsubscribe.uber.com/pqr>",
        selected: false,
    },
    {
        id: "8",
        email: "noreply@spotify.com",
        displayName: "Spotify",
        messageCount: 29,
        lastSeenAt: "2026-03-21",
        unsubscribeLink: "<https://unsubscribe.spotify.com/stu>",
        selected: false,
    },
    {
        id: "9",
        email: "info@leboncoin.fr",
        displayName: "Leboncoin",
        messageCount: 56,
        lastSeenAt: "2026-03-19",
        unsubscribeLink: "<https://unsubscribe.leboncoin.fr/vwx>",
        selected: false,
    },
];

/** Extrait le domaine d'un email expéditeur */
export { domainFromEmail };
