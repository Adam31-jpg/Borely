"use client";

import dynamic from "next/dynamic";
import { AppContextProvider } from "@borecore/core";

/**
 * Skeleton affiché pendant le chargement du chunk de la micro-app.
 */
function AppLoadingSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div
                className="w-10 h-10 rounded-2xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <div
                className="w-32 h-2 rounded-full animate-pulse"
                style={{ background: "rgba(255,255,255,0.04)" }}
            />
        </div>
    );
}

/**
 * Registre d'import dynamiques des micro-apps.
 * ssr: false → évite que zustand soit résolu côté serveur.
 *
 * Pour ajouter une nouvelle micro-app :
 *   "slug": dynamic(() => import("@borecore/app-xxx").then(m => m.default), { ssr: false })
 */
const APP_COMPONENTS: Record<string, React.ComponentType> = {
    mail: dynamic(
        () => import("@borecore/app-mail").then((m) => m.default),
        {
            loading: () => <AppLoadingSkeleton />,
            ssr: false,
        }
    ),
};

export function WorkspaceClient({ appSlug }: { appSlug: string }) {
    const AppComponent = APP_COMPONENTS[appSlug];

    if (!AppComponent) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10">
                <p
                    className="text-[13px] font-mono"
                    style={{ color: "rgba(255,255,255,0.40)" }}
                >
                    Application &quot;{appSlug}&quot; non disponible.
                </p>
            </div>
        );
    }

    return (
        <AppContextProvider appSlug={appSlug}>
            <AppComponent />
        </AppContextProvider>
    );
}
