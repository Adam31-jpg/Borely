"use client";

import { useState, useCallback } from "react";
import type { ScannedSender, ScanState, CleaningAction } from "../types";
import { boreboxConfig } from "../config";
import { useAccountsStore, generateAccountId } from "../store/accounts";

/**
 * Hook principal de BoreBox.
 *
 * Flux réel avec NextAuth :
 *   1. `connect()` → `signIn("google")` → OAuth Google → callback → /workspace/mail
 *   2. `startScan()` → `POST /api/mail/scan` avec l'accessToken de session
 *   3. Les résultats sont mis à jour dans useAccountsStore.updateStats()
 *
 * V1 : Le scan utilise encore les données simulées du GmailProvider
 *      (les appels Gmail API réels nécessitent le token d'une vraie session OAuth).
 *      Dès que GOOGLE_CLIENT_ID est configuré, tout est opérationnel.
 */
export function useGmailScan() {
    const [state, setState] = useState<ScanState>("idle");
    const [senders, setSenders] = useState<ScannedSender[]>([]);
    const [scanProgress, setScanProgress] = useState(0);
    const [totalScanned, setTotalScanned] = useState(0);
    const [cleaningAction, setCleaningAction] = useState<CleaningAction | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { addAccount, updateStats } = useAccountsStore();

    /**
     * Lance le scan via l'API route.
     * Utilise l'accountId du compte actif pour récupérer le bon token en DB.
     */
    const startScan = useCallback(async (accountId: string) => {
        setState("scanning");
        setScanProgress(0);
        setError(null);

        try {
            /* ── Animation de progression ── */
            const progressInterval = setInterval(() => {
                setScanProgress((prev) => {
                    const next = prev + (100 - prev) * 0.12;
                    return Math.min(next, 92); // S'arrête à 92% en attendant la vraie réponse
                });
            }, 200);

            const res = await fetch("/api/mail/scan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accountId,
                    provider: "gmail",
                    limit: boreboxConfig.maxScanEmails,
                }),
            });

            clearInterval(progressInterval);

            if (!res.ok) {
                const err = await res.json() as { error?: string };
                throw new Error(err.error ?? "Erreur de scan");
            }

            const data = await res.json() as {
                senders: ScannedSender[];
                totalScanned: number;
            };

            setScanProgress(100);
            setTotalScanned(data.totalScanned);
            setSenders(data.senders);

            // Mise à jour temps réel des stats dans le store
            updateStats(accountId, {
                totalSenders: data.senders.length,
                totalMessages: data.totalScanned,
                lastScanAt: new Date().toISOString(),
            });

            setTimeout(() => setState("results"), 400);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur inconnue";
            setError(message);
            setState("idle");
        }
    }, [updateStats]);

    /**
     * Simule la transition connecting → scanning.
     * Crée le compte dans le store puis lance le scan.
     *
     * En production : cette fonction est appelée APRÈS le retour OAuth
     * (le composant détecte la session NextAuth via useSession).
     */
    const connect = useCallback(() => {
        setState("connecting");

        // Création du compte dans le store (sera rempli depuis la session NextAuth)
        const accountId = generateAccountId();
        addAccount({
            id: accountId,
            provider: "gmail",
            email: "perso@gmail.com",
            displayLabel: "Perso",
            stats: { totalSenders: 0, totalMessages: 0, lastScanAt: null },
        });

        // Délai simulant le retour OAuth + initialisation token
        setTimeout(() => startScan(accountId), 800);
    }, [addAccount, startScan]);

    const toggleSender = useCallback((id: string) => {
        setSenders((prev) =>
            prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
        );
    }, []);

    const toggleAll = useCallback(() => {
        setSenders((prev) => {
            const allSelected = prev.every((s) => s.selected);
            return prev.map((s) => ({ ...s, selected: !allSelected }));
        });
    }, []);

    const clean = useCallback(() => {
        const selectedIds = senders.filter((s) => s.selected).map((s) => s.id);
        if (selectedIds.length === 0) return;
        setState("cleaning");

        const timerId = setTimeout(() => {
            setSenders((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
            setCleaningAction(null);
            setState("results");
        }, boreboxConfig.undoDelayMs);

        setCleaningAction({ senderIds: selectedIds, startedAt: Date.now(), timerId });
    }, [senders]);

    const undoClean = useCallback(() => {
        if (cleaningAction?.timerId) clearTimeout(cleaningAction.timerId);
        setCleaningAction(null);
        setState("results");
    }, [cleaningAction]);

    const selectedCount = senders.filter((s) => s.selected).length;

    return {
        state, senders, scanProgress, totalScanned,
        cleaningAction, selectedCount, error,
        connect, toggleSender, toggleAll, clean, undoClean,
    };
}
