import DeclaredResultsClintPage from "./client";
import BreadCrumb from "@/components/BreadCrumb";
import { headers } from "next/headers";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import { fetchSelectedFilter, saveLogs } from "@/utils/utility";
import DfpAds from "@/components/Ad/DfpAds";
import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata } from "next";
import {
  commonGetAPIHandler,
  commonPostAPIHandler,
} from "../../../../utils/screeners";
import APIS_CONFIG from "@/network/api_config.json";
import service from "@/network/service";
import { APP_ENV } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const meta = {
    title: "Declared Results",
    desc: "Declared Results, Earnings Dashboard, Check upcoming results, Check Latest Results, Declared Performance, Check live results update at The Economic Times",
    keywords:
      "Declared Results, Results, Declared Result, Result Calendar, Recently declared, Declared Performnace, Live results, Result dashboard, Declared earnings, Latest Results, Stock Market, Q1 Results , Q2 Results , Q3 Results, Q4 Results",
    pathname: `/markets/stocks/declared-results`,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const DeclaredResultsPage = async (props: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const searchParamCompanyID = props?.searchParams?.companyid || "";

  const selectedFilter = await fetchSelectedFilter(0);
  const _declaredCalendar = await commonGetAPIHandler(
    `SCREENER_CALENDAR`,
    `?apiType=declared`,
  );
  const bodyPayloadDeclaredCompaniesQuery = {
    date: "",
    filterType: "companyId",
    filterValue: [searchParamCompanyID],
    apiType: "latest-results",
    pageSize: 4,
    pageNo: 1,
  };
  const bodyPayloadDeclaredCompanies = {
    date: _declaredCalendar?.[0]?.date || "",
    filterType: "index",
    filterValue: [],
    apiType: "latest-results",
    pageSize: 10,
    pageNo: 1,
  };
  const _declaredCompaniesQuery =
    searchParamCompanyID !== ""
      ? await commonPostAPIHandler(
          `DECLARED_COMPANIES`,
          bodyPayloadDeclaredCompaniesQuery,
        )
      : "";
  const _declaredCompanies = await commonPostAPIHandler(
    `DECLARED_COMPANIES`,
    bodyPayloadDeclaredCompanies,
  );
  const upcoingData = {
    data: "coming soon...",
    declaredCalendar: _declaredCalendar || [],
    declaredCompanies: _declaredCompanies || {},
    _declaredCompaniesQuery,
    payload: {
      declareResultTablePayload: bodyPayloadDeclaredCompanies,
    },
    props,
  };
  return (
    <>
      <DeclaredResultsClintPage
        data={upcoingData}
        selectedFilter={selectedFilter}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Declared", redirectUrl: "" }]}
      />
      <br />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
    </>
  );
};
export default DeclaredResultsPage;
