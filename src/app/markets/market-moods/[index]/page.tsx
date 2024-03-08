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
    periodicData = {};
  if (isprimeuser) {
    overviewData = getOverviewData(niftyFilterData.indexId);
    advacneDeclineData = getAdvanceDeclineData(niftyFilterData.indexId);
    periodicData = getPeriodicData(niftyFilterData.indexId);
  }

  return (
    <MarketMoodsClient
      isprimeuser={true}
      overviewData={overviewData}
      advacneDeclineData={advacneDeclineData}
      periodicData={periodicData}
      niftyFilterData={niftyFilterData}
    />
  );
};

export default MarketMoods;
