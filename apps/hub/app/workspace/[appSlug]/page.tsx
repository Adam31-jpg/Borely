import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BoreBoxClient } from "./BoreBoxClient";

interface Props {
  params: Promise<{ appSlug: string }>;
}

export default async function WorkspacePage({ params }: Props) {
  const { appSlug } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const accessToken = (session as any).accessToken ?? null;

  if (appSlug === "mail") {
    return (
      <BoreBoxClient
        userEmail={session.user?.email ?? ""}
        accessToken={accessToken}
      />
    );
  }

  return (
    <div style={{ color: "white", padding: "2rem" }}>
      App <strong>{appSlug}</strong> non disponible.
    </div>
  );
}
