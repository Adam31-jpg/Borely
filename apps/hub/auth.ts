/**
 * Auth.js v5 (NextAuth) — Configuration
 *
 * Scopes Gmail requis :
 *   - https://www.googleapis.com/auth/gmail.readonly   → scan des en-têtes
 *   - https://www.googleapis.com/auth/gmail.modify     → création de filtres
 *
 * Variables d'environnement (.env.local) :
 *   AUTH_SECRET, AUTH_URL               ← Auth.js v5 (obligatoires)
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
 *   AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_KMS_KEY_ID
 *   DATABASE_URL
 *
 * URI de redirection Google Cloud Console :
 *   http://localhost:3001/api/auth/callback/google    (dev)
 *   https://<domaine>/api/auth/callback/google        (prod)
 */
import NextAuth, { type NextAuthResult } from "next-auth";
import Google from "next-auth/providers/google";
import { encryptToken, isKmsConfigured } from "@/lib/kms";

const nextAuthResult = NextAuth({
    /**
     * AUTH_SECRET (v5) ou NEXTAUTH_SECRET (legacy v4) — l'un ou l'autre suffit.
     * NextAuth v5 cherche AUTH_SECRET par défaut ; on accepte les deux.
     */
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,

    /**
     * basePath — chemin de base des endpoints Auth.js.
     * Doit correspondre au segment de route : app/api/auth/[...nextauth]/route.ts
     * Sans ce champ, Auth.js v5 peut échouer à router correctement l'action
     * entrante → erreur "UnknownAction".
     */
    basePath: "/api/auth",

    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: [
                        "openid",
                        "email",
                        "profile",
                        "https://www.googleapis.com/auth/gmail.readonly",
                        "https://www.googleapis.com/auth/gmail.modify",
                    ].join(" "),
                    access_type: "offline",
                    prompt: "consent",
                },
            },
        }),
    ],

    callbacks: {
        /**
         * Stocke l'accessToken dans le JWT.
         *
         * Lors du premier sign-in (account disponible) :
         *   - En production (KMS configuré) : chiffre le token avant stockage
         *   - En dev local : stocke le token en clair dans le JWT
         *
         * Le refreshToken n'est jamais exposé à la session client.
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ token, account }: any) {
            if (account) {
                // Premier sign-in — chiffrement KMS si disponible
                if (isKmsConfigured() && account.access_token) {
                    try {
                        const encrypted = await encryptToken(account.access_token);
                        // Stocker les métadonnées de chiffrement dans le JWT
                        // Le déchiffrement s'effectue dans la route API via decryptToken()
                        token.encryptedToken = encrypted;
                        // Conserver aussi le token en clair pour la session courante
                        // (il sera re-chiffré s'il expire et est rafraîchi)
                        token.accessToken = account.access_token;
                    } catch (err) {
                        // Fallback si KMS est inaccessible (mauvaises credentials, etc.)
                        console.error("[KMS] encryptToken failed, storing plaintext:", err);
                        token.accessToken = account.access_token;
                    }
                } else {
                    // Dev local : token en clair
                    token.accessToken = account.access_token;
                }
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;
            }
            return token;
        },

        /**
         * Expose accessToken à la session client.
         * Ne jamais exposer refreshToken côté client.
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async session({ session, token }: any) {
            return {
                ...session,
                accessToken: token.accessToken as string | undefined,
            };
        },
    },

    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
});

/**
 * Route handlers et helpers — exports stables de next-auth v5.
 * Côté client : utilisez `signIn`/`signOut` depuis "next-auth/react".
 * Côté serveur : utilisez `auth()` pour lire la session courante.
 */
// Contournement d'un bug de portabilité de types dans next-auth v5 beta :
// les types inférés de `auth`/`signIn`/`signOut` référencent des modules
// internes non-exportés (@auth/core/providers, next-auth/lib).
// L'assertion `as any` → retypé via NextAuthResult est sûre au runtime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _r = nextAuthResult as any;
export const handlers = _r.handlers as NextAuthResult["handlers"];
export const auth     = _r.auth     as NextAuthResult["auth"];
export const signIn   = _r.signIn   as NextAuthResult["signIn"];
export const signOut  = _r.signOut  as NextAuthResult["signOut"];

/* Augmentation du type Session */
declare module "next-auth" {
    interface Session {
        accessToken?: string;
    }
}
