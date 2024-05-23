// @ts-nocheck
import { getCookie } from "@/utils";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils/index";
import Service from "../network/service";
import GLOBAL_CONFIG from "../network/global_config.json";
import grxMappingObj from "@/utils/grxMappingObj.json";
import { usePathname } from "next/navigation";
declare global {
  interface Window {
    trackingEvent: (type: string, gaData: object) => void;
    dataLayer: [];
    customDimension: any;
  }
}

export const redirectToPlanPage = (objTracking, type = "select_item") => {
  try {
    trackingEvent("et_push_event", {
      event_category: objTracking.category,
      event_action: objTracking.action,
      event_label: objTracking.label,
    });
    goToPlansPage1(type, objTracking.obj);
  } catch (Err) {
    console.log("redirectToPlanPage Err:", Err);
    goToPlansPage1(type, {});
  }
};

export const goToPlansPage = () => {
  const planUrl = (GLOBAL_CONFIG as any)[APP_ENV]["Plan_PAGE"];
  const ticketId = getCookie("encTicket")
    ? `&ticketid=${getCookie("encTicket")}`
    : "";
  const newPlanUrl =
    planUrl +
    (planUrl.indexOf("?") == -1 ? "?" : "&") +
    "ru=" +
    encodeURI(window.location.href) +
    "&grxId=" +
    getCookie("_grx") +
    ticketId;
  window.location.href = newPlanUrl;
};

export const goToPlansPage1 = (type, data) => {
  if (window.dataLayer) {
    let _gtmEventDimension = {};
    const pagePathName = window.location.pathname;
    const site_section = pagePathName.slice(1);
    _gtmEventDimension["feature_name"] = getPageName();
    _gtmEventDimension["site_section"] =
      site_section.indexOf("/") == -1
        ? site_section.substring(site_section.indexOf("/") + 1)
        : site_section.substring(0, site_section.indexOf("/"));
    _gtmEventDimension["site_sub_section"] = site_section;
    _gtmEventDimension["event"] = type;
    let items = [];
    // data["item_brand"] = "market_tools";
    // data["item_name"] = site_section.substring(
    //   0,
    //   site_section.indexOf(","),
    // );
    // data["item_category"] = site_section.substring(lastSlash + 1);
    // data["item_category4"] = "upgrade to prime";
    items.push(data);
    _gtmEventDimension["items"] = items;
    console.log("gtm Event Dimension------->>> ", _gtmEventDimension);
    window.dataLayer.push(_gtmEventDimension);
    trackPushData(_gtmEventDimension, data);
  }
};

export const trackPushData = (_gtmEventDimension: any, planDim: any) => {
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
      window.location.href = newPlanUrl;
    })
    .catch((err) => {
      window.location.href = newPlanUrl;
    });
};

export const trackingEvent = (type, data) => {
  if (window.dataLayer) {
    let _gtmEventDimension = {};
    const pagePathName = window.location.pathname;
    const pageElem = window.location.pathname.split("/");
    let site_section = pagePathName.slice(1);
    let lastSlash = site_section.lastIndexOf("/");
    _gtmEventDimension["feature_name"] = getPageName();
    _gtmEventDimension["site_section"] =
      site_section.indexOf("/") == -1
        ? site_section.substring(site_section.indexOf("/") + 1)
        : site_section.substring(0, site_section.indexOf("/"));
    _gtmEventDimension["login_status"] =
      typeof window.objUser != "undefined" ? "Yes" : "No";
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
        : "";
    _gtmEventDimension["platform"] = "Web";
    _gtmEventDimension["page_template"] = site_section.substring(lastSlash + 1);
    _gtmEventDimension["feature_permission"] =
      typeof window.objUser != "undefined" &&
      window.objUser.accessibleFeatures &&
      window.objUser.accessibleFeatures > 0
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
    _gtmEventDimension["internal_source"] = "";
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
    _gtmEventDimension["event"] = type;
    _gtmEventDimension = Object.assign(_gtmEventDimension, data);
    window.dataLayer.push(_gtmEventDimension);
  }
};

export const getUserType = (permissionsArr) => {
  try {
    var userType = "New";
    console.log("Permissions Array---->", permissionsArr);
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
        userType = "Paid";
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

export const getPageName = () => {
  const pagePathName = window && window.location.pathname;
  console.log("Router------>", pagePathName);
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
