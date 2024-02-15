import APIS_CONFIG from "../network/api_config.json";
import { APP_ENV } from "../utils";
import Fingerprint2 from "fingerprintjs2";
import { setCookies } from "./index";
import Service from "../network/service";

const API_SOURCE = 18;

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

export const generateFpid = (isLogin: any) => {
  new Fingerprint2.get((components: any[]) => {
    var values = components.map((component: { value: any }) => component.value);
    var murmur = Fingerprint2.x64hash128(values.join(""), 31); // an array of components: {key: ..., value: ...}
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
  const params = {
    type: 7,
    source: API_SOURCE,
  };
  const headers = {
    "Content-type": "application/json",
    Authorization: fpid,
  };

  const url = (APIS_CONFIG as any)?.PERSONALISATION[APP_ENV];
  Service.get({ url, headers, params: params, withCredentials: true })
    .then((res: any) => {
      if (res && res.data && res.data.id != 0) {
        console.log("@@@@--->>>>>", res);
        var pfuuid = res.data.id;
        setCookies("pfuuid", pfuuid);
      }
      // if (res && res.data && res.data.newUser) {
      //   grxEvent('event', {'event_category': 'New_User_Registration', 'event_action': 'New_User', 'event_label': 'New_User'});
      // }
    })
    .catch((e: any) => console.log("error in createPfuuid", e));
};

export const createPeuuid = (fpid: any) => {
  const params = {
    type: 0,
    source: API_SOURCE,
  };
  const url = (APIS_CONFIG as any)?.PERSONALISATION[APP_ENV];
  const headers = {
    "Content-type": "application/json",
  };
  Service.get({ url, headers, params: params, withCredentials: true })
    .then((res: any) => {
      if (res && res.data && res.data.id != 0) {
        const peuuid: any = res.data.id;
        console.log("@@@@--->>>>>2", res);
        setCookies("peuuid", peuuid);
      }
    })
    .catch((e: any) => console.log("error in createPeuuid", e));
};
