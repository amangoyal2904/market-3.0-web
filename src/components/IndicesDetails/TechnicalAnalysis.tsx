import { formatNumber, getCookie } from "@/utils";
import styles from "./IndicesDetails.module.scss";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import {
  ChartingLibraryFeatureset,
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "../../../public/static/charting_library/charting_library";
import Script from "next/script";
import GuageChart from "./GuageChart";
import { useStateContext } from "@/store/StateContext";

const TVChartContainer = dynamic(() =>
  import("@/components/TVChartContainer").then((mod) => mod.TVChartContainer),
);

const IndicesTechnicalAnalysis = React.memo(({ data, symbol }: any) => {
  const { state } = useStateContext();
  const { ssoid } = state.login;
  const [userId, setUserId] = useState("");
  const [isScriptReady, setIsScriptReady] = useState(false);
  const { maScore, bullishMA, bearishMA, movingAverage, pivotLevel } = data;

  const ma_labels = [""];
  const ma_simple = [{ value: "Simple", trend: null }];
  const ma_exponential = [{ value: "Exponential", trend: null }];

  const pl_labels = [""];
  const pl_classic = ["Classic"];
  const pl_fibonacci = ["Fibonacci"];

  for (const item of movingAverage) {
    ma_labels.push(item.label);
    ma_simple.push({ value: item.simple, trend: item.simpleTrend });
    ma_exponential.push({
      value: item.exponential,
      trend: item.exponentialTrend,
    });
  }

  for (const item of pivotLevel) {
    pl_labels.push(item.label);
    pl_classic.push(item.classic);
    pl_fibonacci.push(item.fibonacci);
  }

  const movingAverageData = [ma_simple, ma_exponential];
  const pivotLevelData = [pl_classic, pl_fibonacci];

  const disabledFeatures: ChartingLibraryFeatureset[] = [
    "adaptive_logo",
    "go_to_date",
    "header_saveload",
    "header_symbol_search",
  ];

  const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
    symbol: symbol,
    interval: "1D" as ResolutionString,
    user_id: userId,
    disabled_features: disabledFeatures,
    overrides: {},
  };

  useEffect(() => {
    let user = getCookie("ssoid") || ssoid;
    if (user == null || user == "") {
      user = getCookie("pfuuid");
    }
    const user_id: string | undefined =
      typeof user === "string" ? user : "default_user";
    setUserId(user_id);
  }, [ssoid]);

  return (
    <>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          setIsScriptReady(true);
        }}
      />
      <h2 className={styles.heading}>
        Technical Analysis <i className="eticon_info"></i>
      </h2>
      <div className={styles.wrapper}>
        <h3 className={styles.heading3}>Moving Average: SMA & EMA</h3>
        <div className={styles.gaugeChart}>
          <GuageChart maScore={maScore} />
        </div>
        <div className={styles.maTable}>
          <table className={styles.marketsCustomTable}>
            <thead>
              <tr>
                {ma_labels.map((label, index) => (
                  <th key={index} className={styles.center}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movingAverageData.map((data: any, index: number) => (
                <tr key={index}>
                  {data.map((item: any, i: number) => (
                    <td
                      key={i}
                      className={`${i === 0 ? styles.left : `${styles.center} ${item.trend} numberFonts`}`}
                    >
                      {i === 0 ? item.value : formatNumber(item.value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <ul className={styles.legend}>
            <li>
              <span className={`${styles.point} ${styles.up}`}></span>Bullish
              Moving Averages ({bullishMA})
            </li>
            <li>
              <span className={`${styles.point} ${styles.down}`}></span>Bearish
              Moving Averages ({bearishMA})
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.wrapper}>
        <h3 className={styles.heading3}>Pivot Levels</h3>
        <table className={styles.marketsCustomTable}>
          <thead>
            <tr>
              {pl_labels.map((label, index) => (
                <th
                  key={index}
                  className={`${styles.center} ${index == 4 ? styles.primeCell : ""}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pivotLevelData.map((data: any, index: number) => (
              <tr key={index}>
                {data.map((value: any, i: number) =>
                  index == 0 && i == 4 ? (
                    <td
                      key={i}
                      className={`${styles.primeCell} ${styles.center}`}
                      rowSpan={data.length}
                    >
                      {formatNumber(value)}
                    </td>
                  ) : index > 0 && i == 4 ? (
                    ""
                  ) : (
                    <td
                      key={i}
                      className={`${i === 0 ? styles.left : `${styles.center} numberFonts`}`}
                    >
                      {i === 0 ? value : formatNumber(value)}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.wrapper}>
        <h3 className={styles.heading3}>Technical Chart</h3>
        <div id={styles.tradingView}>
          {isScriptReady && !!userId && (
            <TVChartContainer {...defaultWidgetProps} />
          )}
        </div>
      </div>
    </>
  );
});

export default IndicesTechnicalAnalysis;
IndicesTechnicalAnalysis.displayName = "IndicesTechnicalAnalysis";
