export function ScanProgress({ progress }: { progress: number }) {
  return (
    <div style={{ textAlign: "center", width: "100%", maxWidth: "600px" }}>
      <p style={{ color: "#888", fontFamily: "'Geist Mono', monospace", marginBottom: "1rem" }}>
        Scan en cours… {progress}%
      </p>
      <div style={{ background: "#111", border: "1px solid #222", height: "6px" }}>
        <div style={{ background: "#00ffff", height: "100%", width: `${progress}%`, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}
