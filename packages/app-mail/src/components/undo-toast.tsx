"use client";

import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { boreboxConfig } from "../config";

const t = boreboxConfig.texts;

interface UndoToastProps {
    count: number;
    startedAt: number;
    onUndo: () => void;
}

export function UndoToast({ count, startedAt, onUndo }: UndoToastProps) {
    const [remaining, setRemaining] = useState<number>(boreboxConfig.undoDelayMs);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const elapsed = Date.now() - startedAt;
            const left = Math.max(0, boreboxConfig.undoDelayMs - elapsed);
            setRemaining(left);
            if (left <= 0) {
                clearInterval(interval);
                setIsDone(true);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [startedAt]);

    const progress = 1 - remaining / boreboxConfig.undoDelayMs;
    const secondsLeft = Math.ceil(remaining / 1000);

    /* ── Succès ── */
    if (isDone) {
        return (
            <div
                style={{
                    position: "fixed",
                    bottom: "clamp(72px, 10vh, 32px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 50,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 24px",
                    background: "rgba(0,0,0,0.85)",
                    border: "0.5px solid rgba(34,197,94,0.30)",
                    borderLeft: "2px solid rgb(34,197,94)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    boxShadow: "4px 4px 0 rgba(34,197,94,0.08)",
                    animation: "slide-in-bottom 0.3s cubic-bezier(0.16,1,0.3,1) both",
                    whiteSpace: "nowrap",
                }}
            >
                <CheckCircle2
                    style={{ width: 16, height: 16, color: "rgb(34,197,94)", flexShrink: 0 }}
                />
                <span
                    style={{
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 12,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.75)",
                    }}
                >
                    {t.cleaningSuccess}
                </span>
            </div>
        );
    }

    /* ── Countdown ── */
    return (
        <div
            style={{
                position: "fixed",
                bottom: "clamp(72px, 10vh, 32px)",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 50,
                width: "min(90vw, 480px)",
                animation: "slide-in-bottom 0.3s cubic-bezier(0.16,1,0.3,1) both",
            }}
        >
            {/* Barre de progression — hair line au dessus */}
            <div
                style={{
                    height: 2,
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${progress * 100}%`,
                        background: "rgb(var(--accent))",
                        boxShadow: "0 0 8px rgb(var(--accent) / 0.60)",
                        transition: "width 0.1s linear",
                    }}
                />
            </div>

            {/* Corps */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 20px",
                    background: "rgba(5,5,7,0.92)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                    borderTop: "none",
                    borderLeft: "2px solid rgb(var(--accent) / 0.60)",
                    backdropFilter: "blur(20px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                    boxShadow: "4px 4px 0 rgba(0,0,0,0.40)",
                }}
            >
                {/* Countdown numérique */}
                <div
                    style={{
                        fontFamily: "var(--font-syne, sans-serif)",
                        fontWeight: 800,
                        fontSize: 28,
                        letterSpacing: "-0.05em",
                        lineHeight: 1,
                        color: "rgb(var(--accent))",
                        flexShrink: 0,
                        minWidth: 24,
                        textAlign: "center",
                    }}
                >
                    {secondsLeft}
                </div>

                {/* Séparateur */}
                <div
                    style={{
                        width: "0.5px",
                        alignSelf: "stretch",
                        background: "rgba(255,255,255,0.08)",
                        flexShrink: 0,
                    }}
                />

                {/* Texte */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            fontFamily: "var(--font-syne, sans-serif)",
                            fontWeight: 700,
                            fontSize: 13,
                            letterSpacing: "-0.02em",
                            color: "rgba(255,255,255,0.80)",
                            marginBottom: 2,
                        }}
                    >
                        {count} abonnement{count > 1 ? "s" : ""} nettoyé{count > 1 ? "s" : ""}
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-geist-mono, monospace)",
                            fontSize: 10,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.25)",
                        }}
                    >
                        {t.undoCountdown} {secondsLeft}s
                    </div>
                </div>

                {/* Bouton Annuler */}
                <button
                    onClick={onUndo}
                    style={{
                        padding: "9px 16px",
                        fontFamily: "var(--font-syne, sans-serif)",
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "rgb(var(--accent))",
                        background: "transparent",
                        border: "0.5px solid rgb(var(--accent) / 0.40)",
                        borderRadius: 0,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgb(var(--accent))";
                        (e.currentTarget as HTMLButtonElement).style.color = "#000";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.color = "rgb(var(--accent))";
                    }}
                >
                    {t.undoButton}
                </button>
            </div>
        </div>
    );
}
