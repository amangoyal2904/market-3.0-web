import APIS_CONFIG from "@/network/api_config.json";
import {
  APP_ENV,
  dateFormat,
  formatNumber,
  setCookieToSpecificTime,
} from "@/utils/index";
import { getCookie } from "@/utils/index";
import Service from "@/network/service";

const API_SOURCE = 0;

declare global {
  interface Window {
    _mfq?: any[];
  }
}

type FiiDiiApiType =
  | "FIIDII_CASHPROVISIONAL"
  | "FIIDII_FIICASH"
  | "FIIDII_FANDOCASH"
  | "FIIDII_MFCASH";

interface FiiDiiApiParams {
  filterType: string;
  apiType?: string;
}

const convertJSONToParams = (jsonObject: any) => {
  let paramsArray = [];
  for (let key in jsonObject) {
    if (jsonObject.hasOwnProperty(key)) {
      paramsArray.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(jsonObject[key]),
      );
    }
  }
  return paramsArray.join("&");
};

export const getCurrentMarketStatus = async () => {
  try {
    const url = (APIS_CONFIG as any)?.MARKET_STATUS[APP_ENV];
    const res = await Service.get({ url, params: {}, cache: "no-store" });

    if (res?.status === 200) {
      return await res.json();
    } else {
      saveLogs({
        res: "error",
        msg: "Unexpected response status",
        status: res?.status,
      });
      return null;
    }
  } catch (e) {
    let errorMessage = "Unknown error";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    console.error("Error in fetching market status", errorMessage);
    saveLogs({
      type: "Mercury",
      res: "error",
      msg: "Error in fetching market status",
      error: errorMessage,
    });
    return null;
  }
};

export const generateIntradayDurations = async (type: string) => {
  const noDuration: any = [];
  if (type == "gainers" || type == "losers") {
    return durationOptions;
  } else if (type == "hourly-gainers" || type == "hourly-losers") {
    const { marketStatus } = await getCurrentMarketStatus();
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (
      currentHour <= 9 ||
      currentHour >= 16 ||
      marketStatus.toUpperCase() != "ON"
    ) {
      // If current time is before 09:00 or after 16:00 and if market is off, return all items
      return [
        { label: "9:00 and 10:00", value: "9-10" },
        { label: "10:00 and 11:00", value: "10-11" },
        { label: "11:00 and 12:00", value: "11-12" },
        { label: "13:00 and 14:00", value: "13-14" },
        { label: "14:00 and 15:00", value: "14-15" },
        { label: "15:00 and 16:00", value: "15-16" },
        { label: "Current Hour", value: "" },
      ];
    } else {
      const hourOptions = [];
      for (let i = 9; i < currentHour; i++) {
        hourOptions.push({
          label: `${i}:00 and ${i + 1}:00`,
          value: `${i}-${i + 1}`,
        });
      }
      return [...hourOptions, { label: "Current Hour", value: "" }];
    }
  } else if (type == "volume-shockers") {
    return volumeShockersDurations;
  }
  return noDuration;
};

export const chartIntervals = [
  {
    label: "1D",
    value: "1d",
    change: "netChange",
    percentChange: "percentChange",
  },
  { label: "1W", value: "1w", change: "change1Week", percentChange: "r1Week" },
  {
    label: "1M",
    value: "1m",
    change: "change1Month",
    percentChange: "r1Month",
  },
  {
    label: "3M",
    value: "3m",
    change: "change3Month",
    percentChange: "r3Month",
  },
  {
    label: "6M",
    value: "6m",
    change: "change6Month",
    percentChange: "r6Month",
  },
  { label: "1Y", value: "1y", change: "change1Year", percentChange: "r1Year" },
  { label: "3Y", value: "3y", change: "change3Year", percentChange: "r3Year" },
  { label: "5Y", value: "5y", change: "change5Year", percentChange: "r5Year" },
];

export const volumeShockersDurations = [
  { label: "3 Days", value: "3D" },
  { label: "7 Days", value: "7D" },
  { label: "15 Days", value: "15D" },
];

export const durationOptions = [
  { label: "1 Day", value: "1D", id: 1 },
  { label: "1 Week", value: "1W", id: 2 },
  { label: "1 Month", value: "1M", id: 3 },
  { label: "3 Months", value: "3M", id: 4 },
  { label: "6 Months", value: "6M", id: 5 },
  { label: "1 Year", value: "1Y", id: 6 },
  { label: "3 Years", value: "3Y", id: 7 },
  { label: "5 Years", value: "5Y", id: 8 },
];

export const updateOrAddParamToPath = (
  pathname: any,
  param: any,
  value: any,
) => {
  const url = new URL(window.location.origin + pathname);
  const searchParams = url.searchParams;

  if (value == 0) {
    searchParams.delete(param);
  } else if (searchParams.has(param)) {
    searchParams.set(param, value);
  } else {
    searchParams.append(param, value);
  }

  return url.pathname + "?" + searchParams?.toString();
};

export const fnGenerateMetaData = (meta?: any) => {
  const shouldIndex = meta?.index !== undefined ? meta.index : true;
  return {
    title: `${meta?.title} | The Economic Times`,
    description: meta?.desc,
    generator: "ET Markets",
    applicationName: "The Economic Times",
    keywords: meta?.keywords?.split(","),
    metadataBase: new URL("https://economictimes.indiatimes.com"),
    alternates: {
      canonical: meta?.pathname,
      media: {
        handheld: "https://m.economictimes.com" + meta?.pathname,
        "only screen and (max-width: 600px)":
          "https://m.economictimes.com" + meta?.pathname,
      },
    },
    openGraph: {
      title: meta?.title,
      description: meta?.desc,
      url: meta?.pathname,
      siteName: "The Economic Times",
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
      index: shouldIndex,
      follow: shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
      },
    },
    icons: {
      icon: "https://economictimes.indiatimes.com/icons/etfavicon.ico",
    },
  };
};

export const fetchIndices = async () => {
  try {
    const apiUrl = (APIS_CONFIG as any)?.["INDICES_LIST"][APP_ENV];
    const response = await Service.get({
      url: apiUrl,
      params: {},
    });
    return response?.json();
  } catch (e) {
    console.log("error in fetching indices data", e);
    saveLogs({
      type: "Mercury",
      res: "error",
      msg: "Error in fetching indices data",
    });
  }
};

export const fetchFilters = async ({
  all = false,
  watchlist = false,
  mostrecent = false,
  marketcap = false,
}) => {
  try {
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
  } catch (e) {
    console.log("error in fetching filters data", e);
    saveLogs({
      type: "Mercury",
      res: "error",
      msg: "Error in fetching filters data",
    });
  }
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
  try {
    const apiUrl = (APIS_CONFIG as any)?.[apiType][APP_ENV];
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
  } catch (e) {
    console.log("error in fetching viewTable data", e);
    saveLogs({
      type: "Mercury",
      res: "error",
      msg: "Error in fetching viewTable data",
    });
  }
};

export const fetchTableData = async (viewId: any, params?: any) => {
  try {
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
  } catch (e) {
    console.log("error in fetching table data", e);
    saveLogs({
      type: "Mercury",
      res: "error",
      msg: "Error in fetching table data",
    });
  }
};

export const getStockUrl = (
  id: string = "",
  seoName: string = "",
  stockType: string = "",
  subType: string = "company",
  fromCurrencyShort: string = "",
  toCurrencyShort: string = "",
  fno: string = "",
) => {
  if (stockType === "index") {
    return "/markets/indices/" + seoName;
  } else if (stockType === "sector") {
    return "/stocks/sectors/" + seoName;
  } else {
    if (seoName?.indexOf(" ") >= 0) {
      seoName = seoName
        .replaceAll(" ", "-")
        .replaceAll("&", "")
        .replaceAll(".", "")
        .toLowerCase();
    }
    if ((stockType === "dvr" || stockType === "pp") && id.includes("1111")) {
      id = id.substring(0, id.length - 4);
    }

    const domain = (APIS_CONFIG as any)?.DOMAIN[APP_ENV] || "";
    if (!domain) {
      throw new Error("DOMAIN configuration is missing");
    }

    let stockUrl = domain + "/" + seoName + "/stocks/companyid-" + id + ".cms";

    if (
      stockType !== "equity" &&
      stockType !== "" &&
      stockType !== "company" &&
      stockType?.toLowerCase() !== "etf"
    ) {
      stockUrl = stockUrl + "?companytype=" + stockType?.toLowerCase();
    }

    if (subType === "NonList") {
      stockUrl = domain + "/company/" + seoName + "/" + id;
    }
    if (stockType === "ETF" || stockType === "MutualFund") {
      stockUrl =
        domain + "/" + seoName + "/mffactsheet/schemeid-" + id + ".cms";
    }
    if (stockType === "crypto") {
      stockUrl =
        domain +
        "/markets/cryptocurrency/" +
        seoName +
        "/cryptodetail/symbol-" +
        id +
        ".cms";
    }
    if (stockType === "forex") {
      stockUrl =
        domain +
        "/markets/forex?amount=1&fromcur=" +
        fromCurrencyShort +
        "&tocur=" +
        toCurrencyShort;
    }
    if (stockType === "commodity") {
      stockUrl = domain + "/commoditysummary/symbol-" + fno + ".cms";
    }
    if (stockType === "NPS") {
      stockUrl = domain + "/" + seoName + "/nps/schemecode-" + id + ".cms";
    }
    return stockUrl;
  }
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
  const apiUrl = `${(APIS_CONFIG as any)?.WATCHLISTAPI.getAllWatchlist[APP_ENV]}?stype=${type}&usersettingsubType=${usersettingsubType}`;
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

export const createPeuuid = async () => {
  try {
    let url = (APIS_CONFIG as any)?.PERSONALISATION[APP_ENV];
    url = url + `?type=0&source=${API_SOURCE}`;
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
      setCookieToSpecificTime("peuuid", peuuid, 365, 0, 0);
    }
  } catch (e) {
    console.log("error in creating peuuid ", e);
    saveLogs({
      type: "Mercury",
      res: "error",
      msg: "Error in creating peuuid",
    });
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

export const fetchSelectedIndex = async (
  seoNameOrIndexId?: string | number,
) => {
  try {
    const data = await fetchIndices();

    // Check if data is defined and is an array
    if (!Array.isArray(data)) {
      return { name: "All Stocks", indexId: 0, seoname: "", exchange: "nse" };
    }

    let filteredIndex;
    if (seoNameOrIndexId) {
      filteredIndex = data.find((item: any) => {
        return (
          item.assetSeoName === seoNameOrIndexId ||
          item.assetId === seoNameOrIndexId
        );
      });
    }

    return (
      filteredIndex || {
        name: "All Stocks",
        indexId: 0,
        seoname: "",
        exchange: "nse",
      }
    );
  } catch (error) {
    console.error("Error fetching filters:", error);
    return { name: "All Stocks", indexId: 0, seoname: "", exchange: "nse" };
  }
};

export const fetchSelectedFilter = async (
  seoNameOrIndexId?: string | number,
) => {
  try {
    const data = await fetchFilters({ marketcap: true });
    if (
      !data ||
      !data.keyIndices ||
      !data.sectoralIndices ||
      !data.otherIndices ||
      !data.marketcap
    ) {
      return { name: "All Stocks", indexId: 0, seoname: "", exchange: "nse" };
    }

    const allIndices = [
      ...(data.keyIndices.nse || []),
      ...(data.keyIndices.bse || []),
      ...(data.sectoralIndices.nse || []),
      ...(data.sectoralIndices.bse || []),
      ...(data.otherIndices.nse || []),
      ...(data.otherIndices.bse || []),
      ...(data.marketcap.nse || []),
      ...(data.marketcap.bse || []),
    ];

    let foundIndex;
    if (
      !isNaN(seoNameOrIndexId as number) ||
      typeof seoNameOrIndexId === "string"
    ) {
      foundIndex = allIndices.find(
        (index) =>
          index.indexId === String(seoNameOrIndexId) ||
          index.seoname === seoNameOrIndexId,
      );
    }

    if (foundIndex) {
      let exchange = "";
      if (
        (data.keyIndices.nse || []).includes(foundIndex) ||
        (data.sectoralIndices.nse || []).includes(foundIndex) ||
        (data.otherIndices.nse || []).includes(foundIndex) ||
        (data.marketcap.nse || []).includes(foundIndex)
      ) {
        exchange = "nse";
      } else if (
        (data.keyIndices.bse || []).includes(foundIndex) ||
        (data.sectoralIndices.bse || []).includes(foundIndex) ||
        (data.otherIndices.bse || []).includes(foundIndex) ||
        (data.marketcap.bse || []).includes(foundIndex)
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
      return { name: "All Stocks", indexId: 0, seoname: "", exchange: "nse" };
    }
  } catch (error) {
    console.error("Error fetching filters:", error);
    return { name: "All Stocks", indexId: 0, seoname: "", exchange: "nse" };
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

export const fetchSectorFilters = async () => {
  const API_URL = (APIS_CONFIG as any)?.["industryFilter"][APP_ENV];
  const data = await fetch(`${API_URL}`);
  const resData = await data.json();
  return resData;
};

export const getOverviewData = async (indexid: number, pageno: number) => {
  const response = await Service.get({
    url: `${(APIS_CONFIG as any)?.MARKETMOODS_OVERVIEW[APP_ENV]}?indexid=${indexid}&pageno=${pageno}&pagesize=100`,
    params: {},
  });
  const originalJson = await response?.json();
  return {
    labels: originalJson.labels,
    dataList: originalJson.dataList.map((item: any) => ({
      date: dateFormat(item.date, "%d %MMM"),
      indexPrice: formatNumber(item.indexPrice),
      percentChange: item.percentChange.toFixed(2),
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
    url: `${(APIS_CONFIG as any)?.MARKETMOODS_ADVANCEDECLINE[APP_ENV]}?indexid=${indexid}&duration=${duration}&pageno=${pageno}&pagesize=100`,
    params: {},
  });
  const originalJson = await response?.json();
  return {
    dataList: originalJson.searchresult.map((item: any) => {
      const totalZonesSum = item.advances + item.declines + item.noChange;
      return {
        date:
          duration == "monthly"
            ? dateFormat(item.dateTime, "%MMM %Y")
            : dateFormat(item.dateTime, "%d %MMM"),
        indexPrice: formatNumber(item.currentIndexValue),
        percentChange: item.percentChange.toFixed(2),
        trend:
          item.percentChange > 0
            ? "up"
            : item.percentChange < 0
              ? "down"
              : "neutral",
        others: {
          up: item.advances,
          upChg: (item.advances / totalZonesSum) * 100 + "%",
          down: item.declines,
          downChg: (item.declines / totalZonesSum) * 100 + "%",
          neutral: item.noChange,
          neutralChg: (item.noChange / totalZonesSum) * 100 + "%",
        },
      };
    }),
    pageSummary: originalJson.pagesummary,
  };
};

export const getPeriodicData = async (
  indexid: number,
  duration: string,
  pageno: number,
) => {
  const response = await Service.get({
    url: `${(APIS_CONFIG as any)?.MARKETMOODS_PERIODIC[APP_ENV]}?indexid=${indexid}&duration=${duration}&pageno=${pageno}&pagesize=100`,
    params: {},
  });
  const originalJson = await response?.json();
  return {
    dataList: originalJson.searchresult.map((item: any) => {
      const totalZonesSum = item.highZone + item.midZone + item.lowZone;
      return {
        date: dateFormat(item.dateTime, "%d %MMM"),
        indexPrice: formatNumber(item.currentIndexValue),
        percentChange: item.percentChange.toFixed(2),
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

export const getAllIndices = async (
  exchange: string,
  sortField: any,
  sortOrder: string,
) => {
  try {
    let apiUrl = `${(APIS_CONFIG as any)?.ALLINDICES[APP_ENV]}?exchange=${exchange}`;
    if (!!sortField) {
      apiUrl = `${apiUrl}&sortedField=${sortField}&sortedOrder=${sortOrder}`;
    }

    const response = await Service.get({
      url: apiUrl,
      params: {},
    });

    if (!response || !response.ok) {
      throw new Error(`HTTP error! Status: ${response?.status}`);
    }

    const responseData = await response.json();
    let tableData: any[] = [];
    let tableHeaderData: any[] = [];
    let unixDateTime = new Date().getTime();

    if (responseData?.dataList?.length > 0) {
      tableData = responseData.dataList;
      if (tableData[0]?.data) {
        tableHeaderData = tableData[0].data;
      }
    }

    if (responseData?.dateTime) {
      unixDateTime = responseData.dateTime * 1000;
    }

    return {
      tableHeaderData,
      tableData,
      exchange,
      unixDateTime,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return default values on error
    return {
      tableHeaderData: [],
      tableData: [],
      exchange,
      unixDateTime: new Date().getTime(),
    };
  }
};

export const getIndicesOverview = async (indexid: number) => {
  const response = await Service.get({
    url: `${(APIS_CONFIG as any)?.INDICES_OVERVIEW[APP_ENV]}?indexId=${indexid}`,
    params: {},
  });
  const originalJson = await response?.json();
  return originalJson;
};

export const getIndicesTechnicals = async (indexid: number) => {
  const response = await Service.get({
    url: `${(APIS_CONFIG as any)?.INDICES_TECHNICALS[APP_ENV]}?indexId=${indexid}`,
    params: {},
  });
  const originalJson = await response?.json();
  return originalJson;
};

export const getPeerIndices = async (indexid: number, exchangeid?: number) => {
  let serviceUrl = `${(APIS_CONFIG as any)?.INDICES_PEER[APP_ENV]}?indexId=${indexid}`;
  if (exchangeid !== undefined) {
    serviceUrl += `&exchangeid=${exchangeid}`;
  }
  const response = await Service.get({
    url: serviceUrl,
    params: {},
  });
  const originalJson = await response?.json();
  return originalJson;
};

export const getMarketsLiveBlog = async () => {
  const response = await Service.get({
    url: (APIS_CONFIG as any)?.MARKETS_LIVEBLOG[APP_ENV],
    params: {},
  });
  const originalJson = await response?.json();
  return originalJson;
};

export const getIndicesNews = async (indexid: number, exchangeid: number) => {
  const response = await Service.get({
    url: `${(APIS_CONFIG as any)?.INDICES_NEWS[APP_ENV]}?feedtype=etjson&indexid=${indexid}&exchange=${exchangeid}`,
    params: {},
  });
  const originalJson = await response?.json();
  return originalJson;
};

export const getOtherIndices = async (indexid: number) => {
  const response = await Service.get({
    url: `${(APIS_CONFIG as any)?.INDICES_OTHER[APP_ENV]}?indexId=${indexid}`,
    params: {},
  });
  const originalJson = await response?.json();
  return originalJson;
};

export const getIndicesFaqs = async (indexid: number) => {
  const response = await Service.get({
    url: `${(APIS_CONFIG as any)?.INDICES_FAQ[APP_ENV]}?indexid=${indexid}`,
    params: {},
  });
  const originalJson = await response?.json();
  return originalJson;
};

export const getFiiDiiSummaryData = async (apitype: string) => {
  const response = await Service.get({
    url: `${(APIS_CONFIG as any)?.FIIDII_SUMMARY[APP_ENV]}?apitype=${apitype}`,
    params: {},
  });
  const originalJson = await response?.json();
  return originalJson;
};

export const getDaywiseActivityData = async () => {
  const response = await Service.get({
    url: (APIS_CONFIG as any)?.FIIDII_OVERVIEW[APP_ENV],
    params: {},
  });
  const originalJson = await response?.json();
  return originalJson;
};

export const getFiiDiiData = async (
  apiType: FiiDiiApiType,
  params: FiiDiiApiParams,
) => {
  const { filterType, apiType: extraApiType } = params;
  let url = `${(APIS_CONFIG as any)?.[apiType][APP_ENV]}?filterType=${filterType}`;

  if (extraApiType) {
    url += `&apiType=${extraApiType}`;
  }

  const response = await Service.get({ url, params: {} });
  const originalJson = await response?.json();
  return originalJson;
};

export const fetchInvestMentData = async () => {
  try {
    const response = await Service.get({
      url: `${(APIS_CONFIG as any)?.APIDOMAIN[APP_ENV]}?type=plist&msid=81409979`,
      params: {},
    });
    const data = response ? await response.json() : {};
    const investmentData = data?.searchResult?.[0]?.data || [];
    return investmentData;
  } catch (e) {
    console.log("Error in fetching investment Data", e);
    return [];
  }
};

export const getBuySellTechnicals = async (payload: any) => {
  const response = await Service.get({
    url: `${(APIS_CONFIG as any)?.BuySellTechnical[APP_ENV]}?${convertJSONToParams(payload)}`,
    params: {},
  });
  const originalJson = await response?.json();
  let otherData: any = {};
  if (originalJson?.pagesummary) {
    otherData.unixDateTime = originalJson?.pagesummary?.priceDate;
    otherData.gainLossDays = originalJson?.pagesummary?.gainLossDays;
    otherData.gainLossYears = originalJson?.pagesummary?.gainLossYears;
  }

  let convertedData: {
    assetName: any;
    assetSeoName: any;
    assetType: any;
    assetId: any;
    assetExchangeId: any;
    assetSymbol: any;
    data: (
      | {
          keyId: string;
          keyText: string;
          value: any;
          trend: string;
          decimalValue: null;
          filterFormatValue: any;
          primeFlag: number;
          valueType: string;
        }
      | {
          keyId: string;
          keyText: string;
          value: any;
          trend: string;
          decimalValue: number;
          filterFormatValue: any;
          primeFlag: number;
          valueType: string;
        }
    )[];
  }[] = [];
  originalJson?.response.forEach((company: any) => {
    let newDataObj = {
      assetName: company.companyShortName,
      assetSeoName: company.seoName,
      assetType: company.companyType,
      assetId: company.companyId,
      assetExchangeId: payload.exchange,
      assetSymbol: company.scripCode,
      data: [
        {
          keyId: "shortName",
          keyText: "Stock Name",
          value: company.companyShortName,
          trend: "",
          decimalValue: null,
          filterFormatValue: company.companyShortName,
          primeFlag: 0,
          valueType: "text",
        },
        {
          keyId: "lastTradedPrice",
          keyText: "Price",
          value: formatNumber(company.ltp.toFixed(2), 2),
          trend: "",
          decimalValue: 2,
          filterFormatValue: company.ltp.toFixed(2),
          primeFlag: 0,
          valueType: "number",
        },
        {
          keyId: "netChange",
          keyText: "Chg",
          value: company.absoluteChange.toFixed(2),
          trend:
            company.absoluteChange < 0
              ? "down"
              : company.absoluteChange > 0
                ? "up"
                : "neutral",
          decimalValue: null,
          filterFormatValue: company.absoluteChange,
          primeFlag: 0,
          valueType: "number",
        },
        {
          keyId: "percentChange",
          keyText: "Chg%",
          value: company.percentChange.toFixed(2) + " %",
          trend:
            company.percentChange < 0
              ? "down"
              : company.percentChange > 0
                ? "up"
                : "neutral",
          decimalValue: 2,
          filterFormatValue: company.percentChange,
          primeFlag: 0,
          valueType: "number",
        },
        {
          keyId: "gainDecline",
          keyText: payload.crossoverType == "Bullish" ? "Gain*" : "Decline*",
          value:
            payload.crossoverType == "Bullish"
              ? company.averagePriceGainLossBullish.toFixed(2)
              : company.averagePriceGainLossBearish.toFixed(2),
          trend:
            payload.crossoverType == "Bullish"
              ? company.averagePriceGainLossBullish < 0
                ? "down"
                : company.averagePriceGainLossBullish > 0
                  ? "up"
                  : "neutral"
              : company.averagePriceGainLossBearish < 0
                ? "down"
                : company.averagePriceGainLossBearish > 0
                  ? "up"
                  : "neutral",
          decimalValue: 2,
          filterFormatValue:
            payload.crossoverType == "Bullish"
              ? company.averagePriceGainLossBullish
              : company.averagePriceGainLossBearish,
          primeFlag: 0,
          valueType: "number",
        },
        {
          keyId: "volume",
          keyText: "Volume",
          value: formatNumber(company.volume, 2),
          trend: "",
          decimalValue: 0,
          filterFormatValue: company.volume,
          primeFlag: 0,
          valueType: "number",
        },
      ],
    };
    convertedData.push(newDataObj);
  });
  return { table: convertedData, otherData };
};

const getExpertIdBigbull = (arr: any) => {
  if (arr && arr.length > 0) {
    // Added null check for arr
    for (let item of arr) {
      const parts = item.split(","); // Splitting each item by comma
      for (let part of parts) {
        if (part.includes("expertid-")) {
          // Checking for 'expertid-' substring
          const idParts = part.split("-");
          return idParts[idParts.length - 1];
        }
      }
    }
  }
  return null;
};
export const getBigBullPageName = (slugArray: any) => {
  const slug = slugArray.join("-");
  const checkExpertId = slugArray.some((slug: any) =>
    slug.includes("expertid-"),
  );
  // console.log("slugArray", checkExpertId);
  if (slugArray.length === 1 && checkExpertId) {
    const expertId = getExpertIdBigbull(slugArray);
    return {
      page: "investorhomepage",
      expertId: expertId,
      subCate: "",
      slug: "",
    };
  }
  if (slugArray.length === 1 && slugArray.includes("individual")) {
    return {
      page: "homepage",
      expertId: "",
      subCate: "INDIVIDUAL",
    };
  }
  if (slugArray.length === 1 && slugArray.includes("institutional")) {
    return {
      page: "homepage",
      expertId: "",
      subCate: "INSTITUTIONAL",
    };
  }

  if (slugArray.includes("all-investors") && slugArray.includes("individual")) {
    return {
      page: "allInvestors",
      expertId: "",
      subCate: "INDIVIDUAL",
    };
  } else if (
    slugArray.includes("all-investors") &&
    slugArray.includes("institutional")
  ) {
    return {
      page: "allInvestors",
      expertId: "",
      subCate: "INSTITUTIONAL",
    };
  } else if (
    slugArray.includes("qtr-changes") &&
    slugArray.includes("individual")
  ) {
    return {
      page: "qtrChanges",
      expertId: "",
      subCate: "INDIVIDUAL",
    };
  } else if (
    slugArray.includes("qtr-changes") &&
    slugArray.includes("institutional")
  ) {
    return {
      page: "qtrChanges",
      expertId: "",
      subCate: "INSTITUTIONAL",
    };
  } else if (
    slugArray.includes("recent-transactions") &&
    slugArray.includes("individual")
  ) {
    return {
      page: "recentTransactions",
      expertId: "",
      subCate: "INDIVIDUAL",
    };
  } else if (
    slugArray.includes("recent-transactions") &&
    slugArray.includes("institutional")
  ) {
    return {
      page: "recentTransactions",
      expertId: "",
      subCate: "INSTITUTIONAL",
    };
  } else if (
    slugArray.includes("best-picks") &&
    slugArray.includes("individual")
  ) {
    return {
      page: "bestPicks",
      expertId: "",
      subCate: "INDIVIDUAL",
    };
  } else if (
    slugArray.includes("best-picks") &&
    slugArray.includes("institutional")
  ) {
    return {
      page: "bestPicks",
      expertId: "",
      subCate: "INSTITUTIONAL",
    };
  } else if (slugArray.includes("most-held")) {
    return {
      page: "mostHeld",
      expertId: "",
      subCate: "INDIVIDUAL",
    };
  }

  // Check for expert page with change in holdings

  // Check for expert page with dynamic expert name and "change-in-holdings"
  if (slugArray.length === 2 && slugArray[1].startsWith("change-in-holdings")) {
    const expertId = getExpertIdBigbull(slugArray);
    return {
      page: "expertPage",
      expertId: expertId,
      subCate: "changeinholdings",
      slug: "change-in-holdings",
      subCategoryNameSeo: "Change in Holdings",
    };
  } else if (
    slugArray.length === 2 &&
    slugArray[1].startsWith("fresh-entry-exit")
  ) {
    const expertId = getExpertIdBigbull(slugArray);
    return {
      page: "expertPage",
      expertId: expertId,
      subCate: "freshEntryExit",
      slug: "fresh-entry-exit",
      subCategoryNameSeo: "Fresh Entry & Exit",
    };
  } else if (slugArray.length === 2 && slugArray[1].startsWith("holdings")) {
    const expertId = getExpertIdBigbull(slugArray);
    return {
      page: "expertPage",
      expertId: expertId,
      subCate: "holdings",
      slug: "holdings",
      subCategoryNameSeo: "Holdings",
    };
  } else if (
    slugArray.length === 2 &&
    slugArray[1].startsWith("bulk-block-deals")
  ) {
    const expertId = getExpertIdBigbull(slugArray);
    return {
      page: "expertPage",
      expertId: expertId,
      subCate: "bulkBlockDeals",
      slug: "bulk-block-deals",
      subCategoryNameSeo: "Bulk/Block Deals",
    };
  }
  return "UnknownPage";
};

export const getBigbullTopTabData = (slug: any) => {
  return [
    {
      title: "Overview",
      id: "overview",
      url: `/markets/top-india-investors-portfolio/${slug}`,
    },
    {
      title: "All Investors",
      id: "allInvestors",
      url: `/markets/top-india-investors-portfolio/${slug}/all-investors`,
    },
    {
      title: "Qtr. Changes",
      id: "qtrChanges",
      url: `/markets/top-india-investors-portfolio/${slug}/qtr-changes`,
    },
    {
      title: "Recent Transactions",
      id: "recentTransactions",
      url: `/markets/top-india-investors-portfolio/${slug}/recent-transactions`,
    },
    {
      title: "Best Picks",
      id: "bestPicks",
      url: `/markets/top-india-investors-portfolio/${slug}/best-picks`,
    },
    {
      title: "Most Held",
      id: "mostHeld",
      url: `/markets/top-india-investors-portfolio/most-held`,
    },
  ];
};
export const removeBackSlash = (val: string) => {
  val = val && typeof val != "object" ? val.replace(/\\/g, "") : "";
  return val;
};

export const encodeHTML = (html: any) => {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const saveLogs = (data: any) => {
  if (typeof window !== "undefined") {
    // Check if running in a browser environment
    if (data && window.location.hostname != "localhost") {
      try {
        const isLive = APP_ENV == "development" ? 0 : 1;
        data.TicketId = getCookie("TicketId");
        data.ssoid = getCookie("ssoid");
        data.gid = getCookie("_grx") || "-";
        if (window.objUser) {
          if (
            !data.emailid &&
            window.objUser.info &&
            window.objUser.info.primaryEmail
          ) {
            data.emailid = window.objUser.info.primaryEmail;
          }
          if (!data.ssoid && window.objUser.ssoid) {
            data.ssoid = window.objUser.ssoid;
          }
          if (!data.TicketId && window.objUser.ticketId) {
            data.TicketId = window.objUser.ticketId;
          }
        }
        data.geoinfo = window?.geoinfo;
        data.ua = (navigator && navigator.userAgent) || "";
        var logdata =
          "logdata=" +
          JSON.stringify({
            ref: (isLive ? "live" : "dev") + "_react",
            data: data,
            url: window.location.href,
          });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            console.log(this.responseText);
          }
        });
        //console.log("Log Data>>>>",logdata);

        xhr.open("POST", "https://etx.indiatimes.com/log?et=desktop");
        xhr.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded",
        );
        xhr.send(logdata);
      } catch (e) {
        console.log("Error in save logs api");
      }
    }
  } else {
    console.log("saveLogs: window is not defined, skipping log save.");
  }
};
export const loadScript = (
  src: string,
  async: boolean = true,
  type: string = "text/javascript",
  position: "head" | "body" = "body",
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = type;
    script.async = async;
    script.src = src;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    if (position === "head") {
      document.head.appendChild(script);
    } else {
      document.body.appendChild(script);
    }
  });
};

export const sendMouseFlowEvent = async (): Promise<void> => {
  try {
    await loadScript(
      "//cdn.mouseflow.com/projects/81baae85-f91c-464e-ac38-15a987752b7a.js",
    );

    if (typeof window !== "undefined") {
      window._mfq = window._mfq || [];
      window._mfq.push(["setVariable", "ETMarketsMercury"]);
    }
  } catch (error) {
    console.error("Failed to load Mouseflow script", error);
  }
};
export const fetchSectors = async () => {
  try {
    const apiUrl = (APIS_CONFIG as any)?.["SECTORS_LIST"][APP_ENV];
    const response = await Service.get({
      url: apiUrl,
      params: {},
    });
    return response?.json();
  } catch (e) {
    console.log("error in fetching indices data", e);
    saveLogs({
      type: "Mercury",
      res: "error",
      msg: "Error in fetching indices data",
    });
  }
};
export const fetchSelectedSectors = async (
  seoNameOrIndexId?: string | number,
) => {
  try {
    const data = await fetchSectors();

    // Check if data is defined and is an array
    if (!Array.isArray(data)) {
      return { name: "All Stocks", indexId: 0, seoname: "", exchange: "nse" };
    }

    let filteredIndex;
    if (seoNameOrIndexId) {
      filteredIndex = data.find((item: any) => {
        return (
          item.assetSeoName === seoNameOrIndexId ||
          item.assetId === seoNameOrIndexId
        );
      });
    }

    return (
      filteredIndex || {
        name: "All Stocks",
        indexId: 0,
        seoname: "",
        exchange: "nse",
      }
    );
  } catch (error) {
    console.error("Error fetching filters:", error);
    return { name: "All Stocks", indexId: 0, seoname: "", exchange: "nse" };
  }
};
export const getAllSectors = async (sortField: any, sortOrder: string) => {
  try {
    let apiUrl = `${(APIS_CONFIG as any)?.ALLSECTORS[APP_ENV]}?sortedField=${sortField}&sortedOrder=${sortOrder}`;

    const response = await Service.get({
      url: apiUrl,
      params: {},
    });

    if (!response || !response.ok) {
      throw new Error(`HTTP error! Status: ${response?.status}`);
    }

    const responseData = await response.json();
    let tableData: any[] = [];
    let tableHeaderData: any[] = [];
    let unixDateTime = new Date().getTime();

    if (responseData?.dataList?.length > 0) {
      tableData = responseData.dataList;
      if (tableData[0]?.data) {
        tableHeaderData = tableData[0].data;
      }
    }

    if (responseData?.dateTime) {
      unixDateTime = responseData.dateTime * 1000;
    }

    return {
      tableHeaderData,
      tableData,
      unixDateTime,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return default values on error
    return {
      tableHeaderData: [],
      tableData: [],
      unixDateTime: new Date().getTime(),
    };
  }
};
export const getSectorsOverview = async (indexid: number) => {
  const response = await Service.get({
    url: `${(APIS_CONFIG as any)?.SECTORS_OVERVIEW[APP_ENV]}?sectorId=${indexid}`,
    params: {},
  });
  const originalJson = await response?.json();
  return originalJson;
};

export const getPeerSectors = async (indexid: number) => {
  let serviceUrl = `${(APIS_CONFIG as any)?.SECTORS_PEER[APP_ENV]}?sectorIds=${indexid}`;

  console.log("@@@@ serviceUrl", serviceUrl);
  const response = await Service.get({
    url: serviceUrl,
    params: {},
  });
  const originalJson = await response?.json();
  return originalJson;
};
export const getOtherSectors = async (indexid: number) => {
  const response = await Service.get({
    url: `${(APIS_CONFIG as any)?.SECTORS_OTHER[APP_ENV]}?sectorIds=${indexid}`,
    params: {},
  });
  const originalJson = await response?.json();
  return originalJson;
};
export const getSectorFaqs = async (indexid: number) => {
  const response = await Service.get({
    url: `${(APIS_CONFIG as any)?.SECTORS_FAQ[APP_ENV]}?sectorid=${indexid}`,
    params: {},
  });
  const originalJson = await response?.json();
  return originalJson;
};
