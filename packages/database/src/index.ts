import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Client Drizzle — singleton pour toute l'application.
 * DATABASE_URL doit être défini dans .env.local (PostgreSQL / AWS RDS).
 */
export const db = drizzle(postgres(process.env.DATABASE_URL!), { schema });

export * from "./schema";
