"use client";

import { useState, useMemo } from "react";
import { Check, Hash, Calendar } from "lucide-react";
import { BrandFavicon } from "./account-selector";
import type { ScannedSender, SortOrder } from "../types";
import { boreboxConfig } from "../config";

const t = boreboxConfig.texts;

/**
 * Mapping index → coins asymétriques.
 * Chaque carte a des coins légèrement différents pour casser la grille.
 */
const CORNER_VARIANTS = [
    "10px 14px 8px 12px",
    "14px 8px 12px 10px",
    "8px 12px 14px 10px",
    "12px 10px 10px 14px",
    "10px 10px 14px 8px",
] as const;

/** Couleurs de marque pour le hover glow (domaine → couleur) */
const BRAND_COLORS: Record<string, string> = {
    "netflix.com": "229, 9, 20",
    "amazon.fr": "255, 153, 0",
    "amazon.com": "255, 153, 0",
    "cdiscount.com": "0, 163, 89",
    "linkedin.com": "10, 102, 194",
    "booking.com": "0, 115, 230",
    "medium.com": "255, 255, 255",
    "uber.com": "255, 255, 255",
    "spotify.com": "30, 215, 96",
    "leboncoin.fr": "255, 87, 34",
};

function getBrandColor(email: string): string | null {
    const domain = email.split("@")[1] ?? "";
    return BRAND_COLORS[domain] ?? null;
}

interface SenderListProps {
    senders: ScannedSender[];
    selectedCount: number;
    onToggle: (id: string) => void;
    onToggleAll: () => void;
    onClean: () => void;
}

export function SenderList({
    senders, selectedCount, onToggle, onToggleAll, onClean,
}: SenderListProps) {
    const [sortOrder, setSortOrder] = useState<SortOrder>("count-desc");
    const allSelected = senders.length > 0 && senders.every((s) => s.selected);

    const sorted = useMemo(() => (
        [...senders].sort((a, b) =>
            sortOrder === "count-desc"
                ? b.messageCount - a.messageCount
                : new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime()
        )
    ), [senders, sortOrder]);

    return (
        <div className="space-y-5">
            {/* ── Contrôles ── */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                {/* Sélection globale */}
                <button
                    onClick={onToggleAll}
                    className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] transition-colors duration-150"
                    style={{ color: allSelected ? "rgb(var(--accent))" : "rgba(255,255,255,0.30)" }}
                >
                    <div
                        className="flex items-center justify-center w-4 h-4 transition-all duration-200"
                        style={{
                            background: allSelected ? "rgb(var(--accent))" : "transparent",
                            border: `0.5px solid ${allSelected ? "rgb(var(--accent))" : "rgba(255,255,255,0.20)"}`,
                        }}
                    >
                        {allSelected && <Check className="h-2.5 w-2.5 text-black" strokeWidth={3} />}
                    </div>
                    {t.selectAll}
                </button>

                <div className="flex items-center gap-2">
                    {/* Tri */}
                    <div
                        className="flex items-center text-[10px] font-mono uppercase tracking-[0.06em]"
                        style={{
                            border: "0.5px solid rgba(255,255,255,0.08)",
                        }}
                    >
                        {(["count-desc", "date-desc"] as SortOrder[]).map((order, i) => (
                            <button
                                key={order}
                                onClick={() => setSortOrder(order)}
                                className="flex items-center gap-1.5 px-3 py-2 transition-all duration-150"
                                style={{
                                    color: sortOrder === order ? "rgb(var(--accent))" : "rgba(255,255,255,0.30)",
                                    background: sortOrder === order ? "rgba(var(--accent), 0.08)" : "transparent",
                                    borderLeft: i > 0 ? "0.5px solid rgba(255,255,255,0.08)" : "none",
                                }}
                            >
                                {order === "count-desc" ? <Hash className="h-2.5 w-2.5" /> : <Calendar className="h-2.5 w-2.5" />}
                                {order === "count-desc" ? "Volume" : "Récent"}
                            </button>
                        ))}
                    </div>

                    {/* Nettoyer */}
                    {selectedCount > 0 && (
                        <button
                            onClick={onClean}
                            className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.08em] text-black font-bold animate-fade-in-up shadow-sharp-accent"
                            style={{
                                background: "rgb(var(--accent))",
                            }}
                        >
                            {t.cleanButton}
                            <span
                                className="flex items-center justify-center w-4 h-4 text-[10px]"
                                style={{ background: "rgba(0,0,0,0.25)" }}
                            >
                                {selectedCount}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* ── Cartes expéditeurs (staggered reveal) ── */}
            <div className="space-y-2.5">
                {sorted.map((sender, index) => (
                    <SenderCard
                        key={sender.id}
                        sender={sender}
                        index={index}
                        cornerRadius={CORNER_VARIANTS[index % CORNER_VARIANTS.length]!}
                        onToggle={() => onToggle(sender.id)}
                    />
                ))}
            </div>
        </div>
    );
}

interface SenderCardProps {
    sender: ScannedSender;
    index: number;
    cornerRadius: string;
    onToggle: () => void;
}

function SenderCard({ sender, index, cornerRadius, onToggle }: SenderCardProps) {
    const [hovered, setHovered] = useState(false);
    const brandColor = getBrandColor(sender.email);
    const dateLabel = new Date(sender.lastSeenAt).toLocaleDateString("fr-FR", {
        day: "numeric", month: "short",
    });

    const getBackground = () => {
        if (sender.selected) return "rgba(var(--accent), 0.05)";
        if (hovered && brandColor) return `rgba(${brandColor}, 0.04)`;
        return "rgba(255,255,255,0.02)";
    };

    const getBorderColor = () => {
        if (sender.selected) return `rgba(var(--accent), 0.30)`;
        if (hovered && brandColor) return `rgba(${brandColor}, 0.20)`;
        return "rgba(255,255,255,0.07)";
    };

    const getGlow = () => {
        if (sender.selected) return `0 0 24px rgb(var(--accent) / 0.08), 3px 3px 0px rgb(var(--accent) / 0.10)`;
        if (hovered && brandColor) return `0 0 32px rgba(${brandColor}, 0.08), 3px 3px 0px rgba(${brandColor}, 0.08)`;
        return "3px 3px 0px rgba(255,255,255,0.03)";
    };

    return (
        <button
            onClick={onToggle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="w-full text-left sender-card"
            style={{
                /* Staggered reveal — 50ms par carte */
                animation: `slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 50}ms both`,
                borderRadius: cornerRadius,
                background: getBackground(),
                borderColor: getBorderColor(),
                boxShadow: getGlow(),
                transition: "background 0.2s, border-color 0.2s, box-shadow 0.25s",
                display: "block",
                width: "100%",
                padding: "14px 18px",
            }}
        >
            <div className="flex items-center gap-4">
                {/* Checkbox brutaliste — carré, pas de bords ronds */}
                <div
                    className="flex items-center justify-center w-4 h-4 flex-shrink-0 transition-all duration-150"
                    style={{
                        background: sender.selected ? "rgb(var(--accent))" : "transparent",
                        border: `0.5px solid ${sender.selected ? "rgb(var(--accent))" : "rgba(255,255,255,0.18)"}`,
                        borderRadius: "2px",
                        transform: sender.selected ? "scale(1.1)" : "scale(1)",
                    }}
                >
                    {sender.selected && <Check className="h-2.5 w-2.5 text-black" strokeWidth={3} />}
                </div>

                {/* Favicon */}
                <div
                    className="flex items-center justify-center w-10 h-10 flex-shrink-0"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: "6px",
                    }}
                >
                    <BrandFavicon email={sender.email} size={26} />
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                    <div
                        className="font-display font-semibold text-[14px] leading-none mb-1 truncate transition-colors duration-200"
                        style={{
                            color: hovered && brandColor
                                ? `rgba(${brandColor}, 0.90)`
                                : "rgba(255,255,255,0.88)",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {sender.displayName}
                    </div>
                    <div
                        className="font-mono text-[11px] truncate"
                        style={{ color: "rgba(255,255,255,0.28)" }}
                    >
                        {sender.email}
                    </div>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0 space-y-0.5">
                    <div
                        className="font-display font-bold text-[15px]"
                        style={{
                            color: sender.selected
                                ? "rgb(var(--accent))"
                                : hovered && brandColor
                                    ? `rgba(${brandColor}, 0.85)`
                                    : "rgba(255,255,255,0.75)",
                            letterSpacing: "-0.03em",
                        }}
                    >
                        {sender.messageCount}
                    </div>
                    <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.22)" }}>
                        {dateLabel}
                    </div>
                </div>
            </div>
        </button>
    );
}
