"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ComScoreTrackingScript() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      // Execute tracking logic
      if (window.COMSCORE) {
        window.COMSCORE.beacon({ c1: "2", c2: "6036484" });
      }
      previousPathname.current = pathname;
    }
  }, [pathname]);

  return (
    <Script
      strategy="lazyOnload"
      src="https://sb.scorecardresearch.com/beacon.js"
    />
  );
}
