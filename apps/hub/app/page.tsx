"use client";

import { useState } from "react";
import { AppCard } from "@borecore/ui";
import { appRegistry, siteConfig, categories } from "@borecore/core";

/**
 * StorePage — Borely Hub
 *
 * Layout : héro asymétrique (texte gauche / géométrie brutaliste droite)
 *           + liste d'apps staggerée (pas de grille générique)
 *
 * Esthétique : Industrial Luxury — précision, matière, hiérarchie.
 */
export default function StorePage() {
    const [activeCategory, setActiveCategory] = useState<string>("Tout");

    const filtered =
        activeCategory === "Tout"
            ? appRegistry
            : appRegistry.filter((a) => a.category === activeCategory);

    return (
        <div style={{ position: "relative", minHeight: "100%" }}>

            {/* ════════════════════════════════════════════
                HÉRO — Composition asymétrique
            ════════════════════════════════════════════ */}
            <section
                style={{
                    padding: "clamp(48px, 8vw, 88px) clamp(24px, 5vw, 64px) clamp(40px, 6vw, 72px)",
                    maxWidth: 1200,
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 48,
                }}
            >
                {/* ─── Colonne gauche ─── */}
                <div style={{ flex: 1, maxWidth: 580 }}>

                    {/* Pre-label */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 28,
                        }}
                    >
                        <div
                            style={{
                                width: 28,
                                height: 1,
                                background: "rgb(14,165,233)",
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
                            {siteConfig.name} — v1.0
                        </span>
                    </div>

                    {/* Titre principal */}
                    <h1
                        style={{
                            fontFamily: "var(--font-syne, sans-serif)",
                            fontWeight: 800,
                            fontSize: "clamp(3rem, 7vw, 5.5rem)",
                            letterSpacing: "-0.05em",
                            lineHeight: 0.90,
                            color: "rgba(255,255,255,0.95)",
                            margin: "0 0 28px",
                        }}
                    >
                        Les corvées,
                        <br />
                        <span style={{ color: "rgb(14,165,233)" }}>
                            terminées.
                        </span>
                    </h1>

                    {/* Tagline */}
                    <p
                        style={{
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 13,
                            lineHeight: 1.7,
                            color: "rgba(255,255,255,0.40)",
                            maxWidth: 420,
                            margin: "0 0 40px",
                        }}
                    >
                        {siteConfig.description}
                    </p>

                    {/* Métriques */}
                    <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
                        {[
                            { value: String(appRegistry.length), label: "Apps" },
                            { value: "< 2s", label: "Temps de scan" },
                            { value: "0€", label: "Abonnement" },
                        ].map((stat, i) => (
                            <div
                                key={stat.label}
                                style={{
                                    paddingLeft: i > 0 ? 40 : 0,
                                    borderLeft: i > 0 ? "0.5px solid rgba(255,255,255,0.08)" : "none",
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: "var(--font-syne, sans-serif)",
                                        fontWeight: 700,
                                        fontSize: 26,
                                        letterSpacing: "-0.05em",
                                        color: "rgba(255,255,255,0.90)",
                                        lineHeight: 1,
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-geist-mono, monospace)",
                                        fontSize: 10,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        color: "rgba(255,255,255,0.25)",
                                        marginTop: 4,
                                    }}
                                >
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Colonne droite : géométrie brutaliste ─── */}
                <div
                    style={{
                        flexShrink: 0,
                        width: 280,
                        height: 280,
                        position: "relative",
                        display: "none",
                    }}
                    className="hidden lg:block"
                >
                    {/* Rectangle skewé principal */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(14,165,233,0.06)",
                            border: "0.5px solid rgba(14,165,233,0.18)",
                            transform: "skewY(-8deg)",
                            boxShadow: "8px 8px 0 rgba(14,165,233,0.10)",
                        }}
                    />
                    {/* Quadrillage SVG */}
                    <svg
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            transform: "skewY(-8deg)",
                        }}
                        viewBox="0 0 280 280"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Lignes horizontales */}
                        {[70, 140, 210].map((y) => (
                            <line
                                key={y}
                                x1="0"
                                y1={y}
                                x2="280"
                                y2={y}
                                stroke="rgba(14,165,233,0.08)"
                                strokeWidth="0.5"
                            />
                        ))}
                        {/* Lignes verticales */}
                        {[70, 140, 210].map((x) => (
                            <line
                                key={x}
                                x1={x}
                                y1="0"
                                x2={x}
                                y2="280"
                                stroke="rgba(14,165,233,0.08)"
                                strokeWidth="0.5"
                            />
                        ))}
                        {/* Diagonale pointillée */}
                        <line
                            x1="0"
                            y1="0"
                            x2="280"
                            y2="280"
                            stroke="rgba(14,165,233,0.06)"
                            strokeWidth="0.5"
                            strokeDasharray="6 6"
                        />
                    </svg>
                    {/* Coin accent plein — signature brutaliste */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: 56,
                            height: 56,
                            background: "rgb(14,165,233)",
                            boxShadow: "0 0 32px rgba(14,165,233,0.50)",
                            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                            transform: "skewY(-8deg) translate(8px, 8px)",
                        }}
                    />
                    {/* Label de version */}
                    <div
                        style={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 10,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "rgba(14,165,233,0.50)",
                            transform: "skewY(-8deg)",
                        }}
                    >
                        BRL-001
                    </div>
                    {/* Petit carré accent dans le coin haut-droit */}
                    <div
                        style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            width: 12,
                            height: 12,
                            background: "rgb(14,165,233)",
                            boxShadow: "0 0 12px rgba(14,165,233,0.60)",
                        }}
                    />
                </div>
            </section>

            {/* ════════════════════════════════════════════
                CATALOGUE
            ════════════════════════════════════════════ */}
            <section
                style={{
                    padding: "0 clamp(24px, 5vw, 64px) clamp(48px, 8vw, 88px)",
                    maxWidth: 1200,
                    margin: "0 auto",
                }}
            >
                {/* ─── Séparateur titre ─── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        marginBottom: 32,
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
                            color: "rgba(255,255,255,0.18)",
                        }}
                    >
                        Catalogue
                    </span>
                    <div
                        style={{
                            flex: 1,
                            height: "0.5px",
                            background: "rgba(255,255,255,0.06)",
                        }}
                    />
                </div>

                {/* ─── Filtres catégorie ─── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 36,
                        flexWrap: "wrap",
                    }}
                >
                    {categories.map((cat) => {
                        const isActive = cat === activeCategory;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: "7px 16px",
                                    fontFamily: "var(--font-geist-mono, monospace)",
                                    fontSize: 10,
                                    fontWeight: isActive ? 700 : 400,
                                    letterSpacing: "0.10em",
                                    textTransform: "uppercase",
                                    borderRadius: 0,
                                    cursor: "pointer",
                                    border: `0.5px solid ${isActive ? "rgb(14,165,233)" : "rgba(255,255,255,0.12)"}`,
                                    background: isActive ? "rgb(14,165,233)" : "transparent",
                                    color: isActive ? "#000" : "rgba(255,255,255,0.35)",
                                    boxShadow: isActive ? "3px 3px 0 rgba(14,165,233,0.25)" : "none",
                                    transition: "all 0.12s ease",
                                }}
                            >
                                {cat}
                            </button>
                        );
                    })}

                    {/* Compteur */}
                    <span
                        style={{
                            marginLeft: "auto",
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 10,
                            letterSpacing: "0.08em",
                            color: "rgba(255,255,255,0.20)",
                            textTransform: "uppercase",
                        }}
                    >
                        {filtered.length} app{filtered.length > 1 ? "s" : ""}
                    </span>
                </div>

                {/* ─── Liste staggerée ─── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {filtered.map((app, index) => (
                        <AppCard
                            key={app.slug}
                            slug={app.slug}
                            name={app.name}
                            description={app.description}
                            category={app.category}
                            price={app.price}
                            icon={app.icon}
                            accentColor={app.accentColor}
                            index={index}
                        />
                    ))}
                </div>

                {/* ─── Bientôt ─── */}
                <div
                    style={{
                        marginTop: 24,
                        padding: "20px 28px",
                        border: "0.5px dashed rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            width: 52,
                            height: 52,
                            flexShrink: 0,
                            background: "rgba(255,255,255,0.02)",
                            border: "0.5px dashed rgba(255,255,255,0.10)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 20,
                            color: "rgba(255,255,255,0.12)",
                        }}
                    >
                        +
                    </div>
                    <div>
                        <div
                            style={{
                                fontFamily: "var(--font-syne, sans-serif)",
                                fontWeight: 700,
                                fontSize: 14,
                                letterSpacing: "-0.03em",
                                color: "rgba(255,255,255,0.30)",
                                marginBottom: 2,
                            }}
                        >
                            Bientôt disponible
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-geist-mono, monospace)",
                                fontSize: 11,
                                color: "rgba(255,255,255,0.18)",
                            }}
                        >
                            De nouvelles apps arrivent. Restez à l'écoute.
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
