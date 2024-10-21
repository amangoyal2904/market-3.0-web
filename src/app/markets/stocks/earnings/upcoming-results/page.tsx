import UpcomingResultsClintPage from "./client";
import BreadCrumb from "@/components/BreadCrumb";
import { headers, cookies } from "next/headers";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import { fetchSelectedFilter, saveLogs } from "@/utils/utility";
import DfpAds from "@/components/Ad/DfpAds";
import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata } from "next";
import { getCustomViewTable } from "@/utils/customViewAndTables";
import {
  commonGetAPIHandler,
  commonPostAPIHandler,
} from "../../../../../utils/screeners";
import APIS_CONFIG from "@/network/api_config.json";
import service from "@/network/service";
import { APP_ENV } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const meta = {
    title: "Upcoming Results",
    desc: "Upcoming Results, Earnings Dashboard, Check upcoming results, Check Latest Results, Upcoming Performance, Check live results update at The Economic Times",
    keywords:
      "Upcoming Results, Results, Upcoming Result, Result Calendar, Recently declared, Upcoming Performnace, Live results, Result dashboard, Upcoming earnings, Latest Results, Stock Market, Q1 Results , Q2 Results , Q3 Results, Q4 Results",
    pathname: `/markets/stocks/upcoming-results`,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const UpcomingResultsPage = async (props: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const searchParamCompanyID = props?.searchParams?.companyid || "";

  const selectedFilter = await fetchSelectedFilter(0);

  const _upcomingCalendar = await commonGetAPIHandler(
    `SCREENER_CALENDAR`,
    `?apiType=upcoming`,
  );
  const bodyPayloadUpcomingCompaniesQuery = {
    date: _upcomingCalendar?.calendarData?.[0]?.date || "",
    filterType: "companyId",
    filterValue: [searchParamCompanyID],
    pageSize: 2,
    pageNo: 1,
    deviceType: "web",
    sort: [{ field: "R1MonthReturn", order: "DESC" }],
  };
  const _upcomingCompaniesQuery =
    searchParamCompanyID !== ""
      ? await commonPostAPIHandler(
          `UPCOMING_COMPANIES`,
          bodyPayloadUpcomingCompaniesQuery,
        )
      : "";
  const bodyPayloadUpcomingCompanies = {
    date: _upcomingCalendar?.calendarData?.[0]?.date || "",
    filterType: "index",
    filterValue: [],
    pageSize: 4,
    pageNo: 1,
    deviceType: "web",
    sort: [],
  };
  const _upcomingCompanies = await commonPostAPIHandler(
    `UPCOMING_COMPANIES`,
    bodyPayloadUpcomingCompanies,
  );
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
  const topNewsData = await fetchTopNews();

  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;
  const isprimeuser = cookieStore.get("isprimeuser")?.value === "true";
  const payloadFilterType =
    searchParamCompanyID && searchParamCompanyID !== ""
      ? [searchParamCompanyID]
      : [];
  const bodyPayload = {
    date:
      searchParamCompanyID && searchParamCompanyID !== ""
        ? ""
        : _upcomingCalendar?.calendarData?.[0]?.date,
    filterType:
      searchParamCompanyID && searchParamCompanyID !== ""
        ? "companyId"
        : "index",
    filterValue: payloadFilterType,
    pageSize: 40,
    pageNo: 1,
    deviceType: "web",
    sort: [],
  };
  const { tableHeaderData, tableData, pageSummary, unixDateTime, payload } =
    await getCustomViewTable({
      bodyParams: bodyPayload,
      isprimeuser,
      ssoid,
      apiType: "UPCOMING_COMPANIES",
    });

  const upcoingData = {
    data: "coming soon...",
    upcomingCalendar: _upcomingCalendar?.calendarData || [],
    upcomingCompanies: _upcomingCompanies || {},
    topNewsData: topNewsData,
    payload: {
      upcomingResultTablePayload: bodyPayloadUpcomingCompanies,
      queryPayload: bodyPayloadUpcomingCompaniesQuery,
    },
    props,
    _upcomingCompaniesQuery,
  };
  return (
    <>
      <UpcomingResultsClintPage
        data={upcoingData}
        selectedFilter={selectedFilter}
        tableData={tableData}
        tableHeaderData={tableHeaderData}
        payload={payload}
        pageSummary={pageSummary}
        unixDateTime={unixDateTime}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Upcoming Results", redirectUrl: "" }]}
      />
      <br />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
    </>
  );
};
export default UpcomingResultsPage;
