/**
 * Architecture IMailProvider — Types partagés
 *
 * Stratégie "Plug-and-Play" :
 * Chaque provider (Gmail, Outlook, Yahoo...) implémente l'interface IMailProvider.
 * Le reste du code ne connaît que cette interface.
 */

import type { ScannedSender } from "../types";

/** Types de providers supportés */
export type ProviderType = "gmail" | "outlook";

/** Session OAuth active d'un provider */
export interface ProviderSession {
    accountId: string;
    provider: ProviderType;
    email: string;
    displayName: string;
    avatarUrl?: string;
    accessToken: string;
    expiresAt: number;
}

/** Options de scan */
export interface ScanOptions {
    /** Nombre maximum de mails à analyser */
    limit: number;
    /** ID du compte (pour le multi-compte) */
    accountId: string;
    /** Access token OAuth décrypté (injecté par la route API) */
    accessToken?: string;
}

/** Résultat d'un désabonnement */
export interface UnsubscribeResult {
    success: boolean;
    method: "list-unsubscribe-url" | "list-unsubscribe-email" | "filter-only";
    error?: string;
}

/**
 * Interface principale que tout provider de mail doit implémenter.
 *
 * Pour ajouter un nouveau provider :
 * 1. Créer une classe `XxxProvider implements IMailProvider`
 * 2. L'enregistrer dans `factory.ts`
 * 3. Ajouter le scope OAuth nécessaire dans la config
 */
export interface IMailProvider {
    readonly providerType: ProviderType;

    /**
     * Lance le flux OAuth et retourne une session active.
     * Redirige vers la page de consentement du provider.
     */
    connect(): Promise<ProviderSession>;

    /**
     * Récupère les expéditeurs de promotions/newsletters
     * via l'en-tête List-Unsubscribe.
     */
    fetchPromotions(options: ScanOptions): Promise<ScannedSender[]>;

    /**
     * Désabonne d'un expéditeur :
     * 1. Tente le désabonnement via List-Unsubscribe (URL ou email)
     * 2. Crée un filtre pour supprimer les futurs mails
     */
    unsubscribe(
        senderEmail: string,
        accountId: string,
        accessToken?: string,
        unsubscribeLink?: string,
    ): Promise<UnsubscribeResult>;
}
