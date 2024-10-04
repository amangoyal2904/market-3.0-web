import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata } from "next";
import React from "react";
import BreadCrumb from "@/components/BreadCrumb";
import { cookies, headers } from "next/headers";
import { getPastChartPattern } from "../utilities";
import PastChartPatternsClient from "./clients";
import ChartPatternHeader from "@/components/ChartPatterns/ChartPatternHeader";
import ChartPatternDisclaimer from "@/components/ChartPatterns/ChartPatternDisclaimer";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: "Past Performance",
    desc: "AI Chart Pattern automatically detects chart patterns in real-time and notifies you as soon as one forms. By eliminating the need for manual analysis, it helps traders act swiftly on accurate pattern recognition. Whether it’s a continuation or reversal pattern, the tool ensures you're always informed to make timely, data-driven trading decisions.",
    keywords:
      "ai chart patterns, bullish chart patterns, bearish chart patterns",
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
      <ChartPatternHeader description="AI Chart Pattern Past Performance provides insights into past patterns like Ascending Triangle, Symmetrical Triangle, and Falling Wedge, with quick summaries and performance metrics across various stocks" />
      <PastChartPatternsClient
        response={data}
        responsePayload={payload}
        pageUrl={pageUrl}
      />
      <ChartPatternDisclaimer />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Past Performance", redirectUrl: "" }]}
      />
    </>
  );
};

export default PastChartPatterns;
