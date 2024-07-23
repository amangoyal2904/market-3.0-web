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
        pageName={[{ label: type, redirectUrl: "" }]}
      />
    </>
  );
};

export default FiiDiiActivitySubPages;
