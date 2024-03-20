// Import statements
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import MarketMoodsClient from "../clients";
import { cookies, headers } from "next/headers";
import {
  fetchFilters,
  fetchSelectedFilter,
  fnGenerateMetaData,
  getAdvanceDeclineData,
  getOverviewData,
  getPeriodicData,
} from "@/utils/utility";

export async function generateMetadata(
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

// MarketMoods function
const MarketMoods = async ({ params }: any) => {
  const niftyFilterData = await fetchSelectedFilter(params.index);
  const cookieStore = cookies();
  const isprimeuser = cookieStore.get("isprimeuser")?.value === "true";
  if (niftyFilterData.indexId == 0) {
    notFound();
  }
  const [overviewData, advanceDeclineData, periodicData, allFilters] =
    await Promise.all([
      getOverviewData(niftyFilterData.indexId, 1),
      getAdvanceDeclineData(niftyFilterData.indexId, "daily", 1),
      getPeriodicData(niftyFilterData.indexId, "1M", 1),
      fetchFilters({}),
    ]);

  return (
    <MarketMoodsClient
      selectedFilter={niftyFilterData}
      overview={overviewData}
      advanceDecline={advanceDeclineData}
      periodic={periodicData}
      allFilters={allFilters}
      isprimeuser={true}
    />
  );
};

export default MarketMoods;
