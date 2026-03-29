"use client";

import { useEffect, useState } from "react";
import { useGmailScan } from "./hooks/use-gmail-scan";
import { ScanProgress } from "./components/ScanProgress";
import { SenderList } from "./components/SenderList";
import { MailboxSwitcher } from "./components/MailboxSwitcher";
import type { Sender } from "./hooks/use-gmail-scan";

interface BoreBoxAppProps {
  userEmail: string;
  accessToken: string | null;
}

export function BoreBoxApp({ userEmail, accessToken }: BoreBoxAppProps) {
  const [currentMailbox, setCurrentMailbox] = useState(userEmail);
  const { scan, isScanning, senders, progress, error, nextScanAt } = useGmailScan();
  const isConnected = !!accessToken;

  // Auto-scan on mount and on mailbox switch
  useEffect(() => {
    if (isConnected) {
      scan(currentMailbox);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMailbox, isConnected]);

  const handleUnsubscribe = (sender: Sender) => {
    // TODO: POST /api/mail/unsubscribe
    console.log("[BoreBox] unsubscribe:", sender.email);
  };

  if (!isConnected) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.icon}>📭</div>
          <h2 style={styles.title}>BoreBox</h2>
          <p style={styles.subtitle}>
            Connectez votre Gmail pour détecter et supprimer les newsletters.
          </p>
          <a href="/api/auth/signin/google" style={styles.ctaButton}>
            Connecter Gmail
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.appTitle}>BOREBOX</h1>
        <MailboxSwitcher currentEmail={currentMailbox} onSwitch={setCurrentMailbox} />
      </div>

      {/* Scanning */}
      {isScanning && <ScanProgress progress={progress} />}

      {/* Error */}
      {!isScanning && error && (
        <p style={styles.error}>{error}</p>
      )}

      {/* Results */}
      {!isScanning && senders.length > 0 && (
        <SenderList
          senders={senders}
          nextScanAt={nextScanAt}
          onUnsubscribe={handleUnsubscribe}
        />
      )}

      {/* Empty state after scan */}
      {!isScanning && !error && senders.length === 0 && (
        <p style={styles.empty}>Aucune newsletter détectée dans cette boîte.</p>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#e0e0e0",
    fontFamily: "'Geist Mono', monospace",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "3rem 1rem",
  },
  header: {
    width: "100%",
    maxWidth: "900px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #00ffff33",
    paddingBottom: "1rem",
    marginBottom: "2rem",
  },
  appTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: "2rem",
    color: "#00ffff",
    letterSpacing: "0.2em",
    margin: 0,
  },
  card: {
    background: "#111",
    border: "1px solid #222",
    padding: "3rem",
    textAlign: "center",
    maxWidth: "420px",
    boxShadow: "4px 4px 0px #00ffff22",
  },
  icon: { fontSize: "3rem", marginBottom: "1rem" },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: "1.8rem",
    color: "#00ffff",
    margin: "0 0 0.5rem",
    letterSpacing: "0.1em",
  },
  subtitle: {
    color: "#888",
    fontSize: "0.9rem",
    lineHeight: 1.6,
    marginBottom: "2rem",
  },
  ctaButton: {
    display: "inline-block",
    background: "#00ffff",
    color: "#000",
    fontFamily: "'Geist Mono', monospace",
    fontWeight: 700,
    fontSize: "0.85rem",
    padding: "0.75rem 2rem",
    textDecoration: "none",
    cursor: "pointer",
    border: "none",
    letterSpacing: "0.1em",
    boxShadow: "3px 3px 0px #005555",
  },
  error: { color: "#ff4444", fontSize: "0.85rem", marginTop: "1rem" },
  empty: { color: "#444", fontSize: "0.85rem", marginTop: "2rem" },
};
