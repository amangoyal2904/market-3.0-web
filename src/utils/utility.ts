import APIS_CONFIG from "../network/api_config.json";
import { APP_ENV } from "../utils/index";
import { getCookie } from "../utils/index";

export const fetchTabsData = async () => {
  //const ssoid = "a9s3kgugi5gkscfupjzhxxx2y"
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

export const fetchTableData = async (viewId: any) => {
  //const ssoid = "a9s3kgugi5gkscfupjzhxxx2y"
  const ssoid = window.objUser?.ssoid;
  const apiUrl = (APIS_CONFIG as any)?.watchListTable["development"];
  const data = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ssoid: ssoid,
    },
    body: JSON.stringify({
      sort: [],
      type: "STOCK",
      viewId: viewId,
      deviceId: "web",
    }),
  });
  const res = await data.json();
  console.log("tabledata", res);
  return res;
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

export const fetchAllWatchListData = async (type:any,usersettingsubType:any)=>{
  const authorization:any = getCookie('peuuid') ? getCookie('peuuid') : '1135320605';
  const isLocalhost = window.location.origin.includes('localhost');
  
  const apiUrl = isLocalhost
    ? `${(APIS_CONFIG as any)?.WATCHLISTAPI.getAllWatchlistNextJsAPI[APP_ENV]}?type=${type}&usersettingsubType=${usersettingsubType}&authorization=${authorization}`
    : `${(APIS_CONFIG as any)?.WATCHLISTAPI.getAllWatchlist[APP_ENV]}?type=${type}&usersettingsubType=${usersettingsubType}`;
    const headers = new Headers({ 'Authorization': authorization });
    const options:any = {
      cache: 'no-store',
      headers: headers
    };
    try {
      const response = await fetch(apiUrl, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error fetching watchlist data:', error);
      throw error;
    }
}

export const saveStockInWatchList = async (followData:any)=>{
  const authorization:any = getCookie('peuuid') ? getCookie('peuuid') : '1135320605';
  const isLocalhost = window.location.origin.includes('localhost');
  let postBodyData = {};
  if(isLocalhost){
    postBodyData = {
      _authorization:authorization,
      followData
    }
  }else {
    postBodyData = followData
  }
  const apiUrl = isLocalhost
    ? `${(APIS_CONFIG as any)?.WATCHLISTAPI.addWatchListNextJsAPI[APP_ENV]}`
    : `${(APIS_CONFIG as any)?.WATCHLISTAPI.addWatchList[APP_ENV]}`;
    const headers = new Headers({ 'Authorization': authorization ,"Content-Type": "application/json"});
    const options:any = {
      method: 'POST',
      cache: 'no-store',
      headers: headers,
      body: JSON.stringify(postBodyData)
    };
    try {
      const response = await fetch(apiUrl, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error saving stock in watchlist:', error);
      throw error;
    }
}

export const removeMultipleStockInWatchList = async (followData:any)=>{
  const authorization:any = getCookie('peuuid') ? getCookie('peuuid') : '1135320605';
  const isLocalhost = window.location.origin.includes('localhost');
  let postBodyData = {};
  if(isLocalhost){
    postBodyData = {
      _authorization:authorization,
      followData
    }
  }else {
    postBodyData = followData
  }
  const apiUrl = isLocalhost
    ? `${(APIS_CONFIG as any)?.WATCHLISTAPI.multipleWatchListNextJsAPI[APP_ENV]}`
    : `${(APIS_CONFIG as any)?.WATCHLISTAPI.multipleWatchList[APP_ENV]}`;
    const headers = new Headers({ 'Authorization': authorization ,"Content-Type": "application/json"});
    const options:any = {
      method: 'POST',
      cache: 'no-store',
      headers: headers,
      body: JSON.stringify(postBodyData)
    };
    try {
      const response = await fetch(apiUrl, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error saving stock in watchlist:', error);
      throw error;
    }
}
