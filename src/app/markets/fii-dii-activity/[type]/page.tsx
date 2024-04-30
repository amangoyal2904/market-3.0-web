import {
  getCashData,
  getFandOCashData,
  getFiiCashData,
  getMfCashData,
} from "@/utils/utility";
import FiiDiiActivitySubPagesClients from "./clients";
import { notFound } from "next/navigation";

const typeToFunctionMap: { [key: string]: () => Promise<any> } = {
  "cash-provisional": getCashData.bind(null, "daily"),
  "fii-cash": getFiiCashData.bind(null, "daily"),
  "fii-fno": getFandOCashData.bind(null, "daily", "index"),
  "mf-cash": getMfCashData.bind(null, "daily"),
};

const FiiDiiActivitySubPages = async ({ params }: any) => {
  const type = params.type;
  const possibleTypes = Object.keys(typeToFunctionMap);
  if (!possibleTypes.includes(type)) {
    notFound();
  }

  const responseGetter = typeToFunctionMap[type];
  const response: any = await responseGetter();
  const { listData } = response.datainfo.data;

  return <FiiDiiActivitySubPagesClients listData={listData} type={type} />;
};

export default FiiDiiActivitySubPages;
