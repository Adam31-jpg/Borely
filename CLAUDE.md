# Borely — CLAUDE.md

> **Lire ce fichier en priorité au début de chaque session Claude Code.**
> Il évite de re-scanner le codebase entier à chaque démarrage.

---

## Présentation du projet

**Borely** est un micro-SaaS en cours de construction : une suite d'apps productivité vendues à vie (lifetime deal), sans abonnement.

- **BoreBox** (app-mail) : nettoyeur de boîte Gmail — détecte les newsletters et mailing-lists via l'en-tête `List-Unsubscribe`, propose le désabonnement en un clic + création de filtre Gmail automatique.
- Architecture **app store** : les utilisateurs achètent des apps individuellement via Creem.io, accessibles depuis un hub central.
- Design system : **Industrial Luxury / Retro-Futuristic** — Syne (headings 800), Geist Mono (body), glassmorphism, brutalist corners, hard shadows, pas de border-radius, tout en inline styles.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 15 (App Router, Server + Client Components) |
| Auth | **next-auth v4.24.11** — Google OAuth + JWT strategy |
| Base de données | PostgreSQL via AWS RDS (`borely-db.cev6mgksovif.us-east-1.rds.amazonaws.com`) |
| ORM | Drizzle ORM + drizzle-kit |
| State client | Zustand (accounts store dans app-mail) |
| Monorepo | Turborepo + pnpm workspaces |
| Styling | Inline styles uniquement (pas de Tailwind dans les apps) |
| Paiement | Creem.io (pas encore implémenté) |
| Chiffrement | AWS KMS (lazy, non configuré en dev) |

---

## Architecture monorepo

```
Borely/
├── apps/
│   └── hub/                        # Next.js 15 — app principale
│       ├── app/
│       │   ├── api/auth/[...nextauth]/route.ts   # → import handler from "@/lib/auth"
│       │   ├── api/mail/scan/route.ts
│       │   ├── api/mail/unsubscribe/route.ts
│       │   ├── api/auth/register/route.ts
│       │   ├── auth/signin/page.tsx               # page sign-in branded
│       │   ├── auth/error/page.tsx                # page erreur auth
│       │   ├── login/page.tsx
│       │   ├── register/page.tsx
│       │   ├── workspace/[appSlug]/page.tsx
│       │   ├── store/[appSlug]/page.tsx
│       │   ├── library/page.tsx
│       │   └── settings/page.tsx
│       ├── lib/auth.ts                            # ← CONFIG AUTH PRINCIPALE (next-auth v4)
│       ├── middleware.ts                          # export { default } from "next-auth/middleware"
│       └── types/next-auth.d.ts                  # session.accessToken typé
│
├── packages/
│   ├── auth/                        # ⚠️ PLUS UTILISÉ — peut être supprimé
│   ├── database/src/
│   │   ├── schema/public.ts         # Tables Drizzle (user, account, session…)
│   │   └── index.ts                 # db = drizzle(postgres(DATABASE_URL))
│   ├── app-mail/src/
│   │   ├── index.tsx               # BoreBoxApp — entry point
│   │   ├── providers/gmail.ts      # GmailProvider (API réelle + MOCK fallback)
│   │   ├── hooks/use-gmail-scan.ts # → POST /api/mail/scan
│   │   └── components/             # ScanProgress, SenderList, UndoToast, …
│   └── ui/                         # composants partagés (peu utilisés, inline styles préférés)
│
├── .env.local                       # ← SOURCE UNIQUE des variables d'env (racine)
├── turbo.json                       # globalEnv liste toutes les vars
└── CLAUDE.md                        # ce fichier
```

---

## État actuel (30 mars 2026)

### ✅ Fait et fonctionnel

- Monorepo Turborepo + pnpm
- Next.js 15 App Router (`apps/hub`)
- **Auth : next-auth v4** (downgrade depuis v5 beta qui était buggée)
- Google OAuth fonctionnel avec scopes Gmail (`gmail.readonly` + `gmail.modify`)
- Session JWT avec `accessToken` Google stocké dans `session.accessToken`
- RDS PostgreSQL connecté (`borely-db.cev6mgksovif.us-east-1.rds.amazonaws.com`)
- Tables DB créées : `user`, `account`, `session`, `verificationToken`, `purchases`, `apps_catalog`, `user_oauth_tokens`, `scan_results`, `user_mailboxes`, `unsubscribe_history`
- UI `workspace/mail` s'affiche (BoreBox)
- Auth config : `apps/hub/lib/auth.ts` (NextAuthOptions v4)
- Route auth : `apps/hub/app/api/auth/[...nextauth]/route.ts`
- Package app-mail : `packages/app-mail/src/`
- `.env.local` racine chargé via `dotenv-cli` dans les scripts `dev` et `build`
- BoreBox UI : détection session.accessToken → affichage scanner si connecté
- Gmail API réelle branchée dans /api/mail/scan (fallback mock si pas de token)
- Scan 500 emails sans filtre `q=` (côté serveur : `hasUnsubscribe || count >= 2`)
- Composants ScanProgress + SenderList créés
- `packages/ui`: Modal générique + ModalCheckbox (provider-agnostic, accentColor prop, ESC/overlay close, footer slot)
- UnsubscribeModal BoreBox rewrite — wrapper fin autour du Modal générique
- `scan_results` table en DB — cache 14 jours, refresh ne relance pas le scan
- Auto-rescan 14 jours avec countdown timer dans l'UI
- Multi-mailbox max 3 (`MailboxSwitcher`) + table `user_mailboxes` + OAuth flow `/api/mail/connect`
- Filtre par défaut "NEWSLETTERS" (hasUnsubscribe only) — bouton "TOUS" pour voir tout
- Pagination 20 items par page avec contrôles ← PRÉC / SUIV →
- Tri par fréquence ou nom — recherche texte libre
- Tout en français (UI entièrement traduite)
- Historique désabonnements : table `unsubscribe_history` + GET `/api/mail/history` + composant `UnsubscribeHistory` collapsible
- Désabonnement sauvegardé en DB (userId, mailboxEmail, senderName, method)
- Mobile responsive : `flexWrap`, `className` CSS (`borebox-row`, `borebox-header`, etc.) + `<style>` media query dans BoreBoxApp

### 🚧 À faire ensuite

- Multi-mailbox : chiffrement tokens OAuth secondaires (AWS KMS)
- Multi-mailbox : refresh token automatique pour les boîtes secondaires
- Suppression des emails en masse d'un expéditeur (DELETE /api/mail/delete)
- UndoToast après désabonnement
- Outlook provider
- Système de paiement Creem.io
- Page `store/mail` complète

### ❌ Pas encore fait

- Paiement Creem.io (webhook, vérification d'achat)
- AWS KMS chiffrement tokens (placeholder en dev, tokens en clair dans JWT)
- PWA (manifest, icons, service worker)
- Deploy production (Vercel ou AWS)
- Page `/library` — affichage des apps achetées depuis DB

---

## ⚠️ Points d'attention critiques

### 1. next-auth est en v4 — NE PAS upgrader vers v5

v5 beta (`5.0.0-beta.30`) causait `UnknownAction: Unsupported action` sur `GET /api/auth/signin/google` malgré toutes les tentatives de fix (basePath, AUTH_URL, AUTH_TRUST_HOST…). Downgrade vers v4.24.11 a résolu le problème.

### 2. Config auth centralisée dans apps/hub/lib/auth.ts

```
apps/hub/lib/auth.ts          ← NextAuthOptions + export default NextAuth(authOptions)
apps/hub/app/api/auth/[...nextauth]/route.ts  ← import handler from "@/lib/auth"
apps/hub/middleware.ts        ← export { default } from "next-auth/middleware"
```

Pas de package `@borecore/auth` — tout est dans le hub.

### 3. Modal générique dans packages/ui

Toujours utiliser `<Modal>` de `@borecore/ui` pour toute nouvelle modale. Ne jamais recréer une modale custom dans une app. Passer `accentColor` pour matcher le thème de l'app (BoreBox = `#00ffff`).

### 4. Limite mailboxes

`MAX_MAILBOXES = 3` dans `apps/hub/app/api/mail/mailboxes/route.ts`. Ne pas changer sans revoir le pricing Creem.io.

### 5. packages/auth/ existe encore mais n'est plus utilisé

Peut être supprimé proprement avec `rm -rf packages/auth`.

### 4. Variables d'environnement — chargement monorepo

`.env.local` est à la **racine** du monorepo. Next.js tourne depuis `apps/hub/` et ne trouve pas ce fichier nativement. Fix : `dotenv-cli` dans les scripts npm :
```json
"dev": "dotenv -e ../../.env.local -- next dev --turbopack --port 3001",
"build": "dotenv -e ../../.env.local -- next build"
```

### 5. Multi-mailbox

Table `user_mailboxes` créée. Flow complet : `GET /api/mail/connect` → Google OAuth → `/api/mail/connect/callback` → upsert dans `user_mailboxes`. Le bouton "+ AJOUTER UNE BOÎTE" dans `MailboxSwitcher` pointe vers `/api/mail/connect`. ⚠️ Tokens stockés en clair — KMS non implémenté en dev.

### 6. Scan Gmail

Scan 500 emails sans filtre `q=` (plus large), filtre côté serveur sur `hasUnsubscribe || count >= 2`. Cache 14 jours vérifié avant tout appel Gmail — log `[scan] returning cached result` vs `[scan] running fresh scan`.

### 8. Google OAuth multi-mailbox — URI de redirection supplémentaire

`/api/mail/connect` redirige vers Google OAuth avec `redirect_uri=/api/mail/connect/callback`. Ajouter dans Google Cloud Console → Credentials → OAuth Client → **Authorized redirect URIs** :
```
http://localhost:3001/api/mail/connect/callback   (dev)
https://yourdomain.com/api/mail/connect/callback  (prod)
```
Sans ça : erreur `redirect_uri_mismatch`.

### 7. Noms des tables DB (DrizzleAdapter defaults)

`user`, `account`, `session`, `verificationToken` (singulier, pas pluriel). Migration `0001_rename_auth_tables.sql` a renommé les tables depuis le schéma initial en pluriel.

### 6. Google OAuth app en mode Test

Seul `adam.haouzi31@gmail.com` est testeur autorisé sur Google Cloud Console. Ajouter d'autres emails si besoin.

### 7. Gmail API — flux du token

```
Google OAuth → jwt() callback → token.accessToken stocké dans JWT cookie
                               ↓
POST /api/mail/scan → getServerSession(authOptions) → session.accessToken
                                                      ↓
                                   Authorization: Bearer ${accessToken}
                                   GET https://gmail.googleapis.com/gmail/v1/users/me/messages
```

Si `accessToken` absent → fallback vers `MOCK_SENDERS` (données simulées).

---

## Variables d'environnement requises

Toutes dans `.env.local` à la **racine** du monorepo.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL AWS RDS avec `?sslmode=require` |
| `AUTH_SECRET` | Secret JWT next-auth (généré via `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | URL base de l'app → `http://localhost:3001` |
| `GOOGLE_CLIENT_ID` | Google Cloud Console OAuth 2.0 |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console |
| `AWS_REGION` | Région AWS KMS |
| `AWS_ACCESS_KEY_ID` | Credentials AWS IAM |
| `AWS_SECRET_ACCESS_KEY` | Credentials AWS IAM |
| `AWS_KMS_KEY_ID` | ARN de la clé KMS |
| `CREEM_API_KEY` | API Creem.io (à obtenir) |
| `CREEM_WEBHOOK_SECRET` | Webhook Creem.io (à obtenir) |

---

## Commandes utiles

```bash
# Développement
pnpm dev                          # démarre tous les apps (hub sur :3001)

# Build
pnpm turbo build                  # build + type check complet

# Base de données (depuis packages/database/)
DATABASE_URL="..." pnpm migrate   # applique les migrations SQL
DATABASE_URL="..." pnpm generate  # génère une migration depuis le schéma
DATABASE_URL="..." pnpm push      # push direct (interactif)
DATABASE_URL="..." pnpm studio    # Drizzle Studio UI

# Lint
pnpm turbo lint

# Nettoyage
pnpm store prune
rm -rf apps/hub/.next             # vider cache Next.js
```

---

## Google Cloud Console — Configuration requise

URI de redirection OAuth autorisées :
```
http://localhost:3001/api/auth/callback/google   (développement)
https://<domaine>/api/auth/callback/google        (production)
```

Scopes activés :
- `openid`, `email`, `profile`
- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/gmail.modify`

---

## Décisions d'architecture

1. **Inline styles partout** dans les apps — pas de dépendance Tailwind dans les packages.
2. **`ssr: false`** sur `BoreBoxApp` via `dynamic()` — évite les crashs Zustand en SSR.
3. **KMS lazy** — aucun import AWS au démarrage, déclenché depuis `/api/mail/*` en production uniquement.
4. **next-auth v4** (pas v5) — v5 beta trop instable pour le routing OAuth dans un monorepo Next.js 15.
5. **Auth dans le hub uniquement** — `packages/auth/` abandonné, toute la config est dans `apps/hub/lib/auth.ts`.
