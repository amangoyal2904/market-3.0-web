"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import Script from "next/script";

import {
  ChartingLibraryFeatureset,
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "../../../../public/static/v27/charting_library";
import { getCookie, getParameterByName } from "@/utils";

interface TimeFramePair {
  [key: string]: string;
}

interface TimePair {
  [key: string]: string;
}

const timePair: TimePair = {
  day: "1D",
  week: "1W",
  month: "1M",
  year: "1Y",
};

const timeFramePair: TimeFramePair = {
  "1D": "1D",
  "5D": "5D",
  "1W": "7D",
  "1M": "1M",
  "3M": "3M",
  "6M": "6M",
  "1Y": "12M",
  "3Y": "36M",
  "5Y": "60M",
};

const getSymbol = () => {
  const symbl = getParameterByName("symbol")?.replace("&", "%26");
  const pairnameparent =
    getParameterByName("pairnameparent") ||
    getParameterByName("currencypairname");
  return pairnameparent
    ? pairnameparent.replace("&", "%26")
    : symbl
      ? symbl
      : "NSE INDEX";
};

const getInterval = () => {
  const itvl = getParameterByName("periodicity");
  const defaultPeriod = getParameterByName("default_period");
  const timeframe =
    defaultPeriod && timeFramePair[defaultPeriod]
      ? timeFramePair[defaultPeriod]
      : "12M";
  const interval =
    (timeframe === "1D" || timeframe === "5D" || timeframe === "1W") &&
    itvl === "day"
      ? timeframe === "1D"
        ? 1
        : 15
      : typeof itvl !== "undefined" && Number(itvl)
        ? Number(itvl)
        : typeof itvl !== "undefined" && timePair[itvl]
          ? timePair[itvl]
          : "1D";

  return { timeframe, interval };
};

const getOnlyChartFeatures = (user_id: string) => {
  const hideMenu = getParameterByName("no_menu")
    ? getParameterByName("no_menu")
    : 0;

  const saveFeature = !!user_id && user_id !== "default" ? true : false;
  const onlyChart = [];

  if (
    getParameterByName("symbol_label") === "false" ||
    getParameterByName("symbol_textbox") === "false"
  ) {
    onlyChart.push("header_symbol_search");
  }

  if (hideMenu === "true" || hideMenu === "1") {
    onlyChart.push(
      "left_toolbar",
      "header_widget",
      "legend_widget",
      "timeframes_toolbar",
      "main_series_scale_menu",
      "context_menus",
      "header_screenshot",
      "header_fullscreen_button",
      "go_to_date",
      "edit_buttons_in_legend",
      "create_volume_indicator_by_default",
      "border_around_the_chart",
      "adaptive_logo",
    );
  }

  if (saveFeature === false) {
    onlyChart.push("header_saveload", "use_localstorage_for_settings");
  }

  return onlyChart;
};

const TVChartContainer = dynamic(
  () =>
    import("@/components/TVChartContainer").then((mod) => mod.TVChartContainer),
  { ssr: false },
);

const TechnicalCharts = () => {
  const [isScriptReady, setIsScriptReady] = useState(false);

  const userId = getCookie("ssoid");
  const user_id: string | undefined =
    typeof userId === "string" && !!userId ? userId : "default";

  const symbol = getSymbol();
  const { timeframe, interval } = getInterval();
  const onlyChart = getOnlyChartFeatures(user_id);

  const disabledFeatures: ChartingLibraryFeatureset[] = onlyChart.length
    ? onlyChart.map((feature) => feature as ChartingLibraryFeatureset)
    : [
        "adaptive_logo",
        "header_screenshot",
        "header_fullscreen_button",
        "header_symbol_search",
        "go_to_date",
      ];

  const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
    symbol: symbol || "RELIANCE",
    interval: interval as ResolutionString,
    timeframe: timeframe,
    user_id: user_id,
    theme: getParameterByName("darktheme") === "true" ? "dark" : "light",
    disabled_features: disabledFeatures,
    overrides:
      getParameterByName("darktheme") === "true"
        ? {
            "paneProperties.background": "rgba(34, 34, 34, 1)",
            "paneProperties.vertGridProperties.color": "rgba(69, 69, 69, 1)",
            "paneProperties.horzGridProperties.color": "rgba(69, 69, 69, 1)",
            "scalesProperties.textColor": "rgba(170, 170, 170, 1)",
          }
        : {},
  };
  return (
    <>
      <Script
        src="/marketsweb/static/v27/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          setIsScriptReady(true);
        }}
      />
      {isScriptReady && <TVChartContainer {...defaultWidgetProps} />}
    </>
  );
};

export default TechnicalCharts;
