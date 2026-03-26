"use client";

import { useState, useEffect } from "react";
import { Undo2, CheckCircle2 } from "lucide-react";
import { boreboxConfig } from "../config";

const t = boreboxConfig.texts;

interface UndoToastProps {
    /** Nombre d'expéditeurs en cours de nettoyage */
    count: number;
    /** Timestamp de début du countdown */
    startedAt: number;
    /** Callback d'annulation */
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

    if (isDone) {
        return (
            <div
                className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50
                   flex items-center gap-3 px-6 py-4 rounded-2xl
                   glass shadow-lg animate-slide-in-bottom"
            >
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-[14px] font-medium text-content-primary">
                    {t.cleaningSuccess}
                </span>
            </div>
        );
    }

    return (
        <div
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50
                 w-[90%] max-w-md animate-slide-in-bottom"
        >
            <div className="glass rounded-2xl shadow-lg overflow-hidden">
                {/* Barre de progression */}
                <div className="h-1 bg-surface-elevated">
                    <div
                        className="h-full bg-accent transition-all duration-100 ease-linear"
                        style={{ width: `${progress * 100}%` }}
                    />
                </div>

                {/* Contenu */}
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent-subtle text-accent flex-shrink-0">
                            <Undo2 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-content-primary truncate">
                                {count} abonnement{count > 1 ? "s" : ""} nettoyé{count > 1 ? "s" : ""}
                            </p>
                            <p className="text-[11px] text-content-muted">
                                {t.undoCountdown} {secondsLeft}s
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onUndo}
                        className="px-4 py-2 rounded-xl bg-surface-elevated text-[13px]
                       font-semibold text-content-primary
                       hover:bg-accent hover:text-white
                       transition-all duration-200 flex-shrink-0"
                    >
                        {t.undoButton}
                    </button>
                </div>
            </div>
        </div>
    );
}
