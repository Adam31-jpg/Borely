"use client";

import { useState, useEffect } from "react";
import { Sender } from "../hooks/use-gmail-scan";
import { useCountdown } from "../hooks/use-countdown";
import { UnsubscribeModal } from "./UnsubscribeModal";

type FilterType = "unsub" | "all";
type SortType = "count" | "name";

interface Props {
  senders: Sender[];
  nextScanAt?: string | null;
  onUnsubscribe?: (sender: Sender) => void;
}

const PAGE_SIZE = 20;

export function SenderList({ senders, nextScanAt, onUnsubscribe }: Props) {
  const countdown = useCountdown(nextScanAt);
  const [modalSenders, setModalSenders] = useState<Sender[] | null>(null);
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [unsubbed, setUnsubbed] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>("unsub");
  const [sort, setSort] = useState<SortType>("count");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filter, sort, search]);

  const executeUnsub = async (targets: Sender[]) => {
    setModalSenders(null);
    const emails = targets.map((s) => s.email);
    setLoading((prev) => new Set([...prev, ...emails]));

    await Promise.all(
      targets.map(async (sender) => {
        try {
          const res = await fetch("/api/mail/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              senderEmail: sender.email,
              senderName: sender.name,
              listUnsubscribe: sender.listUnsubscribe,
            }),
          });
          const data = await res.json();
          console.log("[unsub] result for", sender.email, data);
          if (data.success) onUnsubscribe?.(sender);
        } catch (err) {
          console.error("[unsub] error for", sender.email, err);
        }
      })
    );

    setUnsubbed((prev) => new Set([...prev, ...emails]));
    setLoading((prev) => {
      const next = new Set(prev);
      emails.forEach((e) => next.delete(e));
      return next;
    });
  };

  // Base list: remove already unsubscribed senders
  const base = senders.filter((s) => !unsubbed.has(s.email));

  // Apply filter (default: newsletters only = hasUnsubscribe)
  const filtered = base
    .filter((s) => filter === "all" || s.hasUnsubscribe)
    .filter((s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "count" ? b.count - a.count : a.name.localeCompare(b.name)
    );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ width: "100%", maxWidth: "900px" }}>
      {/* Unsubscribe modal */}
      {modalSenders && (
        <UnsubscribeModal
          senders={modalSenders}
          onConfirm={() => executeUnsub(modalSenders)}
          onCancel={() => setModalSenders(null)}
        />
      )}

      {/* Toolbar */}
      <div
        className="borebox-toolbar"
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "0.75rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setFilter("unsub")}
          style={{
            background: filter === "unsub" ? "#00ffff11" : "transparent",
            border: `1px solid ${filter === "unsub" ? "#00ffff44" : "#222"}`,
            color: filter === "unsub" ? "#00ffff" : "#555",
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.7rem",
            padding: "0.35rem 0.75rem",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
        >
          NEWSLETTERS
        </button>
        <button
          onClick={() => setFilter("all")}
          style={{
            background: filter === "all" ? "#ffffff11" : "transparent",
            border: `1px solid ${filter === "all" ? "#ffffff33" : "#222"}`,
            color: filter === "all" ? "#e0e0e0" : "#555",
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.7rem",
            padding: "0.35rem 0.75rem",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
        >
          TOUS
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
          style={{
            background: "#0f0f0f",
            border: "1px solid #222",
            color: "#555",
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.7rem",
            padding: "0.35rem 0.5rem",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          <option value="count">Trier : fréquence</option>
          <option value="name">Trier : nom</option>
        </select>

        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="borebox-search"
          style={{
            background: "#0f0f0f",
            border: "1px solid #222",
            color: "#e0e0e0",
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.75rem",
            padding: "0.35rem 0.75rem",
            outline: "none",
            minWidth: "0",
            flex: "1 1 160px",
          }}
        />
      </div>

      {/* Stats bar */}
      <div
        className="borebox-stats"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.75rem",
        }}
      >
        <span style={{ color: "#333", fontFamily: "'Geist Mono', monospace", fontSize: "0.75rem" }}>
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          {filtered.length !== base.length ? ` (sur ${base.length})` : ""}
        </span>
        {countdown && (
          <span style={{ color: "#333", fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem" }}>
            ⏱ {countdown}
          </span>
        )}
      </div>

      {/* Sender rows */}
      {paginated.map((s) => {
        const isLoading = loading.has(s.email);
        return (
          <div
            key={s.email}
            className="borebox-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              marginBottom: "0.5rem",
              background: "#111",
              border: "1px solid #1a1a1a",
              fontFamily: "'Geist Mono', monospace",
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            <div style={{ minWidth: 0, marginRight: "1rem" }}>
              <div
                style={{
                  color: "#e0e0e0",
                  fontSize: "0.9rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {s.name}
              </div>
              <div
                style={{
                  color: "#555",
                  fontSize: "0.75rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {s.email}
              </div>
            </div>
            <div
              className="borebox-row-right"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flexShrink: 0,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <span style={{ color: "#555", fontSize: "0.75rem" }}>
                {s.count} e-mails
              </span>
              {s.hasUnsubscribe && (
                <button
                  onClick={() => !isLoading && setModalSenders([s])}
                  disabled={isLoading}
                  style={{
                    background: "#00ffff22",
                    color: "#00ffff",
                    border: "1px solid #00ffff44",
                    padding: "0.2rem 0.6rem",
                    fontSize: "0.7rem",
                    letterSpacing: "0.05em",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    fontFamily: "'Geist Mono', monospace",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isLoading ? "..." : "Désabonner"}
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            padding: "1.5rem 0",
            fontFamily: "'Geist Mono', monospace",
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              background: "transparent",
              border: "1px solid #222",
              color: page === 1 ? "#333" : "#888",
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.8rem",
              padding: "0.4rem 1rem",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            ← PRÉC
          </button>
          <span style={{ color: "#444", fontSize: "0.75rem", padding: "0 1rem" }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              background: "transparent",
              border: "1px solid #222",
              color: page === totalPages ? "#333" : "#888",
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.8rem",
              padding: "0.4rem 1rem",
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >
            SUIV →
          </button>
        </div>
      )}
    </div>
  );
}
