import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata } from "next";
import React from "react";
import { getNewChartPattern } from "../utilities";
import BreadCrumb from "@/components/BreadCrumb";
import { cookies, headers } from "next/headers";
import ChartPatternsClient from "./clients";
import Blocker from "@/components/Blocker";
import ChartPatternHeader from "@/components/ChartPatterns/ChartPatternHeader";

const getCommonData = async (params: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;
  const ticketid = cookieStore.get("TicketId")?.value;
  const patternType = params?.latestSlug ? params.latestSlug[0] : "bullish";

  const payload = {
    patternType,
    filterValue: [],
    filterType: "index",
    pageNo: 1,
    pageSize: 12,
  };

  const data = await getNewChartPattern(payload, ssoid, ticketid);
  return { data, payload, pageUrl };
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
  try {
    const { data, pageUrl } = await getCommonData(params);
    const patternName = params?.latestSlug
      ? `${data?.latestPatternRequestDto?.patternName} New Patterns`
      : "AI Chart Patterns";

    const meta = {
      title: `${patternName}`,
      desc: "AI Chart Pattern automatically detects chart patterns in real-time and notifies you as soon as one forms. By eliminating the need for manual analysis, it helps traders act swiftly on accurate pattern recognition. Whether it’s a continuation or reversal pattern, the tool ensures you're always informed to make timely, data-driven trading decisions.",
      keywords:
        "ai chart patterns, bullish chart patterns, bearish chart patterns",
      pathname: pageUrl,
    };
    return fnGenerateMetaData(meta);
  } catch (error) {
    return fnGenerateMetaData({
      title: "Error",
      desc: "An error occurred",
      keywords: "",
      pathname: "",
    });
  }
}

const ChartPatterns = async ({ params }: any) => {
  try {
    const { data, payload, pageUrl } = await getCommonData(params);

    // Check if the API response has status 404
    if (!data || data?.status === 404) {
      return <Blocker type={"apiFailed"} />;
    }

    const patternDescription = (() => {
      const pattern = params?.latestSlug?.[0]?.toLowerCase(); // Safeguard and normalize pattern value

      switch (pattern) {
        case "ascending-triangle":
          return "An <b>ascending triangle</b> is a bullish pattern with rising lows and flat resistance, signaling a potential breakout. Here are new chart patterns based on it.";
        case "symmetrical-triangle":
          return "A <b>symmetrical triangle</b> is a neutral pattern with converging trendlines, signaling a potential breakout in either direction. Here are new chart patterns based on it.";
        case "falling-wedge":
          return "A <b>falling wedge</b> is a bullish pattern with converging downward trendlines, indicating a potential breakout to the upside. Here are new chart patterns based on it.";
        case "rising-channel":
          return "A <b>rising channel</b> is a bullish pattern with parallel upward trendlines, suggesting continued upward momentum. Here are new chart patterns based on it.";
        default:
          return "AI Chart Pattern Past Performance provides insights into past patterns like Ascending Triangle, Symmetrical Triangle, and Falling Wedge, with quick summaries and performance metrics across various stocks";
      }
    })();

    return (
      <>
        <ChartPatternHeader description={patternDescription} />
        <ChartPatternsClient
          response={data}
          responsePayload={payload}
          pageUrl={pageUrl}
        />
        <BreadCrumb
          pagePath={pageUrl}
          pageName={[
            {
              label: data?.latestPatternRequestDto?.patternName || "Patterns",
              redirectUrl: "",
            },
          ]}
        />
      </>
    );
  } catch (error) {
    return (
      <>
        <Blocker type={"apiFailed"} />
      </>
    );
  }
};

export default ChartPatterns;
