"use client";

interface ModalCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  accentColor?: string;
}

export function ModalCheckbox({
  checked,
  onChange,
  label,
  accentColor = "#00ffff",
}: ModalCheckboxProps) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ accentColor, width: "14px", height: "14px" }}
      />
      <span
        style={{
          color: "#555",
          fontSize: "0.78rem",
          fontFamily: "'Geist Mono', monospace",
        }}
      >
        {label}
      </span>
    </label>
  );
}
