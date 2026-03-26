import { Library } from "lucide-react";

export default function LibraryPage() {
    return (
        <div className="px-6 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20 max-w-6xl mx-auto">
            <header className="mb-16">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter text-content-primary">
                    Mes Applications
                </h1>
                <p className="mt-3 text-content-muted text-lg leading-relaxed">
                    Vos micro-apps achetées, prêtes à utiliser.
                </p>
            </header>

            {/* État vide */}
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div
                    className="flex items-center justify-center w-20 h-20 rounded-3xl
                     bg-surface-card border border-border/50 mb-8"
                >
                    <Library className="h-9 w-9 text-content-muted" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-content-primary mb-3">
                    Aucune application
                </h2>
                <p className="text-content-muted max-w-sm leading-relaxed">
                    Rendez-vous dans la Boutique pour découvrir des micro-apps
                    qui automatisent vos tâches les plus ennuyeuses.
                </p>
            </div>
        </div>
    );
}
