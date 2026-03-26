"use client";

import { useState, useCallback, useRef } from "react";
import { Plus, Mail, Shield, Zap, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@borecore/ui";
import { useGmailScan } from "./hooks/use-gmail-scan";
import { SenderList } from "./components/sender-list";
import { ScanProgress } from "./components/scan-progress";
import { UndoToast } from "./components/undo-toast";
import { AddAccountModal } from "./components/add-account-modal";
import { AccountSelector } from "./components/account-selector";
import { useAccountsStore, generateAccountId } from "./store/accounts";
import { boreboxConfig } from "./config";

const t = boreboxConfig.texts;

/**
 * BoreBox — Nettoyeur de boîte mail
 *
 * Flux multi-compte :
 *   idle → [Connecter Gmail] → connecting → scanning → results → cleaning (undo 5s)
 *
 * Multi-compte :
 *   Bouton [+] en haut à droite → modale → choix provider → connect()
 */
export default function BoreBoxApp() {
    const [showAddModal, setShowAddModal] = useState(false);
    const { addAccount, accounts } = useAccountsStore();

    const {
        state,
        senders,
        scanProgress,
        totalScanned,
        cleaningAction,
        selectedCount,
        connect,
        toggleSender,
        toggleAll,
        clean,
        undoClean,
    } = useGmailScan();

    /** Simule la connexion Google depuis la modale */
    const handleConnectGoogle = useCallback(() => {
        setShowAddModal(false);

        // En production : redirect vers /api/auth/signin?provider=google
        // Pour le prototype : simule la connexion OAuth
        addAccount({
            id: generateAccountId(),
            provider: "gmail",
            email: "perso@gmail.com",
            displayLabel: "Perso",
            stats: { totalSenders: 0, totalMessages: 0, lastScanAt: null },
        });

        connect();
    }, [addAccount, connect]);

    const hasAccounts = accounts.length > 0;

    return (
        <div
            data-app="mail"
            className="relative min-h-full"
        >
            {/* ── En-tête sticky ── */}
            <div
                className="sticky top-0 z-30 flex items-center justify-between
                   px-6 py-4 md:px-10 md:py-5"
                style={{
                    background: "rgba(0,0,0,0.60)",
                    backdropFilter: "blur(20px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                {/* Marque app */}
                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center justify-center w-9 h-9 rounded-xl"
                        style={{
                            background: "rgba(14,165,233,0.15)",
                            boxShadow: "0 0 20px rgba(14,165,233,0.15)",
                        }}
                    >
                        <Mail className="h-4 w-4" style={{ color: "rgb(14,165,233)" }} />
                    </div>
                    <div>
                        <h1 className="text-[15px] font-semibold tracking-tight text-white leading-none">
                            {boreboxConfig.appName}
                        </h1>
                        {hasAccounts && (
                            <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>
                                {accounts.length} boîte{accounts.length > 1 ? "s" : ""} connectée{accounts.length > 1 ? "s" : ""}
                            </p>
                        )}
                    </div>
                </div>

                {/* Droite : sélecteur + bouton + */}
                <div className="flex items-center gap-2">
                    {hasAccounts && <AccountSelector />}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold
                       transition-all duration-200"
                        style={{
                            background: "rgba(14,165,233,0.12)",
                            border: "1px solid rgba(14,165,233,0.25)",
                            color: "rgb(14,165,233)",
                        }}
                        title="Ajouter une boîte mail"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Ajouter</span>
                    </button>
                </div>
            </div>

            {/* ── Contenu principal ── */}
            <div className="px-6 py-10 md:px-10 md:py-12 max-w-3xl mx-auto">

                {/* ─── État : Idle / Connexion ─── */}
                {(state === "idle" || state === "connecting") && (
                    <div className="animate-fade-in-up">
                        {/* Bloc CTA principal */}
                        <div
                            className="relative rounded-3xl overflow-hidden p-8 md:p-12 text-center mb-8"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                boxShadow: "0 0 80px rgba(14,165,233,0.06) inset",
                            }}
                        >
                            {/* Lueur centrale */}
                            <div
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
                                style={{
                                    background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.5), transparent)",
                                }}
                            />

                            {/* Icône */}
                            <div
                                className="flex items-center justify-center w-20 h-20 rounded-3xl mx-auto mb-8"
                                style={{
                                    background: "rgba(14,165,233,0.10)",
                                    border: "1px solid rgba(14,165,233,0.20)",
                                    boxShadow: "0 0 48px rgba(14,165,233,0.20)",
                                }}
                            >
                                <Mail className="h-10 w-10" style={{ color: "rgb(14,165,233)" }} />
                            </div>

                            <h2 className="text-2xl md:text-3xl font-semibold tracking-tighter text-white mb-3">
                                {t.connectTitle}
                            </h2>
                            <p className="mb-8 max-w-md mx-auto leading-relaxed text-[14px]"
                                style={{ color: "rgba(255,255,255,0.50)" }}>
                                {t.connectDescription}
                            </p>

                            <button
                                onClick={() => setShowAddModal(true)}
                                disabled={state === "connecting"}
                                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl
                           text-[14px] font-semibold text-white transition-all duration-200"
                                style={{
                                    background: state === "connecting"
                                        ? "rgba(14,165,233,0.30)"
                                        : "linear-gradient(135deg, rgb(14,165,233), rgb(2,132,199))",
                                    boxShadow: state === "connecting"
                                        ? "none"
                                        : "0 8px 32px rgba(14,165,233,0.40)",
                                }}
                            >
                                {state === "connecting" ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Connexion…
                                    </>
                                ) : (
                                    <>
                                        {/* Google G */}
                                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
                                        </svg>
                                        {t.connectButton}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Indicateurs de confiance */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { icon: Shield, title: t.trustPrivacy, desc: t.trustPrivacyDesc },
                                { icon: Zap, title: t.trustSpeed, desc: t.trustSpeedDesc },
                                { icon: Sparkles, title: t.trustOneClick, desc: t.trustOneClickDesc },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="flex items-start gap-3.5 p-5 rounded-2xl"
                                    style={{
                                        background: "rgba(255,255,255,0.02)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                    }}
                                >
                                    <item.icon className="h-4.5 w-4.5 flex-shrink-0 mt-0.5"
                                        style={{ color: "rgb(14,165,233)", width: 18, height: 18 }} />
                                    <div>
                                        <h3 className="text-[13px] font-semibold text-white mb-0.5">{item.title}</h3>
                                        <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.40)" }}>
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── État : Scan en cours ─── */}
                {state === "scanning" && (
                    <ScanProgress progress={scanProgress} totalScanned={totalScanned} />
                )}

                {/* ─── État : Résultats / Nettoyage ─── */}
                {(state === "results" || state === "cleaning") && (
                    <div className="animate-fade-in-up">
                        {/* Stats header */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold tracking-tight text-white mb-1">
                                {t.resultsTitle}
                            </h2>
                            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                                {senders.length > 0
                                    ? `${senders.length} abonnement${senders.length > 1 ? "s" : ""} détecté${senders.length > 1 ? "s" : ""} · ${totalScanned.toLocaleString("fr-FR")} mails analysés`
                                    : t.resultsEmpty}
                            </p>
                        </div>

                        {senders.length > 0 ? (
                            <SenderList
                                senders={senders}
                                selectedCount={selectedCount}
                                onToggle={toggleSender}
                                onToggleAll={toggleAll}
                                onClean={clean}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div
                                    className="flex items-center justify-center w-16 h-16 rounded-3xl mb-6"
                                    style={{ background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.20)" }}
                                >
                                    <Sparkles className="h-8 w-8" style={{ color: "rgb(34,197,94)" }} />
                                </div>
                                <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                                    {t.resultsEmpty}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ─── Toast Undo ─── */}
            {state === "cleaning" && cleaningAction && (
                <UndoToast
                    count={cleaningAction.senderIds.length}
                    startedAt={cleaningAction.startedAt}
                    onUndo={undoClean}
                />
            )}

            {/* ─── Modale Ajout Compte ─── */}
            {showAddModal && (
                <AddAccountModal
                    onClose={() => setShowAddModal(false)}
                    onConnectGoogle={handleConnectGoogle}
                />
            )}
        </div>
    );
}
