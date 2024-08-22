import { fnGenerateMetaData, getAllSectors } from "@/utils/utility";
import { Metadata } from "next";
import SectorsClient from "./client";
import tableConfig from "@/utils/tableConfig.json";
import BreadCrumb from "@/components/BreadCrumb";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import DfpAds from "@/components/Ad/DfpAds";
import dynamic from "next/dynamic";
const PageRefresh = dynamic(() => import("@/components/PageRefresh"), {
  ssr: false,
});

const pageUrl = "/stocks/sectors";

export async function generateMetadata(): Promise<Metadata> {
  const meta = {
    title: "Indian Market Sectors, Live Index Watch, Market Indexes",
    desc: "Indian Market Sectors Live - Checkout Latest & comprehensive value all major stock market Sectors. Live NSE / BSE Sectors Watch to measure the performance against a relevant market index.",
    keywords:
      "Indian Sectors, All Sectors, All Index, Indian Market Sectors, Indian Stock Sectors, Indian Stock Market Sectors, Stock Market Sectors",
    pathname: pageUrl,
    index: false,
  };
  return fnGenerateMetaData(meta);
}

const Sectors = async () => {
  const { tableHeaderData, tableData, unixDateTime } = await getAllSectors(
    "sectorMarketCap",
    "DESC",
  );
  return (
    <>
      <SectorsClient
        tableHeaderData={tableHeaderData}
        tableData={tableData}
        tableConfig={tableConfig["sectorsListing"]}
        unixDateTime={unixDateTime}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Sectors", redirectUrl: "" }]}
      />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
      <PageRefresh refreshTime={180000} />
    </>
  );
};

export default Sectors;
