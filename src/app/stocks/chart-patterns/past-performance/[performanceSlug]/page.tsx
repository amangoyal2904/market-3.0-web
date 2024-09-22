import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import React from "react";
import { getPastChartPatternPerformance } from "../../utilities";
import PastPerformanceClientSlug from "./clients";
import BreadCrumb from "@/components/BreadCrumb";
import Blocker from "@/components/Blocker";
import ChartPatternHeader from "@/components/ChartPatterns/ChartPatternHeader";

const getCommonData = async (params: any) => {
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
  return { data, payload, pageUrl };
};
export async function generateMetadata({ params }: any): Promise<Metadata> {
  try {
    const { data, pageUrl } = await getCommonData(params);
    const meta = {
      title: `${data?.patternName} Past Performance`,
      desc: "AI Chart Pattern automatically detects chart patterns in real-time and notifies you as soon as one forms. By eliminating the need for manual analysis, it helps traders act swiftly on accurate pattern recognition. Whether it’s a continuation or reversal pattern, the tool ensures you're always informed to make timely, data-driven trading decisions.",
      keywords:
        "ai chart patterns, bullish chart patterns, bearish chart patterns",
      pathname: pageUrl,
      index: false,
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

const PastPerformanceSlug = async ({ params }: any) => {
  try {
    const { data, payload, pageUrl } = await getCommonData(params);

    // Check if the API response has status 404
    if (!data || data?.status === 404) {
      return <Blocker type={"apiFailed"} />;
    }

    return (
      <>
        <ChartPatternHeader />
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
  } catch (error) {
    return <Blocker type={"apiFailed"} />;
  }
};

export default PastPerformanceSlug;
