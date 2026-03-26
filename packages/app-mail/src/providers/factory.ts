/**
 * Factory de providers de mail.
 * Retourne l'implémentation correcte selon le type de provider.
 */

import { GmailProvider } from "./gmail";
import { OutlookProvider } from "./outlook";
import type { IMailProvider, ProviderType } from "./types";

/**
 * Crée et retourne le provider adapté.
 *
 * @param type — "gmail" | "outlook"
 * @throws si le provider n'est pas encore implémenté
 */
export function createProvider(type: ProviderType): IMailProvider {
    switch (type) {
        case "gmail":
            return new GmailProvider();
        case "outlook":
            return new OutlookProvider();
        default: {
            const exhaustive: never = type;
            throw new Error(`Provider inconnu : ${exhaustive}`);
        }
    }
}
