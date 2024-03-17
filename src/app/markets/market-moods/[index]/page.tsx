// Import statements
import { Metadata } from "next";
import MarketMoodsClient from "../clients";
import { cookies } from "next/headers";
import {
  fetchSelectedFilter,
  getAdvanceDeclineData,
  getOverviewData,
  getPeriodicData,
} from "@/utils/utility";

// Metadata definition
export const metadata: Metadata = {
  title: "Market Moods",
  description:
    "Know the market sentiments. Check the percentage or count of stocks in the selected index with value above the technical indicators.",
};

// MarketMoods function
const MarketMoods = async ({ params }: any) => {
  const cookieStore = cookies();
  const isprimeuser = cookieStore.get("isprimeuser")?.value === "true";
  const niftyFilterData = await fetchSelectedFilter(params.index);
  const [overviewData, advanceDeclineData, periodicData] = await Promise.all([
    getOverviewData(niftyFilterData.indexId, 1),
    getAdvanceDeclineData(niftyFilterData.indexId, "daily", 1),
    getPeriodicData(niftyFilterData.indexId, "1M", 1),
  ]);

  return (
    <MarketMoodsClient
      isprimeuser={isprimeuser}
      overviewData={overviewData}
      advanceDeclineData={advanceDeclineData}
      periodicData={periodicData}
      selectedFilter={niftyFilterData}
    />
  );
};

export default MarketMoods;
