import { notFound } from "next/navigation";
import {
    Mail,
    Landmark,
    Shield,
    Clock,
    Sparkles,
    Undo2,
    Brain,
    BarChart3,
    Upload,
    Lock,
    ArrowLeft,
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { appsConfig } from "@borecore/core";
import { Button } from "@borecore/ui";
import { productsContent } from "./content";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    Mail,
    Landmark,
    Shield,
    Clock,
    Sparkles,
    Undo2,
    Brain,
    BarChart3,
    Upload,
    Lock,
};

export async function generateStaticParams() {
    return Object.keys(appsConfig).map((slug) => ({ appSlug: slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ appSlug: string }>;
}) {
    const { appSlug } = await params;
    const app = appsConfig[appSlug];
    if (!app) return {};

    return {
        title: `${app.name} — ${app.subtitle}`,
        description: app.shortDescription,
    };
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ appSlug: string }>;
}) {
    const { appSlug } = await params;
    const app = appsConfig[appSlug];
    const content = productsContent[appSlug];

    if (!app || !content) {
        notFound();
    }

    const AppIcon = ICON_MAP[app.iconName] ?? Mail;

    return (
        <div data-app={appSlug} className="px-6 py-10 md:px-12 md:py-16 lg:px-16 lg:py-20 max-w-4xl mx-auto">
            {/* Retour */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-[13px] text-content-muted
                   hover:text-content-primary transition-colors mb-10 group"
            >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                Retour à la Boutique
            </Link>

            {/* En-tête produit */}
            <header className="mb-16">
                <div className="flex items-start gap-5 mb-6">
                    <div
                        className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20
                        rounded-3xl bg-accent-subtle text-accent shadow-glow flex-shrink-0"
                    >
                        <AppIcon className="h-8 w-8 md:h-10 md:w-10" />
                    </div>
                    <div className="pt-1">
                        <span
                            className="inline-block text-[11px] font-semibold tracking-widest uppercase
                         text-accent mb-2"
                        >
                            {app.category}
                        </span>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-content-primary leading-[1.1]">
                            {app.name}
                        </h1>
                        <p className="mt-2 text-content-muted text-lg">{app.subtitle}</p>
                    </div>
                </div>

                {/* Prix + CTA */}
                <div
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4
                     p-6 rounded-2xl bg-surface-card border border-border/50"
                >
                    <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-content-primary">
                                {app.pricing.display}
                            </span>
                            {app.pricing.model === "lifetime" && (
                                <span className="text-[13px] text-content-muted">
                                    Achat unique · Accès à vie
                                </span>
                            )}
                            {app.pricing.model === "subscription" && (
                                <span className="text-[13px] text-content-muted">
                                    Abonnement mensuel
                                </span>
                            )}
                        </div>
                    </div>
                    <Button variant="primary" size="lg">
                        Acheter maintenant
                    </Button>
                </div>
            </header>

            {/* Galerie de screenshots (placeholders) */}
            <section className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {content.screenshots.map((_, i) => (
                        <div
                            key={i}
                            className="aspect-[4/3] rounded-2xl bg-surface-card border border-border/50
                         flex items-center justify-center"
                        >
                            <div className="text-center">
                                <AppIcon className="h-8 w-8 text-content-muted/30 mx-auto mb-2" />
                                <span className="text-[11px] text-content-muted/50">
                                    Aperçu {i + 1}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Description longue */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold tracking-tight text-content-primary mb-6">
                    À propos
                </h2>
                <div className="space-y-4">
                    {content.longDescription.map((paragraph, i) => (
                        <p
                            key={i}
                            className="text-content-muted leading-[1.75] text-[15px]"
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>
            </section>

            {/* Pourquoi cette app ? */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold tracking-tight text-content-primary mb-8">
                    Pourquoi {app.name} ?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {content.features.map((feature) => {
                        const FeatureIcon = ICON_MAP[feature.icon] ?? CheckCircle2;
                        return (
                            <div
                                key={feature.title}
                                className="flex gap-4 p-5 rounded-2xl bg-surface-card border border-border/50"
                            >
                                <div
                                    className="flex items-center justify-center w-10 h-10 rounded-xl
                             bg-accent-subtle text-accent flex-shrink-0"
                                >
                                    <FeatureIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-semibold text-content-primary mb-1">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[13px] text-content-muted leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Guide d'utilisation */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold tracking-tight text-content-primary mb-8">
                    Comment ça marche
                </h2>
                <div className="space-y-6">
                    {content.steps.map((step) => (
                        <div key={step.step} className="flex gap-5">
                            <div
                                className="flex items-center justify-center w-10 h-10 rounded-2xl
                           bg-accent text-white font-bold text-sm flex-shrink-0"
                            >
                                {step.step}
                            </div>
                            <div className="pt-1.5">
                                <h3 className="text-[15px] font-semibold text-content-primary mb-1">
                                    {step.title}
                                </h3>
                                <p className="text-[13px] text-content-muted leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA final */}
            <section
                className="p-8 md:p-10 rounded-3xl bg-surface-card border border-border/50
                   text-center"
            >
                <h2 className="text-2xl font-semibold tracking-tight text-content-primary mb-3">
                    Prêt à commencer ?
                </h2>
                <p className="text-content-muted mb-8 max-w-md mx-auto leading-relaxed">
                    {app.shortDescription}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button variant="primary" size="lg">
                        Acheter {app.pricing.display}
                    </Button>
                    <Link
                        href={`/workspace/${appSlug}`}
                        className="text-[13px] text-content-muted hover:text-accent transition-colors"
                    >
                        Essayer gratuitement →
                    </Link>
                </div>
            </section>
        </div>
    );
}
