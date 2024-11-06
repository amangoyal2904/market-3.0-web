import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata } from "next";
import React from "react";
import { getNewChartPattern, getPatternDescriptionText } from "../../utilities";
import BreadCrumb from "@/components/BreadCrumb";
import { cookies, headers } from "next/headers";
import ChartPatternsClient from "./clients";
import Blocker from "@/components/Blocker";
import ChartPatternDisclaimer from "@/components/ChartPatterns/ChartPatternDisclaimer";

const getCommonData = async (params: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";

  const searchParams = new URLSearchParams(
    headersList.get("x-searchparam") || "",
  );

  const timeFrame = searchParams.get("timeframe");

  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;
  const ticketid = cookieStore.get("TicketId")?.value;
  const isPrime = cookieStore.get("isprimeuser")?.value;
  const patternType = !!params.pastPattern ? params.pastPattern[0] : "bullish";

  const payload = {
    patternType: patternType,
    filterValue: [],
    filterType: "index",
    ideaType: "all",
    pageNo: 1,
    pageSize: 12,
    sortBy: "closedPatternReturns",
    timeFrame: !!timeFrame ? timeFrame : "6m",
  };

  const data = await getNewChartPattern(payload, ssoid, ticketid, isPrime);
  return { data, payload, pageUrl };
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
  try {
    const { data, pageUrl } = await getCommonData(params);

    const patternName = params?.pastPattern
      ? `${data?.latestPatternRequestDto?.patternName} Past Patterns`
      : "Past Patterns";

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

const PastPatterns = async ({ params }: any) => {
  try {
    const { data, payload, pageUrl } = await getCommonData(params);

    // Check if the API response has status 404
    if (!data || data?.status === 404) {
      return <Blocker type={"apiFailed"} />;
    }

    const patternDescription = (() => {
      const pattern = params?.pastPattern?.[0]?.toLowerCase(); // Safeguard and normalize pattern value

      return getPatternDescriptionText(pattern);
    })();

    return (
      <>
        <ChartPatternsClient
          patternDesc={patternDescription}
          response={data}
          responsePayload={payload}
          pageUrl={pageUrl}
        />
        <ChartPatternDisclaimer />
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
  } catch (error) {
    return <Blocker type={"apiFailed"} />;
  }
};

export default PastPatterns;
