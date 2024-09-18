import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import React from "react";
import { getPastChartPatternPerformance } from "../../utilities";
import PastPerformanceClientSlug from "./clients";
import BreadCrumb from "@/components/BreadCrumb";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: "Past Performance",
    desc: "MarketMood: Know the market sentiments. Check the percentage or count of stocks in the selected index with value above the technical indicators",
    keywords:
      "MarketMood, Market Sentiments, stocks in different indices, Stock Analysis, premium feature, ETMarkets",
    pathname: pageUrl,
    index: false,
  };
  return fnGenerateMetaData(meta);
}

const PastPerformanceSlug = async ({ params }: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;
  const ticketid = cookieStore.get("TicketId")?.value;
  const patternType = !!params.performanceSlug
    ? params.performanceSlug
    : "bullish";

  const payload = {
    patternType,
    filterValue: [],
    filterType: "index",
    pageNo: 1,
    pageSize: 10,
    timeFrame: "1m",
  };

  const data = await getPastChartPatternPerformance(payload, ssoid, ticketid);

  return (
    <>
      <PastPerformanceClientSlug
        response={data}
        responsePayload={payload}
        pageUrl={pageUrl}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[
          {
            label: "Past Performance",
            redirectUrl: "/stocks/chart-patterns/past-performance",
          },
          { label: data?.patternName, redirectUrl: "" },
        ]}
      />
    </>
  );
};

export default PastPerformanceSlug;
