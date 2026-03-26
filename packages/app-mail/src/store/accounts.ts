/**
 * Store Zustand — Gestion Multi-Compte BoreBox
 *
 * Stratégie de stockage isolé :
 *
 *   Mémoire (zustand)  : accounts[], activeAccountId
 *   SessionStorage     : liste des accountIds (pas de tokens !)
 *   Base de données    : tokens chiffrés KMS par (userId, accountId)
 *
 * Le switcher de compte = setActiveAccount(id)
 * Aucune reconnexion OAuth n'est déclenchée.
 *
 * Les stats (totalSenders, totalMessages) sont mises à jour
 * immédiatement après chaque scan via updateStats() pour un
 * affichage temps réel dans le sélecteur de comptes.
 */

import { create } from "zustand";
import type { ConnectedAccount } from "../types";

interface AccountsState {
    /** Liste de tous les comptes connectés */
    accounts: ConnectedAccount[];
    /** ID du compte actif (null = voir "Tous les comptes") */
    activeAccountId: string | null;

    /** Connecte un nouveau compte */
    addAccount: (account: ConnectedAccount) => void;

    /** Change le compte actif sans reconnexion */
    setActiveAccount: (id: string | null) => void;

    /** Met à jour les stats après un scan (temps réel) */
    updateStats: (
        accountId: string,
        stats: ConnectedAccount["stats"]
    ) => void;

    /** Déconnecte un compte */
    removeAccount: (accountId: string) => void;
}

export const useAccountsStore = create<AccountsState>((set) => ({
    accounts: [],
    activeAccountId: null,

    addAccount: (account) =>
        set((state) => {
            // Évite les doublons (même email, même provider)
            const exists = state.accounts.some(
                (a) => a.email === account.email && a.provider === account.provider
            );
            if (exists) return state;
            return { accounts: [...state.accounts, account] };
        }),

    setActiveAccount: (id) => set({ activeAccountId: id }),

    updateStats: (accountId, stats) =>
        set((state) => ({
            accounts: state.accounts.map((a) =>
                a.id === accountId ? { ...a, stats } : a
            ),
        })),

    removeAccount: (accountId) =>
        set((state) => ({
            accounts: state.accounts.filter((a) => a.id !== accountId),
            // Si on retire le compte actif, revenir à "Tous les comptes"
            activeAccountId:
                state.activeAccountId === accountId ? null : state.activeAccountId,
        })),
}));

/** Sélecteur : stats agrégées pour "Tous les comptes" */
export function selectTotalStats(accounts: ConnectedAccount[]) {
    return {
        totalSenders: accounts.reduce((sum, a) => sum + a.stats.totalSenders, 0),
        totalMessages: accounts.reduce((sum, a) => sum + a.stats.totalMessages, 0),
    };
}

/** Génère un accountId unique */
export function generateAccountId(): string {
    return `acc_${Math.random().toString(36).slice(2, 10)}`;
}
