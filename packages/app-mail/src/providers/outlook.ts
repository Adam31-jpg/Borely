/**
 * OutlookProvider — Squelette Microsoft Graph
 *
 * Scopes OAuth requis (prévu) :
 *   - Mail.Read       : lecture des messages
 *   - Mail.ReadWrite  : modification / archivage
 *   - offline_access  : refresh token
 *
 * Endpoint Graph : https://graph.microsoft.com/v1.0/me/messages
 * Filtre prévu : $filter=categories/any(c:c eq 'Newsletter')
 *               ou analyse des en-têtes List-Unsubscribe
 *
 * ⚠️ Non implémenté en V1 — squelette prêt pour V2
 */

import type {
    IMailProvider,
    ProviderSession,
    ScanOptions,
    UnsubscribeResult,
    ProviderType,
} from "./types";
import type { ScannedSender } from "../types";

export class OutlookProvider implements IMailProvider {
    readonly providerType: ProviderType = "outlook";

    async connect(): Promise<ProviderSession> {
        // TODO V2 : OAuth Microsoft Identity Platform
        // Endpoint : https://login.microsoftonline.com/common/oauth2/v2.0/authorize
        // Client ID : process.env.MICROSOFT_CLIENT_ID
        throw new Error(
            "OutlookProvider non disponible en V1 — bientôt disponible."
        );
    }

    async fetchPromotions(_options: ScanOptions): Promise<ScannedSender[]> {
        // TODO V2 : GET https://graph.microsoft.com/v1.0/me/messages
        //   ?$filter=singleValueExtendedProperties/any(ep: ep/id eq 'String 0x0019' and ep/value ne null)
        //   &$select=from,receivedDateTime,singleValueExtendedProperties
        throw new Error(
            "OutlookProvider non disponible en V1 — bientôt disponible."
        );
    }

    async unsubscribe(
        _senderId: string,
        _accountId: string
    ): Promise<UnsubscribeResult> {
        // TODO V2 : Créer une règle via POST /me/mailFolders/inbox/messageRules
        throw new Error(
            "OutlookProvider non disponible en V1 — bientôt disponible."
        );
    }
}
