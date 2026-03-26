import * as React from "react";
import { cn } from "./utils";

export interface AppCardProps {
    slug: string;
    name: string;
    description: string;
    category: string;
    price: string;
    icon: React.ReactNode;
    accentColor?: string;
    purchased?: boolean;
    className?: string;
}

export function AppCard({
    slug,
    name,
    description,
    category,
    price,
    icon,
    purchased = false,
    className,
}: AppCardProps) {
    const href = purchased ? `/workspace/${slug}` : `/store/${slug}`;
    const ctaLabel = purchased ? "Ouvrir" : "Voir le produit";

    return (
        <a
            href={href}
            className={cn(
                "group relative flex flex-col gap-5 p-6 rounded-3xl",
                "bg-surface-card border border-border/50",
                "hover:border-accent/20 hover:shadow-lg hover:shadow-glow",
                "transition-all duration-smooth ease-out",
                "no-underline",
                className
            )}
        >
            {/* Badge acheté */}
            {purchased && (
                <div
                    className="absolute top-4 right-4 px-2.5 py-1 rounded-xl
                      bg-accent/10 text-accent text-[11px] font-semibold tracking-wide"
                >
                    Obtenu
                </div>
            )}

            {/* Icône + Catégorie */}
            <div className="flex items-start justify-between">
                <div
                    className="flex items-center justify-center w-14 h-14 rounded-2xl
                      bg-accent-subtle text-accent
                      group-hover:shadow-glow transition-shadow duration-smooth"
                    data-app={slug}
                >
                    {icon}
                </div>
                {!purchased && (
                    <span
                        className="text-[11px] font-medium text-content-muted
                       bg-surface-elevated px-3 py-1.5 rounded-xl"
                    >
                        {category}
                    </span>
                )}
            </div>

            {/* Contenu */}
            <div className="flex-1 space-y-1.5">
                <h3
                    className="text-[15px] font-semibold tracking-tight text-content-primary
                     group-hover:text-accent transition-colors duration-smooth"
                >
                    {name}
                </h3>
                <p className="text-[13px] text-content-muted leading-relaxed line-clamp-2">
                    {description}
                </p>
            </div>

            {/* Prix + CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <span className="text-[14px] font-semibold text-content-primary tracking-tight">
                    {price}
                </span>
                <span
                    className="text-[12px] text-accent font-medium
                     opacity-0 group-hover:opacity-100
                     translate-x-1.5 group-hover:translate-x-0
                     transition-all duration-smooth"
                >
                    {ctaLabel} →
                </span>
            </div>
        </a>
    );
}
