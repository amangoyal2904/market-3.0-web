import APIS_CONFIG from "../network/api_config.json";
import { APP_ENV } from "../utils";

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
