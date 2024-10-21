"use client";
import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";
import Script from "next/script";
import { getCookie } from "@/utils";
import { useStateContext } from "@/store/StateContext";
import styles from "./Chart.module.scss";

const TVChartContainer = dynamic(
  () =>
    import("@/components/TVChartContainer").then((mod) => mod.TVChartContainer),
  { ssr: false },
);

const ChartClient = (defaultWidgetProps: any) => {
  const { patternId, gaHit, chartType, savePatternImages } = defaultWidgetProps;
  const { state } = useStateContext();
  const { ssoReady, isLogin, ssoid } = state.login;
  const [isScriptReady, setIsScriptReady] = useState(false);

  const userid = useMemo(() => {
    if (ssoReady) {
      return isLogin ? ssoid : getCookie("_grx") || "";
    }
    return "";
  }, [ssoReady, isLogin, ssoid]);

  const widgetProps = useMemo(() => {
    return { ...defaultWidgetProps, user_id: userid };
  }, [defaultWidgetProps, userid]);

  useEffect(() => {
    const handleSymbolData = (event: MessageEvent) => {
      if (event.data && event.data.symbolData) {
        const { symbol, fullName, exchange, entity, periodicity } =
          event.data.symbolData;

        // Update the page URL based on the received symbolData
        const newUrl = `${window.location.pathname}?symbol=${symbol}&entity=${entity}&exchange=${exchange}&periodicity=${periodicity}`;
        window.history.replaceState(null, "", newUrl);
      }
    };

    window.addEventListener("message", handleSymbolData);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("message", handleSymbolData);
    };
  }, []);

  return (
    <>
      <Script
        src="/marketsweb/static/v28/datafeeds/udf/dist/bundle.js"
        strategy="afterInteractive"
        onReady={() => {
          setIsScriptReady(true);
        }}
      />
      {userid && isScriptReady ? (
        <TVChartContainer
          {...widgetProps}
          patternId={patternId}
          gaHit={gaHit}
          chartType={chartType}
          savePatternImages={savePatternImages}
          updatePageUrl="true"
        />
      ) : (
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner}></div>
        </div>
      )}
    </>
  );
};

export default ChartClient;
