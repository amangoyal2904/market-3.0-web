import APIS_CONFIG from "@/network/api_config.json";
import {
  APP_ENV,
  dateFormat,
  formatNumber,
  setCookieToSpecificTime,
} from "@/utils/index";
import { getCookie } from "@/utils/index";
import Fingerprint2 from "fingerprintjs2";
import { setCookies } from "./index";
import Service from "@/network/service";

const API_SOURCE = 0;

export const durationOptions = [
  { label: "1 Day", value: "1D", id: 1 },
  { label: "1 Week", value: "1W", id: 2 },
  { label: "1 Month", value: "1M", id: 3 },
  { label: "3 Months", value: "3M", id: 4 },
  { label: "6 Months", value: "6M", id: 5 },
  { label: "1 Year", value: "1Y", id: 6 },
];

export const updateOrAddParamToPath = (
  pathname: any,
  param: any,
  value: any,
) => {
  const url = new URL(window.location.origin + pathname);
  const searchParams = url.searchParams;

  if (value === 0) {
    searchParams.delete(param);
  } else if (searchParams.has(param)) {
    searchParams.set(param, value);
  } else {
    searchParams.append(param, value);
  }

  return url.pathname + "?" + searchParams.toString();
};

export const fnGenerateMetaData = (meta?: any) => {
  return {
    title: `${meta?.title} | ET Markets`,
    description: meta?.desc,
    generator: "ET Markets",
    applicationName: "ET Markets",
    keywords: meta?.keywords?.split(","),
    metadataBase: new URL("https://economictimes.indiatimes.com/"),
    alternates: {
      canonical: "https://economictimes.indiatimes.com" + meta?.pathname,
      languages: {
        "en-IN": "/en-IN",
      },
    },
    openGraph: {
      title: meta?.title,
      description: meta?.desc,
      url: "https://economictimes.indiatimes.com/",
      siteName: "ET Markets",
      images: [
        {
          url: "https://img.etimg.com/photo/msid-65498029/et-logo.jpg",
          width: 1200,
          height: 628,
        },
      ],
      locale: "en-IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta?.title,
      description: meta?.desc,
      creator: "@etmarkets",
      images: ["https://img.etimg.com/photo/msid-65498029/et-logo.jpg"],
    },
    robots: {
      index: meta?.index,
      follow: meta?.index,
      googleBot: {
        index: meta?.index,
        follow: meta?.index,
      },
    },
    icons: {
      icon: "/etfavicon.ico",
    },
  };
};

export const fetchFilters = async ({
  all = false,
  watchlist = false,
  mostrecent = false,
  marketcap = false,
}) => {
  let apiUrl = (APIS_CONFIG as any)?.["INDEX_FILTERS"][APP_ENV];
  let queryParams = [];
  if (all) queryParams.push("all=true");
  if (watchlist) queryParams.push("watchlist=true");
  if (mostrecent) queryParams.push("mostrecent=true");
  if (marketcap) queryParams.push("marketcap=true");
  const queryString = queryParams.join("&");
  if (!!queryString) {
    apiUrl = apiUrl + "?" + queryString;
  }

  const response = await Service.get({
    url: apiUrl,
    params: {},
  });
  return response?.json();
};

export const fetchTabsData = async () => {
  const ssoid = window.objUser?.ssoid;
  const apiUrl = `${(APIS_CONFIG as any)?.MARKETS_CUSTOM_TAB[APP_ENV]}?ssoid=${ssoid}`;
  const data = await fetch(apiUrl, {
    cache: "no-store",
    headers: {
      ssoid: ssoid,
    },
  });
  const res = await data.json();
  return res;
};

export const fetchViewTable = async (
  requestObj: any,
  apiType: any,
  isprimeuser: any,
  ssoid: any,
) => {
  const apiUrl = (APIS_CONFIG as any)?.[apiType][APP_ENV];
  if (apiType == "MARKETSTATS_TECHNICALS") {
    delete requestObj.apiType;
  }
  const response = await Service.post({
    url: apiUrl,
    headers: {
      "Content-Type": "application/json",
      ssoid: ssoid,
      isprime: isprimeuser,
    },
    cache: "no-store",
    body: JSON.stringify({ ...requestObj }),
    params: {},
  });
  return response?.json();
};

export const fetchTableData = async (viewId: any, params?: any) => {
  const ssoid = window.objUser?.ssoid;
  const isprimeuser = getCookie("isprimeuser") == "true" ? true : false;
  const apiUrl = `${(APIS_CONFIG as any)?.MARKETS_CUSTOM_TABLE[APP_ENV]}`;
  const response = await Service.post({
    url: apiUrl,
    headers: {
      "Content-Type": "application/json",
      ssoid: ssoid,
      isprime: isprimeuser ? isprimeuser : false,
    },
    cache: "no-store",
    body: JSON.stringify({
      sort: [],
      type: "STOCK",
      viewId: viewId,
      deviceId: "web",
      ...params,
    }),
    params: {},
  });

  return response?.json();
};

export const getStockUrl = (id: string, seoName: string, stockType: string) => {
  if (seoName?.indexOf(" ") >= 0) {
    seoName = seoName
      .replaceAll(" ", "-")
      .replaceAll("&", "")
      .replaceAll(".", "")
      .toLowerCase();
  }
  if ((stockType == "dvr" || stockType == "pp") && id.includes("1111")) {
    id = id.substring(0, id.length - 4);
  }
  let stockUrl =
    (APIS_CONFIG as any)?.DOMAIN[APP_ENV] +
    seoName +
    "/stocks/companyid-" +
    id +
    ".cms";
  if (stockType != "equity" && stockType !== "" && stockType !== "company")
    stockUrl = stockUrl + "?companytype=" + stockType?.toLowerCase();
  return stockUrl;
};

export const fetchAllWatchListData = async (
  type: any,
  usersettingsubType: any,
) => {
  const authorization: any = getCookie("peuuid") ? getCookie("peuuid") : "";
  const isLocalhost = window.location.origin.includes("localhost");
  if (authorization === "") {
    console.log("peuuid is not getting please check cookie__", authorization);
  }
  const apiUrl = isLocalhost
    ? `${(APIS_CONFIG as any)?.WATCHLISTAPI.getAllWatchlistNextJsAPI[APP_ENV]}?type=${type}&usersettingsubType=${usersettingsubType}&authorization=${authorization}`
    : `${(APIS_CONFIG as any)?.WATCHLISTAPI.getAllWatchlist[APP_ENV]}?type=${type}&usersettingsubType=${usersettingsubType}`;
  const headers = new Headers({ Authorization: authorization });
  const options: any = {
    cache: "no-store",
    headers: headers,
  };
  try {
    const response = await fetch(apiUrl, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error fetching watchlist data:", error);
    throw error;
  }
};

export const saveStockInWatchList = async (followData: any) => {
  const authorization: any = getCookie("peuuid") ? getCookie("peuuid") : "";
  const isLocalhost = window.location.origin.includes("localhost");
  let postBodyData = {};
  if (isLocalhost) {
    postBodyData = {
      _authorization: authorization,
      followData,
    };
  } else {
    postBodyData = followData;
  }
  const apiUrl = isLocalhost
    ? `${(APIS_CONFIG as any)?.WATCHLISTAPI.addWatchListNextJsAPI[APP_ENV]}`
    : `${(APIS_CONFIG as any)?.WATCHLISTAPI.addWatchList[APP_ENV]}`;
  const headers = new Headers({
    Authorization: authorization,
    "Content-Type": "application/json",
  });
  const options: any = {
    method: "POST",
    cache: "no-store",
    headers: headers,
    body: JSON.stringify(postBodyData),
  };
  try {
    const response = await fetch(apiUrl, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error saving stock in watchlist:", error);
    throw error;
  }
};

export const generateFpid = (isLogin: any) => {
  new (Fingerprint2 as any).get((components: any[]) => {
    const values = components.map(
      (component: { value: any }) => component.value,
    );
    const murmur = Fingerprint2.x64hash128(values.join(""), 31); // an array of components: {key: ..., value: ...}
    console.log("@@@@@-->", isLogin, murmur);
    processFingerprint(murmur, isLogin);
  });
};

export const processFingerprint = (data: any, isLogin: any) => {
  setCookieToSpecificTime("fpid", data, 365, 0, 0);
  if (isLogin) {
    createPeuuid(data);
  } else {
    createPfuuid(data);
  }
};

export const createPfuuid = async (fpid: any) => {
  let url = (APIS_CONFIG as any)?.PERSONALISATION[APP_ENV];
  url = url + `?type=7&source=${API_SOURCE}`;
  console.log("@@@@@-->inpfuuid", url);
  try {
    const res: any = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Authorization: fpid,
      },
    });
    const data = await res.json();
    console.log("res", res, data);
    if (data && data.id != 0) {
      console.log("@@@@--->>>>>", data);
      var pfuuid = data.id;
      setCookieToSpecificTime("pfuuid", pfuuid, 365, 0, 0);
    }
  } catch (e) {
    console.log("error in pfuuid api", e);
  }
};

export const createPeuuid = async (fpid: any) => {
  let url = (APIS_CONFIG as any)?.PERSONALISATION[APP_ENV];
  url = url + `?type=0&source=${API_SOURCE}`;
  console.log("@@@@@-->inpfuuid", url);
  const res: any = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await res.json();
  console.log("res", res, data);
  if (data && data.id != 0) {
    const peuuid: any = data.id;
    console.log("@@@@--->>>>>2", data);
    setCookieToSpecificTime("peuuid", peuuid, 365, 0, 0);
  }
};

export const removeMultipleStockInWatchList = async (followData: any) => {
  const authorization: any = getCookie("peuuid") ? getCookie("peuuid") : "";
  const isLocalhost = window.location.origin.includes("localhost");
  let postBodyData = {};
  if (isLocalhost) {
    postBodyData = {
      _authorization: authorization,
      followData,
    };
  } else {
    postBodyData = followData;
  }
  const apiUrl = isLocalhost
    ? `${(APIS_CONFIG as any)?.WATCHLISTAPI.multipleWatchListNextJsAPI[APP_ENV]}`
    : `${(APIS_CONFIG as any)?.WATCHLISTAPI.multipleWatchList[APP_ENV]}`;
  const headers = new Headers({
    Authorization: authorization,
    "Content-Type": "application/json",
  });
  const options: any = {
    method: "POST",
    cache: "no-store",
    headers: headers,
    body: JSON.stringify(postBodyData),
  };
  try {
    const response = await fetch(apiUrl, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error saving stock in watchlist:", error);
    throw error;
  }
};
export const removePersonalizeViewById = async (viewId: any) => {
  const ssoid = window.objUser?.ssoid;
  const API_URL = (APIS_CONFIG as any)?.PERSONALISE_VIEW.screenerRemoveviewbyid[
    APP_ENV
  ];
  const data = await fetch(`${API_URL}${viewId}`, {
    cache: "no-store",
    headers: {
      ssoid: ssoid,
    },
  });
  const resData = await data.json();
  return resData;
};

export const fetchSelectedFilter = async (
  seoNameOrIndexId?: string | number,
) => {
  const data = await fetchFilters({ marketcap: true });
  const allIndices = [
    ...data.keyIndices.nse,
    ...data.keyIndices.bse,
    ...data.sectoralIndices.nse,
    ...data.sectoralIndices.bse,
    ...data.otherIndices.nse,
    ...data.otherIndices.bse,
    ...data.marketcap.nse,
    ...data.marketcap.bse,
  ];
  let foundIndex;
  if (!isNaN(seoNameOrIndexId as number)) {
    foundIndex = allIndices.find(
      (index) => index.indexId == (seoNameOrIndexId as number),
    );
  } else if (typeof seoNameOrIndexId === "string") {
    foundIndex = allIndices.find((index) => index.seoname == seoNameOrIndexId);
  }

  if (foundIndex) {
    let exchange = "";
    if (
      data.keyIndices.nse.includes(foundIndex) ||
      data.sectoralIndices.nse.includes(foundIndex) ||
      data.otherIndices.nse.includes(foundIndex) ||
      data.marketcap.nse.includes(foundIndex)
    ) {
      exchange = "nse";
    } else if (
      data.keyIndices.bse.includes(foundIndex) ||
      data.sectoralIndices.bse.includes(foundIndex) ||
      data.otherIndices.bse.includes(foundIndex) ||
      data.marketcap.bse.includes(foundIndex)
    ) {
      exchange = "bse";
    }

    return {
      name: foundIndex.name,
      indexId: foundIndex.indexId,
      seoname: foundIndex.seoname,
      exchange: exchange,
    };
  } else {
    return { name: "All Stocks", indexId: 0, seoname: "", selectedTab: "nse" };
  }
};

export const getSearchParams = (url: string) => {
  const searchParams: { [key: string]: string } = {};
  const queryString = url.split("?")[1];
  if (queryString) {
    const params = queryString.split("&");
    params.forEach((param) => {
      const [key, value] = param.split("=");
      searchParams[key] = decodeURIComponent(value);
    });
  }
  return searchParams;
};

export const fetchIndustryFilters = async (query: string) => {
  const API_URL = (APIS_CONFIG as any)?.["industryFilter"][APP_ENV];
  const data = await fetch(`${API_URL}${query}`);
  const resData = await data.json();
  return resData;
};

export const getOverviewData = async (indexid: number, pageno: number) => {
  const response = await Service.get({
    url: `${(APIS_CONFIG as any)?.MARKETMOODS_OVERVIEW[APP_ENV]}?indexid=${indexid}&pageno=${pageno}&pagesize=13`,
    params: {},
  });
  const originalJson = await response?.json();
  return {
    labels: originalJson.labels,
    dataList: originalJson.dataList.map((item: any) => ({
      date: dateFormat(item.date, "%d %MMM"),
      indexPrice: formatNumber(item.indexPrice),
      percentChange: item.percentChange,
      trend:
        item.percentChange > 0
          ? "up"
          : item.percentChange < 0
            ? "down"
            : "neutral",
      others: item.count.map((count: number, index: number) => ({
        count: count,
        percent: item.percent[index],
        color: item.color[index],
      })),
    })),
    pageSummary: originalJson.pageSummary,
  };
};

export const getAdvanceDeclineData = async (
  indexid: number,
  duration: string,
  pageno: number,
) => {
  const response = await Service.get({
    url: `${(APIS_CONFIG as any)?.MARKETMOODS_ADVANCEDECLINE[APP_ENV]}?indexid=${indexid}&duration=${duration}&pageno=${pageno}&pagesize=6`,
    params: {},
  });
  const originalJson = await response?.json();
  return {
    dataList: originalJson.searchresult.map((item: any) => ({
      date: dateFormat(item.dateTime, "%d %MMM"),
      indexPrice: formatNumber(item.currentIndexValue),
      percentChange: item.percentChange,
      trend:
        item.percentChange > 0
          ? "up"
          : item.percentChange < 0
            ? "down"
            : "neutral",
      others: {
        up: item.advances,
        upChg: item.advancesPercentange + "%",
        down: item.declines,
        downChg: item.declinesPercentange + "%",
        neutral: item.noChange,
        neutralChg: item.noChangePercentage + "%",
      },
    })),
    pageSummary: originalJson.pagesummary,
  };
};

export const getPeriodicData = async (
  indexid: number,
  duration: string,
  pageno: number,
) => {
  const response = await Service.get({
    url: `${(APIS_CONFIG as any)?.MARKETMOODS_PERIODIC[APP_ENV]}?indexid=${indexid}&duration=${duration}&pageno=${pageno}&pagesize=6`,
    params: {},
  });
  const originalJson = await response?.json();
  return {
    dataList: originalJson.searchresult.map((item: any) => {
      const totalZonesSum = item.highZone + item.midZone + item.lowZone;
      return {
        date: dateFormat(item.dateTime, "%d %MMM"),
        indexPrice: formatNumber(item.currentIndexValue),
        percentChange: item.percentChange,
        trend:
          item.percentChange > 0
            ? "up"
            : item.percentChange < 0
              ? "down"
              : "neutral",
        others: {
          up: item.highZone,
          upChg: (item.highZone / totalZonesSum) * 100 + "%",
          down: item.lowZone,
          downChg: (item.lowZone / totalZonesSum) * 100 + "%",
          neutral: item.midZone,
          neutralChg: (item.midZone / totalZonesSum) * 100 + "%",
        },
      };
    }),
    pageSummary: originalJson.pagesummary,
  };
};
