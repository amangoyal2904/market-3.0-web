// @ts-nocheck
import { getCookie } from "@/utils";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils/index";
import Service from "../network/service";
import GLOBAL_CONFIG from "../network/global_config.json";
import grxMappingObj from "@/utils/grxMappingObj.json";
import cdpObj from "@/utils/cdpObj.json";
import { usePathname } from "next/navigation";
declare global {
  interface Window {
    trackingEvent: (type: string, gaData: object) => void;
    dataLayer: [];
    customDimension: any;
  }
}

export const redirectToPlanPage = (
  objTracking,
  type = "select_item",
  redirect = true,
) => {
  try {
    if (redirect) {
      trackingEvent("et_push_event", {
        event_category: objTracking.category,
        event_action: objTracking.action,
        event_label: objTracking.label,
      });
    }
    goToPlansPage1(type, objTracking.obj, redirect);
  } catch (Err) {
    console.log("redirectToPlanPage Err:", Err);
    goToPlansPage1(type, {}, redirect);
  }
};

export const goToPlansPage1 = (type, data, redirect) => {
  if (window.dataLayer) {
    let _gtmEventDimension = {};
    _gtmEventDimension = updateGtm(_gtmEventDimension);
    _gtmEventDimension["event"] = type;
    let items = [];
    data["subscription_status"] =
      typeof window.objUser != "undefined" && window?.objUser?.permissions
        ? getUserType(window.objUser.permissions)
        : "Free User";
    data["subscription_type"] =
      typeof window.objUser != "undefined" && window?.objUser?.permissions
        ? getUserType(window.objUser.permissions)
        : "Free User";
    items.push(data);
    _gtmEventDimension["items"] = items;
    window.dataLayer.push(_gtmEventDimension);
    trackPushData(_gtmEventDimension, data, redirect);
  }
};

export const trackPushData = (
  _gtmEventDimension: any,
  planDim: any,
  redirect,
) => {
  let url = (APIS_CONFIG as any)?.PUSHDATA[APP_ENV],
    grxMapObj = {},
    newGrxMapObj = grxMappingObj,
    objUserData = {},
    ga4Items = {};

  const objGTMdata = Object.assign({}, _gtmEventDimension);
  let sendGTMdata = Object.assign({}, planDim);
  sendGTMdata["feature_name"] = objGTMdata.feature_name;
  sendGTMdata["site_section"] = objGTMdata.site_section;
  sendGTMdata["site_sub_section"] = objGTMdata.site_sub_section;
  if (window.objUser && window.objUser.info.isLogged) {
    const { primaryEmail, mobile, firstName, lastName } = window.objUser.info;
    const fullName = firstName + (lastName ? " " + lastName : "");
    objUserData.email = primaryEmail;
    objUserData.mobile = mobile;
    objUserData.fname = firstName;
    objUserData.fullname = fullName;
  }
  // const getGrxData = generateGrxFunnel();
  // console.log("getGrxData------>",getGrxData);
  const dataToPost = {
    ET: {},
    grxMappingObj: newGrxMapObj,
    objUserData: objUserData,
    analytics_cdp: {},
    ga4Items: sendGTMdata,
  };
  const pushData = {
    logdata: JSON.stringify(dataToPost),
    merchantType: "ET",
    grxId: getCookie("_grx"),
  };
  const ticketId = getCookie("encTicket")
    ? `&ticketid=${getCookie("encTicket")}`
    : "";
  const planUrl = (GLOBAL_CONFIG as any)[APP_ENV]["Plan_PAGE"];
  const newPlanUrl =
    planUrl +
    (planUrl.indexOf("?") == -1 ? "?" : "&") +
    "ru=" +
    encodeURI(window.location.href) +
    "&grxId=" +
    getCookie("_grx") +
    ticketId;
  const headers = {
    "Content-Type": "application/json",
  };
  Service.post({
    url,
    headers: headers,
    body: JSON.stringify(pushData),
    params: {},
  })
    .then((res) => {
      if (redirect) {
        window.location.href = newPlanUrl;
      }
    })
    .catch((err) => {
      if (redirect) {
        window.location.href = newPlanUrl;
      }
    });
};
export const trackingEvent = (type, data) => {
  if (window.dataLayer) {
    let _gtmEventDimension = {};
    _gtmEventDimension = updateGtm(_gtmEventDimension);
    _gtmEventDimension["event"] = type;
    _gtmEventDimension = Object.assign(_gtmEventDimension, data);
    window.dataLayer.push(_gtmEventDimension);
  }
};

export const getUserType = (permissionsArr) => {
  try {
    var userType = "New";
    if (permissionsArr.length > 0) {
      if (permissionsArr.some((str) => str.includes("expired_subscription"))) {
        userType = "expired";
      } else if (
        permissionsArr.some((str) => str.includes("subscribed")) &&
        permissionsArr.some((str) => str.includes("cancelled_subscription")) &&
        permissionsArr.some((str) => str.includes("can_buy_subscription"))
      ) {
        userType = "trial";
      } else if (
        permissionsArr.some((str) => str.includes("cancelled_subscription"))
      ) {
        userType = "cancelled";
      } else if (
        permissionsArr.some((str) => str.includes("active_subscription")) ||
        permissionsArr.some((str) => str.includes("subscribed"))
      ) {
        userType = "Paid Active";
      } else if (
        permissionsArr.some((str) => str.includes("can_buy_subscription"))
      ) {
        userType = "free";
      }
    }
    return userType;
  } catch (e) {
    console.log("checkUserPermissions:" + e);
  }
};

export const getPageName = (pageURL = "") => {
  const pagePathName = pageURL || (window && window.location.pathname);
  let pageName = "";
  if (pagePathName.includes("/marketstats")) {
    pageName = "Mercury_MarketStats";
  } else if (pagePathName.includes("/stock-recos")) {
    pageName = "Mercury_Recos";
  } else if (pagePathName.includes("/stock-screener")) {
    pageName = "Mercury_Screener";
  } else if (pagePathName.includes("/indices")) {
    pageName = "Mercury_Indices";
  } else if (pagePathName.includes("/top-india-investors-portfolio/")) {
    pageName = "Mercury_BigBull";
  } else if (pagePathName.includes("/stockreportsplus")) {
    pageName = "Mercury_StockReportsPlus";
  } else if (pagePathName.includes("/fiidii")) {
    pageName = "Mercury_FII/DII";
  } else if (pagePathName.includes("/watchlist")) {
    pageName = "Mercury_Watchlist";
  } else if (pagePathName.includes("/live-coverage")) {
    pageName = "Mercury_HomePage";
  } else if (pagePathName.includes("/stock-market-mood")) {
    pageName = "Mercury_MarketMood";
  } else {
    pageName = "Mercury";
  }
  return pageName;
};

export const updateGtm = (_gtmEventDimension) => {
  const pagePathName = window.location.pathname;
  const pageElem = window.location.pathname.split("/");
  let site_section = pagePathName.slice(1);
  let lastSlash = site_section.lastIndexOf("/");
  _gtmEventDimension["feature_name"] = getPageName().replace("Mercury_", "");
  _gtmEventDimension["site_section"] =
    site_section.indexOf("/") == -1
      ? site_section.substring(site_section.indexOf("/") + 1)
      : site_section.substring(0, site_section.indexOf("/"));
  _gtmEventDimension["login_status"] =
    typeof window.objUser != "undefined" ? "Logged In" : "Not Logged In";
  _gtmEventDimension["user_login_status_hit"] =
    typeof window.objUser != "undefined" ? "Logged In" : "Not Logged In";
  _gtmEventDimension["user_login_status_session"] =
    typeof window.objUser != "undefined" ? "Logged In" : "Not Logged In";
  _gtmEventDimension["last_click_source"] = site_section;
  let trafficSource = "direct";
  let dref = document.referrer,
    wlh = window.location.href.toLowerCase();
  if (/google|bing|yahoo/gi.test(dref)) {
    trafficSource = "organic";
  } else if (
    /facebook|linkedin|instagram|twitter/gi.test(dref) ||
    wlh.indexOf("utm_medium=social") != -1
  ) {
    trafficSource = "social";
  } else if (wlh.indexOf("utm_medium=email") != -1) {
    trafficSource = "newsletter";
  } else if (wlh.indexOf("utm_source=etnotifications") != -1) {
    trafficSource = "notifications";
  }
  _gtmEventDimension["internal_source"] = trafficSource;
  _gtmEventDimension["user_id"] =
    typeof window.objUser != "undefined" && window.objUser?.ssoid
      ? window.objUser.ssoid
      : "";
  _gtmEventDimension["site_sub_section"] = site_section;
  _gtmEventDimension["user_grx_id"] = getCookie("_grx")
    ? getCookie("_grx")
    : "";
  _gtmEventDimension["subscription_status"] =
    typeof window.objUser != "undefined" && window?.objUser?.permissions
      ? getUserType(window.objUser.permissions)
      : "Free User";
  _gtmEventDimension["current_subscriber_status"] =
    typeof window.objUser != "undefined" && window?.objUser?.permissions
      ? getUserType(window.objUser.permissions)
      : "Free User";
  _gtmEventDimension["user_subscription_status"] =
    typeof window.objUser != "undefined" && window?.objUser?.permissions
      ? getUserType(window.objUser.permissions)
      : "Free User";
  _gtmEventDimension["platform"] = "Web";
  _gtmEventDimension["page_template"] = site_section.substring(lastSlash + 1);
  _gtmEventDimension["feature_permission"] =
    typeof window.objUser != "undefined" &&
    window.objUser.accessibleFeatures &&
    window.objUser.accessibleFeatures.length > 0
      ? window.objUser.accessibleFeatures
      : "";
  _gtmEventDimension["country"] = window?.geoinfo.CountryCode;
  _gtmEventDimension["email"] = window?.objUser?.info?.primaryEmail
    ? window?.objUser?.info?.primaryEmail
    : "";
  _gtmEventDimension["et_product"] = getPageName();
  _gtmEventDimension["et_uuid"] = getCookie("peuuid")
    ? getCookie("peuuid")
    : getCookie("pfuuid");
  _gtmEventDimension["first_name"] = window?.objUser?.info?.firstName
    ? window?.objUser?.info?.firstName
    : "";
  _gtmEventDimension["last_name"] = window?.objUser?.info?.lastName
    ? window?.objUser?.info?.lastName
    : "";
  _gtmEventDimension["loggedin"] =
    typeof window.objUser != "undefined" ? "Yes" : "No";
  _gtmEventDimension["pageTitle"] = document.title;
  _gtmEventDimension["referral_url"] = document.referrer;
  _gtmEventDimension["ssoid"] = getCookie("ssoid") ? getCookie("ssoid") : "";
  _gtmEventDimension["user_region"] = window?.geoinfo.region_code;
  _gtmEventDimension["web_peuuid"] = getCookie("peuuid");
  _gtmEventDimension["web_pfuuid"] = getCookie("pfuuid");
  return _gtmEventDimension;
};

export const generateGrxFunnel = () => {
  const pagePathName = window.location.pathname;
  const pageElem = window.location.pathname.split("/");
  let site_section = pagePathName.slice(1);
  let lastSlash = site_section.lastIndexOf("/");
  let objGrx = {};
  objGrx["dimension1"] = getPageName();
  objGrx["dimension26"] =
    site_section.indexOf("/") == -1
      ? site_section.substring(site_section.indexOf("/") + 1)
      : site_section.substring(0, site_section.indexOf("/"));
  objGrx["dimension146"] = typeof window.objUser != "undefined" ? "Y" : "N";
  objGrx["dimension27"] = site_section;
  objGrx["dimension12"] = "";
  objGrx["dimension147"] =
    typeof window.objUser != "undefined" && window?.objUser?.permissions
      ? getUserType(window.objUser.permissions)
      : "Free User";
  objGrx["dimension20"] = "Web";
  objGrx["dimension25"] = site_section.substring(lastSlash + 1);
  objGrx["dimension143"] =
    typeof window.objUser != "undefined" &&
    window.objUser.accessibleFeatures &&
    window.objUser.accessibleFeatures.length > 0
      ? window.objUser.accessibleFeatures
      : "";
  objGrx["dimension48"] = "";
  objGrx["dimension96"] = 0;
  objGrx["dimension94"] = 0;
  objGrx["dimension98"] = 0;
  let trafficSource = "direct";
  let dref = document.referrer,
    wlh = window.location.href.toLowerCase();
  if (/google|bing|yahoo/gi.test(dref)) {
    trafficSource = "organic";
  } else if (
    /facebook|linkedin|instagram|twitter/gi.test(dref) ||
    wlh.indexOf("utm_medium=social") != -1
  ) {
    trafficSource = "social";
  } else if (wlh.indexOf("utm_medium=email") != -1) {
    trafficSource = "newsletter";
  } else if (wlh.indexOf("utm_source=etnotifications") != -1) {
    trafficSource = "notifications";
  }
  objGrx["dimension93"] = trafficSource;
  objGrx["dimension92"] = site_section;
  objGrx["dimension109"] = window?.geoinfo.region_code;
  objGrx["dimension10"] =
    typeof window.objUser != "undefined" ? "LOGGEDIN" : "NONLOGGEDIN";
  objGrx["dimension3"] =
    typeof window.objUser != "undefined" ? "LOGGEDIN" : "NONLOGGEDIN";
  objGrx["dimension37"] =
    typeof window.objUser != "undefined" && window?.objUser?.permissions
      ? getUserType(window.objUser.permissions)
      : "Free User";
  objGrx["dimension145"] = "ET_Mercury";
  // objGrx["feature_name"] = getPageName().replace("Mercury_", "");
  // objGrx["referral_url"] = document.referrer;
  // objGrx["url"] = window.location.href;
  // objGrx["user_id"] =
  //   typeof window.objUser != "undefined" && window.objUser?.ssoid
  //     ? window.objUser.ssoid
  //     : "";
  // objGrx["user_grx_id"] = getCookie("_grx") ? getCookie("_grx") : "";
  // objGrx["subscription_status"] =
  //   typeof window.objUser != "undefined" && window?.objUser?.permissions
  //     ? getUserType(window.objUser.permissions)
  //     : "Free User";
  // objGrx["current_subscriber_status"] =
  //   typeof window.objUser != "undefined" && window?.objUser?.permissions
  //     ? getUserType(window.objUser.permissions)
  //     : "Free User";
  // objGrx["user_subscription_status"] =
  //   typeof window.objUser != "undefined" && window?.objUser?.permissions
  //     ? getUserType(window.objUser.permissions)
  //     : "Free User";

  // objGrx["country"] = window?.geoinfo.CountryCode;
  // objGrx["email"] = window?.objUser?.info?.primaryEmail
  //   ? window?.objUser?.info?.primaryEmail
  //   : "";
  // objGrx["et_uuid"] = getCookie("peuuid")
  //   ? getCookie("peuuid")
  //   : getCookie("pfuuid");
  // objGrx["first_name"] = window?.objUser?.info?.firstName
  //   ? window?.objUser?.info?.firstName
  //   : "";
  // objGrx["last_name"] = window?.objUser?.info?.lastName
  //   ? window?.objUser?.info?.lastName
  //   : "";
  // objGrx["loggedin"] = typeof window.objUser != "undefined" ? "Yes" : "No";
  // objGrx["pageTitle"] = document.title;
  // objGrx["ssoid"] = getCookie("ssoid") ? getCookie("ssoid") : "";
  // objGrx["web_peuuid"] = getCookie("peuuid");
  // objGrx["web_pfuuid"] = getCookie("pfuuid");
  return objGrx;
};

export const generateCDPPageView = () => {
  const pagePathName = window.location.pathname;
  const pageElem = window.location.pathname.split("/");
  let site_section = pagePathName.slice(1);
  let lastSlash = site_section.lastIndexOf("/");
  cdpObj["feature_name"] = getPageName().replace("Mercury_", "");
  cdpObj["level_1"] =
    site_section.indexOf("/") == -1
      ? site_section.substring(site_section.indexOf("/") + 1)
      : site_section.substring(0, site_section.indexOf("/"));
  cdpObj["level_2"] = site_section;
  cdpObj["referral_url"] = document.referrer;
  cdpObj["page_template"] = site_section.substring(lastSlash + 1);
  cdpObj["url"] = window.location.href;
  cdpObj["login_status"] =
    typeof window.objUser != "undefined" ? "Logged In" : "Not Logged In";
  cdpObj["user_login_status_hit"] =
    typeof window.objUser != "undefined" ? "Logged In" : "Not Logged In";
  cdpObj["user_login_status_session"] =
    typeof window.objUser != "undefined" ? "Logged In" : "Not Logged In";
  cdpObj["last_click_source"] = site_section;
  let trafficSource = "direct";
  let dref = document.referrer,
    wlh = window.location.href.toLowerCase();
  if (/google|bing|yahoo/gi.test(dref)) {
    trafficSource = "organic";
  } else if (
    /facebook|linkedin|instagram|twitter/gi.test(dref) ||
    wlh.indexOf("utm_medium=social") != -1
  ) {
    trafficSource = "social";
  } else if (wlh.indexOf("utm_medium=email") != -1) {
    trafficSource = "newsletter";
  } else if (wlh.indexOf("utm_source=etnotifications") != -1) {
    trafficSource = "notifications";
  }
  cdpObj["internal_source"] = trafficSource;
  cdpObj["user_id"] =
    typeof window.objUser != "undefined" && window.objUser?.ssoid
      ? window.objUser.ssoid
      : "";

  cdpObj["user_grx_id"] = getCookie("_grx") ? getCookie("_grx") : "";
  cdpObj["subscription_status"] =
    typeof window.objUser != "undefined" && window?.objUser?.permissions
      ? getUserType(window.objUser.permissions)
      : "Free User";
  cdpObj["current_subscriber_status"] =
    typeof window.objUser != "undefined" && window?.objUser?.permissions
      ? getUserType(window.objUser.permissions)
      : "Free User";
  cdpObj["user_subscription_status"] =
    typeof window.objUser != "undefined" && window?.objUser?.permissions
      ? getUserType(window.objUser.permissions)
      : "Free User";
  cdpObj["platform"] = "Web";

  cdpObj["feature_permission"] =
    typeof window.objUser != "undefined" &&
    window.objUser.accessibleFeatures &&
    window.objUser.accessibleFeatures.length > 0
      ? window.objUser.accessibleFeatures
      : "";
  cdpObj["country"] = window?.geoinfo.CountryCode;
  cdpObj["email"] = window?.objUser?.info?.primaryEmail
    ? window?.objUser?.info?.primaryEmail
    : "";
  cdpObj["et_product"] = getPageName();
  cdpObj["et_uuid"] = getCookie("peuuid")
    ? getCookie("peuuid")
    : getCookie("pfuuid");
  cdpObj["first_name"] = window?.objUser?.info?.firstName
    ? window?.objUser?.info?.firstName
    : "";
  cdpObj["last_name"] = window?.objUser?.info?.lastName
    ? window?.objUser?.info?.lastName
    : "";
  cdpObj["loggedin"] = typeof window.objUser != "undefined" ? "Yes" : "No";
  cdpObj["pageTitle"] = document.title;

  cdpObj["ssoid"] = getCookie("ssoid") ? getCookie("ssoid") : "";
  cdpObj["user_region"] = window?.geoinfo.region_code;
  cdpObj["web_peuuid"] = getCookie("peuuid");
  cdpObj["web_pfuuid"] = getCookie("pfuuid");
  return cdpObj;
};
