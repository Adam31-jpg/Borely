"use client";

import { useEffect, useCallback, ReactNode } from "react";

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  loading?: boolean;
}

export interface ModalProps {
  /** Is the modal visible */
  open: boolean;
  /** Title */
  title: string;
  /** Optional subtitle below title */
  subtitle?: string;
  /** Body content — any ReactNode */
  children?: ReactNode;
  /** Bottom action buttons */
  actions: ModalAction[];
  /** Footer slot — e.g. a "don't show again" checkbox */
  footer?: ReactNode;
  /** Accent color for primary button + shadow. Default: #00ffff */
  accentColor?: string;
  /** Called on overlay click or ESC */
  onClose: () => void;
}

export function Modal({
  open,
  title,
  subtitle,
  children,
  actions,
  footer,
  accentColor = "#00ffff",
  onClose,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const accentShadow = accentColor + "33";

  return (
    <div
      style={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="borely-modal-title"
    >
      <div style={{ ...styles.modal, boxShadow: `6px 6px 0px ${accentShadow}` }}>
        {/* Header */}
        <div style={styles.header}>
          <h2 id="borely-modal-title" style={styles.title}>
            {title}
          </h2>
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
        </div>

        {/* Body */}
        {children && <div style={styles.body}>{children}</div>}

        {/* Footer slot */}
        {footer && <div style={styles.footerSlot}>{footer}</div>}

        {/* Actions */}
        <div style={styles.actions}>
          {actions.map((action, i) => {
            const isPrimary =
              action.variant === "primary" ||
              (!action.variant && i === actions.length - 1);
            const isDanger = action.variant === "danger";

            let btnStyle: React.CSSProperties = styles.btnBase;

            if (isPrimary) {
              btnStyle = {
                ...styles.btnBase,
                background: accentColor,
                color: "#000",
                fontWeight: 700,
                border: "none",
                boxShadow: `3px 3px 0px ${accentColor}55`,
                flex: 2,
              };
            } else if (isDanger) {
              btnStyle = {
                ...styles.btnBase,
                background: "#ff444422",
                color: "#ff4444",
                border: "1px solid #ff444444",
                flex: 2,
              };
            } else {
              btnStyle = {
                ...styles.btnBase,
                background: "transparent",
                color: "#555",
                border: "1px solid #2a2a2a",
                flex: 1,
              };
            }

            if (action.disabled || action.loading) {
              btnStyle = { ...btnStyle, opacity: 0.5, cursor: "not-allowed" };
            }

            return (
              <button
                key={i}
                style={btnStyle}
                onClick={() =>
                  !action.disabled && !action.loading && action.onClick()
                }
                disabled={action.disabled || action.loading}
              >
                {action.loading ? "..." : action.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles: {
  overlay: React.CSSProperties;
  modal: React.CSSProperties;
  header: React.CSSProperties;
  title: React.CSSProperties;
  subtitle: React.CSSProperties;
  body: React.CSSProperties;
  footerSlot: React.CSSProperties;
  actions: React.CSSProperties;
  btnBase: React.CSSProperties;
} = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "#0f0f0f",
    border: "1px solid #1e1e1e",
    padding: "2rem",
    maxWidth: "480px",
    width: "90%",
    fontFamily: "'Geist Mono', monospace",
  },
  header: {
    marginBottom: "1.25rem",
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: "1.15rem",
    color: "#e0e0e0",
    margin: "0 0 0.4rem",
    lineHeight: 1.3,
  },
  subtitle: {
    color: "#555",
    fontSize: "0.8rem",
    margin: 0,
    lineHeight: 1.5,
  },
  body: {
    marginBottom: "1.25rem",
  },
  footerSlot: {
    marginBottom: "1.25rem",
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
  },
  btnBase: {
    fontFamily: "'Geist Mono', monospace",
    fontSize: "0.8rem",
    padding: "0.75rem 1rem",
    cursor: "pointer",
    letterSpacing: "0.08em",
    transition: "opacity 0.1s",
    flex: 1,
  },
};
