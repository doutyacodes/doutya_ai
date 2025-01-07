import { useEffect } from "react";

export function useArticleViewTracker(articleId, sessionId) {
  useEffect(() => {
    const startTime = Date.now();

    const sendTrackingData = async () => {
      const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
      await fetch("/api/track-article-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, timeOnPage, sessionId }),
      });
    };

    window.addEventListener("beforeunload", sendTrackingData);

    return () => {
      sendTrackingData();
      window.removeEventListener("beforeunload", sendTrackingData);
    };
  }, [articleId, sessionId]);
}
