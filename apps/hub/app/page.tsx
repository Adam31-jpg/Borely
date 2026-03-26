import { AppCard } from "@borecore/ui";
import { appRegistry, siteConfig, categories } from "@borecore/core";

export default function StorePage() {
    return (
        <div className="px-6 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20 max-w-6xl mx-auto">
            {/* Héro */}
            <header className="mb-16 md:mb-20">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-content-primary leading-[1.1]">
                    {siteConfig.tagline.replace(", terminées.", ",")}
                    <br />
                    <span className="text-accent">terminées.</span>
                </h1>
                <p className="mt-5 text-content-muted text-lg md:text-xl leading-relaxed max-w-xl">
                    {siteConfig.description}
                </p>
            </header>

            {/* Filtres */}
            <div className="flex gap-2.5 mb-10 md:mb-14 overflow-x-auto pb-2 -mx-1 px-1">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`
              px-5 py-2.5 rounded-2xl text-[13px] font-medium whitespace-nowrap
              transition-all duration-smooth tap-target
              ${cat === "Tout"
                                ? "bg-accent text-white shadow-glow"
                                : "bg-surface-card text-content-muted hover:text-content-primary hover:bg-surface-elevated border border-transparent hover:border-border"
                            }
            `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grille d'applications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {appRegistry.map((app) => (
                    <AppCard
                        key={app.slug}
                        slug={app.slug}
                        name={app.name}
                        description={app.description}
                        category={app.category}
                        price={app.price}
                        icon={app.icon}
                        accentColor={app.accentColor}
                    />
                ))}
            </div>
        </div>
    );
}
