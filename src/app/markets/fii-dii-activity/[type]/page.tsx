import {
  getCashData,
  getFandOCashData,
  getFiiCashData,
  getMfCashData,
} from "@/utils/utility";
import FiiDiiActivitySubPagesClients from "./clients";
import { notFound } from "next/navigation";
import BreadCrumb from "@/components/BreadCrumb";
import { headers } from "next/headers";

const typeToFunctionMap: { [key: string]: () => Promise<any> } = {
  "cash-provisional": getCashData.bind(null, "daily"),
  "fii-cash": getFiiCashData.bind(null, "daily"),
  "fii-fno": getFandOCashData.bind(null, "daily", "index"),
  "mf-cash": getMfCashData.bind(null, "daily"),
};

const FiiDiiActivitySubPages = async ({ params }: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const type = params.type;
  const possibleTypes = Object.keys(typeToFunctionMap);
  if (!possibleTypes.includes(type)) {
    notFound();
  }

  const responseGetter = typeToFunctionMap[type];
  const response: any = await responseGetter();
  const { listData } = response.datainfo.data;

  return (
    <>
      <FiiDiiActivitySubPagesClients listData={listData} type={type} />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: type, redirectUrl: "" }]}
      />
    </>
  );
};

export default FiiDiiActivitySubPages;
