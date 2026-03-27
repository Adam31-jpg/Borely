"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const ERROR_MESSAGES: Record<string, { title: string; description: string; code: string }> = {
    Configuration: {
        title: "Erreur de Configuration",
        description: "Le serveur d'authentification est mal configuré. Contactez le support.",
        code: "ERR_CONFIG",
    },
    AccessDenied: {
        title: "Accès Refusé",
        description: "Vous n'avez pas les autorisations nécessaires pour accéder à cette ressource.",
        code: "ERR_ACCESS",
    },
    Verification: {
        title: "Lien Expiré",
        description: "Le lien de vérification a expiré ou a déjà été utilisé.",
        code: "ERR_VERIFY",
    },
    Default: {
        title: "Erreur d'Authentification",
        description: "Une erreur inattendue s'est produite. Réessayez ou contactez le support.",
        code: "ERR_AUTH",
    },
};

function AuthErrorContent() {
    const params = useSearchParams();
    const errorType = params.get("error") ?? "Default";
    const error = ERROR_MESSAGES[errorType] ?? ERROR_MESSAGES["Default"]!;

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(24px, 5vw, 64px)",
                background: "transparent",
            }}
        >
            {/* Panel glassmorphism central */}
            <div
                style={{
                    width: "100%",
                    maxWidth: 480,
                    position: "relative",
                    background: "rgba(255,255,255,0.02)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(16px) saturate(1.4)",
                    WebkitBackdropFilter: "blur(16px) saturate(1.4)",
                    boxShadow: "6px 6px 0 rgba(239,68,68,0.08)",
                    padding: "clamp(32px, 5vw, 56px)",
                    animation: "slide-up-fade 0.4s cubic-bezier(0.16,1,0.3,1) both",
                }}
            >
                {/* Ligne de reflet */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: "10%",
                        right: "10%",
                        height: "0.5px",
                        background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.25), transparent)",
                    }}
                />

                {/* Code erreur — accent rouge */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 32,
                    }}
                >
                    {/* Carré accent rouge */}
                    <div
                        style={{
                            width: 8,
                            height: 8,
                            background: "rgb(239,68,68)",
                            boxShadow: "0 0 12px rgba(239,68,68,0.60)",
                            flexShrink: 0,
                        }}
                    />
                    <span
                        style={{
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 10,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "rgb(239,68,68)",
                        }}
                    >
                        Borely — {error.code}
                    </span>
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
                        margin: "0 0 16px",
                    }}
                >
                    {error.title}
                </h1>

                {/* Description */}
                <p
                    style={{
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: "rgba(255,255,255,0.40)",
                        margin: "0 0 40px",
                    }}
                >
                    {error.description}
                </p>

                {/* Séparateur */}
                <div
                    style={{
                        height: "0.5px",
                        background: "rgba(255,255,255,0.06)",
                        marginBottom: 32,
                    }}
                />

                {/* Actions */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    {/* Réessayer */}
                    <a
                        href="/api/auth/signin/google?callbackUrl=%2F"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            padding: "14px 24px",
                            fontFamily: "var(--font-syne, sans-serif)",
                            fontWeight: 700,
                            fontSize: 13,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            textDecoration: "none",
                            color: "#000",
                            background: "rgba(255,255,255,0.90)",
                            border: "0.5px solid rgba(255,255,255,0.20)",
                            boxShadow: "3px 3px 0 rgba(255,255,255,0.10)",
                            transition: "all 0.15s ease",
                        }}
                    >
                        {/* Google G */}
                        <svg width="14" height="14" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Réessayer avec Google
                    </a>

                    {/* Retour */}
                    <Link
                        href="/"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "14px 24px",
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 12,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            textDecoration: "none",
                            color: "rgba(255,255,255,0.35)",
                            border: "0.5px solid rgba(255,255,255,0.08)",
                            background: "transparent",
                            transition: "all 0.15s ease",
                        }}
                    >
                        ← Retour à la Boutique
                    </Link>
                </div>

                {/* Coin brutaliste */}
                <div
                    style={{
                        position: "absolute",
                        bottom: -1,
                        right: -1,
                        width: 24,
                        height: 24,
                        background: "rgb(239,68,68)",
                        clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                        opacity: 0.6,
                    }}
                />
            </div>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={null}>
            <AuthErrorContent />
        </Suspense>
    );
}
