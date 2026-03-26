/**
 * Types BoreBox — Nettoyeur de boîte mail
 */

import type { ProviderType } from "./providers/types";

/** État de la machine d'état du scan */
export type ScanState =
    | "idle"
    | "connecting"
    | "scanning"
    | "results"
    | "cleaning";

/** Ordre de tri des expéditeurs */
export type SortOrder = "count-desc" | "date-desc";

/** Compte mail connecté */
export interface ConnectedAccount {
    /** Identifiant unique généré à la connexion (ex: "acc_abc123") */
    id: string;
    provider: ProviderType;
    /** Adresse email (ex: "perso@gmail.com") */
    email: string;
    /** Label affiché (ex: "Perso", "Pro") */
    displayLabel: string;
    avatarUrl?: string;
    /** Statistiques mises à jour après chaque scan sans refetch */
    stats: {
        totalSenders: number;
        totalMessages: number;
        lastScanAt: string | null;
    };
}

/** Expéditeur scanné avec en-tête List-Unsubscribe */
export interface ScannedSender {
    id: string;
    email: string;
    displayName: string;
    messageCount: number;
    lastSeenAt: string;
    /** Valeur brute du header List-Unsubscribe (ex: "<https://...>") */
    unsubscribeLink: string;
    selected: boolean;
    /** ID du compte d'origine (multi-compte) */
    accountId?: string;
}

/** Action de nettoyage en cours (pour le countdown undo) */
export interface CleaningAction {
    senderIds: string[];
    startedAt: number;
    timerId: ReturnType<typeof setTimeout> | null;
}

/** Résultat global d'un scan */
export interface ScanResult {
    senders: ScannedSender[];
    totalScanned: number;
    durationMs: number;
}
