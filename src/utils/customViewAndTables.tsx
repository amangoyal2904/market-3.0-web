import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import service from "@/network/service";
import { getAllShortUrls } from "./marketstats";
import { fetchViewTable } from "./utility";

interface getCustomViewTableParams {
  bodyParams: any;
  apiType: any;
  isprimeuser: any;
  ssoid?: any;
  ticketId?: any;
}

const IntradayTabOptions = [
  {
    label: "Top Gainers",
    selectedFlag: 1,
    type: "gainers",
  },
  {
    label: "Top Losers",
    selectedFlag: 1,
    type: "losers",
  },
  {
    label: "Hourly Gainers",
    selectedFlag: 1,
    type: "hourly-gainers",
  },
  {
    label: "Hourly Losers",
    selectedFlag: 1,
    type: "hourly-losers",
  },
  {
    label: "Most Active - Volume",
    selectedFlag: 1,
    type: "most-active-volume",
  },
  {
    label: "Most Active - Value",
    selectedFlag: 1,
    type: "most-active-value",
  },
  {
    label: "Only Buyers",
    selectedFlag: 1,
    type: "only-buyers",
  },
  {
    label: "Only Sellers",
    selectedFlag: 1,
    type: "only-sellers",
  },
  {
    label: "New 52 Week High",
    selectedFlag: 1,
    type: "new-52-week-high",
  },
  {
    label: "New 52 Week Low",
    selectedFlag: 1,
    type: "new-52-week-low",
  },
  {
    label: "Near 52 Week High",
    selectedFlag: 1,
    type: "near-52-week-high",
  },
  {
    label: "Near 52 Week Low",
    selectedFlag: 1,
    type: "near-52-week-low",
  },
  {
    label: "Fall From Intraday High",
    selectedFlag: 1,
    type: "fall-from-intraday-high",
  },
  {
    label: "Recovery from Intraday Low",
    selectedFlag: 1,
    type: "recovery-from-intraday-low",
  },
  {
    label: "Volume Shockers",
    selectedFlag: 1,
    type: "volume-shockers",
  },
];

const fetchTabsData = async ({ type, ssoid }: any) => {
  let apiUrl = `${(APIS_CONFIG as any)?.["MARKETS_CUSTOM_TAB"][APP_ENV]}`;
  if (type !== "watchlist") {
    apiUrl += `?statstype=${type}`;
  }

  // Conditionally set headers based on ssoid availability
  const headers: Record<string, string> = ssoid
    ? {
        "Content-Type": "application/json",
        ssoid: ssoid,
      }
    : {};

  const response = await service.get({
    url: apiUrl,
    params: {},
    cache: "no-store",
    headers: headers,
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

export const getIntradayViewsTab = async () => {
  const apiUrl = `${(APIS_CONFIG as any)?.MARKETSINTRADAY_CUSTOM_TAB[APP_ENV]}`;
  const data = await service.get({ url: apiUrl, params: {} });
  const apiresponse = await data.json();
  const tabData = apiresponse.map((item: any) => {
    const localItem = IntradayTabOptions.find(
      (local) => local.type.toLowerCase() === item.viewType.toLowerCase(),
    );
    return {
      ...item,
      name: localItem ? localItem.label : "",
      selectedFlag: localItem ? localItem.selectedFlag : 0,
    };
  });
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

export const getCustomViewTable = async ({
  bodyParams,
  apiType,
  isprimeuser,
  ssoid,
  ticketId,
}: getCustomViewTableParams) => {
  const responseData = await fetchViewTable({
    requestObj: bodyParams,
    isprimeuser,
    apiType,
    ssoid,
    ticketId,
  });
  let unixDateTime = "";
  let pageSummary = null;
  let tableData = [];
  let tableHeaderData = [];

  if (responseData?.unixDateTime) {
    unixDateTime = responseData.unixDateTime;
  }

  if (typeof responseData != "undefined" && responseData.pageSummary) {
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
    unixDateTime,
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

export const getBreadcrumbObj = async (
  l3Nav: any,
  l3NavMenuItem: string,
  l3NavSubItem: any,
  isTechnical: boolean,
  title: string,
) => {
  const shortUrlMapping = await getAllShortUrls();

  const matchingSubNavs: { label: any; redirectUrl: any }[] = [];
  l3Nav.nav.forEach((navItem: any) => {
    if (navItem.type === l3NavMenuItem) {
      navItem.sub_nav.forEach((subNavItem: any) => {
        const isExist: any = shortUrlMapping?.find(
          (item: any) => item.longURL == subNavItem.link,
        );
        const updatedUrl = isExist ? isExist.shortUrl : subNavItem.link;
        if (!isTechnical) {
          if (subNavItem.type === l3NavSubItem) {
            matchingSubNavs.push({
              label: subNavItem.label,
              redirectUrl: updatedUrl,
            });
          }
        } else {
          if (
            subNavItem.firstoperand === l3NavSubItem.firstOperand &&
            subNavItem.operationtype === l3NavSubItem.operationType &&
            subNavItem.secondoperand === l3NavSubItem.secondOperand
          ) {
            matchingSubNavs.push({
              label: subNavItem.label,
              redirectUrl: updatedUrl,
            });
          }
        }
      });
    }
  });
  if (matchingSubNavs.length === 0) {
    matchingSubNavs.push({
      label: title,
      redirectUrl: "",
    });
  }
  return matchingSubNavs;
};
