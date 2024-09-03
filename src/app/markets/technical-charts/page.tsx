import { Metadata } from "next";
import { headers } from "next/headers";
import { fnGenerateMetaData } from "@/utils/utility";
import {
  ChartingLibraryFeatureset,
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "../../../../public/static/v28/charting_library/charting_library";
import TechnicalChartsClient from "./clients";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title:
      "Share Market, Nifty, Sensex, NSE/BSE Live Updates, Stock Market Today",
    desc: "Share Market & Stock Market Live Updates - Latest share market live updates on NIFTY, Sensex Today live, NSE/BSE, big bull, stock reports, stock screeners, indices, market mood, forex, commodity, top investors at The Economic Times",
    keywords:
      "Share Market, Stock Market, share market live updates, NIFTY, Sensex Today live, NSE/BSE, big bull, stock reports, stock screeners, indices, market mood, forex, commodity, top investors",
    pathname: pageUrl,
    index: false,
  };
  return fnGenerateMetaData(meta);
}

const TechnicalCharts = () => {
  const headersList = headers();
  const searchParams = new URLSearchParams(
    headersList.get("x-searchparam") || "",
  );

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

  const hideMenu = searchParams.get("no_menu")
    ? searchParams.get("no_menu")
    : 0;
  const dontSave = searchParams.get("dont_save")
    ? searchParams.get("dont_save")
    : false;

  const getSymbol = () => {
    const symbl = searchParams.get("symbol")?.replace("&", "%26");
    const pairnameparent =
      searchParams.get("pairnameparent") ||
      searchParams.get("currencypairname");

    const expirydate = searchParams.get("expirydate");
    const isValidDate = (date: any) => {
      return !isNaN(Date.parse(date));
    };

    let formattedSymbol = pairnameparent
      ? pairnameparent.replace("&", "%26")
      : symbl
        ? symbl
        : "NSE INDEX";

    if (expirydate && isValidDate(expirydate)) {
      formattedSymbol = `${formattedSymbol}_${expirydate}_MCX`;
    }

    return formattedSymbol;
  };

  const getInterval = () => {
    const itvl = searchParams.get("periodicity") || "day";
    const defaultPeriod = searchParams.get("default_period") || null; // Updated to handle null if not present
    const timeframe =
      defaultPeriod && timeFramePair[defaultPeriod]
        ? timeFramePair[defaultPeriod]
        : "1D"; // Set to "1D" by default if default_period is not available
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

    return { timeframe, interval, defaultPeriod };
  };

  const getOnlyChartFeatures = () => {
    const onlyChart = [];

    if (
      searchParams.get("symbol_label") === "false" ||
      searchParams.get("symbol_textbox") === "false"
    ) {
      onlyChart.push("header_symbol_search");
    }

    if (hideMenu == "true" || hideMenu == "1") {
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

    if (dontSave == "true") {
      onlyChart.push("header_saveload", "use_localstorage_for_settings");
    }

    return onlyChart;
  };

  const symbol = getSymbol();
  const { timeframe, interval, defaultPeriod } = getInterval();
  const onlyChart = getOnlyChartFeatures();
  const disabledFeatures: ChartingLibraryFeatureset[] = onlyChart.length
    ? onlyChart.map((feature) => feature as ChartingLibraryFeatureset)
    : [
        "adaptive_logo",
        "header_screenshot",
        "header_fullscreen_button",
        "go_to_date",
        "show_object_tree",
        "symbol_info",
        "header_fullscreen_button",
        "show_right_widgets_panel_by_default",
        "popup_hints",
        "chart_property_page_trading",
      ];

  const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
    symbol: symbol,
    interval: interval as ResolutionString,
    ...(defaultPeriod && { timeframe: timeframe }), // Conditionally add timeframe
    theme: searchParams.get("darktheme") == "true" ? "dark" : "light",
    enabled_features: ["show_zoom_and_move_buttons_on_touch"],
    disabled_features: disabledFeatures,
    fullscreen: false,
  };
  return <TechnicalChartsClient {...defaultWidgetProps} />;
};

export default TechnicalCharts;
