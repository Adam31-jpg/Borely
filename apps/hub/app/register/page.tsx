"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json().catch(() => ({}));
        setLoading(false);

        if (!res.ok) {
            setError(data.error ?? "Une erreur est survenue.");
            return;
        }

        // Redirection vers /login après inscription réussie
        router.push("/login?registered=1");
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
            <div style={{ width: "100%", maxWidth: 400, position: "relative" }}>

                {/* Pre-label */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
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
                        Borely — Inscription
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
                    Créer un compte
                </h1>

                {/* Panel */}
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
                    <form onSubmit={handleSubmit}>
                        {/* Nom */}
                        {[
                            { label: "Nom",           type: "text",     value: name,     onChange: setName,     autoComplete: "name",         mb: 14 },
                            { label: "Email",         type: "email",    value: email,    onChange: setEmail,    autoComplete: "email",        mb: 14 },
                            { label: "Mot de passe",  type: "password", value: password, onChange: setPassword, autoComplete: "new-password", mb: 20 },
                        ].map((field) => (
                            <div key={field.label} style={{ marginBottom: field.mb }}>
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
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    required
                                    autoComplete={field.autoComplete}
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
                        ))}

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
                            {loading ? "Création..." : "Créer mon compte"}
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

                <p
                    style={{
                        marginTop: 20,
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 11,
                        color: "rgba(255,255,255,0.25)",
                        textAlign: "center",
                    }}
                >
                    Déjà un compte ?{" "}
                    <a
                        href="/login"
                        style={{
                            color: "rgba(14,165,233,0.70)",
                            textDecoration: "none",
                            borderBottom: "0.5px solid rgba(14,165,233,0.30)",
                        }}
                    >
                        Se connecter
                    </a>
                </p>
            </div>
        </div>
    );
}
