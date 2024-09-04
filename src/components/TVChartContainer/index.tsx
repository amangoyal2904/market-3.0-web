import styles from "./index.module.css";
import React, { useEffect, useRef } from "react";
import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
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
  const overrides =
    props.theme === "dark"
      ? {
          "paneProperties.backgroundType": "solid",
          "paneProperties.background": "#181818",
          "paneProperties.vertGridProperties.color": "#232325",
          "paneProperties.horzGridProperties.color": "#232325",
          "scalesProperties.textColor": "rgba(170, 170, 170, 1)",
        }
      : {
          "paneProperties.background": "#ffffff",
          "paneProperties.vertGridProperties.color": "rgba(42, 46, 57, 0.06)",
          "paneProperties.horzGridProperties.color": "rgba(42, 46, 57, 0.06)",
          "scalesProperties.textColor": "#131722",
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
        intervals: [
          "1" as ResolutionString,
          "5" as ResolutionString,
          "10" as ResolutionString,
          "15" as ResolutionString,
          "30" as ResolutionString,
          "1D" as ResolutionString,
        ],
        chartTypes: ["Area", "Candles", "Bars"],
        drawingTools: [],
        indicators: [],
      },
      overrides,
      symbol_search_request_delay: 2000,
    };

    if (loadLastChart) {
      widgetOptions.charts_storage_url =
        "https://etapi.indiatimes.com/charts/mrkts";
      widgetOptions.charts_storage_api_version = "1.1";
      widgetOptions.load_last_chart = true;
      widgetOptions.auto_save_delay = 1;
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
      const symbolInfo = tvWidget.activeChart().symbolExt();
      const activeResolution = tvWidget.activeChart().resolution();
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
      const screenshotCanvas = await tvWidget.takeClientScreenshot();
      screenshotCanvas.toBlob(async (blob: any) => {
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
          // top events
          chart
            .querySelector("#header-toolbar-symbol-search")
            ?.addEventListener("click", () => {
              const symbol = tvWidget.activeChart().symbol;
              handleTracking(`Clicks - ${symbol}`);
            });

          chart
            .querySelector("#header-toolbar-intervals")
            ?.addEventListener("click", () => {
              const r = tvWidget.activeChart().resolution();
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
      if (gaHit != "false") {
        trackingEvent("et_push_event", {
          event_category: "mercury_engagement",
          event_action: `Impression - WEB Technical Chart`,
          event_label: name,
        });
      }

      tvWidget.changeTheme(props.theme === "dark" ? "dark" : "light");
      if (loadLastChart) {
        tvWidget.subscribe("onAutoSaveNeeded", handleAutoSave);
      }

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

      if (gaHit != "false") {
        tvWidget
          .activeChart()
          .onChartTypeChanged()
          .subscribe(null, () => {
            handleTracking(chartType);
          });
      }

      if (gaHit != "false") {
        tvWidget.subscribe("undo", () => handleTracking("undo"));
        tvWidget.subscribe("redo", () => handleTracking("redo"));
        tvWidget.subscribe("indicators_dialog", () =>
          handleTracking("Indicators"),
        );
      }
      if (
        chartType &&
        chartTypes[chartType as keyof typeof chartTypes] !== undefined
      ) {
        tvWidget
          .activeChart()
          .setChartType(chartTypes[chartType as keyof typeof chartTypes]);
      }
      if (gaHit != "false") {
        attachEventListeners();
      }

      if (patternId) {
        const patternDataResponse = await getPatternData(patternId);
        if (patternDataResponse) {
          const { patternList } = patternDataResponse;
          const patternData = patternList.data.map((item: any) => ({
            time: item.time / 1000,
            price: item.price,
          }));
          const patternShape = patternList.shape;
          const patternFromDate = Math.floor(
            new Date(patternList.chartStartDate).getTime() / 1000,
          );
          const patternToDate = Math.floor(
            new Date(patternList.chartEndDate).getTime() / 1000,
          );

          // Call setVisibleRange and createMultipointShape with the fetched data
          tvWidget.activeChart().setVisibleRange({
            from: patternFromDate,
            to: patternToDate,
          });

          tvWidget.activeChart().createMultipointShape(patternData, {
            shape: patternShape,
          });

          if (savePatternImages == "true") {
            setTimeout(() => {
              savePatternImage(patternId);
            }, 1000);
          }
        }
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
