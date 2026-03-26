import type { AppConfig } from "@borecore/core";

/* ─────────────────────────────────────────────
 * Contenu marketing des pages produit (FR)
 *
 * Chaque app a son contenu marketing ici.
 * Pour ajouter une app : créer une nouvelle entrée.
 * ───────────────────────────────────────────── */

export interface ProductContent {
    /** Description marketing longue (plusieurs paragraphes) */
    longDescription: string[];
    /** Arguments de vente */
    features: Array<{
        title: string;
        description: string;
        icon: string;
    }>;
    /** Étapes du guide d'utilisation */
    steps: Array<{
        step: number;
        title: string;
        description: string;
    }>;
    /** Chemins des screenshots (placeholders) */
    screenshots: string[];
}

export const productsContent: Record<string, ProductContent> = {
    mail: {
        longDescription: [
            "Votre boîte mail est envahie par des newsletters que vous ne lisez jamais ? Des promotions quotidiennes qui s'accumulent ? BoreBox règle le problème en quelques secondes.",
            "Notre technologie scanne uniquement les en-têtes de vos emails pour détecter les abonnements actifs via le protocole standard List-Unsubscribe. Aucun contenu de mail n'est jamais lu, stocké ou transmis.",
            "En un clic, désabonnez-vous de dizaines d'expéditeurs indésirables et créez automatiquement des règles de filtrage pour maintenir votre boîte mail propre durablement.",
        ],
        features: [
            {
                title: "Confidentialité absolue",
                description:
                    "Seuls les en-têtes sont analysés. Zéro contenu d'email stocké, jamais.",
                icon: "Shield",
            },
            {
                title: "Gain de temps massif",
                description:
                    "Ce qui vous prendrait des heures est fait en quelques secondes. Automatiquement.",
                icon: "Clock",
            },
            {
                title: "Nettoyage durable",
                description:
                    "Des filtres sont créés pour que les mails indésirables aillent directement en corbeille.",
                icon: "Sparkles",
            },
            {
                title: "Annulation possible",
                description:
                    "Chaque action de nettoyage est réversible pendant 5 secondes. Zéro risque.",
                icon: "Undo2",
            },
        ],
        steps: [
            {
                step: 1,
                title: "Connectez votre compte",
                description:
                    "Autorisez BoreBox à accéder aux en-têtes de vos mails via Google OAuth. Sécurisé et chiffré.",
            },
            {
                step: 2,
                title: "Lancez le scan",
                description:
                    "BoreBox analyse vos mails et identifie tous les expéditeurs disposant d'un lien de désabonnement.",
            },
            {
                step: 3,
                title: "Nettoyez en un clic",
                description:
                    "Sélectionnez les abonnements indésirables et cliquez sur « Nettoyer ». C'est fait.",
            },
        ],
        screenshots: [
            "/screenshots/borebox-scan.png",
            "/screenshots/borebox-results.png",
            "/screenshots/borebox-clean.png",
        ],
    },
    finance: {
        longDescription: [
            "Vos relevés bancaires sont un chaos de transactions cryptiques. BankSort utilise l'intelligence artificielle pour catégoriser automatiquement chaque dépense.",
            "Importez vos relevés et laissez BankSort faire le tri. Loyer, courses, abonnements, loisirs — tout est classé intelligemment, sans effort de votre part.",
            "Obtenez une vue claire de vos dépenses par catégorie et identifiez instantanément les postes où vous dépensez le plus.",
        ],
        features: [
            {
                title: "Tri intelligent",
                description:
                    "L'IA distingue un loyer d'un achat en ligne. Précision chirurgicale.",
                icon: "Brain",
            },
            {
                title: "Vue d'ensemble",
                description:
                    "Graphiques clairs de vos dépenses par catégorie. Comprenez où va votre argent.",
                icon: "BarChart3",
            },
            {
                title: "Import simple",
                description:
                    "Glissez-déposez vos relevés CSV ou PDF. Pas de connexion bancaire requise.",
                icon: "Upload",
            },
            {
                title: "Données privées",
                description:
                    "Vos données financières restent sur nos serveurs européens sécurisés.",
                icon: "Lock",
            },
        ],
        steps: [
            {
                step: 1,
                title: "Importez vos relevés",
                description:
                    "Téléchargez vos relevés bancaires au format CSV ou PDF depuis votre banque.",
            },
            {
                step: 2,
                title: "Laissez l'IA trier",
                description:
                    "BankSort catégorise automatiquement chaque transaction en quelques secondes.",
            },
            {
                step: 3,
                title: "Analysez vos dépenses",
                description:
                    "Consultez vos graphiques et identifiez les postes de dépense à optimiser.",
            },
        ],
        screenshots: [
            "/screenshots/banksort-import.png",
            "/screenshots/banksort-results.png",
            "/screenshots/banksort-charts.png",
        ],
    },
};
