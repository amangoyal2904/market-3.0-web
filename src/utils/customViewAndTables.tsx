import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import Service from "@/network/service";

const fetchTabsData = async ({ type, ssoid }: any) => {
  let apiUrl = `${(APIS_CONFIG as any)?.["watchListTab"][APP_ENV]}`;
  if (type != "watchlist") {
    apiUrl += `?statstype=${type}`;
  }
  const response = await Service.get({
    url: apiUrl,
    params: {},
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ssoid: ssoid,
    },
  });
  return response?.json();
};

const concatenateAndLowerCase = (
  param1: string,
  param2: string,
  param3: any,
): string => {
  if (!isNaN(param3)) {
    param3 = "number";
  }
  let concatenatedString: string = `${param1}-${param2}-${param3}`;
  concatenatedString = concatenatedString.toLowerCase();

  return concatenatedString;
};

const fetchViewTable = async (
  bodyParams: any,
  isprimeuser: any,
  ssoid: any,
  apiType: any,
) => {
  const apiUrl = (APIS_CONFIG as any)?.[apiType][APP_ENV];
  const response = await Service.post({
    url: apiUrl,
    headers: {
      "Content-Type": "application/json",
      ssoid: ssoid,
      isprime: isprimeuser,
    },
    cache: "no-store",
    body: JSON.stringify({ ...bodyParams }),
    params: {},
  });
  return response?.json();
};

export const getCustomViewsTab = async ({
  type = null,
  firstOperand = null,
  operationType = null,
  secondOperand = null,
  ssoid,
}: any) => {
  if (type == null) {
    type = concatenateAndLowerCase(firstOperand, operationType, secondOperand);
  }
  console.log({ type });
  const tabData = await fetchTabsData({ type, ssoid });
  const activeViewId = tabData[0].viewId;
  return {
    tabData,
    activeViewId,
  };
};

export const getCustomViewTable = async (
  bodyParams: any,
  isprimeuser: boolean,
  ssoid: any,
  apiType: string,
) => {
  const responseData = await fetchViewTable(
    bodyParams,
    isprimeuser,
    ssoid,
    apiType,
  );
  const pageSummary = responseData.pageSummary;
  const tableData = responseData?.dataList
    ? responseData.dataList
    : responseData;

  const tableHeaderData =
    tableData && tableData.length && tableData[0] && tableData[0]?.data
      ? tableData[0]?.data
      : [];
  return {
    tableHeaderData,
    tableData,
    pageSummary,
    payload: bodyParams,
  };
};
