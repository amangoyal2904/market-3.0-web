import { Metadata } from "next";
import MarketMoodsClient from "../clients";
import { cookies } from "next/headers";
import {
  getAdvanceDeclineData,
  getFilterDataBySeoName,
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
  const niftyFilterData = await getFilterDataBySeoName(params.index);
  let overviewData,
    advacneDeclineData,
    periodicData = null;
  // if (isprimeuser) {
  overviewData = await getOverviewData(niftyFilterData.indexId, 1);
  advacneDeclineData = await getAdvanceDeclineData(
    niftyFilterData.indexId,
    "daily",
    1,
  );
  periodicData = await getPeriodicData(niftyFilterData.indexId, "1M", 1);
  // }

  return (
    <MarketMoodsClient
      isprimeuser={isprimeuser}
      overviewData={overviewData}
      advacneDeclineData={advacneDeclineData}
      periodicData={periodicData}
      niftyFilterData={niftyFilterData}
    />
  );
};

export default MarketMoods;
