"use client";

import { useState } from "react";
import { Sender } from "../hooks/use-gmail-scan";
import { useCountdown } from "../hooks/use-countdown";
import { UnsubscribeModal } from "./UnsubscribeModal";

interface Props {
  senders: Sender[];
  nextScanAt?: string | null;
  onUnsubscribe?: (sender: Sender) => void;
}

export function SenderList({ senders, nextScanAt, onUnsubscribe }: Props) {
  const countdown = useCountdown(nextScanAt);
  const [modalSenders, setModalSenders] = useState<Sender[] | null>(null);

  return (
    <div style={{ width: "100%", maxWidth: "900px" }}>
      {/* Stats bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
      }}>
        <p style={{ color: "#888", fontFamily: "'Geist Mono', monospace", margin: 0 }}>
          {senders.length} expéditeurs détectés
        </p>
        {countdown && (
          <span style={{ color: "#444", fontFamily: "'Geist Mono', monospace", fontSize: "0.75rem" }}>
            ⏱ {countdown}
          </span>
        )}
      </div>

      {/* Unsubscribe modal */}
      {modalSenders && (
        <UnsubscribeModal
          senders={modalSenders}
          onConfirm={() => {
            if (modalSenders[0]) onUnsubscribe?.(modalSenders[0]);
            setModalSenders(null);
          }}
          onCancel={() => setModalSenders(null)}
        />
      )}

      {/* Sender rows */}
      {senders.map((s) => (
        <div key={s.email} style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          marginBottom: "0.5rem",
          background: "#111",
          border: "1px solid #1a1a1a",
          fontFamily: "'Geist Mono', monospace",
        }}>
          <div>
            <div style={{ color: "#e0e0e0", fontSize: "0.9rem" }}>{s.name}</div>
            <div style={{ color: "#555", fontSize: "0.75rem" }}>{s.email}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "#555", fontSize: "0.75rem" }}>{s.count} emails</span>
            {s.hasUnsubscribe && (
              <button
                onClick={() => setModalSenders([s])}
                style={{
                  background: "#00ffff22",
                  color: "#00ffff",
                  border: "1px solid #00ffff44",
                  padding: "0.2rem 0.6rem",
                  fontSize: "0.7rem",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  fontFamily: "'Geist Mono', monospace",
                }}
              >
                UNSUB
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
