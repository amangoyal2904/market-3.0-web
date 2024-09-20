import styles from "./index.module.css";
import React, { useEffect, useRef } from "react";
import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
  VisiblePriceRange,
  widget,
} from "../../../public/static/v28/charting_library";
import { trackingEvent } from "@/utils/ga";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import Service from "@/network/service";

interface TimePair {
  [key: string]: string;
}

const timePair: TimePair = {
  "1D": "day", // Add this line to map "1D" to "day"
  "1W": "week",
  "1M": "month",
  "1Y": "year",
};

const getOverrides = (theme: string) => ({
  "paneProperties.backgroundType": theme === "dark" ? "solid" : undefined,
  "paneProperties.background": theme === "dark" ? "#181818" : "#ffffff",
  "paneProperties.vertGridProperties.color":
    theme === "dark" ? "#232325" : "rgba(42, 46, 57, 0.06)",
  "paneProperties.horzGridProperties.color":
    theme === "dark" ? "#232325" : "rgba(42, 46, 57, 0.06)",
  "scalesProperties.textColor":
    theme === "dark" ? "rgba(170, 170, 170, 1)" : "#131722",
});

export const TVChartContainer = (
  props: Partial<ChartingLibraryWidgetOptions> & {
    patternId?: string;
    chartType?: string;
    gaHit?: string;
    savePatternImages?: string;
    updatePageUrl?: string;
  },
) => {
  const {
    patternId,
    chartType,
    gaHit = true,
    savePatternImages = "false",
    updatePageUrl = "false",
  } = props;
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const param_periodicity = props.interval as ResolutionString;
  const iframeRef = useRef<HTMLIFrameElement | null>(null); // Ref for iframe
  const chartTypes = {
    bar: 0,
    candle: 1,
    line: 2,
    area: 3,
    mountain: 3,
    heikin_ashi: 8,
    hollow_candle: 9,
    baseline_delta: 10,
    hi_lo: 12,
  };

  const initializeChart = () => {
    const loadLastChart = !props.disabled_features?.includes(
      "use_localstorage_for_settings",
    );

    const widgetOptions: ChartingLibraryWidgetOptions = {
      debug: false,
      fullscreen: !!props.fullscreen,
      symbol: props.symbol,
      interval: props.interval as ResolutionString,
      container: chartContainerRef.current,
      timezone: "Asia/Kolkata",
      autosize: true,
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        "https://etapi.indiatimes.com/charts/mrkts",
        undefined,
        {
          maxResponseLength: 1000,
          expectedOrder: "latestFirst",
        },
      ),
      library_path: "/marketsweb/static/v28/charting_library/",
      locale: "en",
      disabled_features: props.disabled_features,
      enabled_features: props.enabled_features,
      client_id: "economictimes.indiatimes.com",
      user_id: props.user_id,
      theme: props.theme,
      time_frames: [
        { text: "1D", resolution: "1" as ResolutionString },
        { text: "5D", resolution: "15" as ResolutionString },
        { text: "1M", resolution: "1D" as ResolutionString },
        { text: "3M", resolution: "1D" as ResolutionString },
        { text: "6M", resolution: "1D" as ResolutionString },
        { text: "1Y", resolution: "1D" as ResolutionString },
        { text: "5Y", resolution: "W" as ResolutionString },
        {
          text: "100y",
          resolution: "M" as ResolutionString,
          description: "Max",
          title: "Max",
        },
      ],
      favorites: {
        intervals: ["1", "5", "10", "15", "30", "1D"] as ResolutionString[],
        chartTypes: ["Area", "Candles", "Bars"],
        drawingTools: [],
        indicators: [],
      },
      overrides: getOverrides(props.theme || "light"),
      symbol_search_request_delay: 2000,
    };

    if (loadLastChart) {
      Object.assign(widgetOptions, {
        charts_storage_url: "https://etapi.indiatimes.com/charts/mrkts",
        charts_storage_api_version: "1.1",
        load_last_chart: true,
        auto_save_delay: 1,
      });
    }

    if (props.timeframe) {
      widgetOptions.timeframe = props.timeframe;
    }

    const tvWidget = new widget(widgetOptions);

    const handleAutoSave = () => {
      tvWidget.saveChartToServer(
        () => {},
        () => {
          console.log("Error during autosave.");
        },
        { defaultChartName: "Default" },
      );
    };

    const updateUrl = () => {
      const activeChart = tvWidget.activeChart();
      const symbolInfo = activeChart.symbolExt();
      const activeResolution = activeChart.resolution();
      const periodicity = timePair[activeResolution] || activeResolution;

      const symbolData = {
        fullName: symbolInfo?.description,
        exchange: symbolInfo?.exchange,
        entity: symbolInfo?.type,
        symbol: symbolInfo?.ticker,
        periodicity: periodicity,
      };

      // Post the symbolData to the parent window
      if (window.parent) {
        window.parent.postMessage({ symbolData }, "*");
      }
    };

    const savePatternImage = async (patternId: string) => {
      const screenshotCanvas = await tvWidget.takeClientScreenshot({});
      const ctx = screenshotCanvas.getContext("2d");

      const originalWidth = screenshotCanvas.width;
      const originalHeight = screenshotCanvas.height;

      // Calculate the cropped dimensions (5% from left/right, 10% from top/bottom)
      const cropWidth = originalWidth * 0.9; // 90% of the original width (5% from each side)
      const cropHeight = originalHeight * 0.8; // 80% of the original height (10% from top and bottom)
      const cropX = originalWidth * 0.04; // Starting x-coordinate (4% from the left)
      const cropY = originalHeight * 0.1; // Starting y-coordinate (10% from the top)

      // Create an off-screen canvas to hold the cropped image
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = cropWidth;
      croppedCanvas.height = cropHeight;

      const croppedCtx = croppedCanvas.getContext("2d");
      // Draw the cropped portion of the screenshot onto the new canvas
      croppedCtx?.drawImage(
        screenshotCanvas,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight,
      );

      // Uncomment below below code to download the cropped image on local machine
      // const linkElement = document.createElement("a");
      // linkElement.download = "screenshot";
      // linkElement.href = croppedCanvas.toDataURL(); // Alternatively, use `toBlob` which is a better API
      // linkElement.dataset.downloadurl = [
      //   "image/png",
      //   linkElement.download,
      //   linkElement.href,
      // ].join(":");
      // document.body.appendChild(linkElement);
      // linkElement.click();
      // document.body.removeChild(linkElement);

      // Convert to blob and upload
      croppedCanvas.toBlob(async (blob: any) => {
        const formData = new FormData();
        formData.append("preparedImage", blob);
        formData.append("patternId", patternId);
        formData.append("mode", tvWidget.getTheme());

        try {
          const response = await fetch(
            "https://etelectionk8s.indiatimes.com/chartpatterns/chartSnapshot",
            {
              method: "POST",
              body: formData,
            },
          );

          if (response.ok) {
            const data = await response.json();
            console.info("Image uploaded successfully:", data);
          }
        } catch (error) {
          console.warn("Error uploading image:", error);
        }
      }, "image/png");
    };

    const handleTracking = (name: any) => {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: `WEB Technical Chart - Clicked ${name}`,
        event_label: name,
      });
    };

    const getPatternData = async (patternId: string) => {
      let apiUrl = `${(APIS_CONFIG as any)?.["CHARTPATTERNBYID"][APP_ENV]}?id=${patternId}`;
      const response = await Service.get({
        url: apiUrl,
        params: {},
        cache: "no-store",
      });
      return response?.json();
    };

    const attachEventListeners = () => {
      // Access the iframe within the widget container
      iframeRef.current = chartContainerRef.current?.querySelector(
        "iframe",
      ) as HTMLIFrameElement | null;

      if (iframeRef.current) {
        const chart =
          iframeRef.current.contentDocument ||
          iframeRef.current.contentWindow?.document;

        if (chart) {
          const activeChart = tvWidget.activeChart();
          // top events
          chart
            .querySelector("#header-toolbar-symbol-search")
            ?.addEventListener("click", () => {
              const symbol = activeChart.symbol;
              handleTracking(`Clicks - ${symbol}`);
            });

          chart
            .querySelector("#header-toolbar-intervals")
            ?.addEventListener("click", () => {
              const r = activeChart.resolution();
              const resolution = Number(r) ? Number(r) + "m" : r;
              handleTracking(`${resolution}`);
            });

          chart
            .querySelector("#header-toolbar-compare")
            ?.addEventListener("click", () => {
              handleTracking("NA");
            });

          chart
            .querySelector('[data-name="header-toolbar-properties"]')
            ?.addEventListener("click", () => {
              handleTracking("Clicks - Button");
            });

          chart
            .querySelector(
              '[class^=legendMainSourceWrapper] [data-name="legend-show-hide-action"]',
            )
            ?.addEventListener("click", () => {
              const node = chart.querySelector(
                "[class^=legendMainSourceWrapper] > div",
              );
              const status =
                node && node.classList.contains("disabled") ? "Hide" : "Show";
              handleTracking(status);
            });

          chart
            .querySelector(
              '[class^=legendMainSourceWrapper] [data-name="legend-more-action"]',
            )
            ?.addEventListener("click", () => {
              handleTracking("");
            });

          // bottom events
          chart
            .querySelector('[data-name="date-ranges-tabs"]')
            ?.addEventListener("click", (e) => {
              handleTracking((e.target as HTMLElement).innerText.toUpperCase());
            });

          chart
            .querySelector('[data-name="time-zone-menu"]')
            ?.addEventListener("click", () => {
              handleTracking("NA");
            });

          const axisContainers = chart.querySelectorAll(
            '[data-name="percentage"], [data-name="logarithm"], [data-name="auto"]',
          );

          axisContainers.forEach((container) =>
            container.addEventListener("click", () => {
              handleTracking(`Clicks - ${container.getAttribute("data-name")}`);
            }),
          );

          chart.addEventListener("click", (e) => {
            const innerText = (e.target as HTMLElement).innerText;
            if (
              (e.target as HTMLElement).closest(".context-menu table") &&
              innerText &&
              (innerText.includes("Symbol info") ||
                innerText.includes("Visual order") ||
                innerText.includes("Move to") ||
                innerText.includes("Pin to scale") ||
                innerText.includes("Hide") ||
                innerText.includes("Show") ||
                innerText.includes("Copy") ||
                innerText.includes("Remove") ||
                innerText.includes("Lines") ||
                innerText.includes("Settings"))
            ) {
              handleTracking(innerText);
            }
            if (
              (e.target as HTMLElement).closest(".context-menu table") &&
              innerText &&
              (innerText.includes("UTC") || innerText.includes("Exchange"))
            ) {
              handleTracking(innerText);
            }
          });

          // drawing tool events
          const drawingToolContainers = chart.querySelectorAll(
            '[data-name^="linetool-group"], [data-name="measure"], [data-name="zoom"], [data-name="magnet-button"], [data-name="removeAllDrawingTools"], [data-name="showObjectsTree"]',
          );

          drawingToolContainers.forEach((container: Element) =>
            container.addEventListener("click", () => {
              handleTracking(container.getAttribute("data-name") || "");
            }),
          );

          const drawingToggleBtn = chart.querySelector(
            '[data-name="toolbar-drawing-toggle-button"]',
          );

          if (drawingToggleBtn) {
            drawingToggleBtn.addEventListener("click", () => {
              const elData = drawingToggleBtn.getAttribute("data-value");
              const toggleVal = elData === "visible" ? "Show" : "Hide";
              handleTracking(`${toggleVal} Drawings Toolbar`);
            });
          }

          let cdToolbar = 0;

          chart.addEventListener(
            "click",
            (e) => {
              const eventNode = e.target as HTMLElement;

              if (
                eventNode.closest("#header-toolbar-chart") ||
                eventNode.closest(
                  ".apply-common-tooltip.common-tooltip-fixed",
                ) ||
                eventNode.closest("#header-toolbar-intervals") ||
                eventNode.closest("#header-toolbar-compare") ||
                eventNode.closest("[class^=legendMainSourceWrapper]")
              ) {
                handleTracking("Clicked Toolbar");
              }

              if (
                eventNode.closest(
                  '[class^="apply-common-tooltip common-tooltip-fixed"]',
                ) ||
                eventNode.closest("[class^=chart-events-editor-toolbar]")
              ) {
                cdToolbar++;
                if (cdToolbar === 1) {
                  handleTracking("Clicked Drawings Toolbar");
                }
              }
            },
            true,
          );
        }
      }
    };

    tvWidget.onChartReady(async () => {
      const activeChart = tvWidget.activeChart();
      activeChart.setResolution(param_periodicity);
      tvWidget.changeTheme(props.theme === "dark" ? "dark" : "light");

      // Last saved chart will get loaded only if save is not disabled in disabled_features
      if (loadLastChart) {
        tvWidget.subscribe("onAutoSaveNeeded", handleAutoSave);
      }

      // Chart Type will get change if valid chart_type param passed
      if (
        chartType &&
        chartTypes[chartType as keyof typeof chartTypes] !== undefined
      ) {
        tvWidget
          .activeChart()
          .setChartType(chartTypes[chartType as keyof typeof chartTypes]);
      }

      // Pattern will get formed if pattern id is available
      if (patternId) {
        const patternDataResponse = await getPatternData(patternId);

        if (patternDataResponse) {
          const { patternList } = patternDataResponse;
          const {
            data: patternData,
            shape: patternShape,
            chartStartDate,
            chartEndDate,
          } = patternList;

          // Convert pattern data
          const processedPatternData = patternData.map((item: any) => ({
            time: item.time / 1000,
            price: item.price,
          }));

          // Date conversion
          const patternFromDate = Math.floor(
            new Date(chartStartDate).getTime() / 1000,
          );
          const patternToDate = Math.floor(
            new Date(chartEndDate).getTime() / 1000,
          );

          // Price range calculations
          const prices = processedPatternData.map((item: any) => item.price);
          const minPrice = Math.min(...prices) * 0.75;
          const maxPrice = Math.max(...prices) * 1.25;

          // Get active chart and price scale

          const priceScale = activeChart.getPanes()[0].getRightPriceScales()[0];
          const range: VisiblePriceRange | null =
            priceScale.getVisiblePriceRange();

          // Set visible range for the chart
          activeChart.setVisibleRange(
            { from: patternFromDate, to: patternToDate },
            { percentRightMargin: 7 },
          );

          // Adjust price range if visible range exists
          if (range) {
            priceScale.setVisiblePriceRange({
              from: Math.min(range.from, minPrice),
              to: Math.max(range.to, maxPrice),
            });
          }

          // Create shape
          activeChart.createMultipointShape(processedPatternData, {
            shape: patternShape,
            lock: true,
          });

          // Save pattern image if required
          if (savePatternImages === "true") {
            setTimeout(() => savePatternImage(patternId), 1000);
          }
        }
      }

      // GA will be fired by default, to stop pass ga_hit=false in param
      if (gaHit != "false") {
        trackingEvent("et_push_event", {
          event_category: "mercury_engagement",
          event_action: `Impression - WEB Technical Chart`,
          event_label: name,
        });
        tvWidget
          .activeChart()
          .onChartTypeChanged()
          .subscribe(null, () => {
            handleTracking(chartType);
          });
        tvWidget.subscribe("undo", () => handleTracking("undo"));
        tvWidget.subscribe("redo", () => handleTracking("redo"));
        tvWidget.subscribe("indicators_dialog", () =>
          handleTracking("Indicators"),
        );
        attachEventListeners();
      }

      // Page url will be updated on change of Interval and Symbol change
      if (updatePageUrl == "true") {
        tvWidget
          .activeChart()
          .onIntervalChanged()
          .subscribe(null, () => updateUrl());

        tvWidget
          .activeChart()
          .onSymbolChanged()
          .subscribe(null, () => updateUrl());
      }
    });

    return tvWidget;
  };

  useEffect(() => {
    const tvWidget = initializeChart();

    return () => {
      tvWidget.remove();
    };
  }, [props]);

  return <div ref={chartContainerRef} className={styles.TVChartContainer} />;
};
