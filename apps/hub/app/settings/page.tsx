import { User, Palette, Bell, Shield, ChevronRight } from "lucide-react";

/**
 * SettingsPage — Réglages
 *
 * Esthétique : Industrial Luxury
 * Sections : Compte, Apparence, Notifications, Confidentialité
 */

const SECTIONS = [
    {
        icon: User,
        title: "Compte",
        description: "Gérez votre profil et vos informations personnelles",
        code: "01",
    },
    {
        icon: Palette,
        title: "Apparence",
        description: "Personnalisez le thème et l'affichage",
        code: "02",
    },
    {
        icon: Bell,
        title: "Notifications",
        description: "Configurez vos préférences de notification",
        code: "03",
    },
    {
        icon: Shield,
        title: "Confidentialité",
        description: "Contrôlez vos données et autorisations",
        code: "04",
    },
] as const;

export default function SettingsPage() {
    return (
        <div
            style={{
                padding: "clamp(48px, 8vw, 88px) clamp(24px, 5vw, 64px)",
                maxWidth: 800,
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
                        Borely — Réglages
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
                    Réglages
                </h1>

                <p
                    style={{
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: "rgba(255,255,255,0.35)",
                        margin: 0,
                    }}
                >
                    Gérez votre compte et vos préférences.
                </p>
            </header>

            {/* ── Séparateur ── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 32,
                }}
            >
                <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.06)" }} />
                <span
                    style={{
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.12)",
                    }}
                >
                    Configuration
                </span>
            </div>

            {/* ── Liste des sections ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SECTIONS.map((section, i) => {
                    const Icon = section.icon;
                    return (
                        <div
                            key={section.title}
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                gap: 20,
                                padding: "20px 24px",
                                background: "rgba(255,255,255,0.02)",
                                border: "0.5px solid rgba(255,255,255,0.07)",
                                borderTop: "0.5px solid rgba(255,255,255,0.10)",
                                boxShadow: "3px 3px 0 rgba(255,255,255,0.02)",
                                cursor: "pointer",
                                animation: `slide-up-fade 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 50}ms both`,
                                transition: "background 0.15s ease, border-color 0.15s ease",
                            }}
                        >
                            {/* Numéro de section */}
                            <span
                                style={{
                                    fontFamily: "var(--font-geist-mono, monospace)",
                                    fontSize: 10,
                                    letterSpacing: "0.08em",
                                    color: "rgba(255,255,255,0.15)",
                                    flexShrink: 0,
                                    userSelect: "none",
                                }}
                            >
                                {section.code}
                            </span>

                            {/* Séparateur vertical */}
                            <div
                                style={{
                                    width: "0.5px",
                                    alignSelf: "stretch",
                                    background: "rgba(255,255,255,0.06)",
                                    flexShrink: 0,
                                }}
                            />

                            {/* Icône */}
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "rgba(255,255,255,0.04)",
                                    border: "0.5px solid rgba(255,255,255,0.07)",
                                    flexShrink: 0,
                                    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
                                }}
                            >
                                <Icon
                                    style={{
                                        width: 16,
                                        height: 16,
                                        color: "rgba(255,255,255,0.40)",
                                    }}
                                />
                            </div>

                            {/* Texte */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h3
                                    style={{
                                        fontFamily: "var(--font-syne, sans-serif)",
                                        fontWeight: 700,
                                        fontSize: 15,
                                        letterSpacing: "-0.03em",
                                        color: "rgba(255,255,255,0.80)",
                                        margin: "0 0 3px",
                                    }}
                                >
                                    {section.title}
                                </h3>
                                <p
                                    style={{
                                        fontFamily: "var(--font-geist-mono, monospace)",
                                        fontSize: 12,
                                        lineHeight: 1.5,
                                        color: "rgba(255,255,255,0.28)",
                                        margin: 0,
                                    }}
                                >
                                    {section.description}
                                </p>
                            </div>

                            {/* Flèche */}
                            <ChevronRight
                                style={{
                                    width: 14,
                                    height: 14,
                                    color: "rgba(255,255,255,0.15)",
                                    flexShrink: 0,
                                }}
                            />

                            {/* Coin brutaliste décoratif */}
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: -1,
                                    right: -1,
                                    width: 12,
                                    height: 12,
                                    background: "rgba(255,255,255,0.04)",
                                    clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* ── Note de version ── */}
            <div
                style={{
                    marginTop: 48,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.04)" }} />
                <span
                    style={{
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 10,
                        letterSpacing: "0.10em",
                        color: "rgba(255,255,255,0.10)",
                        textTransform: "uppercase",
                    }}
                >
                    Borely v1.0 — Toutes données chiffrées AWS KMS
                </span>
                <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.04)" }} />
            </div>
        </div>
    );
}
