import { Library } from "lucide-react";
import Link from "next/link";

/**
 * LibraryPage — Mes Applications
 *
 * Esthétique : Industrial Luxury
 * État actuel : vide (aucune app achetée)
 */
export default function LibraryPage() {
    return (
        <div
            style={{
                padding: "clamp(48px, 8vw, 88px) clamp(24px, 5vw, 64px)",
                maxWidth: 1200,
                margin: "0 auto",
            }}
        >
            {/* ── En-tête ── */}
            <header style={{ marginBottom: 64 }}>
                {/* Pre-label */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 24,
                    }}
                >
                    <div
                        style={{
                            width: 28,
                            height: 1,
                            background: "rgba(255,255,255,0.20)",
                        }}
                    />
                    <span
                        style={{
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 10,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.25)",
                        }}
                    >
                        Borely — Bibliothèque
                    </span>
                </div>

                <h1
                    style={{
                        fontFamily: "var(--font-syne, sans-serif)",
                        fontWeight: 800,
                        fontSize: "clamp(2.5rem, 6vw, 4rem)",
                        letterSpacing: "-0.05em",
                        lineHeight: 0.92,
                        color: "rgba(255,255,255,0.92)",
                        margin: "0 0 16px",
                    }}
                >
                    Mes
                    <br />
                    <span style={{ color: "rgba(255,255,255,0.30)" }}>Applications</span>
                </h1>

                <p
                    style={{
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: "rgba(255,255,255,0.35)",
                        maxWidth: 440,
                        margin: 0,
                    }}
                >
                    Vos micro-apps achetées, prêtes à utiliser.
                </p>
            </header>

            {/* ── Séparateur ── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 56,
                }}
            >
                <div
                    style={{
                        flex: 1,
                        height: "0.5px",
                        background: "rgba(255,255,255,0.06)",
                    }}
                />
                <span
                    style={{
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.12)",
                    }}
                >
                    0 app
                </span>
            </div>

            {/* ── État Vide ── */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "80px 32px",
                    textAlign: "center",
                    position: "relative",
                    border: "0.5px dashed rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.01)",
                    animation: "slide-up-fade 0.4s cubic-bezier(0.16,1,0.3,1) both",
                }}
            >
                {/* Icône brutaliste */}
                <div
                    style={{
                        position: "relative",
                        marginBottom: 40,
                    }}
                >
                    {/* Glow */}
                    <div
                        style={{
                            position: "absolute",
                            inset: -12,
                            background: "rgba(255,255,255,0.03)",
                            filter: "blur(16px)",
                        }}
                    />
                    <div
                        style={{
                            position: "relative",
                            width: 72,
                            height: 72,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.03)",
                            border: "0.5px solid rgba(255,255,255,0.08)",
                            boxShadow: "4px 4px 0 rgba(255,255,255,0.03)",
                            clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
                        }}
                    >
                        <Library
                            style={{
                                width: 28,
                                height: 28,
                                color: "rgba(255,255,255,0.18)",
                            }}
                        />
                    </div>
                    {/* Coin accent */}
                    <div
                        style={{
                            position: "absolute",
                            top: -1,
                            right: -1,
                            width: 8,
                            height: 8,
                            background: "rgba(255,255,255,0.12)",
                        }}
                    />
                </div>

                <h2
                    style={{
                        fontFamily: "var(--font-syne, sans-serif)",
                        fontWeight: 700,
                        fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                        letterSpacing: "-0.04em",
                        color: "rgba(255,255,255,0.50)",
                        margin: "0 0 12px",
                    }}
                >
                    Aucune application
                </h2>

                <p
                    style={{
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: "rgba(255,255,255,0.22)",
                        maxWidth: 340,
                        margin: "0 0 40px",
                    }}
                >
                    Rendez-vous dans la Boutique pour découvrir des micro-apps
                    qui automatisent vos tâches les plus ennuyeuses.
                </p>

                {/* CTA */}
                <Link
                    href="/"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 28px",
                        fontFamily: "var(--font-syne, sans-serif)",
                        fontWeight: 700,
                        fontSize: 12,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        color: "rgba(255,255,255,0.70)",
                        border: "0.5px solid rgba(255,255,255,0.14)",
                        background: "rgba(255,255,255,0.03)",
                        boxShadow: "3px 3px 0 rgba(255,255,255,0.03)",
                        transition: "all 0.15s ease",
                    }}
                >
                    Explorer la Boutique →
                </Link>

                {/* Coin brutaliste décoratif */}
                <div
                    style={{
                        position: "absolute",
                        bottom: -1,
                        right: -1,
                        width: 32,
                        height: 32,
                        background: "rgba(255,255,255,0.04)",
                        clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                    }}
                />
            </div>
        </div>
    );
}
