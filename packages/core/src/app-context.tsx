"use client";

import * as React from "react";

/**
 * Wraps micro-app content with a data-app attribute for CSS theming.
 * Changes to [data-app] instantly switch accent colors via CSS custom properties.
 */
export function AppContextProvider({
    appSlug,
    children,
}: {
    appSlug: string;
    children: React.ReactNode;
}) {
    return (
        <div data-app={appSlug} className="contents min-h-full">
            {children}
        </div>
    );
}
