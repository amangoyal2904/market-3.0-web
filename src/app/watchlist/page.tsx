import { Metadata } from "next";
import WatchListClient from "./client";
import BreadCrumb from "@/components/BreadCrumb";

const pageTitle = "Watchlist | The Economic Time";
const pageDesc =
  "My Watchlist: Check you stocks last & recent price on The ET Markets. Get all the latest information about your stocks, prev. close, stocks price change, stocks percentage change, low & High stocks and more.";
const pageUrl = "https://economictimes.indiatimes.com/watchlist";
const imageUrl = "https://img.etimg.com/photo/msid-65498029/et-logo.jpg";
export const metadata: Metadata = {
  title: pageTitle,
  description: pageDesc,
  keywords: "watchlist, et, etmarkets",
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

const MyWatchList = async () => {
  const breadCrumbObj = [{ label: "Watchlist", redirectUrl: "" }];
  return (
    <>
      <WatchListClient />
      <BreadCrumb pagePath="/watchlist" pageName={breadCrumbObj} />
    </>
  );
};

export default MyWatchList;
