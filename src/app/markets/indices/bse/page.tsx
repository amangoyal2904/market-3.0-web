import { fnGenerateMetaData, getAllIndices } from "@/utils/utility";
import { Metadata } from "next";
import IndicesClient from "../client";
import tableConfig from "@/utils/tableConfig.json";
import BreadCrumb from "@/components/BreadCrumb";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import DfpAds from "@/components/Ad/DfpAds";
import dynamic from "next/dynamic";
const PageRefresh = dynamic(() => import("@/components/PageRefresh"), {
  ssr: false,
});

const pageUrl = "/markets/indices/bse";

export async function generateMetadata(): Promise<Metadata> {
  const meta = {
    title: "BSE Live | BSE India - Bombay Stock Exchange Today",
    desc: "BSE Today | BSE Live Updates - All Indices stock exchange Index live prices, volume, Bombay Stock Exchange (BSE) ALL 30 constituent companies and 52-week high low price for SENSEX Index.",
    keywords:
      "BSE,Bombay Stock Exchange,BSE Today,BSE India,BSE Live,BSE Sensex,BSE Live Updates",
    pathname: pageUrl,
  };
  return fnGenerateMetaData(meta);
}

const Indices = async () => {
  const { tableHeaderData, tableData, exchange, unixDateTime } =
    await getAllIndices("bse", "", "DESC");

  return (
    <>
      <IndicesClient
        tableHeaderData={tableHeaderData}
        tableData={tableData}
        exchange={exchange}
        tableConfig={tableConfig["indicesListing"]}
        unixDateTime={unixDateTime}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "BSE", redirectUrl: "" }]}
      />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
      <PageRefresh refreshTime={180000} />
    </>
  );
};

export default Indices;
