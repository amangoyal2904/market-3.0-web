import styles from "./index.module.css";
import React, { useEffect, useRef } from "react";
import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
  widget,
} from "../../../public/static/v27/charting_library";

export const TVChartContainer = (
  props: Partial<ChartingLibraryWidgetOptions>,
) => {
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  const _overrides =
    props?.theme == "dark"
      ? {
          "paneProperties.backgroundType": "solid",
          "paneProperties.background": "#181818",
          "paneProperties.vertGridProperties.color": "#232325",
          "paneProperties.horzGridProperties.color": "#232325",
          "scalesProperties.textColor": "rgba(170, 170, 170, 1)",
        }
      : {};

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: props.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        "https://etapi.indiatimes.com/charts/mrkts",
        1000 * 20,
        "Y",
      ),
      timeframe: props.timeframe,
      interval: props.interval as ResolutionString,
      container: chartContainerRef.current,
      timezone: "Asia/Kolkata",
      disabled_features: props.disabled_features,
      enabled_features: ["show_zoom_and_move_buttons_on_touch"],
      library_path: "/marketsweb/static/v27/charting_library/",
      locale: "en",
      load_last_chart: props?.user_id !== "default" ? true : false,
      charts_storage_url: "https://etapi.indiatimes.com/charts/mrkts/stock",
      charts_storage_api_version: "1.1",
      client_id: "economictimes.indiatimes.com",
      auto_save_delay: 1,
      theme: props.theme,
      user_id: props.user_id,
      fullscreen: !!props?.fullscreen ? props?.fullscreen : false,
      autosize: true,
      time_frames: [
        {
          text: "1D",
          resolution: "1" as ResolutionString,
        },
        {
          text: "5D",
          resolution: "15" as ResolutionString,
        },
        {
          text: "1M",
          resolution: "1D" as ResolutionString,
        },
        {
          text: "3M",
          resolution: "1D" as ResolutionString,
        },
        {
          text: "6M",
          resolution: "1D" as ResolutionString,
        },
        {
          text: "1Y",
          resolution: "1D" as ResolutionString,
        },
        {
          text: "5Y",
          resolution: "W" as ResolutionString,
        },
        {
          text: "100y",
          resolution: "M" as ResolutionString,
          description: "Max",
          title: "Max",
        },
      ],
      favorites: {
        intervals: [
          "1" as ResolutionString,
          "15" as ResolutionString,
          "1D" as ResolutionString,
        ],
        chartTypes: ["Area", "Candles"],
      },
      overrides: _overrides,
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      tvWidget.changeTheme(props.theme == "dark" ? "dark" : "light");
    });

    return () => {
      tvWidget.remove();
    };
  }, [props]);

  return <div ref={chartContainerRef} className={styles.TVChartContainer} />;
};
