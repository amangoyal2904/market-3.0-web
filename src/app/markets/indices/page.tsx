import { getAllIndices } from "@/utils/utility";
import { Metadata } from "next";
import IndicesClient from "./client";
import tableConfig from "@/utils/tableConfig.json";
import BreadCrumb from "@/components/BreadCrumb";
import { headers } from "next/headers";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import DfpAds from "@/components/Ad/DfpAds";

const pageTitle =
  "Indian Market Indices, Live Index Watch, Market Indexes | The Economic Time";
const pageDesc =
  "Indian Market Indices Live - Checkout Latest & comprehensive value all major stock market indices. Live NSE / BSE Indices Watch to measure the performance against a relevant market index.";
const pageUrl = "https://economictimes.indiatimes.com/markets/indices";
const imageUrl = "https://img.etimg.com/photo/msid-65498029/et-logo.jpg";
export const metadata: Metadata = {
  title: pageTitle,
  description: pageDesc,
  keywords:
    "Indian Indices, All Indices, All Index, Indian Market Indices, Indian Stock Indices, Indian Stock Market Indices, Stock Market Indices",
  metadataBase: new URL(pageUrl),
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: pageUrl,
    siteName: "ET Markets",
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 628,
      },
    ],
    locale: "en-IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDesc,
    creator: "@etmarkets",
    images: [imageUrl],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

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
      <br />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
    </>
  );
};

export default Indices;
