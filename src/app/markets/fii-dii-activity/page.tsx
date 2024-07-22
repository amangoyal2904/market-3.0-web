import { getDaywiseActivityData, getFiiDiiSummaryData } from "@/utils/utility";
import FiiDiiActivityclient from "./client";
import BreadCrumb from "@/components/BreadCrumb";
import { headers } from "next/headers";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import DfpAds from "@/components/Ad/DfpAds";

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
