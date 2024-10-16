import {
  fnGenerateMetaData,
  getCorporateActionsData,
  getFiiDiiSummaryData,
} from "@/utils/utility";
import CorporateActionsSubPageClients from "./client";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: "Corporate Actions",
    desc: "Corporate Actions",
    keywords: "Corporate Actions, Stocks Market",
    pathname: pageUrl,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const typeToFunctionMap: { [key: string]: () => Promise<any> } = {
  dividend: getCorporateActionsData.bind(null, "dividendnew", {
    pageNo: 1,
    marketcap: "All",
    filterValue: ["14034"],
    pageSize: 10,
    marketactionType: "dividend",
    duration: "default",
    filterType: "company",
  }),
  bonus: getCorporateActionsData.bind(null, "bonusnew", {
    filterType: "daily",
  }),
  "board-meetings": getCorporateActionsData.bind(null, "boardmeetingsnew", {
    filterType: "daily",
    apiType: "index",
  }),
  "agm-egm": getCorporateActionsData.bind(null, "AGMMeetingnew", {
    filterType: "daily",
  }),
  splits: getCorporateActionsData.bind(null, "splitnew", {
    filterType: "daily",
  }),
  rights: getCorporateActionsData.bind(null, "rightnew", {
    filterType: "daily",
  }),
};

const typeToSummaryParamMap: { [key: string]: string } = {
  "cash-provisional": "cash",
  "fii-cash": "fiicash",
  "fii-fno": "foindex",
  "mf-cash": "mfcash",
};

const CorporateActionsSubPage = async ({ params }: any) => {
  const type = params.slug;
  // console.log("Sub Page Called", type);
  const possibleTypes = Object.keys(typeToFunctionMap);
  if (!possibleTypes.includes(type)) {
    notFound();
  }

  const responseGetter = typeToFunctionMap[type];
  const response: any = await responseGetter();
  const { searchresult, pagesummary } = response;

  /* const summaryParam = typeToSummaryParamMap[type];
  const summaryResponse: any = await getFiiDiiSummaryData(summaryParam);
  const summaryData = summaryResponse; */

  return (
    <>
      <CorporateActionsSubPageClients
        summaryType={typeToSummaryParamMap[type]}
        type={type}
        listData={searchresult}
      />
      {/* summaryData={summaryData}
       */}
    </>
  );
};

export default CorporateActionsSubPage;
