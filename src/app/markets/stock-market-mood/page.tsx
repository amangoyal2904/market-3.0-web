import { Metadata } from "next";
import {
  fetchFilters,
  fnGenerateMetaData,
  getAdvanceDeclineData,
  getOverviewData,
  getPeriodicData,
} from "@/utils/utility";
import BreadCrumb from "@/components/BreadCrumb";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import DfpAds from "@/components/Ad/DfpAds";
import MarketMoodsClient from "./clients";

export const revalidate = 1200;
const pageUrl = "/markets/stock-market-mood";

async function fetchData(indexId: number) {
  return Promise.all([
    getOverviewData(indexId, 1),
    getAdvanceDeclineData(indexId, "daily", 1),
    getPeriodicData(indexId, "1M", 1),
    fetchFilters({}),
  ]);
}

async function generateMetadata(): Promise<Metadata> {
  const meta = {
    title: "MarketMood - Know Market Sentiments",
    desc: "MarketMood: Know the market sentiments. Check the percentage or count of stocks in the selected index with value above the technical indicators",
    keywords:
      "MarketMood, Market Sentiments, stocks in different indices, Stock Analysis, premium feature, ETMarkets",
    pathname: pageUrl,
  };
  return fnGenerateMetaData(meta);
}

const MarketMoods = async () => {
  const niftyFilterData = {
    name: "Nifty 500",
    indexId: 2371,
    seoname: "nifty-500",
    exchange: "nse",
  };
  const [overviewData, advanceDeclineData, periodicData, allFilters] =
    await fetchData(niftyFilterData.indexId);
  const breadCrumbObj = [{ label: "Stock Market Mood", redirectUrl: "" }];

  return (
    <>
      <MarketMoodsClient
        selectedFilter={niftyFilterData}
        overview={overviewData}
        advanceDecline={advanceDeclineData}
        periodic={periodicData}
        allFilters={allFilters}
      />
      <BreadCrumb pagePath={pageUrl} pageName={breadCrumbObj} />
      <br />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
    </>
  );
};

export { generateMetadata, MarketMoods as default };
