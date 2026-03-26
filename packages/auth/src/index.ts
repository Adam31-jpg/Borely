/**
 * @borecore/auth — Authentication package
 *
 * This package will integrate:
 * - AWS Cognito for user management
 * - NextAuth.js for session handling
 * - Google OAuth login
 *
 * TODO: Implement when setting up Cognito User Pool
 */

export interface AuthUser {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
}

export interface AuthSession {
    user: AuthUser;
    accessToken: string;
    expiresAt: Date;
}

/**
 * Placeholder — will be replaced with actual Cognito/NextAuth config
 */
export function getAuthConfig() {
    return {
        providers: ["google"],
        // TODO: Configure Cognito User Pool
    };
}
