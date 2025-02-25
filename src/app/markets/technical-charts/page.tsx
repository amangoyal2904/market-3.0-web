import { Metadata } from "next";
import { headers } from "next/headers";
import {
  fetchSeoWidgetData,
  fnGenerateMetaData,
  getSymbolInfo,
} from "@/utils/utility";
import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "../../../../public/static/v283/charting_library/charting_library";
import TechnicalChartsClient from "./clients";
import {
  fetchMarketTrend,
  getTechnicalChartNews,
  getTechnicalChartPageMetaData,
} from "./utilities";
import BreadCrumb from "@/components/BreadCrumb";

// Function to fetch common data
const getCommonData = () => {
  const headersList = headers();
  const searchParams = new URLSearchParams(
    headersList.get("x-searchparam") || "",
  );

  const timePair: { [key: string]: string } = {
    day: "1D",
    week: "1W",
    month: "1M",
    year: "1Y",
  };

  const timeFramePair = {
    "1D": "1D",
    "5D": "5D",
    "1W": "7D",
    "1M": "1M",
    "3M": "3M",
    "6M": "6M",
    "1Y": "12M",
    "3Y": "36M",
    "5Y": "60M",
  } as const;

  const getSymbol = () => {
    const symbol = searchParams.get("symbol")?.replace("&", "%26");
    const pairnameparent =
      searchParams.get("pairnameparent") ||
      searchParams.get("currencypairname");
    const expirydate = searchParams.get("expirydate");

    const isValidDate = (date: string) => !isNaN(Date.parse(date));
    let formattedSymbol = pairnameparent
      ? pairnameparent.replace("&", "%26")
      : symbol || "NSE INDEX";

    if (expirydate && isValidDate(expirydate)) {
      formattedSymbol = `${formattedSymbol}_${expirydate}_MCX`;
    }

    return formattedSymbol;
  };

  const getInterval = () => {
    const itvl = searchParams.get("periodicity") || "day";
    const defaultPeriod = searchParams.get("default_period") || null;

    const timeframe =
      defaultPeriod &&
      timeFramePair[defaultPeriod as keyof typeof timeFramePair]
        ? timeFramePair[defaultPeriod as keyof typeof timeFramePair]
        : "1D";

    const defaultPeriodIntervalMap: { [key: string]: string | number } = {
      "1D": 1,
      "5D": 15,
      "1M": "1D",
      "3M": "1D",
      "6M": "1D",
      "1Y": "1D",
      "3Y": "W",
      "5Y": "W",
    };

    const interval =
      defaultPeriod && defaultPeriodIntervalMap[defaultPeriod]
        ? defaultPeriodIntervalMap[defaultPeriod]
        : typeof itvl !== "undefined" && Number(itvl)
          ? Number(itvl)
          : timePair[itvl] ?? "1D";

    return { timeframe, interval, defaultPeriod };
  };

  const symbol = getSymbol();
  const { timeframe, interval, defaultPeriod } = getInterval();

  return {
    symbol,
    timeframe,
    interval,
    defaultPeriod,
    searchParams,
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const { symbol } = getCommonData();
  const pageUrl = headers().get("x-url") || "";
  const symbolData = await getSymbolInfo(symbol);

  const { title, desc, keywords } = getTechnicalChartPageMetaData(symbolData);
  const meta = {
    title: title,
    desc: desc,
    keywords: keywords,
    pathname: pageUrl,
  };
  return fnGenerateMetaData(meta);
}

const TechnicalCharts = async () => {
  const { symbol, timeframe, interval, defaultPeriod, searchParams } =
    getCommonData();
  const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
    symbol,
    interval: interval as ResolutionString,
    ...(defaultPeriod && { timeframe }),
    theme: searchParams.get("darktheme") === "true" ? "dark" : "light",
    enabled_features: ["show_zoom_and_move_buttons_on_touch"],
    disabled_features: [
      "adaptive_logo",
      "go_to_date",
      "show_object_tree",
      "symbol_info",
      "show_right_widgets_panel_by_default",
      "popup_hints",
      "chart_property_page_trading",
    ],
    fullscreen: false,
  };

  const [symbolData, newsData, trendData, trendingTerm] = await Promise.all([
    getSymbolInfo(symbol),
    getTechnicalChartNews(),
    fetchMarketTrend(),
    fetchSeoWidgetData(),
  ]);

  const { relatedNews, technicalAnalysis, definitions } = newsData;

  return (
    <>
      <TechnicalChartsClient
        {...defaultWidgetProps}
        patternId={searchParams.get("patternid")}
        gaHit={searchParams.get("ga_hit")}
        chartType={searchParams.get("chart_type")}
        symbolData={symbolData}
        relatedNews={relatedNews}
        technicalAnalysis={technicalAnalysis}
        definitions={definitions}
        trendingList={trendData}
        trendingTerm={trendingTerm}
      />
      <BreadCrumb
        pagePath="/markets/technical-charts"
        pageName={[{ label: "Technical Chart", redirectUrl: "" }]}
      />
    </>
  );
};

export default TechnicalCharts;
