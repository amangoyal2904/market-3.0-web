import APIS_CONFIG from "@/network/api_config.json";
import GLOBAL_CONFIG from "@/network/global_config.json";
import { APP_ENV } from "@/utils/index";
import { getCookie } from "@/utils/index";
import Fingerprint2 from "fingerprintjs2";
import { setCookies } from "./index";
import CryptoJS from "crypto-js";
import Service from "@/network/service";

const API_SOURCE = 18;

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

export const fetchFilters = async () => {
  const apiUrl =
    "https://economictimes.indiatimes.com/feed/feed_indexfilterdata.cms?feedtype=etjson";
  const response = await Service.get({
    url: apiUrl,
    params: {},
  });
  return response?.json();
};

export const fetchTabsData = async () => {
  const ssoid = window.objUser?.ssoid;
  const apiUrl = `${APIS_CONFIG?.watchListTab["development"]}?ssoid=${ssoid}`;
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
  const isprimeuser = getCookie("isprimeuser") ? true : false;
  const apiUrl = (APIS_CONFIG as any)?.watchListTable["development"];
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

export const decryptPrimeData = (pageSummary: string, encrytedTxt: string) => {
  const secretkey = GLOBAL_CONFIG.securityKey;
  const key = CryptoJS.enc.Utf8.parse(secretkey);
  const iv = CryptoJS.enc.Utf8.parse(pageSummary);

  const decrypted = CryptoJS.AES.decrypt(encrytedTxt, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const getStockUrl = (id: string, seoName: string, stockType: string) => {
  if (seoName.indexOf(" ") >= 0) {
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
    stockUrl = stockUrl + "?companytype=" + stockType.toLowerCase();
  return stockUrl;
};

export const fetchAllWatchListData = async (
  type: any,
  usersettingsubType: any,
) => {
  const authorization: any = getCookie("peuuid") ? getCookie("peuuid") : "";
  const isLocalhost = window.location.origin.includes("localhost");

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
  setCookies("fpid", data);
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
      setCookies("pfuuid", pfuuid);
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
    setCookies("peuuid", peuuid);
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
const fetchSelectedFilter = async (data: any, desiredIndexId: any) => {
  let filterData;
  if (data.keyIndices.nse.some((obj: any) => obj.indexId == desiredIndexId)) {
    filterData = data.keyIndices.nse.find(
      (obj: any) => obj.indexId == desiredIndexId,
    );
    filterData.selectedTab = "nse";
  } else if (
    data.keyIndices.bse.some((obj: any) => obj.indexId == desiredIndexId)
  ) {
    filterData = data.keyIndices.bse.find(
      (obj: any) => obj.indexId == desiredIndexId,
    );
    filterData.selectedTab = "bse";
  } else if (
    data.sectoralIndices.nse.some((obj: any) => obj.indexId == desiredIndexId)
  ) {
    filterData = data.sectoralIndices.nse.find(
      (obj: any) => obj.indexId == desiredIndexId,
    );
    filterData.selectedTab = "nse";
  } else if (
    data.sectoralIndices.bse.some((obj: any) => obj.indexId == desiredIndexId)
  ) {
    filterData = data.sectoralIndices.bse.find(
      (obj: any) => obj.indexId == desiredIndexId,
    );
    filterData.selectedTab = "bse";
  } else if (
    data.otherIndices.nse.some((obj: any) => obj.indexId == desiredIndexId)
  ) {
    filterData = data.otherIndices.nse.find(
      (obj: any) => obj.indexId == desiredIndexId,
    );
    filterData.selectedTab = "nse";
  } else if (
    data.otherIndices.bse.some((obj: any) => obj.indexId == desiredIndexId)
  ) {
    filterData = data.otherIndices.bse.find(
      (obj: any) => obj.indexId == desiredIndexId,
    );
    filterData.selectedTab = "bse";
  }
  return filterData;
};

export const getSelectedFilter = async (filter: any) => {
  let selectedFilter;
  const filters = await fetchFilters();
  if (!!filter) {
    selectedFilter = await fetchSelectedFilter(filters, filter);
  } else {
    selectedFilter = { name: "All Stocks", indexId: 0, selectedTab: "nse" };
  }

  return {
    name: selectedFilter.name,
    id: selectedFilter.indexId,
    selectedTab: selectedFilter.selectedTab,
  };
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
