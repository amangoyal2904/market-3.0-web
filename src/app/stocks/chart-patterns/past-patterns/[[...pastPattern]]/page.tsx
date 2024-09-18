import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata } from "next";
import React from "react";
import { getNewChartPattern } from "../../utilities";
import BreadCrumb from "@/components/BreadCrumb";
import { cookies, headers } from "next/headers";
import ChartPatternsClient from "./clients";

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

const PastPatterns = async ({ params }: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";

  const searchParams = new URLSearchParams(
    headersList.get("x-searchparam") || "",
  );

  const timeFrame = searchParams.get("timeframe");

  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;
  const ticketid = cookieStore.get("TicketId")?.value;
  const patternType = !!params.pastPattern ? params.pastPattern[0] : "bullish";

  const payload = {
    patternType: patternType,
    filterValue: [],
    filterType: "index",
    pageNo: 1,
    pageSize: 12,
    timeFrame: !!timeFrame ? timeFrame : "1m",
  };

  const data = await getNewChartPattern(payload, ssoid, ticketid);

  return (
    <>
      <ChartPatternsClient
        response={data}
        responsePayload={payload}
        pageUrl={pageUrl}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[
          {
            label: "Past Patterns",
            redirectUrl: "/stocks/chart-patterns/past-patterns",
          },
          {
            label: data?.latestPatternRequestDto?.patternName,
            redirectUrl: "",
          },
        ]}
      />
    </>
  );
};

export default PastPatterns;
