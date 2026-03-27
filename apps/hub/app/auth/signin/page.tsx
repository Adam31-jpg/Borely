"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInContent() {
    const params = useSearchParams();
    const callbackUrl = params.get("callbackUrl") ?? "/";

    const handleGoogleSignIn = () => {
        window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(24px, 5vw, 64px)",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 440,
                    position: "relative",
                    background: "rgba(255,255,255,0.02)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(16px) saturate(1.4)",
                    WebkitBackdropFilter: "blur(16px) saturate(1.4)",
                    boxShadow: "6px 6px 0 rgba(14,165,233,0.08)",
                    padding: "clamp(32px, 5vw, 56px)",
                    animation: "slide-up-fade 0.4s cubic-bezier(0.16,1,0.3,1) both",
                }}
            >
                {/* Reflet haut */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: "10%",
                        right: "10%",
                        height: "0.5px",
                        background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.30), transparent)",
                    }}
                />

                {/* Logo + label */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 40,
                    }}
                >
                    <div
                        style={{
                            width: 24,
                            height: 24,
                            background: "rgb(14,165,233)",
                            clipPath: "polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)",
                            boxShadow: "3px 3px 0 rgba(14,165,233,0.20)",
                            flexShrink: 0,
                        }}
                    />
                    <span
                        style={{
                            fontFamily: "var(--font-syne, sans-serif)",
                            fontWeight: 800,
                            fontSize: 16,
                            letterSpacing: "-0.04em",
                            color: "rgba(255,255,255,0.90)",
                            textTransform: "uppercase",
                        }}
                    >
                        Borely
                    </span>
                    <div
                        style={{
                            marginLeft: "auto",
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 10,
                            letterSpacing: "0.10em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.20)",
                        }}
                    >
                        Auth
                    </div>
                </div>

                {/* Titre */}
                <h1
                    style={{
                        fontFamily: "var(--font-syne, sans-serif)",
                        fontWeight: 800,
                        fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                        letterSpacing: "-0.05em",
                        lineHeight: 0.95,
                        color: "rgba(255,255,255,0.92)",
                        margin: "0 0 12px",
                    }}
                >
                    Connexion
                </h1>

                <p
                    style={{
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: "rgba(255,255,255,0.35)",
                        margin: "0 0 36px",
                    }}
                >
                    Connectez-vous avec votre compte Google pour accéder à vos micro-apps.
                </p>

                {/* Séparateur */}
                <div
                    style={{
                        height: "0.5px",
                        background: "rgba(255,255,255,0.06)",
                        marginBottom: 32,
                    }}
                />

                {/* Bouton Google */}
                <button
                    onClick={handleGoogleSignIn}
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        padding: "16px 24px",
                        fontFamily: "var(--font-syne, sans-serif)",
                        fontWeight: 700,
                        fontSize: 14,
                        letterSpacing: "0.02em",
                        textTransform: "uppercase",
                        color: "#000",
                        background: "rgba(255,255,255,0.92)",
                        border: "0.5px solid rgba(255,255,255,0.20)",
                        borderRadius: 0,
                        boxShadow: "4px 4px 0 rgba(14,165,233,0.20)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                    }}
                >
                    {/* Google G officiel */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continuer avec Google
                </button>

                {/* Note légale */}
                <p
                    style={{
                        marginTop: 24,
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 10,
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.18)",
                        textAlign: "center",
                    }}
                >
                    En vous connectant, vous acceptez nos conditions d'utilisation.
                    <br />
                    Vos tokens sont chiffrés via AWS KMS.
                </p>

                {/* Coin brutaliste */}
                <div
                    style={{
                        position: "absolute",
                        bottom: -1,
                        right: -1,
                        width: 20,
                        height: 20,
                        background: "rgb(14,165,233)",
                        clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                        opacity: 0.5,
                    }}
                />
            </div>
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={null}>
            <SignInContent />
        </Suspense>
    );
}
