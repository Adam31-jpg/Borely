"use client";

import dynamic from "next/dynamic";

const BoreBoxApp = dynamic(
  () => import("@borecore/app-mail").then((m) => m.BoreBoxApp),
  { ssr: false }
);

interface Props {
  userEmail: string;
  accessToken: string | null;
}

export function BoreBoxClient({ userEmail, accessToken }: Props) {
  return <BoreBoxApp userEmail={userEmail} accessToken={accessToken} />;
}
