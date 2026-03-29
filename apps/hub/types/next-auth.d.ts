import type { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        /** Access token Google OAuth — utilisé pour les appels Gmail API */
        accessToken?: string;
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
    }
}
