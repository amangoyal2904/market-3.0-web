import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata } from "next";
import React from "react";
import BreadCrumb from "@/components/BreadCrumb";
import { headers } from "next/headers";
import { getExploreChartPattern } from "../utilities";
import PastChartPatternsClient from "./clients";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: "Explore Patterns",
    desc: "MarketMood: Know the market sentiments. Check the percentage or count of stocks in the selected index with value above the technical indicators",
    keywords:
      "MarketMood, Market Sentiments, stocks in different indices, Stock Analysis, premium feature, ETMarkets",
    pathname: pageUrl,
    index: false,
  };
  return fnGenerateMetaData(meta);
}

const ExploreChartPatterns = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";

  const data = await getExploreChartPattern();

  return (
    <>
      <PastChartPatternsClient response={data} pageUrl={pageUrl} />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Explore by Patterns", redirectUrl: "" }]}
      />
    </>
  );
};

export default ExploreChartPatterns;
