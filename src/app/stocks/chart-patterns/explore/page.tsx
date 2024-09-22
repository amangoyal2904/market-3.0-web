import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata } from "next";
import React from "react";
import BreadCrumb from "@/components/BreadCrumb";
import { headers } from "next/headers";
import { getExploreChartPattern } from "../utilities";
import PastChartPatternsClient from "./clients";
import ChartPatternHeader from "@/components/ChartPatterns/ChartPatternHeader";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: "Explore Patterns | AI Chart Patterns",
    desc: "AI Chart Pattern automatically detects chart patterns in real-time and notifies you as soon as one forms. By eliminating the need for manual analysis, it helps traders act swiftly on accurate pattern recognition. Whether it’s a continuation or reversal pattern, the tool ensures you're always informed to make timely, data-driven trading decisions..",
    keywords:
      "ai chart patterns, bullish chart patterns, bearish chart patterns",
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
      <ChartPatternHeader />
      <PastChartPatternsClient response={data} pageUrl={pageUrl} />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Explore by Patterns", redirectUrl: "" }]}
      />
    </>
  );
};

export default ExploreChartPatterns;
