import StocksEarningsClintPage from "./client";
import BreadCrumb from "@/components/BreadCrumb";
import { headers } from "next/headers";
import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata } from "next";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import { fetchSelectedFilter, saveLogs } from "@/utils/utility";
import DfpAds from "@/components/Ad/DfpAds";
import {
  commonGetAPIHandler,
  commonPostAPIHandler,
} from "../../../../utils/screeners";
import APIS_CONFIG from "@/network/api_config.json";
import service from "@/network/service";
import { APP_ENV } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const meta = {
    title: "Quarterly Results",
    desc: "Quarterly Results, Earnings Dashboard, Check upcoming results, Check Latest Results, Quarterly Performance, Check live results update at The Economic Times",
    keywords:
      "Quarterly Results, Results, Upcoming Result, Result Calendar, Recently declared, Quarterly Performnace, Live results, Result dashboard, Quarterly earnings, Latest Results, Stock Market, Q1 Results , Q2 Results , Q3 Results, Q4 Results",
    pathname: `/markets/stocks/earnings`,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const StocksEarningsPage = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";

  const fetchTopNews = async () => {
    try {
      const response = await service.get({
        url: `${(APIS_CONFIG as any)?.APIDOMAIN[APP_ENV]}?type=plist&msid=5766568`,
        params: {},
      });
      const data = response ? await response?.json() : {};
      const topNewsData =
        (data &&
          data.searchResult &&
          data.searchResult[0] &&
          data.searchResult[0].data) ||
        [];
      const topNewsFilteredData = topNewsData?.filter(
        (data: { type: string }) => data.type === "articleshow",
      );
      return topNewsFilteredData;
    } catch (e) {
      console.log("error in fetching top news", e);
      saveLogs({
        type: "Mercury",
        res: "error",
        msg: "Error in fetching top news data stocks earnings",
      });
      return [];
    }
  };

  const earningsSummary = await commonGetAPIHandler(`EARNINGS_SUMMARY`);

  const topSummaryDate = earningsSummary?.prevQuarterEndDate;
  const originalDate = new Date(topSummaryDate);
  const futureDate = new Date(
    originalDate.getTime() + 55 * 24 * 60 * 60 * 1000,
  ); // for add 55 days
  const todayDate = new Date();
  const isFutureDateGreater = futureDate < todayDate;
  const dateCollection = {
    topSummaryDate,
    originalDate,
    futureDate,
    todayDate,
    isFutureDateGreater,
  };

  const _declaredCalendar = await commonGetAPIHandler(
    `SCREENER_CALENDAR`,
    `?apiType=declared`,
  );
  const _upcomingCalendar = await commonGetAPIHandler(
    `SCREENER_CALENDAR`,
    `?apiType=upcoming`,
  );

  const bodyPayloadUpcomingCompanies = {
    date: _upcomingCalendar?.[0]?.date || "",
    filterType: "index",
    filterValue: [],
    pageSize: 8,
    pageNo: 1,
    deviceType: "web",
    sort: [{ field: "R1MonthReturn", order: "DESC" }],
  };
  const bodyPayloadDeclaredCompanies = {
    date: isFutureDateGreater ? "" : _declaredCalendar?.[0]?.date || "",
    filterType: "index",
    filterValue: [],
    apiType: isFutureDateGreater ? "sales-gainers" : "latest-results",
    pageSize: 6,
    pageNo: 1,
  };
  const bodyPayloadSector = {
    apiType: "top-performing",
    pageSize: 10,
    pageNo: 1,
    sort: [{ field: "sectorPATQoqAvg", order: "DESC" }],
  };
  const bodyPayloadSectorUnder = {
    apiType: "under-performing",
    pageSize: 10,
    pageNo: 1,
    sort: [{ field: "sectorPATQoqAvg", order: "DESC" }],
  };
  const _upcomingCompanies = await commonPostAPIHandler(
    `UPCOMING_COMPANIES`,
    bodyPayloadUpcomingCompanies,
  );

  const _declaredCompanies = await commonPostAPIHandler(
    `DECLARED_COMPANIES`,
    bodyPayloadDeclaredCompanies,
  );

  const _topSector = await commonPostAPIHandler(
    `SECTOR_AGGREGATE`,
    bodyPayloadSector,
  );
  const _underSector = await commonPostAPIHandler(
    `SECTOR_AGGREGATE`,
    bodyPayloadSectorUnder,
  );

  const selectedFilter = await fetchSelectedFilter(0);
  const topNewsData = await fetchTopNews();
  const _earningScreeners = await commonGetAPIHandler(
    `EARNINGS_SCREENERS`,
    `?collectiontypeid=6&screenercount=10&list=false`,
  );
  const earningData = {
    topSummaryCardData: earningsSummary || {},
    declaredCalendar: _declaredCalendar || [],
    upcomingCalendar: _upcomingCalendar || [],
    upcomingCompanies: _upcomingCompanies || {},
    declaredCompanies: _declaredCompanies || {},
    topNewsData: topNewsData,
    sectorData: {
      topSector: _topSector?.sectorAggregateData || [],
      underSector: _underSector?.sectorAggregateData || [],
    },
    earningScreeners: _earningScreeners || {},
    payload: {
      upcomingResultTablePayload: bodyPayloadUpcomingCompanies,
      declareResultTablePayload: bodyPayloadDeclaredCompanies,
    },
  };
  return (
    <>
      <StocksEarningsClintPage
        data={earningData}
        selectedFilter={selectedFilter}
        dateCollection={dateCollection}
        activeResultValue={`${isFutureDateGreater ? "sales-gainers" : "latest-results"}`}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Earnings", redirectUrl: "" }]}
      />
      <br />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
    </>
  );
};
export default StocksEarningsPage;
