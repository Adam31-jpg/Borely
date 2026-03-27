"use client";

import * as React from "react";
import { useState } from "react";

export interface AppCardProps {
    slug: string;
    name: string;
    description: string;
    category: string;
    price: string;
    icon: React.ReactNode;
    accentColor?: string;
    purchased?: boolean;
    index?: number;
    className?: string;
}

/**
 * AppCard — Industrial Luxury
 *
 * Layout horizontal : icône brutaliste | nom/desc | catégorie | prix + CTA
 * Hard shadow décalé en couleur accent.
 * Bordure supérieure accent pour identifier l'app.
 * Animation staggerée via CSS (index * 50ms).
 */
export function AppCard({
    slug,
    name,
    description,
    category,
    price,
    icon,
    accentColor = "#0EA5E9",
    purchased = false,
    index = 0,
}: AppCardProps) {
    const [hovered, setHovered] = useState(false);
    const href = purchased ? `/workspace/${slug}` : `/store/${slug}`;
    const ctaLabel = purchased ? "Ouvrir →" : "Découvrir →";

    // Parse accent color en RGB pour les effets
    const parseRgb = (hex: string): string => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r},${g},${b}`;
    };
    const rgb = parseRgb(accentColor);

    return (
        <a
            href={href}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "block",
                textDecoration: "none",
                position: "relative",
                animation: `slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 50}ms both`,
                // Hard shadow — accent couleur décalée
                boxShadow: hovered
                    ? `-2px -2px 0 rgba(${rgb}, 0.50)`
                    : `4px 4px 0 rgba(${rgb}, 0.20)`,
                // Bordure : accent au hover
                border: `0.5px solid ${hovered ? `rgba(${rgb}, 0.50)` : "rgba(255,255,255,0.08)"}`,
                background: hovered ? `rgba(${rgb}, 0.04)` : "rgba(255,255,255,0.02)",
                transition: "box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease, transform 0.15s ease",
                transform: hovered ? "translate(-1px, -1px)" : "none",
                // Ligne accent en haut (1px)
                borderTop: `1px solid rgba(${rgb}, ${hovered ? "0.70" : "0.30"})`,
                overflow: "hidden",
            }}
        >
            {/* Badge acheté */}
            {purchased && (
                <div
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        padding: "2px 8px",
                        background: `rgba(${rgb}, 0.15)`,
                        border: `0.5px solid rgba(${rgb}, 0.30)`,
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: accentColor,
                    }}
                >
                    Obtenu
                </div>
            )}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    padding: "24px 28px",
                }}
            >
                {/* ── Icône brutaliste (coin coupé) ── */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                    {/* Glow derrière l'icône */}
                    <div
                        style={{
                            position: "absolute",
                            inset: -4,
                            background: `rgba(${rgb}, 0.15)`,
                            filter: "blur(12px)",
                            transition: "opacity 0.2s",
                            opacity: hovered ? 1 : 0.5,
                        }}
                    />
                    <div
                        style={{
                            position: "relative",
                            width: 52,
                            height: 52,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: `rgba(${rgb}, 0.12)`,
                            border: `0.5px solid rgba(${rgb}, 0.25)`,
                            // Coin coupé en haut à droite — signature brutaliste
                            clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                            color: accentColor,
                        }}
                    >
                        {icon}
                    </div>
                </div>

                {/* ── Nom + Description ── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            fontFamily: "var(--font-syne, sans-serif)",
                            fontWeight: 700,
                            fontSize: 18,
                            letterSpacing: "-0.04em",
                            color: hovered ? accentColor : "rgba(255,255,255,0.92)",
                            lineHeight: 1.1,
                            marginBottom: 4,
                            transition: "color 0.2s",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {name}
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 12,
                            color: "rgba(255,255,255,0.35)",
                            lineHeight: 1.5,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {description}
                    </div>
                </div>

                {/* ── Catégorie ── */}
                <div
                    style={{
                        flexShrink: 0,
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: "0.10em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.25)",
                        padding: "4px 10px",
                        border: "0.5px solid rgba(255,255,255,0.08)",
                        display: "none",
                    }}
                    className="hidden md:block"
                >
                    {category}
                </div>

                {/* ── Prix ── */}
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <div
                        style={{
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 22,
                            fontWeight: 500,
                            letterSpacing: "-0.03em",
                            color: hovered ? accentColor : "rgba(255,255,255,0.80)",
                            transition: "color 0.2s",
                        }}
                    >
                        {price}
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 10,
                            color: "rgba(255,255,255,0.22)",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                        }}
                    >
                        accès unique
                    </div>
                </div>

                {/* ── CTA ── */}
                <div
                    style={{
                        flexShrink: 0,
                        padding: "10px 20px",
                        fontFamily: "var(--font-syne, sans-serif)",
                        fontWeight: 700,
                        fontSize: 12,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: hovered ? "#000" : accentColor,
                        background: hovered ? accentColor : "transparent",
                        border: `1px solid rgba(${rgb}, ${hovered ? "1" : "0.40"})`,
                        borderRadius: 0,
                        boxShadow: hovered ? `2px 2px 0 rgba(${rgb}, 0.40)` : "none",
                        transition: "all 0.15s ease",
                        whiteSpace: "nowrap",
                    }}
                >
                    {ctaLabel}
                </div>
            </div>
        </a>
    );
}
