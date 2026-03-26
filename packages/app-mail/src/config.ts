/* ─────────────────────────────────────────────
 * Configuration BoreBox — Nettoyeur de boîte mail
 *
 * Tous les textes de l'interface et paramètres
 * de l'application sont centralisés ici.
 * ───────────────────────────────────────────── */

export const boreboxConfig = {
    /** Nom affiché dans l'interface */
    appName: "BoreBox",

    /** Nombre maximum de mails scannés par exécution */
    maxScanEmails: 5000,

    /** Durée de la fenêtre d'annulation (ms) */
    undoDelayMs: 5000,

    /** Intervalle entre les scans automatiques (jours) */
    scanIntervalDays: 14,

    /** Textes de l'interface (FR) */
    texts: {
        // ─── État : Connexion ───
        connectTitle: "Connectez votre Gmail",
        connectDescription:
            "Nous scannons uniquement les en-têtes de vos mails pour détecter les abonnements. Aucun contenu d'email n'est stocké — jamais.",
        connectButton: "Se connecter avec Google",

        // ─── État : Scan ───
        scanTitle: "Analyse en cours",
        scanDescription: "Détection des abonnements et newsletters...",
        scanButton: "Lancer le scan",
        scanProgress: "mails analysés",

        // ─── État : Résultats ───
        resultsTitle: "Abonnements détectés",
        resultsDescription:
            "Voici les expéditeurs qui envoient des newsletters ou mails récurrents à votre adresse.",
        resultsEmpty: "Aucun abonnement détecté. Votre boîte mail est propre !",
        cleanButton: "Nettoyer",
        cleanAllButton: "Tout nettoyer",
        selectAll: "Tout sélectionner",
        mailCount: "mail(s)",
        lastSeen: "Dernier mail",

        // ─── État : Nettoyage (Undo) ───
        cleaningTitle: "Nettoyage en cours",
        undoButton: "Annuler",
        undoCountdown: "Validation dans",
        cleaningSuccess: "Nettoyage terminé avec succès.",
        cleaningUndone: "Nettoyage annulé.",

        // ─── Confiance ───
        trustPrivacy: "Confidentialité absolue",
        trustPrivacyDesc: "Aucun contenu d'email stocké",
        trustSpeed: "Ultra-rapide",
        trustSpeedDesc: "Des milliers de mails analysés en quelques secondes",
        trustOneClick: "Un clic suffit",
        trustOneClickDesc: "Désabonnement et nettoyage instantanés",
    },
} as const;
