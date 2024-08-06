import {
  fnGenerateMetaData,
  getDaywiseActivityData,
  getFiiDiiSummaryData,
} from "@/utils/utility";
import FiiDiiActivityclient from "./client";
import BreadCrumb from "@/components/BreadCrumb";
import { headers } from "next/headers";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import DfpAds from "@/components/Ad/DfpAds";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: "FII DII Trading Activity, Live FII & DII Data",
    desc: "FII & DII Trading Activity - Get live data for FII (Foreign Institutional Investors) & DII (Domestic Institutional Investors) trading activity. Check cash provosional, FII cash, F&O (future and options), mutual funds at The Economic Times",
    keywords:
      "FII, DII, FII & DII Trading Activity, Trading Activity Today, Futures and Options, F&O Trading, F&O, MF, Mutual Funds, Stocks Market",
    pathname: pageUrl,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const FiiDiiActivity = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const response: any = await getDaywiseActivityData();
  const { listFiiDiiDaywiseActivityData } =
    response.datainfo.fiiDiiDaywiseActivity;
  const dataWithNiftySensex: any = [];
  const otherData: any = [];
  listFiiDiiDaywiseActivityData.forEach((data: any) => {
    const { dateLong, dateStr, nifty, sensex, ...rest } = data;

    dataWithNiftySensex.push({ dateLong, dateStr, nifty, sensex });
    otherData.push(rest);
  });

  const summaryResponse: any = await getFiiDiiSummaryData("cash");
  const summaryData = summaryResponse;

  return (
    <>
      <FiiDiiActivityclient
        dataWithNiftySensex={dataWithNiftySensex}
        otherData={otherData}
        summaryData={summaryData}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "FII & DII", redirectUrl: "" }]}
      />
      <br />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
    </>
  );
};

export default FiiDiiActivity;
