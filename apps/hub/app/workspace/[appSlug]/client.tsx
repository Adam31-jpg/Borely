"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { AppContextProvider } from "@borecore/core";
import type { ComponentType } from "react";

/**
 * Skeleton affiché pendant le chargement du chunk.
 */
function AppLoadingSkeleton() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
                gap: 16,
                padding: "40px 24px",
            }}
        >
            {/* Indicateur de chargement brutaliste */}
            <div
                style={{
                    width: 40,
                    height: 40,
                    background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                    clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                    animation: "skeleton-pulse 1.4s ease-in-out infinite",
                }}
            />
            <div
                style={{
                    width: 120,
                    height: 2,
                    background: "rgba(255,255,255,0.06)",
                    animation: "skeleton-pulse 1.4s ease-in-out 0.2s infinite",
                }}
            />
            <span
                style={{
                    fontFamily: "var(--font-geist-mono, monospace)",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.15)",
                }}
            >
                Chargement...
            </span>
        </div>
    );
}

/**
 * Import dynamique typé pour BoreBox avec props de session.
 * ssr: false → empêche Zustand d'être résolu côté serveur.
 */
const MailApp = dynamic(
    () => import("@borecore/app-mail").then(
        (m) => m.default as ComponentType<{ userEmail?: string; userName?: string }>
    ),
    {
        loading: () => <AppLoadingSkeleton />,
        ssr: false,
    }
);

/** Registre pour les futures micro-apps sans props spécifiques */
const GENERIC_APP_COMPONENTS: Record<string, ComponentType> = {};

export function WorkspaceClient({ appSlug }: { appSlug: string }) {
    const { data: session } = useSession();
    const userEmail = session?.user?.email ?? undefined;
    const userName = session?.user?.name ?? undefined;

    /* ── Mail (BoreBox) — injecte la session réelle ── */
    if (appSlug === "mail") {
        return (
            <AppContextProvider appSlug="mail">
                <MailApp userEmail={userEmail} userName={userName} />
            </AppContextProvider>
        );
    }

    /* ── Autres micro-apps ── */
    const GenericApp = GENERIC_APP_COMPONENTS[appSlug];

    if (!GenericApp) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "60vh",
                    textAlign: "center",
                    padding: 40,
                }}
            >
                <p
                    style={{
                        fontFamily: "var(--font-geist-mono, monospace)",
                        fontSize: 13,
                        letterSpacing: "0.04em",
                        color: "rgba(255,255,255,0.35)",
                    }}
                >
                    Application &quot;{appSlug}&quot; non disponible.
                </p>
            </div>
        );
    }

    return (
        <AppContextProvider appSlug={appSlug}>
            <GenericApp />
        </AppContextProvider>
    );
}
