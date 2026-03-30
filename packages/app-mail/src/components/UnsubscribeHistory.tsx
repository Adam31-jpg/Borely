"use client";

import { useState, useEffect } from "react";

interface HistoryItem {
  id: string;
  senderEmail: string;
  senderName: string;
  unsubscribedAt: string;
  method: string;
}

export function UnsubscribeHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open || loaded) return;
    setLoading(true);
    fetch("/api/mail/history")
      .then((r) => r.json())
      .then((data) => {
        setHistory(data.history ?? []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true))
      .finally(() => setLoading(false));
  }, [open, loaded]);

  return (
    <div style={{ width: "100%", maxWidth: "900px", marginTop: "2rem" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "transparent",
          border: "none",
          color: "#2a2a2a",
          fontFamily: "'Geist Mono', monospace",
          fontSize: "0.75rem",
          cursor: "pointer",
          letterSpacing: "0.05em",
          padding: "0.5rem 0",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {open ? "▲" : "▼"} HISTORIQUE DES DÉSABONNEMENTS
        {history.length > 0 && (
          <span
            style={{
              background: "#1a1a1a",
              color: "#333",
              padding: "0.1rem 0.5rem",
              fontSize: "0.7rem",
            }}
          >
            {history.length}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            marginTop: "0.5rem",
            border: "1px solid #1a1a1a",
            background: "#0a0a0a",
          }}
        >
          {loading && (
            <div
              style={{
                color: "#333",
                padding: "1rem",
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.8rem",
              }}
            >
              Chargement...
            </div>
          )}

          {!loading && history.length === 0 && (
            <div
              style={{
                color: "#2a2a2a",
                padding: "1rem",
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.8rem",
              }}
            >
              Aucun désabonnement enregistré.
            </div>
          )}

          {!loading &&
            history.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  borderBottom: "1px solid #111",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      color: "#444",
                      fontSize: "0.85rem",
                      fontFamily: "'Geist Mono', monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.senderName}
                  </div>
                  <div
                    style={{
                      color: "#2a2a2a",
                      fontSize: "0.75rem",
                      fontFamily: "'Geist Mono', monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.senderEmail}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      color: "#2a2a2a",
                      fontSize: "0.7rem",
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {new Date(item.unsubscribedAt).toLocaleDateString("fr-FR")}
                  </div>
                  <div
                    style={{
                      color: "#1a3a1a",
                      fontSize: "0.65rem",
                      fontFamily: "'Geist Mono', monospace",
                      marginTop: "0.2rem",
                    }}
                  >
                    ✓ DÉSABONNÉ
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
