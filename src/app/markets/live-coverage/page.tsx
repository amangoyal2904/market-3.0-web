import StockRecommendations from "@/components/StockRecommendations";
import WatchListWidget from "@/components/WatchlistWidget";
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
import {
  fetchInvestMentData,
  fnGenerateMetaData,
  getBuySellTechnicals,
  saveLogs,
} from "@/utils/utility";
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
    const data = response ? await response?.json() : {};
    return data;
  };

  const fetchTopNews = async () => {
    const response = await service.get({
      url: `${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/feed_livecoverage_topnews.cms?feedtype=etjson&platform=web`,
      params: {},
    });
    if (response && response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Handle cases where response is undefined or not successful
      return [];
    }
  };

  const fetchFiiDIIData = async () => {
    const response = await service.get({
      url: (APIS_CONFIG as any)?.FIIDIICash[APP_ENV],
      params: {},
    });
    const data = response ? await response?.json() : {};
    const fiidiiData =
      (data && data.datainfo && data.datainfo.fiiDiiChart) || {};
    return fiidiiData;
  };

  const getRecosNav = async () => {
    const RECOS_NAV_Link = `${(APIS_CONFIG as any)?.["STOCK_RECOS_NAV"][APP_ENV]}?pagename=home`;
    const recosNavPromise = await service.get({
      url: RECOS_NAV_Link,
      params: {},
    });
    const getRecosNavData = await recosNavPromise?.json();
    return getRecosNavData;
  };

  const getRecosData = async (type: any) => {
    const getRecosDetailApi = `${(APIS_CONFIG as any)?.["GET_RECOS_DETAILS"][APP_ENV]}`;
    const payload = {
      apiType: type,
      filterType: "",
      filterValue: [],
      recoType: "all",
      pageSize: 20,
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
  const { table, otherData } = await getBuySellTechnicals(
    buySellTechnicalspayload,
  );

  const topNewsData = await fetchTopNews();
  const investmentData = await fetchInvestMentData();
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
      <WatchListWidget />
      <DfpAds adInfo={AdInfo.dfp.mid1} />
      <InvestmentIdea investmentData={investmentData} />
      <StockRecommendations
        stockRecoResult={stockRecoResult}
        recosNav={await getRecosNav()}
      />
      <StockReportsPlus srResult={srPlusResult} />
      <StockScreenerWidget />
      <DfpAds adInfo={AdInfo.dfp.mid2} />
      <BuySellTechnicalWidget
        data={table}
        otherData={otherData}
        bodyParams={buySellTechnicalspayload}
      />
      <DfpAds adInfo={AdInfo.dfp.mid3} />
      <LiveStreamWidget />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Markets", redirectUrl: "" }]}
      />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
      <PageRefresh refreshTime={180000} />
    </>
  );
};

export default LiveCoverage;
