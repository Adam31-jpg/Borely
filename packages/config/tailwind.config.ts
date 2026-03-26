import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class", '[data-theme="dark"]'],
    content: [],
    theme: {
        extend: {
            colors: {
                accent: {
                    DEFAULT: "rgb(var(--accent) / <alpha-value>)",
                    hover: "rgb(var(--accent-hover) / <alpha-value>)",
                    subtle: "rgb(var(--accent-subtle))",
                },
                surface: {
                    primary: "rgb(var(--bg-primary) / <alpha-value>)",
                    card: "rgb(var(--bg-card) / <alpha-value>)",
                    elevated: "rgb(var(--bg-elevated) / <alpha-value>)",
                },
                content: {
                    primary: "rgb(var(--text-primary) / <alpha-value>)",
                    muted: "rgb(var(--text-muted) / <alpha-value>)",
                },
                border: {
                    DEFAULT: "rgb(var(--border) / <alpha-value>)",
                },
            },
            fontFamily: {
                /* Syne — titres, labels forts, marque */
                display: [
                    "var(--font-syne)",
                    "system-ui",
                    "sans-serif",
                ],
                /* Geist Mono — corps, données, descriptions */
                mono: [
                    "var(--font-geist-mono)",
                    "ui-monospace",
                    "SFMono-Regular",
                    "monospace",
                ],
                /* Fallback (ne devrait pas être utilisé) */
                sans: ["var(--font-syne)", "system-ui", "sans-serif"],
            },
            letterSpacing: {
                /* Syne à -0.05em pour les gros titres */
                brutal: "-0.05em",
                tighter: "-0.03em",
                tight: "-0.02em",
                normal: "0em",
                mono: "0.01em",
            },
            borderRadius: {
                /* Coins variables pour casser la grille */
                card: "10px 14px 8px 12px",
                "card-alt": "14px 8px 12px 10px",
                "card-wide": "8px 12px 14px 10px",
                xl: "1rem",
                "2xl": "1.25rem",
                "3xl": "1.5rem",
            },
            boxShadow: {
                /* Ombres "dures" — pas de blur, juste offset */
                hard: "2px 2px 0px rgba(255, 255, 255, 0.05)",
                "hard-accent": "2px 2px 0px rgb(var(--accent) / 0.15)",
                /* Glow pour pills actives */
                glow: "var(--shadow-glow)",
                "glow-strong": "0 0 32px rgb(var(--accent) / 0.35)",
                /* Standard */
                sm: "var(--shadow-sm)",
                md: "var(--shadow-md)",
                lg: "var(--shadow-lg)",
            },
            keyframes: {
                "slide-up-fade": {
                    "0%": { opacity: "0", transform: "translateY(12px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "skeleton-pulse": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.3" },
                },
                "slide-in-bottom": {
                    "0%": { opacity: "0", transform: "translateY(100%)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "progress-fill": {
                    "0%": { width: "0%" },
                    "100%": { width: "100%" },
                },
                "fade-in-up": {
                    "0%": { opacity: "0", transform: "translateY(8px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
                "fade-in": "fade-in 0.3s ease-out both",
                "skeleton-pulse": "skeleton-pulse 2s ease-in-out infinite",
                "slide-in-bottom": "slide-in-bottom 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                "fade-in-up": "fade-in-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
            },
        },
    },
    plugins: [],
};

export default config;
