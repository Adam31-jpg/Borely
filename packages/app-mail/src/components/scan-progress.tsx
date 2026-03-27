"use client";

import { useEffect, useState } from "react";
import { boreboxConfig } from "../config";

const t = boreboxConfig.texts;

interface ScanProgressProps {
    progress: number;
    totalScanned: number;
}

/** Lignes de log simulées pour l'effet terminal */
const LOG_LINES = [
    "Connexion à l'API Gmail...",
    "Récupération des labels PROMOTIONS...",
    "Analyse des en-têtes List-Unsubscribe...",
    "Agrégation par expéditeur...",
    "Filtrage des abonnements actifs...",
    "Tri par volume de messages...",
];

export function ScanProgress({ progress, totalScanned }: ScanProgressProps) {
    const [visibleLines, setVisibleLines] = useState(1);

    /* Révèle les lignes de log proportionnellement à la progression */
    useEffect(() => {
        const idx = Math.min(
            Math.floor((progress / 100) * LOG_LINES.length),
            LOG_LINES.length
        );
        setVisibleLines(Math.max(1, idx));
    }, [progress]);

    const pct = Math.round(progress);
    /* Barre de progression segmentée — 40 blocs */
    const BLOCKS = 40;
    const filled = Math.round((progress / 100) * BLOCKS);

    return (
        <div
            style={{
                padding: "clamp(32px, 6vw, 56px) 0",
                animation: "fade-in-up 0.35s cubic-bezier(0.16,1,0.3,1) both",
            }}
        >
            {/* ── En-tête terminal ── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                    paddingBottom: 12,
                    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    {/* Indicateur actif (pulse) */}
                    <div
                        style={{
                            width: 6,
                            height: 6,
                            background: "rgb(var(--accent))",
                            boxShadow: "0 0 10px rgb(var(--accent) / 0.7)",
                            animation: "skeleton-pulse 1.2s ease-in-out infinite",
                        }}
                    />
                    <span
                        style={{
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 10,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "rgb(var(--accent))",
                        }}
                    >
                        BRL-SCAN-001 — EN COURS
                    </span>
                </div>
                <span
                    style={{
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 10,
                        letterSpacing: "0.08em",
                        color: "rgba(255,255,255,0.20)",
                        textTransform: "uppercase",
                    }}
                >
                    {totalScanned > 0
                        ? `${totalScanned.toLocaleString("fr-FR")} msgs`
                        : "Initialisation..."}
                </span>
            </div>

            {/* ── Titre ── */}
            <h2
                style={{
                    fontFamily: "var(--font-syne, sans-serif)",
                    fontWeight: 800,
                    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                    letterSpacing: "-0.05em",
                    lineHeight: 0.95,
                    color: "rgba(255,255,255,0.88)",
                    margin: "0 0 32px",
                }}
            >
                {t.scanTitle}
            </h2>

            {/* ── Barre segmentée ── */}
            <div
                style={{
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                }}
            >
                {Array.from({ length: BLOCKS }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: 12,
                            background: i < filled
                                ? "rgb(var(--accent))"
                                : "rgba(255,255,255,0.05)",
                            boxShadow: i < filled
                                ? "0 0 6px rgb(var(--accent) / 0.40)"
                                : "none",
                            transition: `background 0.15s ease ${i * 15}ms`,
                        }}
                    />
                ))}
            </div>

            {/* ── Pourcentage + description ── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    marginBottom: 36,
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 11,
                        letterSpacing: "0.06em",
                        color: "rgba(255,255,255,0.25)",
                        textTransform: "uppercase",
                    }}
                >
                    {t.scanDescription}
                </span>
                <span
                    style={{
                        fontFamily: "var(--font-syne, sans-serif)",
                        fontWeight: 800,
                        fontSize: "clamp(2rem, 5vw, 3.5rem)",
                        letterSpacing: "-0.05em",
                        lineHeight: 1,
                        color: pct > 0 ? "rgb(var(--accent))" : "rgba(255,255,255,0.20)",
                    }}
                >
                    {pct}
                    <span
                        style={{
                            fontSize: "0.4em",
                            letterSpacing: "0.04em",
                            color: "rgba(255,255,255,0.30)",
                            marginLeft: 2,
                        }}
                    >
                        %
                    </span>
                </span>
            </div>

            {/* ── Log terminal ── */}
            <div
                style={{
                    padding: "16px 20px",
                    background: "rgba(0,0,0,0.30)",
                    border: "0.5px solid rgba(255,255,255,0.06)",
                    borderLeft: "2px solid rgb(var(--accent) / 0.40)",
                    fontFamily: "var(--font-geist-mono, monospace)",
                    fontSize: 11,
                    lineHeight: 1.8,
                }}
            >
                {LOG_LINES.slice(0, visibleLines).map((line, i) => (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            gap: 10,
                            color: i === visibleLines - 1
                                ? "rgba(255,255,255,0.65)"
                                : "rgba(255,255,255,0.22)",
                            animation: "fade-in 0.25s ease both",
                        }}
                    >
                        <span
                            style={{
                                color: i === visibleLines - 1
                                    ? "rgb(var(--accent))"
                                    : "rgba(255,255,255,0.15)",
                                userSelect: "none",
                            }}
                        >
                            {i === visibleLines - 1 ? "▶" : "✓"}
                        </span>
                        {line}
                    </div>
                ))}
                {/* Curseur clignotant */}
                <span
                    style={{
                        display: "inline-block",
                        width: 7,
                        height: 13,
                        background: "rgb(var(--accent))",
                        marginLeft: 20,
                        animation: "skeleton-pulse 0.8s ease-in-out infinite",
                        verticalAlign: "middle",
                    }}
                />
            </div>
        </div>
    );
}
