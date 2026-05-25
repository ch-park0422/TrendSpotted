"use client";

/**
 * components/ViewCounter.tsx
 * Displays the view count and tracks the current visit.
 *
 * - Shows initialCount (server-fetched) immediately
 * - On first visit within 24h: calls the view API + shows count + 1 optimistically
 * - Subsequent visits within 24h: shows initialCount as-is (already counted)
 */

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

const VIEW_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface ViewCounterProps {
  trendId: string;
  initialCount: number;
}

export default function ViewCounter({ trendId, initialCount }: ViewCounterProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const key = `viewed_${trendId}`;
    const lastViewed = localStorage.getItem(key);
    const now = Date.now();
    const isNewView = !lastViewed || now - parseInt(lastViewed, 10) > VIEW_TTL_MS;

    if (isNewView) {
      // Optimistically update the UI right away
      setCount((c) => c + 1);
      // Mark as viewed before the async call to prevent double-fire
      localStorage.setItem(key, String(now));
      // Persist to DB in the background
      fetch(`/api/trends/${trendId}/view`, { method: "POST" }).catch(() => {
        // Silently ignore — count is already marked in localStorage
      });
    }
  }, [trendId]);

  return (
    <span className="flex items-center gap-1.5">
      <Eye className="h-3.5 w-3.5" />
      {count.toLocaleString()} views
    </span>
  );
}
