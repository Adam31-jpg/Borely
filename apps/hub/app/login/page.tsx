"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleCredentials(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("Email ou mot de passe incorrect.");
            return;
        }

        router.push(callbackUrl);
    }

    async function handleGoogle() {
        await signIn("google", { callbackUrl });
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 24px",
                background: "#0a0a0a",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 400,
                    position: "relative",
                }}
            >
                {/* Pre-label */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 28,
                    }}
                >
                    <div style={{ width: 24, height: 1, background: "rgb(14,165,233)" }} />
                    <span
                        style={{
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 10,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "rgb(14,165,233)",
                        }}
                    >
                        Borely — Accès
                    </span>
                </div>

                {/* Titre */}
                <h1
                    style={{
                        fontFamily: "var(--font-syne, sans-serif)",
                        fontWeight: 800,
                        fontSize: "clamp(2rem, 6vw, 3rem)",
                        letterSpacing: "-0.05em",
                        lineHeight: 0.92,
                        color: "rgba(255,255,255,0.92)",
                        margin: "0 0 32px",
                    }}
                >
                    Connexion
                </h1>

                {/* Panel glassmorphism */}
                <div
                    style={{
                        position: "relative",
                        padding: "32px",
                        background: "rgba(255,255,255,0.02)",
                        border: "0.5px solid rgba(255,255,255,0.08)",
                        borderTop: "1px solid rgba(14,165,233,0.20)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        boxShadow: "6px 6px 0 rgba(14,165,233,0.06)",
                    }}
                >
                    {/* Bouton Google */}
                    <button
                        type="button"
                        onClick={handleGoogle}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            padding: "12px 20px",
                            marginBottom: 24,
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.80)",
                            background: "rgba(255,255,255,0.04)",
                            border: "0.5px solid rgba(255,255,255,0.12)",
                            borderRadius: 0,
                            cursor: "pointer",
                            boxShadow: "3px 3px 0 rgba(0,0,0,0.30)",
                            transition: "all 0.12s ease",
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="rgba(255,255,255,0.70)" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="rgba(255,255,255,0.70)" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="rgba(255,255,255,0.70)" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="rgba(255,255,255,0.70)" />
                        </svg>
                        Continuer avec Google
                    </button>

                    {/* Séparateur */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 24,
                        }}
                    >
                        <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }} />
                        <span
                            style={{
                                fontFamily: "var(--font-geist-mono, monospace)",
                                fontSize: 9,
                                letterSpacing: "0.10em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.18)",
                            }}
                        >
                            ou
                        </span>
                        <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }} />
                    </div>

                    {/* Formulaire */}
                    <form onSubmit={handleCredentials}>
                        {/* Email */}
                        <div style={{ marginBottom: 14 }}>
                            <label
                                style={{
                                    display: "block",
                                    fontFamily: "var(--font-geist-mono, monospace)",
                                    fontSize: 10,
                                    letterSpacing: "0.10em",
                                    textTransform: "uppercase",
                                    color: "rgba(255,255,255,0.35)",
                                    marginBottom: 6,
                                }}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    fontFamily: "var(--font-geist-mono, monospace)",
                                    fontSize: 13,
                                    color: "rgba(255,255,255,0.85)",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "0.5px solid rgba(255,255,255,0.10)",
                                    borderRadius: 0,
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* Mot de passe */}
                        <div style={{ marginBottom: 20 }}>
                            <label
                                style={{
                                    display: "block",
                                    fontFamily: "var(--font-geist-mono, monospace)",
                                    fontSize: 10,
                                    letterSpacing: "0.10em",
                                    textTransform: "uppercase",
                                    color: "rgba(255,255,255,0.35)",
                                    marginBottom: 6,
                                }}
                            >
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    fontFamily: "var(--font-geist-mono, monospace)",
                                    fontSize: 13,
                                    color: "rgba(255,255,255,0.85)",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "0.5px solid rgba(255,255,255,0.10)",
                                    borderRadius: 0,
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* Erreur */}
                        {error && (
                            <div
                                style={{
                                    marginBottom: 16,
                                    padding: "10px 14px",
                                    background: "rgba(239,68,68,0.08)",
                                    border: "0.5px solid rgba(239,68,68,0.25)",
                                    fontFamily: "var(--font-geist-mono, monospace)",
                                    fontSize: 11,
                                    color: "rgba(239,68,68,0.85)",
                                }}
                            >
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px 20px",
                                fontFamily: "var(--font-syne, sans-serif)",
                                fontWeight: 700,
                                fontSize: 13,
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                                color: loading ? "rgba(0,0,0,0.50)" : "#000",
                                background: loading ? "rgba(14,165,233,0.40)" : "rgb(14,165,233)",
                                border: "none",
                                borderRadius: 0,
                                cursor: loading ? "not-allowed" : "pointer",
                                boxShadow: loading ? "none" : "4px 4px 0 rgba(14,165,233,0.20)",
                                transition: "all 0.12s ease",
                            }}
                        >
                            {loading ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>

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
                            opacity: 0.45,
                        }}
                    />
                </div>

                {/* Lien vers /register */}
                <p
                    style={{
                        marginTop: 20,
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 11,
                        color: "rgba(255,255,255,0.25)",
                        textAlign: "center",
                    }}
                >
                    Pas encore de compte ?{" "}
                    <a
                        href="/register"
                        style={{
                            color: "rgba(14,165,233,0.70)",
                            textDecoration: "none",
                            borderBottom: "0.5px solid rgba(14,165,233,0.30)",
                        }}
                    >
                        Créer un compte
                    </a>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
