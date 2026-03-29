import { useState, useCallback } from "react";

export interface Sender {
  email: string;
  name: string;
  count: number;
  hasUnsubscribe: boolean;
  listUnsubscribe?: string;
  lastEmailDate?: string;
  provider?: string;
}

interface UseGmailScanReturn {
  scan: (mailboxEmail: string, forceRescan?: boolean) => Promise<void>;
  isScanning: boolean;
  senders: Sender[];
  progress: number;
  error: string | null;
  nextScanAt: string | null;
  scannedAt: string | null;
}

export function useGmailScan(): UseGmailScanReturn {
  const [isScanning, setIsScanning] = useState(false);
  const [senders, setSenders] = useState<Sender[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [nextScanAt, setNextScanAt] = useState<string | null>(null);
  const [scannedAt, setScannedAt] = useState<string | null>(null);

  const scan = useCallback(async (mailboxEmail: string, forceRescan = false) => {
    setIsScanning(true);
    setError(null);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 8, 85));
      }, 400);

      const res = await fetch("/api/mail/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mailboxEmail, forceRescan }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Erreur serveur ${res.status}`);
      }

      const data = await res.json();
      setSenders(data.senders ?? []);
      setNextScanAt(data.nextScanAt ? new Date(data.nextScanAt).toISOString() : null);
      setScannedAt(data.scannedAt ? new Date(data.scannedAt).toISOString() : null);
    } catch (err: any) {
      setError(err.message ?? "Erreur inconnue");
    } finally {
      setIsScanning(false);
    }
  }, []);

  return { scan, isScanning, senders, progress, error, nextScanAt, scannedAt };
}
