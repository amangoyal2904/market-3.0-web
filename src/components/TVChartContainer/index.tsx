import styles from "./index.module.css";
import React, { useEffect, useRef } from "react";
import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
  widget,
  ChartData,
  ChartMetaInfo,
  ChartTemplate,
  ChartTemplateContent,
  IExternalSaveLoadAdapter,
  LineToolState,
  LineToolsAndGroupsLoadRequestContext,
  LineToolsAndGroupsLoadRequestType,
  LineToolsAndGroupsState,
  StudyTemplateData,
  StudyTemplateMetaInfo,
} from "../../../public/static/v28/charting_library";
import { trackingEvent } from "@/utils/ga";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import Service from "@/network/service";

interface TimePair {
  [key: string]: string;
}

interface SavedChartData extends ChartData {
  timestamp: number;
  id: string;
}

interface DrawingTemplate {
  name: string;
  toolName: string;
  content: string;
}

interface SavedChartTemplate extends ChartTemplate {
  name: string;
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

const storageKeys = {
  charts: "LocalStorageSaveLoadAdapter_charts",
  studyTemplates: "LocalStorageSaveLoadAdapter_studyTemplates",
  drawingTemplates: "LocalStorageSaveLoadAdapter_drawingTemplates",
  chartTemplates: "LocalStorageSaveLoadAdapter_chartTemplates",
  drawings: "LocalStorageSaveLoadAdapter_drawings",
} as const;

type LayoutDrawings = Record<string, LineToolState>;
type SavedDrawings = Record<string, LayoutDrawings>;

// LocalStorageSaveLoadAdapter class implementing IExternalSaveLoadAdapter
class LocalStorageSaveLoadAdapter implements IExternalSaveLoadAdapter {
  private _charts: SavedChartData[] = [];
  private _studyTemplates: StudyTemplateData[] = [];
  private _drawingTemplates: DrawingTemplate[] = [];
  private _chartTemplates: SavedChartTemplate[] = [];
  private _isDirty = false;
  protected _drawings: SavedDrawings = {};

  constructor() {
    this._charts =
      this._getFromLocalStorage<SavedChartData[]>(storageKeys.charts) ?? [];
    this._studyTemplates =
      this._getFromLocalStorage<StudyTemplateData[]>(
        storageKeys.studyTemplates,
      ) ?? [];
    this._drawingTemplates =
      this._getFromLocalStorage<DrawingTemplate[]>(
        storageKeys.drawingTemplates,
      ) ?? [];
    this._chartTemplates =
      this._getFromLocalStorage<SavedChartTemplate[]>(
        storageKeys.chartTemplates,
      ) ?? [];
    this._drawings =
      this._getFromLocalStorage<SavedDrawings>(storageKeys.drawings) ?? {};
    setInterval(() => {
      if (this._isDirty) {
        this._saveAllToLocalStorage();
        this._isDirty = false;
      }
    }, 1000);
  }

  public getAllCharts(): Promise<ChartMetaInfo[]> {
    return Promise.resolve(this._charts);
  }

  public removeChart(id: string | number): Promise<void> {
    for (let i = 0; i < this._charts.length; ++i) {
      if (this._charts[i].id === id) {
        this._charts.splice(i, 1);
        this._isDirty = true;
        return Promise.resolve();
      }
    }
    return Promise.reject(new Error("The chart does not exist"));
  }

  public saveChart(chartData: ChartData): Promise<string> {
    if (!chartData.id) {
      chartData.id = this._generateUniqueChartId();
    } else {
      this.removeChart(chartData.id);
    }
    const savedChartData: SavedChartData = {
      ...chartData,
      id: String(chartData.id),
      timestamp: Math.round(Date.now() / 1000),
    };
    this._charts.push(savedChartData);
    this._isDirty = true;
    return Promise.resolve(savedChartData.id);
  }

  public getChartContent(id: string | number): Promise<string> {
    for (let i = 0; i < this._charts.length; ++i) {
      if (this._charts[i].id === id) {
        return Promise.resolve(this._charts[i].content);
      }
    }
    return Promise.reject(new Error("The chart does not exist"));
  }

  public removeStudyTemplate(
    studyTemplateData: StudyTemplateMetaInfo,
  ): Promise<void> {
    for (let i = 0; i < this._studyTemplates.length; ++i) {
      if (this._studyTemplates[i].name === studyTemplateData.name) {
        this._studyTemplates.splice(i, 1);
        this._isDirty = true;
        return Promise.resolve();
      }
    }
    return Promise.reject(new Error("The study template does not exist"));
  }

  public getStudyTemplateContent(
    studyTemplateData: StudyTemplateMetaInfo,
  ): Promise<string> {
    for (let i = 0; i < this._studyTemplates.length; ++i) {
      if (this._studyTemplates[i].name === studyTemplateData.name) {
        return Promise.resolve(this._studyTemplates[i].content);
      }
    }
    return Promise.reject(new Error("The study template does not exist"));
  }

  public saveStudyTemplate(
    studyTemplateData: StudyTemplateData,
  ): Promise<void> {
    for (let i = 0; i < this._studyTemplates.length; ++i) {
      if (this._studyTemplates[i].name === studyTemplateData.name) {
        this._studyTemplates.splice(i, 1);
        break;
      }
    }
    this._studyTemplates.push(studyTemplateData);
    this._isDirty = true;
    return Promise.resolve();
  }

  public getAllStudyTemplates(): Promise<StudyTemplateData[]> {
    return Promise.resolve(this._studyTemplates);
  }

  public removeDrawingTemplate(
    toolName: string,
    templateName: string,
  ): Promise<void> {
    for (let i = 0; i < this._drawingTemplates.length; ++i) {
      if (
        this._drawingTemplates[i].name === templateName &&
        this._drawingTemplates[i].toolName === toolName
      ) {
        this._drawingTemplates.splice(i, 1);
        this._isDirty = true;
        return Promise.resolve();
      }
    }
    return Promise.reject(new Error("The drawing template does not exist"));
  }

  public loadDrawingTemplate(
    toolName: string,
    templateName: string,
  ): Promise<string> {
    for (let i = 0; i < this._drawingTemplates.length; ++i) {
      if (
        this._drawingTemplates[i].name === templateName &&
        this._drawingTemplates[i].toolName === toolName
      ) {
        return Promise.resolve(this._drawingTemplates[i].content);
      }
    }
    return Promise.reject(new Error("The drawing template does not exist"));
  }

  public saveDrawingTemplate(
    toolName: string,
    templateName: string,
    content: string,
  ): Promise<void> {
    for (let i = 0; i < this._drawingTemplates.length; ++i) {
      if (
        this._drawingTemplates[i].name === templateName &&
        this._drawingTemplates[i].toolName === toolName
      ) {
        this._drawingTemplates.splice(i, 1);
        break;
      }
    }
    this._drawingTemplates.push({
      name: templateName,
      content: content,
      toolName: toolName,
    });
    this._isDirty = true;
    return Promise.resolve();
  }

  public getDrawingTemplates(): Promise<string[]> {
    return Promise.resolve(
      this._drawingTemplates.map((template) => template.name),
    );
  }

  public async getAllChartTemplates(): Promise<string[]> {
    return this._chartTemplates.map((x) => x.name);
  }

  public async saveChartTemplate(
    templateName: string,
    content: ChartTemplateContent,
  ): Promise<void> {
    const theme = this._chartTemplates.find((x) => x.name === templateName);
    if (theme) {
      theme.content = content;
    } else {
      this._chartTemplates.push({ name: templateName, content });
    }
    this._isDirty = true;
  }

  public async removeChartTemplate(templateName: string): Promise<void> {
    this._chartTemplates = this._chartTemplates.filter(
      (x) => x.name !== templateName,
    );
    this._isDirty = true;
  }

  public async getChartTemplateContent(
    templateName: string,
  ): Promise<ChartTemplate> {
    const content = this._chartTemplates.find(
      (x) => x.name === templateName,
    )?.content;
    return { content: structuredClone(content) };
  }

  // Only used if `saveload_separate_drawings_storage` featureset is enabled
  public async saveLineToolsAndGroups(
    layoutId: string,
    chartId: string | number,
    state: LineToolsAndGroupsState,
  ): Promise<void> {
    const drawings = state.sources;
    if (!drawings) return;

    const drawingKey = this._getDrawingKey(layoutId, chartId);
    if (!this._drawings[drawingKey]) {
      this._drawings[drawingKey] = {};
    }

    // Convert the Map to an array and iterate
    drawings.forEach((value, key) => {
      if (value === null) {
        delete this._drawings[drawingKey][key];
      } else {
        this._drawings[drawingKey][key] = value;
      }
    });

    this._isDirty = true;
  }

  // Only used if `saveload_separate_drawings_storage` featureset is enabled
  public async loadLineToolsAndGroups(
    layoutId: string | undefined,
    chartId: string | number,
    _requestType: LineToolsAndGroupsLoadRequestType,
    _requestContext: LineToolsAndGroupsLoadRequestContext,
  ): Promise<Partial<LineToolsAndGroupsState> | null> {
    if (!layoutId) {
      return null;
    }
    const rawSources = this._drawings[this._getDrawingKey(layoutId, chartId)];
    if (!rawSources) return null;
    const sources = new Map();

    for (let [key, state] of Object.entries(rawSources)) {
      sources.set(key, state);
    }

    return {
      sources,
    };
  }

  private _getFromLocalStorage<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  private _generateUniqueChartId(): string {
    return "local_tv_chart_" + Date.now();
  }

  private _getDrawingKey(layoutId: string, chartId: string | number): string {
    return `${layoutId}-${chartId}`;
  }

  private _saveAllToLocalStorage() {
    localStorage.setItem(storageKeys.charts, JSON.stringify(this._charts));
    localStorage.setItem(
      storageKeys.studyTemplates,
      JSON.stringify(this._studyTemplates),
    );
    localStorage.setItem(
      storageKeys.drawingTemplates,
      JSON.stringify(this._drawingTemplates),
    );
    localStorage.setItem(
      storageKeys.chartTemplates,
      JSON.stringify(this._chartTemplates),
    );
    localStorage.setItem(storageKeys.drawings, JSON.stringify(this._drawings));
  }
}

export const TVChartContainer = (
  props: Partial<ChartingLibraryWidgetOptions> & {
    patternId?: string;
    chartType?: string;
    gaHit?: string;
    savePatternImages?: string;
    updatePageUrl?: string;
    isLogin?: string;
    showVolume?: boolean;
    symbolData?: any;
  },
) => {
  const {
    patternId,
    chartType,
    gaHit = true,
    savePatternImages = "false",
    updatePageUrl = "false",
    isLogin = false,
    showVolume = true,
  } = props;
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  // Special handling for props.symbolData.type and props.interval
  let param_periodicity = props.interval as ResolutionString;

  if (
    (props?.symbolData?.type === "mcx" ||
      props?.symbolData?.type === "forex" ||
      props?.symbolData?.type === "commodity") &&
    (param_periodicity == "1" ||
      param_periodicity == "5" ||
      param_periodicity == "10")
  ) {
    param_periodicity = "15" as ResolutionString; // Set interval to 15 if conditions are met
  }

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
      study_count_limit: 3,
    };

    if (patternId) {
      widgetOptions.overrides = {
        ...widgetOptions.overrides,
        "scalesProperties.showSeriesLastValue": false,
        "mainSeriesProperties.showPriceLine": false,
      };
    }

    if (!widgetOptions.disabled_features) {
      widgetOptions.disabled_features = []; // Initialize if it doesn't exist
    }

    if (!showVolume) {
      if (
        !widgetOptions.disabled_features.includes(
          "create_volume_indicator_by_default",
        )
      ) {
        widgetOptions.disabled_features.push(
          "create_volume_indicator_by_default",
        );
      }
      widgetOptions.studies_access = {
        type: "black",
        tools: [
          { name: "Accumulation/Distribution", grayed: true },
          { name: "Chaikin Money Flow", grayed: true },
          { name: "Ease of Movement", grayed: true },
          { name: "Elders Force Index", grayed: true },
          { name: "Klinger Oscillator", grayed: true },
          { name: "Money Flow Index", grayed: true },
          { name: "Net Volume", grayed: true },
          { name: "On Balance Volume", grayed: true },
          { name: "Price Volume Trend", grayed: true },
          { name: "VWAP", grayed: true },
          { name: "Volume Oscillator", grayed: true },
        ],
      };
    }

    if (loadLastChart) {
      Object.assign(widgetOptions, {
        load_last_chart: true,
        auto_save_delay: 1,
      });

      if (isLogin) {
        Object.assign(widgetOptions, {
          charts_storage_url: "https://etapi.indiatimes.com/charts/mrkts",
          charts_storage_api_version: "1.1",
        });
      } else {
        Object.assign(widgetOptions, {
          save_load_adapter: new LocalStorageSaveLoadAdapter(),
        });
        if (!widgetOptions.disabled_features.includes("header_saveload")) {
          widgetOptions.disabled_features.push("header_saveload");
        }
      }
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
      const screenshotCanvas = await tvWidget.takeClientScreenshot({
        hideResolution: true,
        hideStudiesFromLegend: true,
      });

      const originalWidth = screenshotCanvas.width;
      const originalHeight = screenshotCanvas.height;

      // Calculate crop values based on new percentages
      const cropX = originalWidth * 0.01; // Crop 1% from the left
      const cropWidth = originalWidth * 0.98; // 98% of the width (1% crop from both left and right)
      const cropY = originalHeight * 0.08; // Start cropping 8% from the top
      const cropHeight = originalHeight * 0.84; // 84% of the original height (8% cropped from both top and bottom)

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
            patternTrend,
            breakoutData,
          } = patternList;

          // Convert pattern data
          const processedPatternData = patternData.map((item: any) => ({
            time: (item.time + 34200000) / 1000,
            price: item.price,
          }));

          const processedBreakoutData = [
            {
              time: (breakoutData.time + 34200000) / 1000,
              price: breakoutData.price,
            },
          ];

          // Date conversion
          const patternFromDate = Math.floor(
            new Date(chartStartDate).getTime() / 1000,
          );
          const patternToDate = Math.floor(
            new Date(chartEndDate).getTime() / 1000,
          );

          // Set visible range for the chart
          activeChart.setVisibleRange({
            from: patternFromDate,
            to: patternToDate,
          });

          if (savePatternImages === "true") {
            // Get active chart and price scale
            const priceScale = activeChart
              .getPanes()[0]
              .getRightPriceScales()[0];

            // Price range calculations
            const prices = processedPatternData.map((item: any) => item.price);
            const minPrice = Math.min(...prices) * 0.95; // Reduce min price by 5%
            const maxPrice = Math.max(...prices) * 1.05; // Increase max price by 5%

            const adjustedMinBreakoutPrice = breakoutData.price * 0.95;
            const adjustedMaxBreakoutPrice = breakoutData.price * 1.05;

            priceScale.setVisiblePriceRange({
              from: Math.min(adjustedMinBreakoutPrice, minPrice),
              to: Math.max(adjustedMaxBreakoutPrice, maxPrice),
            });
          }

          // Create shape
          activeChart.createMultipointShape(processedPatternData, {
            shape: patternShape,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            lock: true,
            overrides: {
              linecolor: patternTrend === "bear" ? "#F57B8F" : "#24CB24",
              backgroundColor: patternTrend === "bear" ? "#FDE7EB" : "#E9FBE9",
              linewidth: 2,
              transparency: 1,
            },
          });

          if (savePatternImages !== "true") {
            activeChart.createShape(processedBreakoutData[0], {
              shape: "icon",
              zOrder: "top",
              disableSelection: true,
              disableSave: true,
              lock: true,
              overrides: {
                color: "#2962ff",
                size: 25,
              },
              icon: 0xf192, // Heart
            });

            activeChart.createMultipointShape(processedBreakoutData, {
              shape: "text",
              zOrder: "top",
              disableSelection: true,
              disableSave: true,
              lock: true,
              overrides: {
                text: "Breakout Level",
                color: "#000", // Text color (white)
              },
            });

            activeChart.createMultipointShape(processedBreakoutData, {
              shape: "horizontal_line",
              zOrder: "top",
              disableSelection: true,
              disableSave: true,
              disableUndo: true,
              lock: true,
              overrides: {
                linecolor: "#000",
                linestyle: 2,
                linewidth: 2,
              },
            });
          }

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
