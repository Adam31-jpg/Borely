import { Settings, User, Palette, Bell, Shield } from "lucide-react";

const SECTIONS = [
    {
        icon: User,
        title: "Compte",
        description: "Gérez votre profil et vos informations personnelles",
    },
    {
        icon: Palette,
        title: "Apparence",
        description: "Personnalisez le thème et l'affichage",
    },
    {
        icon: Bell,
        title: "Notifications",
        description: "Configurez vos préférences de notification",
    },
    {
        icon: Shield,
        title: "Confidentialité",
        description: "Contrôlez vos données et autorisations",
    },
] as const;

export default function SettingsPage() {
    return (
        <div className="px-6 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20 max-w-3xl mx-auto">
            <header className="mb-16">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter text-content-primary">
                    Réglages
                </h1>
                <p className="mt-3 text-content-muted text-lg leading-relaxed">
                    Gérez votre compte et vos préférences.
                </p>
            </header>

            <div className="space-y-3">
                {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    return (
                        <div
                            key={section.title}
                            className="flex items-center justify-between p-5 md:p-6 rounded-2xl
                         bg-surface-card border border-border/50
                         hover:border-border hover:shadow-sm
                         transition-all duration-smooth cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="flex items-center justify-center w-10 h-10 rounded-xl
                             bg-surface-elevated text-content-muted"
                                >
                                    <Icon className="h-[18px] w-[18px]" />
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-medium text-content-primary">
                                        {section.title}
                                    </h3>
                                    <p className="text-[13px] text-content-muted mt-0.5">
                                        {section.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
