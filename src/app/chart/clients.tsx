"use client";
import dynamic from "next/dynamic";
import { useState, useMemo, useEffect, useCallback } from "react";
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
  const {
    patternId,
    gaHit,
    chartType,
    savePatternImages,
    showVolume,
    assestType,
  } = defaultWidgetProps;
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

  const handleSymbolData = useCallback(async (event: MessageEvent) => {
    if (event.data && event.data.symbolData) {
      const { symbol, entity, periodicity, exchange } = event.data.symbolData;

      const urlParams = new URLSearchParams();
      urlParams.set("entity", entity);

      if (entity === "forex") {
        urlParams.set("periodicity", periodicity);
        urlParams.set("createdby", "Mecklai");
        urlParams.set("pairnameparent", symbol);
        urlParams.set("currencypairname", symbol);
      } else if (entity === "commodity") {
        const match = symbol.match(/^([A-Z]+)_(\d{4}-\d{2}-\d{2})_([A-Z]+)$/);
        const name = match ? match[1] : symbol;
        const expiryDate = match ? match[2] : null;
        urlParams.set("symbol", name);
        if (match) {
          urlParams.set("expirydate", expiryDate.trim());
        }
      } else {
        urlParams.set("symbol", symbol);
        urlParams.set("exchange", exchange);
        urlParams.set("periodicity", periodicity);
      }

      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleSymbolData);
    return () => {
      window.removeEventListener("message", handleSymbolData);
    };
  }, [handleSymbolData]);

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
          updatePageUrl="false"
          isLogin={isLogin}
          showVolume={showVolume}
          assestType={assestType}
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
