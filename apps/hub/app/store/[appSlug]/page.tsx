import { notFound } from "next/navigation";
import {
    Mail, Landmark, Shield, Clock, Sparkles,
    Undo2, Brain, BarChart3, Upload, Lock,
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { appsConfig } from "@borecore/core";
import { productsContent } from "./content";

const ICON_MAP: Record<string, React.ComponentType<{ style?: React.CSSProperties }>> = {
    Mail, Landmark, Shield, Clock, Sparkles,
    Undo2, Brain, BarChart3, Upload, Lock,
};

export async function generateStaticParams() {
    return Object.keys(appsConfig).map((slug) => ({ appSlug: slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ appSlug: string }>;
}) {
    const { appSlug } = await params;
    const app = appsConfig[appSlug];
    if (!app) return {};
    return {
        title: `${app.name} — ${app.subtitle}`,
        description: app.shortDescription,
    };
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ appSlug: string }>;
}) {
    const { appSlug } = await params;
    const app = appsConfig[appSlug];
    const content = productsContent[appSlug];

    if (!app || !content) notFound();

    const AppIcon = ICON_MAP[app.iconName] ?? Mail;

    // Parse accent hex → rgb components for rgba()
    const hex = app.accentColor;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const accent = app.accentColor;
    const accentRgb = `${r},${g},${b}`;

    return (
        <div
            data-app={appSlug}
            style={{
                padding: "clamp(32px, 6vw, 72px) clamp(24px, 5vw, 64px)",
                maxWidth: 900,
                margin: "0 auto",
            }}
        >
            {/* ── Retour ── */}
            <Link
                href="/"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--font-geist-mono, monospace)",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    color: "rgba(255,255,255,0.25)",
                    marginBottom: 48,
                    transition: "color 0.15s ease",
                }}
            >
                ← Retour à la Boutique
            </Link>

            {/* ═══════════════════════════════
                EN-TÊTE PRODUIT
            ═══════════════════════════════ */}
            <header style={{ marginBottom: 72 }}>
                {/* Pre-label */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 28,
                    }}
                >
                    <div style={{ width: 28, height: 1, background: `rgba(${accentRgb},0.50)` }} />
                    <span
                        style={{
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 10,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: accent,
                        }}
                    >
                        {app.category}
                    </span>
                </div>

                {/* Nom + icône */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 32 }}>
                    {/* Icône brutaliste */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                        <div
                            style={{
                                position: "absolute",
                                inset: -6,
                                background: `rgba(${accentRgb},0.12)`,
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
                                background: `rgba(${accentRgb},0.10)`,
                                border: `0.5px solid rgba(${accentRgb},0.25)`,
                                boxShadow: `5px 5px 0 rgba(${accentRgb},0.15)`,
                                clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
                            }}
                        >
                            <AppIcon style={{ width: 32, height: 32, color: accent }} />
                        </div>
                    </div>

                    <div>
                        <h1
                            style={{
                                fontFamily: "var(--font-syne, sans-serif)",
                                fontWeight: 800,
                                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                                letterSpacing: "-0.05em",
                                lineHeight: 0.92,
                                color: "rgba(255,255,255,0.92)",
                                margin: "0 0 8px",
                            }}
                        >
                            {app.name}
                        </h1>
                        <p
                            style={{
                                fontFamily: "var(--font-geist-mono, monospace)",
                                fontSize: 13,
                                color: "rgba(255,255,255,0.35)",
                                margin: 0,
                            }}
                        >
                            {app.subtitle}
                        </p>
                    </div>
                </div>

                {/* Prix + CTA — panel glassmorphism */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 24,
                        padding: "24px 28px",
                        background: "rgba(255,255,255,0.02)",
                        border: `0.5px solid rgba(${accentRgb},0.15)`,
                        borderTop: `1px solid rgba(${accentRgb},0.30)`,
                        backdropFilter: "blur(16px) saturate(1.4)",
                        WebkitBackdropFilter: "blur(16px) saturate(1.4)",
                        boxShadow: `4px 4px 0 rgba(${accentRgb},0.08)`,
                        position: "relative",
                    }}
                >
                    {/* Reflet */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: "5%",
                            right: "5%",
                            height: "0.5px",
                            background: `linear-gradient(90deg, transparent, rgba(${accentRgb},0.25), transparent)`,
                        }}
                    />

                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                fontFamily: "var(--font-syne, sans-serif)",
                                fontWeight: 800,
                                fontSize: "clamp(2rem, 5vw, 3rem)",
                                letterSpacing: "-0.05em",
                                lineHeight: 1,
                                color: accent,
                                marginBottom: 4,
                            }}
                        >
                            {app.pricing.display}
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-geist-mono, monospace)",
                                fontSize: 11,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.25)",
                            }}
                        >
                            {app.pricing.model === "lifetime"
                                ? "Achat unique · Accès à vie"
                                : "Abonnement mensuel"}
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <a
                            href={`/workspace/${appSlug}`}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "14px 32px",
                                fontFamily: "var(--font-syne, sans-serif)",
                                fontWeight: 700,
                                fontSize: 13,
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                color: "#000",
                                background: accent,
                                border: "none",
                                boxShadow: `3px 3px 0 rgba(${accentRgb},0.30)`,
                                whiteSpace: "nowrap",
                            }}
                        >
                            Acheter maintenant
                        </a>
                        <a
                            href={`/workspace/${appSlug}`}
                            style={{
                                fontFamily: "var(--font-geist-mono, monospace)",
                                fontSize: 11,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                color: `rgba(${accentRgb},0.60)`,
                                textAlign: "center",
                            }}
                        >
                            Essayer gratuitement →
                        </a>
                    </div>
                </div>
            </header>

            {/* ═══════════════════════════════
                GALERIE (placeholders)
            ═══════════════════════════════ */}
            <section style={{ marginBottom: 72 }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: 12,
                    }}
                >
                    {content.screenshots.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                aspectRatio: "4 / 3",
                                background: "rgba(255,255,255,0.02)",
                                border: "0.5px solid rgba(255,255,255,0.07)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                animation: `slide-up-fade 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`,
                            }}
                        >
                            <AppIcon
                                style={{
                                    width: 28,
                                    height: 28,
                                    color: `rgba(${accentRgb},0.15)`,
                                }}
                            />
                            <span
                                style={{
                                    fontFamily: "var(--font-geist-mono, monospace)",
                                    fontSize: 10,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "rgba(255,255,255,0.12)",
                                }}
                            >
                                Aperçu {i + 1}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════
                À PROPOS
            ═══════════════════════════════ */}
            <section style={{ marginBottom: 72 }}>
                <SectionHeader label="001" title="À propos" accentRgb={accentRgb} />
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {content.longDescription.map((paragraph, i) => (
                        <p
                            key={i}
                            style={{
                                fontFamily: "var(--font-geist-mono, monospace)",
                                fontSize: 14,
                                lineHeight: 1.75,
                                color: "rgba(255,255,255,0.45)",
                                margin: 0,
                            }}
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════
                POURQUOI CETTE APP ?
            ═══════════════════════════════ */}
            <section style={{ marginBottom: 72 }}>
                <SectionHeader label="002" title={`Pourquoi ${app.name} ?`} accentRgb={accentRgb} />
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: 12,
                    }}
                >
                    {content.features.map((feature, i) => {
                        const FeatureIcon = ICON_MAP[feature.icon] ?? CheckCircle2;
                        return (
                            <div
                                key={feature.title}
                                style={{
                                    position: "relative",
                                    display: "flex",
                                    gap: 16,
                                    padding: "20px 24px",
                                    background: "rgba(255,255,255,0.02)",
                                    border: "0.5px solid rgba(255,255,255,0.07)",
                                    borderTop: `1px solid rgba(${accentRgb},0.20)`,
                                    boxShadow: `3px 3px 0 rgba(${accentRgb},0.06)`,
                                    animation: `slide-up-fade 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both`,
                                }}
                            >
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: `rgba(${accentRgb},0.08)`,
                                        border: `0.5px solid rgba(${accentRgb},0.18)`,
                                        flexShrink: 0,
                                        clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
                                    }}
                                >
                                    <FeatureIcon style={{ width: 18, height: 18, color: accent }} />
                                </div>
                                <div>
                                    <h3
                                        style={{
                                            fontFamily: "var(--font-syne, sans-serif)",
                                            fontWeight: 700,
                                            fontSize: 14,
                                            letterSpacing: "-0.03em",
                                            color: "rgba(255,255,255,0.80)",
                                            margin: "0 0 4px",
                                        }}
                                    >
                                        {feature.title}
                                    </h3>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-geist-mono, monospace)",
                                            fontSize: 12,
                                            lineHeight: 1.6,
                                            color: "rgba(255,255,255,0.30)",
                                            margin: 0,
                                        }}
                                    >
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════
                COMMENT ÇA MARCHE
            ═══════════════════════════════ */}
            <section style={{ marginBottom: 72 }}>
                <SectionHeader label="003" title="Comment ça marche" accentRgb={accentRgb} />
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {content.steps.map((step, i) => (
                        <div
                            key={step.step}
                            style={{
                                display: "flex",
                                gap: 24,
                                padding: "24px 0",
                                borderBottom: i < content.steps.length - 1
                                    ? "0.5px solid rgba(255,255,255,0.05)"
                                    : "none",
                                animation: `slide-up-fade 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms both`,
                            }}
                        >
                            {/* Numéro */}
                            <div
                                style={{
                                    fontFamily: "var(--font-syne, sans-serif)",
                                    fontWeight: 800,
                                    fontSize: "clamp(2rem, 4vw, 3rem)",
                                    letterSpacing: "-0.05em",
                                    lineHeight: 1,
                                    color: `rgba(${accentRgb},0.15)`,
                                    flexShrink: 0,
                                    width: 56,
                                    paddingTop: 2,
                                }}
                            >
                                {String(step.step).padStart(2, "0")}
                            </div>
                            <div style={{ paddingTop: 4 }}>
                                <h3
                                    style={{
                                        fontFamily: "var(--font-syne, sans-serif)",
                                        fontWeight: 700,
                                        fontSize: 16,
                                        letterSpacing: "-0.03em",
                                        color: "rgba(255,255,255,0.80)",
                                        margin: "0 0 6px",
                                    }}
                                >
                                    {step.title}
                                </h3>
                                <p
                                    style={{
                                        fontFamily: "var(--font-geist-mono, monospace)",
                                        fontSize: 13,
                                        lineHeight: 1.7,
                                        color: "rgba(255,255,255,0.35)",
                                        margin: 0,
                                    }}
                                >
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════
                CTA FINAL
            ═══════════════════════════════ */}
            <section
                style={{
                    position: "relative",
                    padding: "clamp(32px, 5vw, 56px)",
                    background: "rgba(255,255,255,0.02)",
                    border: `0.5px solid rgba(${accentRgb},0.15)`,
                    borderTop: `1px solid rgba(${accentRgb},0.40)`,
                    backdropFilter: "blur(16px) saturate(1.4)",
                    WebkitBackdropFilter: "blur(16px) saturate(1.4)",
                    boxShadow: `6px 6px 0 rgba(${accentRgb},0.10)`,
                    textAlign: "center",
                }}
            >
                {/* Reflet */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: "10%",
                        right: "10%",
                        height: "0.5px",
                        background: `linear-gradient(90deg, transparent, rgba(${accentRgb},0.35), transparent)`,
                    }}
                />

                <h2
                    style={{
                        fontFamily: "var(--font-syne, sans-serif)",
                        fontWeight: 800,
                        fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                        letterSpacing: "-0.05em",
                        lineHeight: 0.95,
                        color: "rgba(255,255,255,0.90)",
                        margin: "0 0 16px",
                    }}
                >
                    Prêt à commencer ?
                </h2>

                <p
                    style={{
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: "rgba(255,255,255,0.35)",
                        maxWidth: 400,
                        margin: "0 auto 40px",
                    }}
                >
                    {app.shortDescription}
                </p>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 16,
                    }}
                >
                    <a
                        href={`/workspace/${appSlug}`}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "14px 40px",
                            fontFamily: "var(--font-syne, sans-serif)",
                            fontWeight: 700,
                            fontSize: 14,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            textDecoration: "none",
                            color: "#000",
                            background: accent,
                            boxShadow: `4px 4px 0 rgba(${accentRgb},0.25)`,
                            whiteSpace: "nowrap",
                        }}
                    >
                        Acheter {app.pricing.display}
                    </a>
                    <a
                        href={`/workspace/${appSlug}`}
                        style={{
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 12,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            textDecoration: "none",
                            color: `rgba(${accentRgb},0.60)`,
                        }}
                    >
                        Essayer gratuitement →
                    </a>
                </div>

                {/* Coin brutaliste */}
                <div
                    style={{
                        position: "absolute",
                        bottom: -1,
                        right: -1,
                        width: 28,
                        height: 28,
                        background: accent,
                        clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                        opacity: 0.4,
                    }}
                />
            </section>
        </div>
    );
}

/**
 * Section header — ligne de séparation avec numéro et titre.
 */
function SectionHeader({
    label,
    title,
    accentRgb,
}: {
    label: string;
    title: string;
    accentRgb: string;
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 28,
            }}
        >
            <span
                style={{
                    fontFamily: "var(--font-geist-mono, monospace)",
                    fontSize: 10,
                    letterSpacing: "0.10em",
                    color: `rgba(${accentRgb},0.40)`,
                    flexShrink: 0,
                }}
            >
                {label}
            </span>
            <div style={{ width: 12, height: "0.5px", background: `rgba(${accentRgb},0.25)`, flexShrink: 0 }} />
            <h2
                style={{
                    fontFamily: "var(--font-syne, sans-serif)",
                    fontWeight: 700,
                    fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                    letterSpacing: "-0.04em",
                    color: "rgba(255,255,255,0.80)",
                    margin: 0,
                    flexShrink: 0,
                }}
            >
                {title}
            </h2>
            <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.05)" }} />
        </div>
    );
}
