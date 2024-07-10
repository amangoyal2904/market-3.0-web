import { fnGenerateMetaData, getAllIndices } from "@/utils/utility";
import { Metadata } from "next";
import IndicesClient from "./client";
import tableConfig from "@/utils/tableConfig.json";
import BreadCrumb from "@/components/BreadCrumb";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import DfpAds from "@/components/Ad/DfpAds";
import dynamic from "next/dynamic";
import { Fragment } from "react";
const PageRefresh = dynamic(() => import("@/components/PageRefresh"), {
  ssr: false,
});

const pageUrl = "/markets/indices";

export async function generateMetadata(): Promise<Metadata> {
  const meta = {
    title: "Indian Market Indices, Live Index Watch, Market Indexes",
    desc: "Indian Market Indices Live - Checkout Latest & comprehensive value all major stock market indices. Live NSE / BSE Indices Watch to measure the performance against a relevant market index.",
    keywords:
      "Indian Indices, All Indices, All Index, Indian Market Indices, Indian Stock Indices, Indian Stock Market Indices, Stock Market Indices",
    pathname: pageUrl,
  };
  return fnGenerateMetaData(meta);
}

const Indices = async () => {
  const { tableHeaderData, tableData, exchange, unixDateTime } =
    await getAllIndices("nse", "", "DESC");

  return (
    <Fragment key="indices">
      <IndicesClient
        tableHeaderData={tableHeaderData}
        tableData={tableData}
        exchange={exchange}
        tableConfig={tableConfig["indicesListing"]}
        unixDateTime={unixDateTime}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Indices", redirectUrl: "" }]}
      />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
      <PageRefresh refreshTime={180000} />
    </Fragment>
  );
};

export default Indices;
