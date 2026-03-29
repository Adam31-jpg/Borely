"use client";

import { useState, useEffect } from "react";
import { useCountdown } from "../hooks/use-countdown";

interface MailboxScan {
  scannedAt: string;
  nextScanAt: string;
  totalScanned: number;
}

interface Mailbox {
  email: string;
  provider: string;
  scan: MailboxScan | null;
}

interface Props {
  currentEmail: string;
  onSwitch: (email: string) => void;
}

function MailboxRow({ mailbox, isCurrent, onSelect }: {
  mailbox: Mailbox;
  isCurrent: boolean;
  onSelect: () => void;
}) {
  const countdown = useCountdown(mailbox.scan?.nextScanAt ?? null);

  return (
    <div
      onClick={onSelect}
      style={{
        padding: "0.75rem 1rem",
        cursor: "pointer",
        background: isCurrent ? "#00ffff11" : "transparent",
        borderLeft: isCurrent ? "2px solid #00ffff" : "2px solid transparent",
        borderBottom: "1px solid #1a1a1a",
      }}
    >
      <div style={{ color: "#e0e0e0", fontSize: "0.8rem", fontFamily: "'Geist Mono', monospace" }}>
        {mailbox.email}
      </div>
      {countdown && (
        <div style={{ color: "#444", fontSize: "0.7rem", fontFamily: "'Geist Mono', monospace", marginTop: "0.2rem" }}>
          {countdown}
        </div>
      )}
      {!mailbox.scan && (
        <div style={{ color: "#555", fontSize: "0.7rem", fontFamily: "'Geist Mono', monospace", marginTop: "0.2rem" }}>
          Jamais scanné
        </div>
      )}
    </div>
  );
}

export function MailboxSwitcher({ currentEmail, onSwitch }: Props) {
  const [open, setOpen] = useState(false);
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [canAddMore, setCanAddMore] = useState(false);
  const [max, setMax] = useState(3);

  useEffect(() => {
    fetch("/api/mail/mailboxes")
      .then((r) => r.json())
      .then((data) => {
        setMailboxes(data.mailboxes ?? []);
        setCanAddMore(data.canAddMore ?? false);
        setMax(data.max ?? 3);
      });
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "transparent",
          border: "1px solid #222",
          color: "#888",
          fontFamily: "'Geist Mono', monospace",
          fontSize: "0.75rem",
          padding: "0.35rem 0.75rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span style={{ color: "#00ffff", fontSize: "0.6rem" }}>●</span>
        {currentEmail}
        <span style={{ color: "#444" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            background: "#0f0f0f",
            border: "1px solid #222",
            boxShadow: "4px 4px 0px #00ffff22",
            minWidth: "280px",
            zIndex: 100,
          }}
        >
          {mailboxes.map((m) => (
            <MailboxRow
              key={m.email}
              mailbox={m}
              isCurrent={m.email === currentEmail}
              onSelect={() => { onSwitch(m.email); setOpen(false); }}
            />
          ))}

          {canAddMore ? (
            <a
              href="/api/auth/signin/google"
              style={{
                display: "block",
                padding: "0.75rem 1rem",
                color: "#00ffff",
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.75rem",
                textDecoration: "none",
                borderTop: "1px solid #1a1a1a",
                letterSpacing: "0.05em",
              }}
            >
              + AJOUTER UNE BOÎTE ({mailboxes.length}/{max})
            </a>
          ) : (
            <div
              style={{
                padding: "0.75rem 1rem",
                color: "#333",
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.7rem",
                borderTop: "1px solid #1a1a1a",
              }}
            >
              LIMITE ATTEINTE ({max}/{max} boîtes)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
