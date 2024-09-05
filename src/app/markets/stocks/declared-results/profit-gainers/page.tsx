import DeclaredResultsProfitGainersClient from "./client";
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
} from "../../../../../utils/screeners";
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

const DeclaredResultsProfitGainers = async (props: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const selectedFilter = await fetchSelectedFilter(0);
  const bodyPayloadDeclaredCompanies = {
    date: "",
    filterType: "index",
    filterValue: [],
    apiType: "profit-gainers",
    pageSize: 10,
    pageNo: 1,
  };

  const _declaredCompanies = await commonPostAPIHandler(
    `DECLARED_COMPANIES`,
    bodyPayloadDeclaredCompanies,
  );
  const upcoingData = {
    declaredCompanies: _declaredCompanies || {},
    payload: {
      declareResultTablePayload: bodyPayloadDeclaredCompanies,
    },
    props,
  };
  return (
    <>
      <DeclaredResultsProfitGainersClient
        data={upcoingData}
        selectedFilter={selectedFilter}
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
export default DeclaredResultsProfitGainers;
