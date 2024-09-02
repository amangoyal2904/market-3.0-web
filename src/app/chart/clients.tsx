"use client";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
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

  return (
    <>
      <Script
        src="/marketsweb/static/v28/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          setIsScriptReady(true);
        }}
      />
      {userid && isScriptReady ? (
        <TVChartContainer {...widgetProps} />
      ) : (
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner}></div>
        </div>
      )}
    </>
  );
};

export default ChartClient;
