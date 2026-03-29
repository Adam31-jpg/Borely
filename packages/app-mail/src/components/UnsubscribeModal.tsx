"use client";

import { useState } from "react";
import { Modal, ModalCheckbox } from "@borecore/ui";
import { Sender } from "../hooks/use-gmail-scan";

const PREF_KEY = "borebox_skip_unsub_modal";

export function shouldSkipModal(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PREF_KEY) === "true";
}

interface Props {
  senders: Sender[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function UnsubscribeModal({ senders, onConfirm, onCancel }: Props) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const isBulk = senders.length > 1;

  const handleConfirm = () => {
    if (dontShowAgain) localStorage.setItem(PREF_KEY, "true");
    onConfirm();
  };

  const bodyContent = (
    <div>
      {isBulk ? (
        <div
          style={{
            background: "#111",
            border: "1px solid #1a1a1a",
            padding: "0.5rem",
            maxHeight: "160px",
            overflowY: "auto",
          }}
        >
          {senders.slice(0, 5).map((s) => (
            <div
              key={s.email}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.4rem 0.5rem",
                borderBottom: "1px solid #1a1a1a",
              }}
            >
              <span style={{ color: "#e0e0e0", fontSize: "0.8rem" }}>{s.name}</span>
              <span style={{ color: "#555", fontSize: "0.75rem" }}>{s.email}</span>
            </div>
          ))}
          {senders.length > 5 && (
            <div
              style={{
                color: "#555",
                fontSize: "0.75rem",
                padding: "0.4rem 0.5rem",
                textAlign: "center",
              }}
            >
              +{senders.length - 5} autres
            </div>
          )}
        </div>
      ) : (
        <p
          style={{
            color: "#888",
            fontSize: "0.85rem",
            margin: "0 0 0.5rem",
            fontFamily: "'Geist Mono', monospace",
          }}
        >
          <span style={{ color: "#00ffff" }}>{senders[0]?.email}</span>
        </p>
      )}

      <p
        style={{
          background: "#111",
          border: "1px solid #1a1a1a",
          padding: "0.75rem 1rem",
          fontSize: "0.78rem",
          color: "#555",
          lineHeight: 1.6,
          marginTop: "1rem",
          fontFamily: "'Geist Mono', monospace",
        }}
      >
        Vous ne recevrez plus d&apos;emails de{" "}
        {isBulk ? "ces expéditeurs" : "cet expéditeur"}.{" "}
        Ils ne seront pas bloqués — seulement désabonnés.
      </p>
    </div>
  );

  return (
    <Modal
      open={true}
      title={
        isBulk
          ? `Se désabonner de ${senders.length} expéditeurs`
          : `Se désabonner de ${senders[0]?.name}`
      }
      accentColor="#00ffff"
      onClose={onCancel}
      actions={[
        { label: "ANNULER", onClick: onCancel, variant: "secondary" },
        {
          label: isBulk ? `DÉSABONNER (${senders.length})` : "SE DÉSABONNER",
          onClick: handleConfirm,
          variant: "primary",
        },
      ]}
      footer={
        <ModalCheckbox
          checked={dontShowAgain}
          onChange={setDontShowAgain}
          label="Ne plus afficher ce message"
          accentColor="#00ffff"
        />
      }
    >
      {bodyContent}
    </Modal>
  );
}
