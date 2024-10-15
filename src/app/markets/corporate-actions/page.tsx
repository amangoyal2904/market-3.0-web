import {
  fnGenerateMetaData,
  getDaywiseActivityData,
  getFiiDiiSummaryData,
} from "@/utils/utility";
import BreadCrumb from "@/components/BreadCrumb";
import { headers } from "next/headers";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import DfpAds from "@/components/Ad/DfpAds";
import { Metadata } from "next";
import CorporateActionClient from "./client";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: "Corporate Actions",
    desc: "Corporate Actions",
    keywords: "Corporate Actions, Stocks Market",
    pathname: pageUrl,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const CorporateActions = async () => {
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
      <CorporateActionClient />
    </>
  );
};

export default CorporateActions;
