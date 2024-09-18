import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata } from "next";
import React from "react";
import BreadCrumb from "@/components/BreadCrumb";
import { cookies, headers } from "next/headers";
import { getPastChartPattern } from "../utilities";
import PastChartPatternsClient from "./clients";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: "Past Patterns",
    desc: "MarketMood: Know the market sentiments. Check the percentage or count of stocks in the selected index with value above the technical indicators",
    keywords:
      "MarketMood, Market Sentiments, stocks in different indices, Stock Analysis, premium feature, ETMarkets",
    pathname: pageUrl,
    index: false,
  };
  return fnGenerateMetaData(meta);
}

const PastChartPatterns = async () => {
  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;
  const ticketid = cookieStore.get("TicketId")?.value;
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";

  const payload = {
    patternType: "bullish",
    filterType: "index",
    filterValue: [],
    timeFrame: "1m",
  };

  const data = await getPastChartPattern(payload, ssoid, ticketid);

  return (
    <>
      <PastChartPatternsClient
        response={data}
        responsePayload={payload}
        pageUrl={pageUrl}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Past Performance", redirectUrl: "" }]}
      />
    </>
  );
};

export default PastChartPatterns;
