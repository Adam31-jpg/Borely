"use client";

import { boreboxConfig } from "../config";

const t = boreboxConfig.texts;

interface ScanProgressProps {
    progress: number;
    totalScanned: number;
}

export function ScanProgress({ progress, totalScanned }: ScanProgressProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center animate-fade-in-up">
            {/* Cercle de progression */}
            <div className="relative w-32 h-32 mb-8">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle
                        cx="60"
                        cy="60"
                        r="52"
                        stroke="rgb(var(--border))"
                        strokeWidth="6"
                        fill="none"
                    />
                    <circle
                        cx="60"
                        cy="60"
                        r="52"
                        stroke="rgb(var(--accent))"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 52}`}
                        strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                        className="transition-all duration-300 ease-out"
                        style={{
                            filter: "drop-shadow(0 0 8px rgb(var(--accent) / 0.4))",
                        }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold tracking-tight text-content-primary">
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>

            {/* Texte */}
            <h2 className="text-xl font-semibold tracking-tight text-content-primary mb-2">
                {t.scanTitle}
            </h2>
            <p className="text-content-muted text-[14px] mb-4">
                {t.scanDescription}
            </p>
            <p className="text-[13px] text-content-muted">
                <span className="text-accent font-semibold">
                    {totalScanned.toLocaleString("fr-FR")}
                </span>{" "}
                {t.scanProgress}
            </p>
        </div>
    );
}
