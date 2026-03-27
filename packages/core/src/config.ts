import type { LucideIcon } from "lucide-react";

/* ─────────────────────────────────────────────
 * Configuration Globale — Borecore
 *
 * Ce fichier centralise TOUS les paramètres
 * modifiables du SaaS : prix, IDs Creem,
 * méta-données, et registre d'applications.
 *
 * Pour ajouter une micro-app :
 * 1. Ajouter une entrée dans `appsConfig`
 * 2. Créer le package correspondant
 * 3. Enregistrer le composant dans le hub
 * ───────────────────────────────────────────── */

/**
 * Méta-données globales du site.
 */
export const siteConfig = {
    name: "Borely",
    tagline: "Les tâches ennuyeuses, terminées.",
    description:
        "Des micro-apps qui automatisent ce que vous détestez faire. Rapides, chirurgicales, magnifiquement conçues.",
    url: "https://borely.app",
    locale: "fr-FR",
    creator: "Borely",
} as const;

/**
 * Modèle de tarification d'une micro-app.
 */
export interface AppPricing {
    /** "lifetime" = achat unique, "subscription" = abonnement */
    model: "lifetime" | "subscription";
    /** Prix en centimes (ex: 499 = 4,99 €) */
    amount: number;
    /** Devise ISO */
    currency: "EUR";
    /** Prix affiché (ex: "4,99 €") */
    display: string;
}

/**
 * Configuration complète d'une micro-app.
 */
export interface AppConfig {
    slug: string;
    name: string;
    subtitle: string;
    shortDescription: string;
    category: "Productivité" | "Finance" | "Confidentialité";
    pricing: AppPricing;
    creemProductId: string;
    accentColor: string;
    iconName: string;
}

/**
 * Registre de toutes les micro-apps.
 * Modifier ici pour changer les prix, noms, ou ajouter une app.
 */
export const appsConfig: Record<string, AppConfig> = {
    mail: {
        slug: "mail",
        name: "BoreBox",
        subtitle: "Nettoyeur de boîte mail",
        shortDescription:
            "Scannez votre boîte mail, identifiez les abonnements indésirables et désabonnez-vous en un clic.",
        category: "Productivité",
        pricing: {
            model: "lifetime",
            amount: 499,
            currency: "EUR",
            display: "1,99 €",
        },
        creemProductId: "prod_borebox_mail",
        accentColor: "#0EA5E9",
        iconName: "Mail",
    },
    finance: {
        slug: "finance",
        name: "BankSort",
        subtitle: "Trieur de relevés bancaires",
        shortDescription:
            "Catégorisez automatiquement vos transactions bancaires. Un tri intelligent qui comprend vos dépenses.",
        category: "Finance",
        pricing: {
            model: "subscription",
            amount: 699,
            currency: "EUR",
            display: "6,99 €/mois",
        },
        creemProductId: "prod_banksort",
        accentColor: "#22C55E",
        iconName: "Landmark",
    },
} as const;

/**
 * Labels de navigation (FR).
 */
export const navLabels = {
    store: "Boutique",
    library: "Mes Apps",
    settings: "Réglages",
} as const;

/**
 * Catégories de filtrage (FR).
 */
export const categories = [
    "Tout",
    "Productivité",
    "Finance",
    "Confidentialité",
] as const;
