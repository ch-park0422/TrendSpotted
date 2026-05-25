"use client";

/**
 * components/ViewTracker.tsx
 * Invisible client component — fires a view-count increment API call
 * at most once per 24 hours per device, using localStorage as a dedup store.
 */

import { useEffect } from "react";

const VIEW_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface ViewTrackerProps {
  trendId: string;
}

export default function ViewTracker({ trendId }: ViewTrackerProps) {
  useEffect(() => {
    const key = `viewed_${trendId}`;
    const lastViewed = localStorage.getItem(key);
    const now = Date.now();

    if (!lastViewed || now - parseInt(lastViewed, 10) > VIEW_TTL_MS) {
      // Mark as viewed before the async call to prevent double-fire
      localStorage.setItem(key, String(now));

      fetch(`/api/trends/${trendId}/view`, { method: "POST" }).catch(() => {
        // Fire-and-forget — silently ignore network errors
      });
    }
  }, [trendId]);

  return null;
}
