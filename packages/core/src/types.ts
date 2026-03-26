import * as React from "react";

/**
 * Représente une micro-app enregistrée dans l'écosystème Borecore.
 */
export interface MicroApp {
    /** Identifiant URL-safe, ex: "mail" */
    slug: string;
    /** Nom affiché */
    name: string;
    /** Description courte pour la boutique */
    description: string;
    /** Catégorie de filtrage */
    category: "Productivité" | "Finance" | "Confidentialité";
    /** Prix affiché, ex: "4,99 €" */
    price: string;
    /** Couleur d'accentuation CSS */
    accentColor: string;
    /** Icône React */
    icon: React.ReactNode;
}

/**
 * Statut d'abonnement d'un utilisateur à une micro-app.
 */
export interface UserSubscription {
    userId: string;
    appSlug: string;
    status: "active" | "expired" | "cancelled";
    purchasedAt: Date;
    expiresAt?: Date;
}

/**
 * Contexte d'application pour le thème.
 */
export interface AppContext {
    appSlug: string;
}
