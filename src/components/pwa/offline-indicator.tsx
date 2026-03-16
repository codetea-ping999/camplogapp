"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (online) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-20 z-50 rounded-full border border-amber-300/30 bg-amber-500/15 px-4 py-2 text-sm font-medium text-amber-100 shadow-2xl backdrop-blur">
      <span className="flex items-center gap-2">
        <WifiOff className="size-4" />
        Offline mode: cached screens remain available.
      </span>
    </div>
  );
}
