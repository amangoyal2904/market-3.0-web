import StockRecommendations from "@/components/StockRecommendations";
import WatchlistWidget from "@/components/WatchlistWidget";
import StockReportsPlus from "@/components/StockReportsPlus";
import APIS_CONFIG from "@/network/api_config.json";
import service from "@/network/service";
import { APP_ENV } from "@/utils";
import MarketsDashboardWidget from "@/components/MarketsDashboardWidget";
import StockScreenerWidget from "@/components/ScreenerWidget";
import LiveStreamWidget from "@/components/LiveStreamWidget";
import IndicesWidget from "@/components/IndicesWidget";
import BreadCrumb from "@/components/BreadCrumb";
import { headers } from "next/headers";
import BuySellTechnicalWidget from "@/components/BuySellTechnicalWidget";
import InvestmentIdea from "@/components/InvestmentIdea";
import { fnGenerateMetaData, getBuySellTechnicals } from "@/utils/utility";
import AdInfo from "@/components/Ad/AdInfo/homeAds.json";
import DfpAds from "@/components/Ad/DfpAds";
import dynamic from "next/dynamic";
import { Metadata, ResolvingMetadata } from "next";

const PageRefresh = dynamic(() => import("@/components/PageRefresh"), {
  ssr: false,
});

export async function generateMetadata(
  { searchParams }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title:
      "Share Market, Nifty, Sensex, NSE/BSE Live Updates, Stock Market Today",
    desc: "Share Market & Stock Market Live Updates - Latest share market live updates on NIFTY, Sensex Today live, NSE/BSE, big bull, stock reports, stock screeners, indices, market mood, forex, commodity, top investors at The Economic Times",
    keywords:
      "Share Market, Stock Market, share market live updates, NIFTY, Sensex Today live, NSE/BSE, big bull, stock reports, stock screeners, indices, market mood, forex, commodity, top investors",
    pathname: pageUrl,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const LiveCoverage = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";

  const getIndicesWidgetData = async () => {
    const response = await service.get({
      url: `${(APIS_CONFIG as any)?.INDICES_WIDGET[APP_ENV]}`,
      params: {},
    });
    const data = await response?.json();
    return data;
  };

  const fetchTopNews = async () => {
    const response = await service.get({
      url: `${(APIS_CONFIG as any)?.APIDOMAIN[APP_ENV]}?type=plist&msid=53282427`,
      params: {},
    });
    const data = await response?.json();
    const topNewsData =
      (data &&
        data.searchResult &&
        data.searchResult[0] &&
        data.searchResult[0].data) ||
      [];
    return topNewsData;
  };

  const fetchFiiDIIData = async () => {
    const response = await service.get({
      url: (APIS_CONFIG as any)?.FIIDIICash[APP_ENV],
      params: {},
    });
    const data = await response?.json();
    const fiidiiData =
      (data && data.datainfo && data.datainfo.fiiDiiChart) || {};
    return fiidiiData;
  };

  const getRecosData = async (type: any) => {
    const getRecosDetailApi = `${(APIS_CONFIG as any)?.["GET_RECOS_DETAILS"][APP_ENV]}`;
    // console.log("@@type --- > " , type)
    const payload = {
      apiType: type,
      filterType: "",
      filterValue: [],
      recoType: "all",
      pageSize: 30,
      pageNumber: 1,
    };

    const headers = {
      "Content-Type": "application/json",
    };
    const getRecosDetailPromise = await service.post({
      url: getRecosDetailApi,
      headers: headers,
      body: JSON.stringify(payload),
      params: {},
    });
    const getRecosDetailData = await getRecosDetailPromise?.json();
    return getRecosDetailData;
  };
  const getSrPlusData = async (screenerId: any) => {
    const getSrPlusDataApi = `${(APIS_CONFIG as any)?.["SCREENER_BY_SCREENERID"][APP_ENV]}`;
    const payload = {
      deviceId: "web",
      pageno: 1,
      pagesize: 20,
      screenerId: screenerId,
      viewId: 5246,
      filterType: "index",
      filterValue: [],
    };

    const headers = {
      "Content-Type": "application/json",
    };
    const getSrPlusDataPromise = await service.post({
      url: getSrPlusDataApi,
      headers: headers,
      body: JSON.stringify(payload),
      params: {},
    });
    const data = await getSrPlusDataPromise?.json();
    return data;
  };
  const stockRecoResult = await getRecosData("newRecos");
  const srPlusResult = await getSrPlusData("2554");

  const buySellTechnicalspayload = {
    indicatorName: "EMA20",
    exchange: "nse",
    sortby: "percentChange",
    sortorder: "desc",
    pagesize: 10,
    crossoverType: "Bullish",
  };
  const { table, unixDateTime } = await getBuySellTechnicals(
    buySellTechnicalspayload,
  );

  const topNewsData = await fetchTopNews();
  const indicesData = await getIndicesWidgetData();
  const fiiDiiData = await fetchFiiDIIData();

  return (
    <>
      <IndicesWidget
        data={indicesData}
        topNewsData={topNewsData}
        fiiDiiCash={fiiDiiData}
      />
      <MarketsDashboardWidget />
      <WatchlistWidget />
      <DfpAds adInfo={AdInfo.dfp.mid1} />
      <InvestmentIdea />
      <StockRecommendations stockRecoResult={stockRecoResult} />
      <StockReportsPlus srResult={srPlusResult} />
      <StockScreenerWidget />
      <DfpAds adInfo={AdInfo.dfp.mid2} />
      <BuySellTechnicalWidget
        data={table}
        unixDateTime={unixDateTime}
        bodyParams={buySellTechnicalspayload}
      />
      <DfpAds adInfo={AdInfo.dfp.mid3} />
      <LiveStreamWidget />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Markets", redirectUrl: "" }]}
      />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
      <PageRefresh refreshTime={420000} />
    </>
  );
};

export default LiveCoverage;
