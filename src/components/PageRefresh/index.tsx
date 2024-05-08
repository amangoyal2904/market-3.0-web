"use client";
import React, { useEffect, useState } from "react";

interface PageRefreshProps {
  refreshTime?: number;
  preCheckTime?: number;
  timeSlide?: "logical" | "fixed";
}

const PageRefresh: React.FC<PageRefreshProps> = ({
  refreshTime = 180000,
  preCheckTime = 60000,
  timeSlide = "logical",
}) => {
  const [lastAccessTime, setLastAccessTime] = useState<number>(Date.now());

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const setRefresh = () => {
      clearTimeout(interval);
      interval = setTimeout(() => {
        if (
          timeSlide === "logical" &&
          Date.now() - lastAccessTime > preCheckTime
        ) {
          reloadPage();
        } else if (timeSlide === "fixed") {
          reloadPage();
        } else {
          setRefresh();
        }
      }, refreshTime);

      return () => clearTimeout(interval);
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

      if (window.navigator && navigator.onLine) {
        _ifOnline();
      }
    };

    const resetTimer = () => {
      clearTimeout(interval);
      setRefresh();
    };

    window.addEventListener("scroll", resetTimer);
    document.body.addEventListener("keyup", resetTimer);
    document.body.addEventListener("mousemove", resetTimer);

    setRefresh();

    return () => {
      window.removeEventListener("scroll", resetTimer);
      document.body.removeEventListener("keyup", resetTimer);
      document.body.removeEventListener("mousemove", resetTimer);
    };
  }, [lastAccessTime, refreshTime, preCheckTime, timeSlide]);

  return null;
};

export default PageRefresh;
