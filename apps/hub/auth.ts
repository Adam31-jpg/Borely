/**
 * Auth.js v5 (NextAuth) — Configuration
 *
 * Scopes Gmail requis :
 *   - https://www.googleapis.com/auth/gmail.readonly   → scan des en-têtes
 *   - https://www.googleapis.com/auth/gmail.modify     → création de filtres
 *
 * Variables d'environnement (.env.local) :
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL
 *
 * URI de redirection Google Cloud Console :
 *   http://localhost:3001/api/auth/callback/google    (dev)
 *   https://<domaine>/api/auth/callback/google        (prod)
 */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const nextAuthResult = NextAuth({
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
         * Production : chiffrer via KMS avant stockage DB.
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ token, account }: any) {
            if (account) {
                token.accessToken = account.access_token;
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
            return { ...session, accessToken: token.accessToken };
        },
    },

    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
});

/**
 * Route handlers — seuls exports stables de next-auth beta.
 * Utilisez `signIn`/`signOut` depuis "next-auth/react" côté client.
 */
export const { handlers } = nextAuthResult;

/* Augmentation du type Session */
declare module "next-auth" {
    interface Session {
        accessToken?: string;
    }
}
