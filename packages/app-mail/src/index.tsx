"use client";

import { useState, useCallback, useEffect } from "react";
import { Plus, Mail, Shield, Zap, Sparkles, Loader2 } from "lucide-react";
import { useGmailScan } from "./hooks/use-gmail-scan";
import { SenderList } from "./components/sender-list";
import { ScanProgress } from "./components/scan-progress";
import { UndoToast } from "./components/undo-toast";
import { AddAccountModal } from "./components/add-account-modal";
import { AccountSelector } from "./components/account-selector";
import { useAccountsStore } from "./store/accounts";
import { boreboxConfig } from "./config";

const t = boreboxConfig.texts;

interface BoreBoxAppProps {
    /** Email réel de l'utilisateur (depuis la session NextAuth côté hub) */
    userEmail?: string;
    /** Nom affiché de l'utilisateur (depuis session.user.name) */
    userName?: string;
}

/**
 * BoreBox — Nettoyeur de boîte mail
 *
 * Flux réel avec NextAuth :
 *   idle → [Connecter Gmail] → /api/auth/signin?provider=google
 *   → retour OAuth → /workspace/mail → scanning → results → cleaning (undo 5s)
 *
 * Si `userEmail` est fourni (injecté depuis le hub via useSession),
 * le compte est créé avec les vraies données de la session.
 */
export default function BoreBoxApp({ userEmail, userName }: BoreBoxAppProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const { accounts } = useAccountsStore();

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

    /**
     * Redirige vers le flux OAuth Google via NextAuth.
     * callbackUrl ramène sur /workspace/mail après le consentement Google.
     */
    const handleConnectGoogle = useCallback(() => {
        setShowAddModal(false);
        window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent("/workspace/mail")}`;
    }, []);

    /**
     * Détection de session au montage :
     * — Si `userEmail` est présent → session NextAuth réelle → connexion directe.
     * — Sinon → détection via cookie pour les retours OAuth sans rechargement.
     */
    useEffect(() => {
        if (state !== "idle" || accounts.length > 0) return;

        if (userEmail) {
            // Session réelle disponible via le hub — connexion automatique
            connect(userEmail, userName ?? undefined);
            return;
        }

        // Fallback : détection de retour OAuth via cookie
        const hasCookie = document.cookie.includes("next-auth.session-token")
            || document.cookie.includes("authjs.session-token");
        if (hasCookie) {
            connect();
        }
    // Intentionnel : on ne veut déclencher ça qu'au montage
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hasAccounts = accounts.length > 0;

    return (
        <div data-app="mail" style={{ position: "relative", minHeight: "100%" }}>

            {/* ── En-tête sticky ── */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px clamp(24px, 4vw, 40px)",
                    background: "rgba(0,0,0,0.65)",
                    backdropFilter: "blur(20px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                }}
            >
                {/* Marque app */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {/* Icône brutaliste */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                        <div
                            style={{
                                position: "absolute",
                                inset: -4,
                                background: "rgba(14,165,233,0.12)",
                                filter: "blur(8px)",
                            }}
                        />
                        <div
                            style={{
                                position: "relative",
                                width: 34,
                                height: 34,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(14,165,233,0.10)",
                                border: "0.5px solid rgba(14,165,233,0.25)",
                                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
                            }}
                        >
                            <Mail style={{ width: 16, height: 16, color: "rgb(14,165,233)" }} />
                        </div>
                    </div>
                    <div>
                        <h1
                            style={{
                                fontFamily: "var(--font-syne, sans-serif)",
                                fontWeight: 800,
                                fontSize: 15,
                                letterSpacing: "-0.04em",
                                color: "rgba(255,255,255,0.90)",
                                margin: 0,
                                lineHeight: 1,
                                textTransform: "uppercase",
                            }}
                        >
                            {boreboxConfig.appName}
                        </h1>
                        {hasAccounts && (
                            <p
                                style={{
                                    fontFamily: "var(--font-geist-mono, monospace)",
                                    fontSize: 10,
                                    color: "rgba(255,255,255,0.30)",
                                    margin: "3px 0 0",
                                    letterSpacing: "0.04em",
                                }}
                            >
                                {accounts.length} boîte{accounts.length > 1 ? "s" : ""} connectée{accounts.length > 1 ? "s" : ""}
                            </p>
                        )}
                    </div>
                </div>

                {/* Droite : sélecteur + bouton + */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {hasAccounts && <AccountSelector />}
                    <button
                        onClick={() => setShowAddModal(true)}
                        title="Ajouter une boîte mail"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 14px",
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 11,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            color: "rgb(14,165,233)",
                            background: "rgba(14,165,233,0.08)",
                            border: "0.5px solid rgba(14,165,233,0.25)",
                            borderRadius: 0,
                            cursor: "pointer",
                            boxShadow: "2px 2px 0 rgba(14,165,233,0.10)",
                            transition: "all 0.15s ease",
                        }}
                    >
                        <Plus style={{ width: 12, height: 12 }} />
                        <span className="hidden sm:inline">Ajouter</span>
                    </button>
                </div>
            </div>

            {/* ── Contenu principal ── */}
            <div
                style={{
                    padding: "clamp(32px, 6vw, 56px) clamp(24px, 4vw, 40px)",
                    maxWidth: 760,
                    margin: "0 auto",
                }}
            >

                {/* ─── État : Idle / Connexion ─── */}
                {(state === "idle" || state === "connecting") && (
                    <div style={{ animation: "fade-in-up 0.35s cubic-bezier(0.16,1,0.3,1) both" }}>

                        {/* ── Bloc CTA principal — style "instrument panel" ── */}
                        <div
                            style={{
                                position: "relative",
                                padding: "clamp(32px, 6vw, 56px) clamp(24px, 4vw, 40px)",
                                marginBottom: 24,
                                background: "rgba(255,255,255,0.02)",
                                border: "0.5px solid rgba(255,255,255,0.07)",
                                borderTop: "1px solid rgba(14,165,233,0.25)",
                                backdropFilter: "blur(16px) saturate(1.4)",
                                WebkitBackdropFilter: "blur(16px) saturate(1.4)",
                                boxShadow: "6px 6px 0 rgba(14,165,233,0.06)",
                            }}
                        >
                            {/* Reflet haut */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: "8%",
                                    right: "8%",
                                    height: "0.5px",
                                    background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.30), transparent)",
                                }}
                            />

                            {/* Code système */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    marginBottom: 32,
                                }}
                            >
                                <div
                                    style={{
                                        width: 28,
                                        height: 1,
                                        background: "rgba(14,165,233,0.50)",
                                    }}
                                />
                                <span
                                    style={{
                                        fontFamily: "var(--font-geist-mono, monospace)",
                                        fontSize: 10,
                                        letterSpacing: "0.14em",
                                        textTransform: "uppercase",
                                        color: "rgb(14,165,233)",
                                    }}
                                >
                                    BoreBox — Initialisation
                                </span>
                            </div>

                            {/* Titre */}
                            <h2
                                style={{
                                    fontFamily: "var(--font-syne, sans-serif)",
                                    fontWeight: 800,
                                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                                    letterSpacing: "-0.05em",
                                    lineHeight: 0.92,
                                    color: "rgba(255,255,255,0.90)",
                                    margin: "0 0 16px",
                                }}
                            >
                                {t.connectTitle}
                            </h2>

                            <p
                                style={{
                                    fontFamily: "var(--font-geist-mono, monospace)",
                                    fontSize: 13,
                                    lineHeight: 1.7,
                                    color: "rgba(255,255,255,0.35)",
                                    maxWidth: 440,
                                    margin: "0 0 36px",
                                }}
                            >
                                {t.connectDescription}
                            </p>

                            {/* Bouton principal */}
                            <button
                                onClick={() => setShowAddModal(true)}
                                disabled={state === "connecting"}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "16px 32px",
                                    fontFamily: "var(--font-syne, sans-serif)",
                                    fontWeight: 700,
                                    fontSize: 14,
                                    letterSpacing: "0.02em",
                                    textTransform: "uppercase",
                                    color: state === "connecting" ? "rgba(255,255,255,0.60)" : "#000",
                                    background: state === "connecting"
                                        ? "rgba(14,165,233,0.20)"
                                        : "rgb(14,165,233)",
                                    border: "0.5px solid rgba(14,165,233,0.40)",
                                    borderRadius: 0,
                                    boxShadow: state === "connecting" ? "none" : "4px 4px 0 rgba(14,165,233,0.25)",
                                    cursor: state === "connecting" ? "not-allowed" : "pointer",
                                    transition: "all 0.15s ease",
                                }}
                            >
                                {state === "connecting" ? (
                                    <>
                                        <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                                        Connexion...
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#000" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#000" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#000" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#000" />
                                        </svg>
                                        {t.connectButton}
                                    </>
                                )}
                            </button>

                            {/* Coin brutaliste */}
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: -1,
                                    right: -1,
                                    width: 24,
                                    height: 24,
                                    background: "rgb(14,165,233)",
                                    clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                                    opacity: 0.50,
                                }}
                            />
                        </div>

                        {/* ── Indicateurs de confiance ── */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                gap: 8,
                            }}
                        >
                            {[
                                { icon: Shield, title: t.trustPrivacy, desc: t.trustPrivacyDesc },
                                { icon: Zap, title: t.trustSpeed, desc: t.trustSpeedDesc },
                                { icon: Sparkles, title: t.trustOneClick, desc: t.trustOneClickDesc },
                            ].map((item, i) => (
                                <div
                                    key={item.title}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 14,
                                        padding: "16px 20px",
                                        background: "rgba(255,255,255,0.02)",
                                        border: "0.5px solid rgba(255,255,255,0.06)",
                                        animation: `slide-up-fade 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 60 + 100}ms both`,
                                    }}
                                >
                                    <item.icon
                                        style={{
                                            width: 16,
                                            height: 16,
                                            color: "rgba(14,165,233,0.70)",
                                            flexShrink: 0,
                                            marginTop: 2,
                                        }}
                                    />
                                    <div>
                                        <h3
                                            style={{
                                                fontFamily: "var(--font-syne, sans-serif)",
                                                fontWeight: 700,
                                                fontSize: 13,
                                                letterSpacing: "-0.02em",
                                                color: "rgba(255,255,255,0.70)",
                                                margin: "0 0 3px",
                                            }}
                                        >
                                            {item.title}
                                        </h3>
                                        <p
                                            style={{
                                                fontFamily: "var(--font-geist-mono, monospace)",
                                                fontSize: 11,
                                                lineHeight: 1.6,
                                                color: "rgba(255,255,255,0.28)",
                                                margin: 0,
                                            }}
                                        >
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
                    <div style={{ animation: "fade-in-up 0.35s cubic-bezier(0.16,1,0.3,1) both" }}>
                        {/* Stats header */}
                        <div
                            style={{
                                marginBottom: 32,
                                paddingBottom: 20,
                                borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    marginBottom: 12,
                                }}
                            >
                                <div style={{ width: 20, height: 1, background: "rgba(14,165,233,0.50)" }} />
                                <span
                                    style={{
                                        fontFamily: "var(--font-geist-mono, monospace)",
                                        fontSize: 10,
                                        letterSpacing: "0.14em",
                                        textTransform: "uppercase",
                                        color: "rgba(14,165,233,0.70)",
                                    }}
                                >
                                    Résultats
                                </span>
                            </div>
                            <h2
                                style={{
                                    fontFamily: "var(--font-syne, sans-serif)",
                                    fontWeight: 800,
                                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                                    letterSpacing: "-0.05em",
                                    lineHeight: 0.95,
                                    color: "rgba(255,255,255,0.88)",
                                    margin: "0 0 8px",
                                }}
                            >
                                {t.resultsTitle}
                            </h2>
                            <p
                                style={{
                                    fontFamily: "var(--font-geist-mono, monospace)",
                                    fontSize: 12,
                                    color: "rgba(255,255,255,0.35)",
                                    margin: 0,
                                }}
                            >
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
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "72px 32px",
                                    textAlign: "center",
                                    border: "0.5px dashed rgba(255,255,255,0.06)",
                                }}
                            >
                                <div
                                    style={{
                                        width: 56,
                                        height: 56,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "rgba(34,197,94,0.08)",
                                        border: "0.5px solid rgba(34,197,94,0.18)",
                                        marginBottom: 20,
                                        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                                    }}
                                >
                                    <Sparkles style={{ width: 24, height: 24, color: "rgb(34,197,94)" }} />
                                </div>
                                <p
                                    style={{
                                        fontFamily: "var(--font-geist-mono, monospace)",
                                        fontSize: 13,
                                        color: "rgba(255,255,255,0.35)",
                                        margin: 0,
                                    }}
                                >
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
