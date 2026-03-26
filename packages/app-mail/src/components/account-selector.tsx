"use client";

import { useState, useRef, useEffect } from "react";
import type { ConnectedAccount } from "../types";
import { useAccountsStore, selectTotalStats } from "../store/accounts";

/**
 * Favicon d'une marque via Google Favicon Service.
 */
export function BrandFavicon({
    email, size = 20, className = "",
}: {
    email: string; size?: number; className?: string;
}) {
    const domain = email.split("@")[1] ?? "";
    const [failed, setFailed] = useState(false);
    const initial = (email[0] ?? "?").toUpperCase();

    if (failed || !domain) {
        return (
            <div
                className={`flex items-center justify-center font-mono text-[10px] font-bold ${className}`}
                style={{
                    width: size, height: size,
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                }}
            >
                {initial}
            </div>
        );
    }

    return (
        <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${size * 2}`}
            alt={domain}
            width={size}
            height={size}
            className={className}
            style={{ imageRendering: "crisp-edges", borderRadius: 3 }}
            onError={() => setFailed(true)}
        />
    );
}

/**
 * AccountSelector — Pills flottantes horizontales
 *
 * Chaque compte connecté est une pill.
 * Pill active : glow lumineux de la couleur du provider.
 * "Tous" : glow accent global.
 */
export function AccountSelector({ className = "" }: { className?: string }) {
    const { accounts, activeAccountId, setActiveAccount } = useAccountsStore();
    const totalStats = selectTotalStats(accounts);

    if (accounts.length === 0) return null;

    const all = [
        {
            id: null as string | null,
            label: "Tous",
            sublabel: totalStats.totalSenders > 0 ? `${totalStats.totalSenders}` : null,
            color: "var(--accent-rgb, 99,102,241)",
            email: null as string | null,
        },
        ...accounts.map((a: ConnectedAccount) => ({
            id: a.id,
            label: a.displayLabel,
            sublabel: a.stats.totalSenders > 0 ? `${a.stats.totalSenders}` : null,
            color: a.provider === "gmail" ? "234,67,53" : "0,120,212",
            email: a.email,
        })),
    ];

    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            {all.map((item) => {
                const isActive = item.id === activeAccountId;
                return (
                    <AccountPill
                        key={item.id ?? "all"}
                        label={item.label}
                        sublabel={item.sublabel}
                        color={item.color}
                        active={isActive}
                        email={item.email}
                        onClick={() => setActiveAccount(item.id)}
                    />
                );
            })}
        </div>
    );
}

interface PillProps {
    label: string;
    sublabel: string | null;
    color: string;
    active: boolean;
    email: string | null;
    onClick: () => void;
}

function AccountPill({ label, sublabel, color, active, email, onClick }: PillProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-1.5 transition-all duration-200"
            style={{
                background: active
                    ? `rgba(${color}, 0.10)`
                    : "rgba(255,255,255,0.03)",
                border: `0.5px solid ${active
                    ? `rgba(${color}, 0.40)`
                    : "rgba(255,255,255,0.08)"}`,
                boxShadow: active
                    ? `0 0 16px rgba(${color}, 0.30), 0 0 4px rgba(${color}, 0.15), inset 0 0 12px rgba(${color}, 0.05)`
                    : "none",
                /* Zéro border-radius — cohérent avec l'esthétique brutaliste */
                borderRadius: 0,
            }}
        >
            {email && (
                <BrandFavicon email={email} size={14} />
            )}
            <span
                className="font-mono text-[11px] uppercase tracking-[0.06em] transition-colors duration-200"
                style={{
                    color: active ? `rgba(${color}, 0.95)` : "rgba(255,255,255,0.35)",
                }}
            >
                {label}
            </span>
            {sublabel && (
                <span
                    className="font-mono text-[10px] font-bold"
                    style={{
                        color: active ? `rgba(${color}, 0.70)` : "rgba(255,255,255,0.20)",
                    }}
                >
                    {sublabel}
                </span>
            )}
        </button>
    );
}
