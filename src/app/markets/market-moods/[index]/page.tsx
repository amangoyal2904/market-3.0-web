import { Metadata } from "next";
import MarketMoodsClient from "../clients";
import { cookies } from "next/headers";
import {
  fetchSelectedFilter,
  getAdvanceDeclineData,
  getOverviewData,
  getPeriodicData,
} from "@/utils/utility";

export const metadata: Metadata = {
  title: "Market Moods",
  description:
    "Know the market sentiments. Check the percentage or count of stocks in the selected index with value above the technical indicators.",
};

const MarketMoods = async ({ params }: any) => {
  const cookieStore = cookies();
  const isprimeuser = cookieStore.get("isprimeuser") ? true : false;
  const niftyFilterData = await fetchSelectedFilter(params.index);
  let overviewData,
    advanceDeclineData,
    periodicData = null;
  // if (isprimeuser) {
  overviewData = await getOverviewData(niftyFilterData.indexId, 1);
  advanceDeclineData = await getAdvanceDeclineData(
    niftyFilterData.indexId,
    "daily",
    1,
  );
  periodicData = await getPeriodicData(niftyFilterData.indexId, "1M", 1);
  // }

  return (
    <MarketMoodsClient
      isprimeuser={true}
      overviewData={overviewData}
      advanceDeclineData={advanceDeclineData}
      periodicData={periodicData}
      selectedFilter={niftyFilterData}
    />
  );
};

export default MarketMoods;
