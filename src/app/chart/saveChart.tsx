"use client";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import Script from "next/script";
import styles from "./Chart.module.scss";

const TVChartContainer = dynamic(
  () =>
    import("@/components/TVChartContainer").then((mod) => mod.TVChartContainer),
  { ssr: false },
);

const ChartClientSave = (defaultWidgetProps: any) => {
  const {
    patternId,
    gaHit,
    chartType,
    savePatternImages,
    showVolume,
    assestType,
  } = defaultWidgetProps;
  const [isScriptReady, setIsScriptReady] = useState(false);

  const widgetProps = useMemo(() => {
    return { ...defaultWidgetProps, user_id: "default" };
  }, [defaultWidgetProps]);

  return (
    <>
      <Script
        src="/marketsweb/static/v283/datafeeds/udf/dist/bundle.js"
        strategy="afterInteractive"
        onReady={() => {
          setIsScriptReady(true);
        }}
      />
      {isScriptReady ? (
        <TVChartContainer
          {...widgetProps}
          patternId={patternId}
          gaHit="false"
          chartType={chartType}
          savePatternImages={savePatternImages}
          updatePageUrl="false"
          isLogin={false}
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

export default ChartClientSave;
