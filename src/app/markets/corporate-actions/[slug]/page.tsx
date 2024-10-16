import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

import { fnGenerateMetaData, getCorporateActionsData } from "@/utils/utility";
import CorporateActionsSubPageClients from "./client";
import PageHeaderSection from "@/components/PageHeader";

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
    pageNo: 1,
    marketcap: "All",
    filterValue: ["2371"],
    pageSize: 10,
    marketactionType: "bonus",
    duration: "default",
    filterType: "index",
  }),
  "board-meetings": getCorporateActionsData.bind(null, "boardmeetingsnew", {
    pageNo: 1,
    marketcap: "All",
    pageSize: 10,
    marketactionType: "boardmeetingsnew",
    duration: "default",
    filterType: "index",
  }),
  "agm-egm": getCorporateActionsData.bind(null, "AGMMeetingnew", {
    pageNo: 1,
    marketcap: "All",
    filterValue: ["2371"],
    pageSize: 10,
    marketactionType: "AGMMeeting",
    duration: "default",
    filterType: "index",
  }),
  splits: getCorporateActionsData.bind(null, "splitnew", {
    pageNo: 1,
    marketcap: "All",
    filterValue: ["2371"],
    pageSize: 10,
    marketactionType: "split",
    duration: "default",
    filterType: "index",
  }),
  rights: getCorporateActionsData.bind(null, "rightnew", {
    pageNo: 1,
    marketcap: "All",
    filterValue: ["2371"],
    pageSize: 10,
    marketactionType: "right",
    duration: "default",
    filterType: "index",
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

  /* const summaryParam = typeToSummaryParamMap[type];
  const summaryResponse: any = await getFiiDiiSummaryData(summaryParam);
  const summaryData = summaryResponse; */

  return (
    <>
      <PageHeaderSection
        heading="Corporate Actions"
        description="Stay ahead of market-moving events! Track key corporate actions like Mergers, Buybacks, Dividends, Spinoffs, Reverse Stock Splits, Bonus Issues, and Right Issues with our comprehensive insights."
      />
      <CorporateActionsSubPageClients
        summaryType={typeToSummaryParamMap[type]}
        type={type}
        listData={response?.searchresult}
      />
    </>
  );
};

export default CorporateActionsSubPage;
