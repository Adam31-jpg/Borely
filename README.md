# 🚀 Borecore — Monorepo Hub Micro-SaaS

**Les tâches ennuyeuses, terminées.**  
Des micro-apps qui automatisent ce que vous détestez faire. Rapides, chirurgicales, magnifiquement conçues.

---

## 📦 Installation

```bash
# Cloner le projet
git clone <repo-url>
cd Borely

# Installer les dépendances
pnpm install

# Copier les variables d'environnement
cp .env.local.example .env.local
# ⚠️ Remplir les valeurs dans .env.local avant de lancer

# Lancer en développement
pnpm dev
```

**Pré-requis :** Node.js ≥ 20 · pnpm ≥ 9

---

## 🏗️ Architecture

```
Borely/
├── apps/
│   └── hub/                    # Next.js 15 App Router (portail principal)
│       ├── app/
│       │   ├── page.tsx        # Boutique (grille d'apps)
│       │   ├── store/[slug]/   # Pages détails produit
│       │   ├── workspace/[slug]/ # Chargement dynamique des micro-apps
│       │   ├── library/        # Mes Applications
│       │   └── settings/       # Réglages
│       └── components/         # Shell, Providers
│
├── packages/
│   ├── config/                 # Tailwind, TypeScript, Design System
│   ├── ui/                     # Bibliothèque de composants (Button, AppCard, Skeleton)
│   ├── core/                   # Configuration globale, registre d'apps, types
│   ├── database/               # Drizzle ORM (PostgreSQL multi-schema)
│   ├── auth/                   # Cognito + NextAuth (placeholder)
│   └── app-mail/               # BoreBox — Nettoyeur de boîte mail
│
├── .env.local.example          # Template des variables d'environnement
├── turbo.json                  # Pipeline Turborepo
└── pnpm-workspace.yaml         # Déclaration du workspace
```

---

## ⚙️ Configuration

### Variables d'environnement (`.env.local`)

Toutes les clés API et secrets sont dans `.env.local` (jamais commité) :

| Variable | Description |
|---|---|
| `DATABASE_URL` | URL PostgreSQL (AWS RDS) |
| `GOOGLE_CLIENT_ID` | OAuth Google (Gmail API) |
| `GOOGLE_CLIENT_SECRET` | Secret OAuth Google |
| `AWS_KMS_KEY_ID` | Clé KMS pour chiffrement des tokens |
| `CREEM_API_KEY` | Clé API Creem.io (paiements) |
| `NEXTAUTH_SECRET` | Secret de session NextAuth |

### Configuration des apps (`packages/core/src/config.ts`)

Les prix, IDs Creem, et métadonnées sont modifiables sans toucher au code :

```typescript
export const appsConfig = {
  mail: {
    name: "BoreBox",
    pricing: { model: "lifetime", amount: 499, display: "4,99 €" },
    creemProductId: "prod_borebox_mail",
    // ...
  },
};
```

---

## 🎨 Design System

- **Thème** : Dark mode par défaut, toggle clair/sombre
- **Accentuation** : Chaque micro-app a sa propre couleur (`data-app` attribute)
- **Variables CSS** : `packages/config/themes.css`
- **Composants** : `packages/ui/` (shadcn/ui customisé)

---

## 📱 PWA

L'application supporte l'installation sur mobile :
- Manifest configuré (`public/manifest.json`)
- Icônes à fournir : `public/icons/icon-192.png` et `icon-512.png`

---

## 🧩 Ajouter une nouvelle micro-app

1. Créer le package : `packages/app-nouvelle/`
2. Ajouter l'entrée dans `packages/core/src/config.ts`
3. Enregistrer l'import dynamique dans `apps/hub/app/workspace/[appSlug]/page.tsx`
4. Créer le contenu marketing dans `apps/hub/app/store/[appSlug]/content.ts`

---

## 📋 Scripts

| Commande | Description |
|---|---|
| `pnpm dev` | Démarre le serveur de développement |
| `pnpm build` | Build de production |
| `pnpm lint` | Lint TypeScript + ESLint |

---

## 🔒 Sécurité

- **OAuth tokens** : Chiffrement AES-256-GCM via AWS KMS (Envelope Encryption)
- **Données emails** : Seuls les en-têtes sont scannés, aucun contenu stocké
- **Clés API** : Exclusivement via `.env.local` (non commité)
