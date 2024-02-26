import APIS_CONFIG from "@/network/api_config.json";
import GLOBAL_CONFIG from "@/network/global_config.json";
import { APP_ENV } from "@/utils/index";
import { getCookie } from "@/utils/index";
import Fingerprint2 from "fingerprintjs2";
import { setCookies } from "./index";
import CryptoJS from "crypto-js";
import Service from "@/network/service";

const API_SOURCE = 18;

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
    generator: "ET Markets",
    applicationName: "ET Markets",
    keywords: meta?.meta_keywords?.split(","),
    metadataBase: new URL("https://economictimes.indiatimes.com/"),
    alternates: {
      canonical: "/",
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
    manifest: "/manifest.cms",
  };
};

export const fetchTechnicalCategory = async (params: any, type: any) => {
  let category = params.technicals[0];
  if (category == "moving-averages") {
    category =
      type == "ema-ema-crossovers" || type == "price-ema-crossovers"
        ? "ema-ema-crossovers"
        : "sma-sma-crossovers";
  }
  const apiUrl =
    "https://qcbselivefeeds.indiatimes.com/et-screener/operands-data?category=" +
    category;
  const response = await Service.get({
    url: apiUrl,
    params: {},
  });
  return response?.json();
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
      isprimeuser: isprimeuser,
    },
    cache: "no-store",
    body: JSON.stringify({ ...requestObj }),
    params: {},
  });
  return response?.json();
};

export const fetchTableData = async (viewId: any, params?: any) => {
  const ssoid = window.objUser?.ssoid;
  const apiUrl = (APIS_CONFIG as any)?.watchListTable["development"];
  const data = await fetch(apiUrl, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ssoid: ssoid,
    },
    body: JSON.stringify({
      sort: [],
      type: "STOCK",
      viewId: viewId,
      deviceId: "web",
      ...params,
    }),
  });
  const res = await data.json();
  //console.log("tabledata", res);
  return res;
};

export const decryptPrimeData = (ivKey: string, encrytedTxt: string) => {
  debugger;
  const secretkey = GLOBAL_CONFIG.securityKey;
  const key = CryptoJS.enc.Utf8.parse(secretkey);
  const iv = CryptoJS.enc.Utf8.parse(ivKey);

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
  const authorization: any = getCookie("peuuid")
    ? getCookie("peuuid")
    : "1135320605";
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
  const authorization: any = getCookie("peuuid")
    ? getCookie("peuuid")
    : "1135320605";
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
  const authorization: any = getCookie("peuuid")
    ? getCookie("peuuid")
    : "1135320605";
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
