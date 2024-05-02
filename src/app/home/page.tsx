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
import { getBuySellTechnicals } from "@/utils/utility";

const Home = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
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
      filterValue: [2365],
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
    pagesize: 6,
    crossoverType: "Bullish",
  };
  const table = await getBuySellTechnicals(buySellTechnicalspayload);

  return (
    <>
      <IndicesWidget />
      <MarketsDashboardWidget />
      <WatchlistWidget />
      <StockRecommendations stockRecoResult={stockRecoResult} />
      <StockReportsPlus srResult={srPlusResult} />
      <StockScreenerWidget />
      <BuySellTechnicalWidget
        data={table}
        bodyParams={buySellTechnicalspayload}
      />
      <LiveStreamWidget />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Markets", redirectUrl: "" }]}
      />
    </>
  );
};

export default Home;
