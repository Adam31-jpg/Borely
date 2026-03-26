/**
 * WorkspacePage — Server Component wrapper
 *
 * Architecture :
 *   [Server Component]  → résout appSlug, vérifie l'existence de l'app
 *   [WorkspaceClient]   → "use client" avec dynamic(ssr: false)
 *
 * Raison du split :
 *   Le dynamic import de zustand (client-only) crashait le
 *   worker de static-path generation quand "use client" était
 *   sur le même fichier que la page.
 */
import { appRegistry } from "@borecore/core";
import { WorkspaceClient } from "./client";

export default async function WorkspacePage({
    params,
}: {
    params: Promise<{ appSlug: string }>;
}) {
    const { appSlug } = await params;
    const app = appRegistry.find((a) => a.slug === appSlug);

    if (!app) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10">
                <p
                    className="text-[13px] font-mono"
                    style={{ color: "rgba(255,255,255,0.40)" }}
                >
                    Application &quot;{appSlug}&quot; introuvable.
                </p>
            </div>
        );
    }

    return <WorkspaceClient appSlug={appSlug} />;
}
