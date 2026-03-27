import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, users } from "@borecore/database";

/**
 * Auth.js v5 — Configuration principale Borely
 *
 * Providers :
 *   - Google OAuth  → compte social, tokens stockés dans `accounts`
 *   - Credentials   → email + mot de passe bcrypt, stockés dans `users.passwordHash`
 *
 * Adapter DrizzleAdapter → sessions et comptes persistés en base (AWS RDS).
 *
 * KMS : le chiffrement AWS KMS des tokens OAuth n'est PAS appelé ici.
 *       Il est déclenché de façon lazy depuis les routes API /api/mail/*
 *       après que la session est établie. Aucun import KMS dans ce fichier.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    adapter: DrizzleAdapter(db),

    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        Credentials({
            credentials: {
                email:    { label: "Email",         type: "email" },
                password: { label: "Mot de passe",  type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const email = credentials.email as string;
                const password = credentials.password as string;

                const [user] = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, email))
                    .limit(1);

                if (!user || !user.passwordHash) return null;

                const valid = await bcrypt.compare(password, user.passwordHash);
                if (!valid) return null;

                return {
                    id:    user.id,
                    email: user.email,
                    name:  user.name ?? undefined,
                    image: user.image ?? undefined,
                };
            },
        }),
    ],

    session: { strategy: "database" },

    callbacks: {
        session({ session, user }) {
            if (session.user && user) {
                session.user.id = user.id;
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
        error:  "/auth/error",
    },
});
