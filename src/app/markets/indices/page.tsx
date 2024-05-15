import { fnGenerateMetaData, getAllIndices } from "@/utils/utility";
import { Metadata, ResolvingMetadata } from "next";
import IndicesClient from "./client";
import tableConfig from "@/utils/tableConfig.json";
import BreadCrumb from "@/components/BreadCrumb";
import { headers } from "next/headers";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import DfpAds from "@/components/Ad/DfpAds";
import dynamic from "next/dynamic";
const PageRefresh = dynamic(() => import("@/components/PageRefresh"), {
  ssr: false,
});

export async function generateMetadata(
  { searchParams }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";

  const meta = {
    title: "Indian Market Indices, Live Index Watch, Market Indexes",
    desc: "Indian Market Indices Live - Checkout Latest & comprehensive value all major stock market indices. Live NSE / BSE Indices Watch to measure the performance against a relevant market index.",
    keywords:
      "Indian Indices, All Indices, All Index, Indian Market Indices, Indian Stock Indices, Indian Stock Market Indices, Stock Market Indices",
    pathname: pageUrl,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const Indices = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const { tableHeaderData, tableData, exchange, unixDateTime } =
    await getAllIndices("nse", "", "DESC");

  return (
    <>
      <IndicesClient
        tableHeaderData={tableHeaderData}
        tableData={tableData}
        exchange="nse"
        tableConfig={tableConfig["indicesListing"]}
        unixDateTime={unixDateTime}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Indices", redirectUrl: "" }]}
      />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
      <PageRefresh refreshTime={180000} />
    </>
  );
};

export default Indices;
