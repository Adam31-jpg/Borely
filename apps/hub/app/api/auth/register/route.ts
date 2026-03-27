import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, users } from "@borecore/database";

/**
 * POST /api/auth/register
 * Crée un compte email + mot de passe.
 * Le mot de passe est haché avec bcrypt (cost 12) avant stockage.
 */
export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);

    if (!body?.email || !body?.password || !body?.name) {
        return NextResponse.json(
            { error: "Champs requis : name, email, password" },
            { status: 400 },
        );
    }

    const { email, password, name } = body as {
        email: string;
        password: string;
        name: string;
    };

    if (password.length < 8) {
        return NextResponse.json(
            { error: "Le mot de passe doit contenir au moins 8 caractères" },
            { status: 400 },
        );
    }

    // Vérifier si l'email est déjà pris
    const [existing] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (existing) {
        return NextResponse.json(
            { error: "Un compte existe déjà avec cet email" },
            { status: 409 },
        );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const id = crypto.randomUUID();

    await db.insert(users).values({
        id,
        email,
        name,
        passwordHash,
    });

    return NextResponse.json({ success: true }, { status: 201 });
}
