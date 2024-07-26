import { getFiiDiiData, getFiiDiiSummaryData } from "@/utils/utility";
import FiiDiiActivitySubPagesClients from "./clients";
import { notFound } from "next/navigation";
import BreadCrumb from "@/components/BreadCrumb";
import { headers } from "next/headers";

const typeToFunctionMap: { [key: string]: () => Promise<any> } = {
  "cash-provisional": getFiiDiiData.bind(null, "FIIDII_CASHPROVISIONAL", {
    filterType: "daily",
  }),
  "fii-cash": getFiiDiiData.bind(null, "FIIDII_FIICASH", {
    filterType: "daily",
  }),
  "fii-fno": getFiiDiiData.bind(null, "FIIDII_FANDOCASH", {
    filterType: "daily",
    apiType: "index",
  }),
  "mf-cash": getFiiDiiData.bind(null, "FIIDII_MFCASH", { filterType: "daily" }),
};

const typeToSummaryParamMap: { [key: string]: string } = {
  "cash-provisional": "cash",
  "fii-cash": "fiicash",
  "fii-fno": "foindex",
  "mf-cash": "mfcash",
};

const FiiDiiActivitySubPages = async ({ params }: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const type = params.slug;
  const possibleTypes = Object.keys(typeToFunctionMap);
  if (!possibleTypes.includes(type)) {
    notFound();
  }

  const responseGetter = typeToFunctionMap[type];
  const response: any = await responseGetter();
  const { listData } = response.datainfo.data;

  const summaryParam = typeToSummaryParamMap[type];
  const summaryResponse: any = await getFiiDiiSummaryData(summaryParam);
  const summaryData = summaryResponse;

  const tabData = [
    { label: "Cash Provisional", key: "cash-provisional" },
    { label: "FII Cash", key: "fii-cash" },
    { label: "FII F&O", key: "fii-fno" },
    { label: "MF Cash", key: "mf-cash" },
  ];

  const matchingLabel = tabData.find((tab) => tab.key === type)?.label || "";

  return (
    <>
      <FiiDiiActivitySubPagesClients
        summaryData={summaryData}
        summaryType={typeToSummaryParamMap[type]}
        listData={listData}
        type={type}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: matchingLabel, redirectUrl: "" }]}
      />
    </>
  );
};

export default FiiDiiActivitySubPages;
