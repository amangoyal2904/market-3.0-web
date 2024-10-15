import {
  fnGenerateMetaData,
  getFiiDiiData,
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
  dividend: getFiiDiiData.bind(null, "FIIDII_CASHPROVISIONAL", {
    filterType: "daily",
  }),
  bonus: getFiiDiiData.bind(null, "FIIDII_FIICASH", {
    filterType: "daily",
  }),
  "board-meetings": getFiiDiiData.bind(null, "FIIDII_FANDOCASH", {
    filterType: "daily",
    apiType: "index",
  }),
  "agm-egm": getFiiDiiData.bind(null, "FIIDII_MFCASH", { filterType: "daily" }),
  splits: getFiiDiiData.bind(null, "FIIDII_MFCASH", { filterType: "daily" }),
  rights: getFiiDiiData.bind(null, "FIIDII_MFCASH", { filterType: "daily" }),
};

const typeToSummaryParamMap: { [key: string]: string } = {
  "cash-provisional": "cash",
  "fii-cash": "fiicash",
  "fii-fno": "foindex",
  "mf-cash": "mfcash",
};

const CorporateActionsSubPage = async ({ params }: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const type = params.slug;
  const possibleTypes = Object.keys(typeToFunctionMap);
  if (!possibleTypes.includes(type)) {
    notFound();
  }

  /* const responseGetter = typeToFunctionMap[type];
        const response: any = await responseGetter();
        const { listData } = response.datainfo.data;
        
        const summaryParam = typeToSummaryParamMap[type];
        const summaryResponse: any = await getFiiDiiSummaryData(summaryParam);
        const summaryData = summaryResponse; */
  console.log("Sub Page Called");

  return (
    <>
      <CorporateActionsSubPageClients
        summaryType={typeToSummaryParamMap[type]}
        type={type}
      />
      {/* summaryData={summaryData}
          listData={listData} */}
    </>
  );
};

export default CorporateActionsSubPage;
