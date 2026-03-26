"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Store,
    Library,
    Settings,
    Sun,
    Moon,
    PanelLeftClose,
    PanelLeft,
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/", label: "Boutique", icon: Store },
    { href: "/library", label: "Mes Apps", icon: Library },
    { href: "/settings", label: "Réglages", icon: Settings },
] as const;

function ThemeToggle() {
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const toggle = useCallback(() => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
    }, [theme]);
    return (
        <button
            onClick={toggle}
            className="tap-target text-content-muted hover:text-content-primary transition-colors duration-200"
            aria-label={`Mode ${theme === "dark" ? "clair" : "sombre"}`}
        >
            <AnimatePresence mode="wait">
                {theme === "dark" ? (
                    <motion.div key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Sun className="h-4 w-4" />
                    </motion.div>
                ) : (
                    <motion.div key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Moon className="h-4 w-4" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}

function NavItem({
    href, label, icon: Icon, active, collapsed,
}: {
    href: string; label: string;
    icon: React.ComponentType<{ className?: string }>;
    active: boolean; collapsed: boolean;
}) {
    return (
        <Link
            href={href}
            className={`
        flex items-center gap-3 py-2.5 text-[12px] font-display font-medium
        uppercase tracking-[0.08em] transition-all duration-200
        ${collapsed ? "justify-center px-0" : "px-3"}
        ${active
                    ? "text-white"
                    : "text-white/30 hover:text-white/70"
                }
      `}
        >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
            {/* Indicateur actif — ligne dure à gauche */}
            {active && !collapsed && (
                <span
                    className="ml-auto w-1 h-full self-stretch"
                    style={{
                        background: "rgb(var(--accent))",
                        boxShadow: "0 0 8px rgb(var(--accent) / 0.6)",
                    }}
                />
            )}
        </Link>
    );
}

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
    const pathname = usePathname();

    return (
        <motion.aside
            className="hidden md:flex flex-col h-screen relative"
            style={{
                borderRight: "0.5px solid rgba(255,255,255,0.06)",
                background: "rgba(255, 255, 255, 0.015)",
            }}
            animate={{ width: collapsed ? 64 : 220 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
            {/* Marque */}
            <div
                className="flex items-center gap-3 px-5 h-[60px]"
                style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}
            >
                {/* Logo brutaliste — carré avec accent */}
                <div
                    className="flex-shrink-0 w-6 h-6 shadow-sharp-accent"
                    style={{
                        background: "rgb(var(--accent))",
                        clipPath: "polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)",
                    }}
                />
                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="font-display font-bold tracking-brutal text-white text-[15px] whitespace-nowrap overflow-hidden uppercase"
                        >
                            Borecore
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-0.5 px-3 pt-8">
                {NAV_ITEMS.map((item) => (
                    <NavItem
                        key={item.href}
                        {...item}
                        collapsed={collapsed}
                        active={
                            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                        }
                    />
                ))}
            </nav>

            {/* Pied */}
            <div
                className="flex flex-col items-center gap-3 px-3 py-5"
                style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}
            >
                <ThemeToggle />
                <button
                    onClick={onToggle}
                    className="tap-target text-white/25 hover:text-white/60 transition-colors"
                    aria-label={collapsed ? "Étendre" : "Réduire"}
                >
                    {collapsed
                        ? <PanelLeft className="h-4 w-4" />
                        : <PanelLeftClose className="h-4 w-4" />
                    }
                </button>
            </div>
        </motion.aside>
    );
}

function MobileTabBar() {
    const pathname = usePathname();
    return (
        <nav
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 safe-area-bottom"
            style={{
                background: "rgba(5,5,7,0.95)",
                borderTop: "0.5px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
            }}
        >
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                    <Link
                        key={href}
                        href={href}
                        className="flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors"
                        style={{ color: active ? "rgb(var(--accent))" : "rgba(255,255,255,0.30)" }}
                    >
                        <Icon className="h-4 w-4" />
                        <span className="text-[10px] font-display uppercase tracking-[0.06em]">{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export function Shell({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: "transparent" }}>
            {/* Grain overlay — position fixed, GPU layer isolé, ne scrolle pas */}
            <div className="grain-overlay" aria-hidden="true" />

            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <main className="relative z-10 flex-1 overflow-y-auto pb-20 md:pb-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.20, ease: [0.4, 0, 0.2, 1] }}
                        className="min-h-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            <MobileTabBar />
        </div>
    );
}
