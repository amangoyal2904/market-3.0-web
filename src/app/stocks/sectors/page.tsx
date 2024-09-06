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
    title: "Indian Market Sectors, Live Sector Watch, Market Indices",
    desc: "Indian Market Sectors Live - Checkout Latest & comprehensive value all major stock market sectors. Live Stock Market Sectors Watch to measure the performance against a relevant market sector.",
    keywords:
      "Indian Stock Sectors, All Stock Sectors, All Sector, Indian Market Sectors, Indian Sectors, Indian Stock Market Sectors, Stock Market Sectors, Different Sectors in Stock Market, All Sectors of Stock Market, Sector wise Performance Indian Stock Market",
    pathname: pageUrl,
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
