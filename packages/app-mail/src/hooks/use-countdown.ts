import { useState, useEffect } from "react";

export function useCountdown(nextScanAt: string | null | undefined): string {
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!nextScanAt) return;

    const update = () => {
      const diff = new Date(nextScanAt).getTime() - Date.now();
      if (diff <= 0) { setLabel("Scan imminent"); return; }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);

      if (days > 0) setLabel(`Prochain scan dans ${days}j ${hours}h`);
      else if (hours > 0) setLabel(`Prochain scan dans ${hours}h ${mins}m`);
      else setLabel(`Prochain scan dans ${mins}m`);
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [nextScanAt]);

  return label;
}
