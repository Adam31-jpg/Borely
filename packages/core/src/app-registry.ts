import * as React from "react";
import { Mail, Landmark } from "lucide-react";
import type { MicroApp } from "./types";
import { appsConfig } from "./config";

/**
 * Registre central des micro-apps.
 * Construit dynamiquement depuis appsConfig pour éviter la duplication.
 */
export const appRegistry: MicroApp[] = Object.values(appsConfig).map((app) => ({
    slug: app.slug,
    name: app.name,
    description: app.shortDescription,
    category: app.category,
    price: app.pricing.display,
    accentColor: app.accentColor,
    icon: React.createElement(
        app.iconName === "Mail" ? Mail : Landmark,
        { className: "h-6 w-6" }
    ),
}));
