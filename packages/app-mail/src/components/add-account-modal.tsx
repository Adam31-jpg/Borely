"use client";

import { useEffect } from "react";
import { X, Clock } from "lucide-react";

interface AddAccountModalProps {
    onClose: () => void;
    onConnectGoogle: () => void;
}

/**
 * AddAccountModal — Sélection de protocole
 *
 * Esthétique : Industrial Luxury / Retro-Futuristic
 * Zéro border-radius — cohérent avec l'esthétique brutaliste.
 */
export function AddAccountModal({ onClose, onConnectGoogle }: AddAccountModalProps) {
    /* Fermeture Escape */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    /* Blocage scroll */
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        /* Overlay */
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
            }}
        >
            {/* Fond flouté */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backdropFilter: "blur(20px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                    background: "rgba(0,0,0,0.65)",
                }}
            />

            {/* Panneau */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Sélection de protocole de connexion"
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 400,
                    isolation: "isolate",
                    willChange: "transform",
                    animation: "slide-up-fade 0.3s cubic-bezier(0.16,1,0.3,1) both",
                    background: "rgba(8,8,11,0.96)",
                    border: "0.5px solid rgba(255,255,255,0.10)",
                    borderTop: "1px solid rgba(255,255,255,0.18)",
                    backdropFilter: "blur(16px) saturate(1.5)",
                    WebkitBackdropFilter: "blur(16px) saturate(1.5)",
                    boxShadow: "8px 8px 0 rgba(0,0,0,0.60), 0 32px 64px rgba(0,0,0,0.80)",
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
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                    }}
                />

                {/* ── En-tête ── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px 24px 16px",
                        borderBottom: "0.5px solid rgba(255,255,255,0.07)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {/* Indicateur système */}
                        <div
                            style={{
                                width: 6,
                                height: 6,
                                background: "rgb(var(--accent))",
                                boxShadow: "0 0 8px rgb(var(--accent) / 0.70)",
                                flexShrink: 0,
                            }}
                        />
                        <div>
                            <div
                                style={{
                                    fontFamily: "var(--font-geist-mono, monospace)",
                                    fontSize: 9,
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    color: "rgba(255,255,255,0.20)",
                                    marginBottom: 3,
                                }}
                            >
                                BRL // PROTOCOLE
                            </div>
                            <h2
                                style={{
                                    fontFamily: "var(--font-syne, sans-serif)",
                                    fontWeight: 700,
                                    fontSize: 16,
                                    letterSpacing: "-0.04em",
                                    color: "rgba(255,255,255,0.90)",
                                    margin: 0,
                                }}
                            >
                                Ajouter une boîte
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Fermer"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 32,
                            height: 32,
                            background: "transparent",
                            border: "0.5px solid rgba(255,255,255,0.10)",
                            borderRadius: 0,
                            cursor: "pointer",
                            color: "rgba(255,255,255,0.35)",
                            transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.80)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.25)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.10)";
                        }}
                    >
                        <X style={{ width: 14, height: 14 }} />
                    </button>
                </div>

                {/* ── Options ── */}
                <div style={{ padding: "16px 16px 12px" }}>

                    {/* ─ Google Gmail — Actif ─ */}
                    <button
                        onClick={onConnectGoogle}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            padding: "16px 20px",
                            background: "rgba(255,255,255,0.03)",
                            border: "0.5px solid rgba(255,255,255,0.10)",
                            borderLeft: "2px solid rgb(var(--accent) / 0.60)",
                            borderRadius: 0,
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "background 0.15s ease, border-color 0.15s ease",
                            boxShadow: "3px 3px 0 rgb(var(--accent) / 0.06)",
                            marginBottom: 8,
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                        }}
                    >
                        {/* Icône Google */}
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(255,255,255,0.06)",
                                border: "0.5px solid rgba(255,255,255,0.10)",
                                flexShrink: 0,
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                                style={{
                                    fontFamily: "var(--font-syne, sans-serif)",
                                    fontWeight: 700,
                                    fontSize: 14,
                                    letterSpacing: "-0.02em",
                                    color: "rgba(255,255,255,0.88)",
                                    marginBottom: 2,
                                }}
                            >
                                Google Gmail
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-geist-mono, monospace)",
                                    fontSize: 11,
                                    color: "rgba(255,255,255,0.30)",
                                    letterSpacing: "0.02em",
                                }}
                            >
                                Scan via Gmail API v1
                            </div>
                        </div>

                        {/* Badge actif */}
                        <div
                            style={{
                                padding: "4px 10px",
                                fontFamily: "var(--font-geist-mono, monospace)",
                                fontSize: 9,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                fontWeight: 700,
                                color: "rgb(var(--accent))",
                                background: "rgb(var(--accent) / 0.10)",
                                border: "0.5px solid rgb(var(--accent) / 0.25)",
                                flexShrink: 0,
                            }}
                        >
                            Actif
                        </div>
                    </button>

                    {/* ─ Outlook — Bientôt ─ */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            padding: "16px 20px",
                            background: "rgba(255,255,255,0.01)",
                            border: "0.5px solid rgba(255,255,255,0.05)",
                            borderLeft: "2px solid rgba(255,255,255,0.08)",
                            opacity: 0.45,
                            cursor: "not-allowed",
                        }}
                    >
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(255,255,255,0.04)",
                                border: "0.5px solid rgba(255,255,255,0.07)",
                                flexShrink: 0,
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M7 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                                <path d="M5 8l7 5 7-5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                            </svg>
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                                style={{
                                    fontFamily: "var(--font-syne, sans-serif)",
                                    fontWeight: 700,
                                    fontSize: 14,
                                    letterSpacing: "-0.02em",
                                    color: "rgba(255,255,255,0.60)",
                                    marginBottom: 2,
                                }}
                            >
                                Outlook / Hotmail
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-geist-mono, monospace)",
                                    fontSize: 11,
                                    color: "rgba(255,255,255,0.25)",
                                }}
                            >
                                Microsoft Graph API
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "4px 10px",
                                fontFamily: "var(--font-geist-mono, monospace)",
                                fontSize: 9,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.35)",
                                border: "0.5px solid rgba(255,255,255,0.10)",
                                flexShrink: 0,
                            }}
                        >
                            <Clock style={{ width: 10, height: 10 }} />
                            V2
                        </div>
                    </div>
                </div>

                {/* ── Note sécurité ── */}
                <div
                    style={{
                        padding: "12px 24px 20px",
                        borderTop: "0.5px solid rgba(255,255,255,0.05)",
                    }}
                >
                    <p
                        style={{
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 10,
                            lineHeight: 1.6,
                            letterSpacing: "0.04em",
                            color: "rgba(255,255,255,0.18)",
                            textAlign: "center",
                            margin: 0,
                        }}
                    >
                        Tokens chiffrés AES-256 · Isolés par compte · AWS KMS
                    </p>
                </div>

                {/* Coin brutaliste */}
                <div
                    style={{
                        position: "absolute",
                        bottom: -1,
                        right: -1,
                        width: 20,
                        height: 20,
                        background: "rgb(var(--accent))",
                        clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                        opacity: 0.45,
                    }}
                />
            </div>
        </div>
    );
}
