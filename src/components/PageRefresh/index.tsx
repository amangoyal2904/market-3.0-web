"use client";
import React, { useEffect, useRef } from "react";

interface PageRefreshProps {
  refreshTime?: number;
}

const PageRefresh: React.FC<PageRefreshProps> = ({ refreshTime = 180000 }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      reloadPage();
    }, refreshTime);
  };

  const reloadPage = () => {
    const _ifOnline = () => {
      const expTime = Date.now() + 120000; // 2 minutes
      document.cookie = `popout_autorefresh_open=true; expires=${new Date(expTime).toUTCString()}; path=/; domain=.indiatimes.com`;
      document.cookie = `rw_default=true; expires=${new Date(expTime).toUTCString()}; path=/; domain=.indiatimes.com`;
      // Implement GA Here
      sessionStorage.pageReload = "1";
      console.log("Page Reload at", new Date());
      window.location.reload();
    };

    if (navigator.onLine) {
      _ifOnline();
    }
  };

  const handleActivity = () => {
    resetTimer();
  };

  const handleEvents = () => {
    ["scroll", "keyup", "mousemove"].forEach((event) => {
      document.body.addEventListener(event, handleActivity);
    });
  };

  useEffect(() => {
    handleEvents();
    resetTimer();

    return () => {
      ["scroll", "keyup", "mousemove"].forEach((event) => {
        document.body.removeEventListener(event, handleActivity);
      });
    };
  }, [refreshTime]);

  return null;
};

export default PageRefresh;
