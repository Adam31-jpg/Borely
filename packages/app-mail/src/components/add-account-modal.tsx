"use client";

import { useEffect, useRef } from "react";
import { X, Mail, Clock } from "lucide-react";

interface AddAccountModalProps {
    onClose: () => void;
    onConnectGoogle: () => void;
}

/**
 * Modale glassmorphism pour ajouter un compte mail.
 * Fermeture : clic sur l'overlay, touche Escape, ou bouton ×.
 * Performance : blur(16px) avec isolation GPU sur le conteneur.
 */
export function AddAccountModal({
    onClose,
    onConnectGoogle,
}: AddAccountModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Fermeture au clavier (Escape)
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    // Blocage du scroll derrière la modale
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        /* Overlay */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Fond flouté */}
            <div
                className="absolute inset-0"
                style={{
                    backdropFilter: "blur(20px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                    backgroundColor: "rgba(0,0,0,0.60)",
                }}
            />

            {/* Panneau */}
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label="Ajouter une boîte mail"
                className="relative w-full max-w-sm animate-fade-in-up"
                style={{ isolation: "isolate", willChange: "transform" }}
            >
                <div
                    className="rounded-3xl overflow-hidden"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        backdropFilter: "blur(16px) saturate(1.5)",
                        WebkitBackdropFilter: "blur(16px) saturate(1.5)",
                        boxShadow: "0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                >
                    {/* Reflet en haut */}
                    <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
                    />

                    {/* En-tête */}
                    <div className="flex items-center justify-between px-6 pt-6 pb-5">
                        <div>
                            <h2 className="text-[17px] font-semibold tracking-tight text-white">
                                Ajouter une boîte
                            </h2>
                            <p className="text-[12px] text-white/50 mt-0.5">
                                Connectez un compte mail
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex items-center justify-center w-8 h-8 rounded-full
                         text-white/40 hover:text-white hover:bg-white/10
                         transition-all duration-200"
                            aria-label="Fermer"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Séparateur */}
                    <div className="h-px mx-6" style={{ background: "rgba(255,255,255,0.06)" }} />

                    {/* Options */}
                    <div className="p-4 space-y-3">
                        {/* Google — Actif */}
                        <button
                            onClick={onConnectGoogle}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl
                         text-left transition-all duration-200 group"
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.16)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
                            }}
                        >
                            {/* Icône Google */}
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: "rgba(255,255,255,0.08)" }}>
                                <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[14px] font-semibold text-white">Google Gmail</div>
                                <div className="text-[12px] text-white/50">Scan via Gmail API</div>
                            </div>
                            <div className="text-[11px] font-medium px-2.5 py-1 rounded-lg"
                                style={{ background: "rgba(14,165,233,0.15)", color: "rgb(14,165,233)" }}>
                                Actif
                            </div>
                        </button>

                        {/* Outlook — Bientôt */}
                        <div
                            className="flex items-center gap-4 p-4 rounded-2xl opacity-40 cursor-not-allowed"
                            style={{
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.05)",
                            }}
                        >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: "rgba(255,255,255,0.06)" }}>
                                <Mail className="h-5 w-5 text-white/60" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[14px] font-semibold text-white">Outlook / Hotmail</div>
                                <div className="text-[12px] text-white/50">Microsoft Graph API</div>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                                <Clock className="h-3 w-3" />
                                Bientôt
                            </div>
                        </div>
                    </div>

                    <div className="px-6 pb-6">
                        <p className="text-[11px] text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
                            Vos tokens sont chiffrés et isolés par compte.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
