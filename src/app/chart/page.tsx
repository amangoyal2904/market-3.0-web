import { Metadata } from "next";
import { headers } from "next/headers";
import ChartClient from "./clients";
import { fnGenerateMetaData } from "@/utils/utility";
import { getCookie, getParameterByName } from "@/utils";
import {
  ChartingLibraryFeatureset,
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "../../../public/static/v27/charting_library/charting_library";

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

const Chart = () => {
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

  const getOnlyChartFeatures = (user_id: string) => {
    const showOnlyChart =
      getParameterByName("onlychart") == "true" ? true : false;

    const saveFeature = !!user_id && user_id !== "default" ? true : false;

    const onlyChart = [];

    if (getParameterByName("hidesymbol") == "true") {
      onlyChart.push("header_symbol_search");
    }

    if (showOnlyChart === true) {
      onlyChart.push(
        "left_toolbar",
        "header_widget",
        "legend_widget",
        "timeframes_toolbar",
        "main_series_scale_menu",
        "context_menus",
        "edit_buttons_in_legend",
        "create_volume_indicator_by_default",
        "border_around_the_chart",
      );
    }

    if (saveFeature === false) {
      onlyChart.push("header_saveload", "use_localstorage_for_settings");
    }

    return onlyChart;
  };

  const symbol = getSymbol();
  const interval = "1";
  const userId = getCookie("ssoid");
  const user_id: string =
    typeof userId === "string" && !!userId ? userId : "default";

  const onlyChart = getOnlyChartFeatures(user_id);
  const disabledFeatures: ChartingLibraryFeatureset[] = onlyChart.length
    ? onlyChart.map((feature) => feature as ChartingLibraryFeatureset)
    : [
        "adaptive_logo",
        "header_screenshot",
        "header_fullscreen_button",
        "go_to_date",
        "items_favoriting",
        "show_object_tree",
        "symbol_info",
        "header_fullscreen_button",
        "show_right_widgets_panel_by_default",
        "popup_hints",
        "chart_property_page_trading",
      ];

  const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
    symbol: symbol || "RELIANCE",
    interval: interval as ResolutionString,
    user_id: user_id,
    theme: getParameterByName("darktheme") == "true" ? "dark" : "light",
    enabled_features: [
      "study_templates",
      "pre_post_market_sessions",
      "seconds_resolution",
      "custom_resolutions",
      "secondary_series_extend_time_scale",
      "show_percent_option_for_right_margin",
      "items_favoriting",
      "show_spread_operators",
      "show_average_close_price_line_and_label",
      "custom_resolutions",
      "items_favoriting",
      "datasource_copypaste",
      "hide_object_tree_and_price_scale_exchange_label",
    ],
    disabled_features: disabledFeatures,
    fullscreen: true,
    overrides: {},
  };

  return <ChartClient {...defaultWidgetProps} />;
};

export default Chart;
