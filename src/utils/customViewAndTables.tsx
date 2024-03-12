import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import Service from "@/network/service";

const fetchTabsData = async ({ type, ssoid }: any) => {
  let apiUrl = `${(APIS_CONFIG as any)?.["MARKETS_CUSTOM_TAB"][APP_ENV]}`;
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
  L3NavSubItem = null,
  firstOperand = null,
  operationType = null,
  secondOperand = null,
  ssoid,
}: any) => {
  if (L3NavSubItem == null) {
    L3NavSubItem = concatenateAndLowerCase(
      firstOperand,
      operationType,
      secondOperand,
    );
  }
  const tabData = await fetchTabsData({ type: L3NavSubItem, ssoid });
  let activeViewId = null;
  if (typeof tabData != "undefined" && tabData.length > 0) {
    activeViewId = tabData[0].viewId;
  } else {
    console.error("tabData is empty");
  }
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
  let pageSummary = null;
  let tableData = [];
  let tableHeaderData = [];

  if (responseData?.pageSummary) {
    pageSummary = responseData.pageSummary;
  }

  if (responseData?.dataList) {
    tableData = responseData.dataList;
    if (tableData.length > 0 && tableData[0].data) {
      tableHeaderData = tableData[0].data;
    }
  } else {
    tableData = responseData;
    if (tableData?.length > 0 && tableData[0]?.data) {
      tableHeaderData = tableData[0].data;
    }
  }
  let screenerDetail: any = {};
  if (responseData && responseData.screenerDetail) {
    screenerDetail = { ...responseData.screenerDetail };
  }
  const _queryCondition = screenerDetail?.displayQuery;
  return {
    tableHeaderData,
    tableData,
    pageSummary,
    payload: { ...bodyParams, queryCondition: _queryCondition },
    screenerDetail,
  };
};

export const getScreenerTabViewData = async ({ type = "", ssoid = "" }) => {
  const tabData = await fetchTabsData({ type, ssoid });
  const activeViewId = tabData[0].viewId;
  return {
    tabData,
    activeViewId,
  };
};
