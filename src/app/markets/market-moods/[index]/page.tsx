import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import MarketMoodsClient from "../clients";
import { headers } from "next/headers";
import {
  fetchFilters,
  fetchSelectedFilter,
  fnGenerateMetaData,
  getAdvanceDeclineData,
  getOverviewData,
  getPeriodicData,
} from "@/utils/utility";
import BreadCrumb from "@/components/BreadCrumb";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import DfpAds from "@/components/Ad/DfpAds";

async function fetchData(indexId: number) {
  return Promise.all([
    getOverviewData(indexId, 1),
    getAdvanceDeclineData(indexId, "daily", 1),
    getPeriodicData(indexId, "1M", 1),
    fetchFilters({}),
  ]);
}

async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const niftyFilterData = await fetchSelectedFilter(params.index);
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: "Market Moods | " + niftyFilterData.name,
    desc: "Know the market sentiments. Check the percentage or count of stocks in the selected index with value above the technical indicators.",
    keywords: `market moods, ${niftyFilterData.seoname}, ${niftyFilterData.name}`,
    pathname: pageUrl,
    index: niftyFilterData.indexId == 0 ? false : true,
  };
  return fnGenerateMetaData(meta);
}

const MarketMoods = async ({ params }: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const niftyFilterData = await fetchSelectedFilter(params.index);
  if (niftyFilterData.indexId == 0) {
    notFound();
  }
  const [overviewData, advanceDeclineData, periodicData, allFilters] =
    await fetchData(niftyFilterData.indexId);
  const breadCrumbObj = [{ label: niftyFilterData?.name, redirectUrl: "" }];

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
      <br/>
      <DfpAds adInfo={AdInfo.dfp.btfAd}/>
    </>
  );
};

export { generateMetadata, MarketMoods as default };
