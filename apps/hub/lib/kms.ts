/**
 * AWS KMS — Chiffrement/Déchiffrement des tokens OAuth
 *
 * Architecture Envelope Encryption :
 *   1. KMS génère une DEK (Data Encryption Key) unique par token
 *   2. La DEK chiffre le token avec AES-256-GCM
 *   3. La DEK chiffrée est stockée en DB (encryptedDek)
 *   4. Le vecteur d'initialisation (IV) est stocké en clair en DB
 *
 * Variables d'environnement requises :
 *   AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_KMS_KEY_ID
 *
 * ⚠️ Ce module s'exécute côté SERVEUR uniquement.
 *    Ne jamais importer depuis des composants "use client".
 */

import {
    KMSClient,
    GenerateDataKeyCommand,
    DecryptCommand,
} from "@aws-sdk/client-kms";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

/** Résultat du chiffrement d'un token */
export interface EncryptedToken {
    /** Token chiffré (AES-256-GCM), encodé en base64 */
    encryptedValue: string;
    /** DEK chiffrée par KMS, encodée en base64 */
    encryptedDek: string;
    /** Vecteur d'initialisation AES, encodé en base64 */
    iv: string;
    /** Tag d'authentification GCM, encodé en base64 */
    authTag: string;
}

function getKmsClient(): KMSClient {
    return new KMSClient({
        region: process.env.AWS_REGION ?? "eu-west-3",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });
}

const KMS_KEY_ID = process.env.AWS_KMS_KEY_ID!;

/**
 * Chiffre un token OAuth avec envelope encryption.
 *
 * @param plaintext — Token en clair (accessToken ou refreshToken)
 * @returns EncryptedToken prêt à stocker en DB
 */
export async function encryptToken(plaintext: string): Promise<EncryptedToken> {
    const client = getKmsClient();

    // 1. Demander une DEK à KMS
    const { Plaintext, CiphertextBlob } = await client.send(
        new GenerateDataKeyCommand({
            KeyId: KMS_KEY_ID,
            KeySpec: "AES_256",
        })
    );

    if (!Plaintext || !CiphertextBlob) {
        throw new Error("KMS GenerateDataKey a échoué");
    }

    // 2. Chiffrer le token avec la DEK (AES-256-GCM)
    const iv = randomBytes(12); // 96 bits — recommandé pour GCM
    const cipher = createCipheriv("aes-256-gcm", Buffer.from(Plaintext), iv);
    const encrypted = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    // 3. Effacer la DEK en mémoire (best-effort)
    Buffer.from(Plaintext).fill(0);

    return {
        encryptedValue: encrypted.toString("base64"),
        encryptedDek: Buffer.from(CiphertextBlob).toString("base64"),
        iv: iv.toString("base64"),
        authTag: authTag.toString("base64"),
    };
}

/**
 * Déchiffre un token OAuth stocké en DB.
 *
 * @param encrypted — Données chiffrées issues de encryptToken()
 * @returns Token en clair
 */
export async function decryptToken(encrypted: EncryptedToken): Promise<string> {
    const client = getKmsClient();

    // 1. Demander à KMS de déchiffrer la DEK
    const { Plaintext } = await client.send(
        new DecryptCommand({
            CiphertextBlob: Buffer.from(encrypted.encryptedDek, "base64"),
            KeyId: KMS_KEY_ID,
        })
    );

    if (!Plaintext) {
        throw new Error("KMS Decrypt a échoué");
    }

    // 2. Déchiffrer le token avec la DEK (AES-256-GCM)
    const decipher = createDecipheriv(
        "aes-256-gcm",
        Buffer.from(Plaintext),
        Buffer.from(encrypted.iv, "base64"),
    );
    decipher.setAuthTag(Buffer.from(encrypted.authTag, "base64"));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encrypted.encryptedValue, "base64")),
        decipher.final(),
    ]);

    // Effacer la DEK
    Buffer.from(Plaintext).fill(0);

    return decrypted.toString("utf8");
}

/**
 * Vérifie que les variables d'environnement KMS sont configurées.
 * Retourne false en dev local sans configuration AWS.
 */
export function isKmsConfigured(): boolean {
    return !!(
        process.env.AWS_KMS_KEY_ID &&
        process.env.AWS_ACCESS_KEY_ID &&
        process.env.AWS_SECRET_ACCESS_KEY
    );
}
