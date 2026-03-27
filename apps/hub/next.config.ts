import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,

    /**
     * transpilePackages — Next.js compile ces packages workspace directement
     * au lieu de les attendre pré-compilés. Requis pour les monorepos pnpm
     * avec import direct depuis les sources TypeScript.
     */
    transpilePackages: ["@borecore/ui", "@borecore/core", "@borecore/app-mail"],

    /**
     * Webpack — fallback pour `next build` et `next dev` sans --turbopack.
     *
     * Problème HMR Windows + pnpm workspaces :
     *   chokidar (le watcher de webpack) ne suit pas toujours les symlinks
     *   pnpm sur Windows. Le polling force une vérification explicite
     *   toutes les 800 ms → les changements dans packages/* sont détectés.
     *
     * Note : cette config est ignorée quand --turbopack est actif.
     *        Le dev script utilise --turbopack par défaut (meilleur HMR).
     */
    webpack: (config, { dev }) => {
        if (dev) {
            config.watchOptions = {
                // Intervalle de polling en ms — 800 est un bon équilibre
                // entre réactivité et charge CPU sur Windows.
                poll: 800,
                // Délai d'agrégation : attend 300 ms après le dernier
                // changement avant de déclencher la recompilation.
                aggregateTimeout: 300,
                // Exclure node_modules SAUF les packages workspace Borely
                // pour que les modifications dans packages/* soient vues.
                ignored: /node_modules\/(?!@borecore)/,
            };
        }
        return config;
    },
};

export default nextConfig;
