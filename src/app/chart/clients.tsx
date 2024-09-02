"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import Script from "next/script";

const TVChartContainer = dynamic(
  () =>
    import("@/components/TVChartContainer").then((mod) => mod.TVChartContainer),
  { ssr: false },
);

const ChartClient = (defaultWidgetProps: any) => {
  const [isScriptReady, setIsScriptReady] = useState(false);

  return (
    <>
      <Script
        src="/marketsweb/static/v28/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          setIsScriptReady(true);
        }}
      />
      {isScriptReady && <TVChartContainer {...defaultWidgetProps} />}
    </>
  );
};

export default ChartClient;
