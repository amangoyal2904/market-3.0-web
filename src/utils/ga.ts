// @ts-nocheck
import { getCookie } from "@/utils";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils/index";
import Service from "../network/service";
import GLOBAL_CONFIG from "../network/global_config.json";
import grxMappingObj from "@/utils/grxMappingObj.json";
import cdpObj from "@/utils/cdpObj.json";
import { setPaywallCounts } from "@/utils/utility";
import jStorageReact from "jstorage-react";

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
    } else {
      trackingEvent("et_push_event", {
        event_category: objTracking.category,
        event_action: objTracking.action,
        event_label: objTracking.label,
        widget_name: objTracking.widget_name ? objTracking.widget_name : "",
        tab_name: objTracking.tab_name ? objTracking.tab_name : "",
      });
      setPaywallCounts();
    }
    goToPlansPage1(type, objTracking.obj, redirect, objTracking.cdp);
  } catch (Err) {
    console.log("redirectToPlanPage Err:", Err);
    goToPlansPage1(type, {}, redirect);
  }
};

export const goToPlansPage1 = (type, data = {}, redirect, cdpSend = {}) => {
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
    trackPushData(_gtmEventDimension, data, redirect, cdpSend);
  }
};

export const trackPushData = (
  _gtmEventDimension: any,
  planDim: any,
  redirect,
  cdpSend,
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
  if (typeof window.objUser.info != "undefined") {
    const { primaryEmail, firstName, lastName } = window.objUser.info;
    const fullName = firstName + (lastName ? " " + lastName : "");
    objUserData.email = primaryEmail;
    objUserData.mobile =
      window?.objUser?.info?.mobileList &&
      Object.keys(window?.objUser?.info?.mobileList).length > 0
        ? Object.keys(window?.objUser?.info?.mobileList)[0]
        : "";
    objUserData.fname = firstName;
    objUserData.fullname = fullName;
  }

  const getGrxData = generateGrxFunnel(window?.objUser?.prevPath);
  let cdpData = generateCDPPageView(window?.objUser?.prevPath, redirect);
  cdpData = { ...cdpData, ...cdpSend };

  if (typeof grx != "undefined") {
    grx("init", (GLOBAL_CONFIG as any)[APP_ENV]?.grxId);
    grx("track", cdpData.event_name, cdpData);
  }
  const dataToPost = {
    ET: generateGrxFunnel(window?.objUser?.prevPath),
    grxMappingObj: newGrxMapObj,
    objUserData: objUserData,
    analytics_cdp: cdpData,
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
  let ACQ_SUB_SOURCE = `${sendGTMdata?.item_category}|${sendGTMdata?.item_category2}|${sendGTMdata?.item_category3}|${sendGTMdata?.item_category4?.replace(" ", "_")}`;
  let ACQ_SOURCE = sendGTMdata?.item_brand || "";
  const acqDetails = localStorage.getItem("acqDetails");
  if (acqDetails) {
    const data = JSON.parse(acqDetails);
    ACQ_SOURCE = data?.acqSource
      ? data?.acqSource + "|" + ACQ_SOURCE
      : ACQ_SOURCE;
    ACQ_SUB_SOURCE = data?.acqSubSource
      ? data?.acqSubSource + "|" + ACQ_SUB_SOURCE
      : ACQ_SUB_SOURCE;
  }
  const planUrl = (GLOBAL_CONFIG as any)[APP_ENV]["Plan_PAGE"];
  const newPlanUrl =
    planUrl +
    (planUrl.indexOf("?") == -1 ? "?" : "&") +
    "ru=" +
    encodeURI(window.location.href) +
    "&grxId=" +
    getCookie("_grx") +
    ticketId +
    "&acqSource=" +
    ACQ_SOURCE +
    "&acqSubSource=" +
    ACQ_SUB_SOURCE;
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
    _gtmEventDimension = updateGtm(_gtmEventDimension, data.prevPath);
    _gtmEventDimension["event"] = type;
    _gtmEventDimension = Object.assign(_gtmEventDimension, data);
    window.dataLayer.push(_gtmEventDimension);
  }
  let checkGrxready = false;
  if (type == "et_push_pageload") {
    const objCDP = generateCDPPageView(data.prevPath, false);
    if (window.grx || window.isGrxLoaded) {
      if (!checkGrxready) {
        checkGrxready = true;
        window.grx("track", "page_view", objCDP);
      }
    } else {
      document.addEventListener("ready", () => {
        if (!checkGrxready) {
          window.isGrxLoaded = true;
          checkGrxready = true;
          window.grx("track", "page_view", objCDP);
        }
      });
    }
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
  let pageDetails = { pageName: "", featureName: "" };
  if (pagePathName.includes("/marketstats")) {
    pageName = "Mercury_MarketStats";
    pageDetails.pageName = "Mercury_MarketStats";
    pageDetails.featureName = "ETMKTSTATS";
  } else if (pagePathName.includes("/stock-recos")) {
    pageName = "Mercury_Recos";
  } else if (pagePathName.includes("/stock-screener")) {
    pageName = "Mercury_Screener";
  } else if (pagePathName.includes("/indices")) {
    pageName = "Mercury_Indices";
  } else if (pagePathName.includes("stocks/earnings")) {
    pageName = "Mercury_Earnings";
  } else if (pagePathName.includes("/top-india-investors-portfolio/")) {
    pageName = "Mercury_BigBull";
  } else if (pagePathName.includes("/stockreportsplus")) {
    pageName = "Mercury_StockReportPlus";
  } else if (pagePathName.includes("/fii-dii-activity")) {
    pageName = "Mercury_FII/DII";
  } else if (pagePathName.includes("/watchlist")) {
    pageName = "Mercury_Watchlist";
  } else if (pagePathName.includes("/live-coverage")) {
    pageName = "Mercury_HomePage";
  } else if (pagePathName.includes("/stock-market-mood")) {
    pageName = "Mercury_MarketMood";
  } else if (pagePathName.includes("/corporate-actions")) {
    pageName = "Mercury_Corporate Actions";
  } else if (pagePathName.includes("/corporate-announcements")) {
    pageName = "Mercury_Corporate Announcements";
  } else {
    pageName = "Mercury";
  }
  return pageName;
};

export const updateGtm = (_gtmEventDimension, prevPath) => {
  try {
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
      typeof window.objUser.info != "undefined" ? "Logged In" : "Not Logged In";
    _gtmEventDimension["user_login_status_hit"] =
      typeof window.objUser.info != "undefined" ? "Logged In" : "Not Logged In";
    _gtmEventDimension["user_login_status_session"] =
      typeof window.objUser.info != "undefined" ? "Logged In" : "Not Logged In";
    _gtmEventDimension["last_click_source"] = site_section;
    let trafficSource = "direct";
    let dref = document.referrer,
      wlh = window.location.href.toLowerCase();
    if (/google|bing|yahoo/gi.test(prevPath)) {
      trafficSource = "organic";
    } else if (
      /facebook|linkedin|instagram|twitter/gi.test(prevPath) ||
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
      typeof window.objUser.info != "undefined" ? "Yes" : "No";
    _gtmEventDimension["pageTitle"] = document.title;
    _gtmEventDimension["referral_url"] =
      window.location.pathname == prevPath ? "" : prevPath;
    _gtmEventDimension["ssoid"] = getCookie("ssoid") ? getCookie("ssoid") : "";
    _gtmEventDimension["numbers_of_stocks_in_watchlist"] = window?.objUser
      ?.watchlistCount
      ? window?.objUser?.watchlistCount
      : "";
    _gtmEventDimension["user_region"] = window?.geoinfo.region_code;
    _gtmEventDimension["web_peuuid"] = getCookie("peuuid");
    _gtmEventDimension["web_pfuuid"] = getCookie("pfuuid");
    const savedFreeTrialData = jStorageReact.get("et_freetrial") || {};
    const isAPUser = window?.objUser?.userAcquisitionType === "ACCESS_PASS";

    if (Object.keys(savedFreeTrialData).length) {
      if (window?.objUser?.info?.primaryEmail && isAPUser) {
        const now = +new Date();
        const expiryDate = +new Date(window?.objUser?.userAcquisitionType);
        _gtmEventDimension["experiment_variant_name"] =
          "Free Trial_" + (expiryDate < now ? "Expired" : "Activated");
      } else if (
        savedFreeTrialData.eligible &&
        !window?.objUser?.permissions?.includes("subscribed")
      ) {
        _gtmEventDimension["experiment_variant_name"] = "Free Trial_Eligible";
      }
    } else {
      delete _gtmEventDimension["experiment_variant_name"];
    }

    return _gtmEventDimension;
  } catch (e) {
    console.log("Error", e);
    return {};
  }
};

export const generateGrxFunnel = (prevPath) => {
  try {
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
    objGrx["dimension146"] =
      typeof window.objUser.info != "undefined" ? "Logged In" : "Not Logged In";
    objGrx["dimension10"] =
      typeof window.objUser.info != "undefined" ? "Logged In" : "Not Logged In";
    objGrx["dimension3"] =
      typeof window.objUser.info != "undefined" ? "Logged In" : "Not Logged In";
    objGrx["dimension37"] =
      typeof window.objUser != "undefined" && window?.objUser?.permissions
        ? getUserType(window.objUser.permissions)
        : "Free User";
    objGrx["dimension145"] = getPageName();
    objGrx["dimension148"] = getPageName().replace("Mercury_", "");
    objGrx["dimension149"] = "";
    objGrx["dimension150"] =
      typeof window.objUser != "undefined" && window.objUser?.ssoid
        ? window.objUser.ssoid
        : "";
    objGrx["dimension151"] = getCookie("_grx") ? getCookie("_grx") : "";
    objGrx["dimension152"] = document.title;
    objGrx["dimension153"] =
      window.location.pathname == prevPath ? "" : prevPath;

    return objGrx;
  } catch (e) {
    console.log("Error ", e);
    return {};
  }
};

export const generateCDPPageView = (prevPath, redirect) => {
  try {
    const pagePathName = window.location.pathname;
    let pageElem = window.location.pathname.split("/");
    const arr = pageElem.shift();
    let site_section = pagePathName.slice(1);
    let lastSlash = site_section.lastIndexOf("/");
    cdpObj["feature_name"] = getPageName().replace("Mercury_", "");
    cdpObj["level_1"] = pageElem[0] != undefined ? pageElem[0] : "";
    cdpObj["level_2"] = pageElem[1] != undefined ? pageElem[1] : "";
    cdpObj["level_3"] = pageElem[2] != undefined ? pageElem[2] : "";
    cdpObj["level_4"] = pageElem[3] != undefined ? pageElem[3] : "";
    cdpObj["level_full"] = site_section;
    const n = prevPath ? prevPath.lastIndexOf("/") : 0;
    const lastClick = n == 0 ? "" : prevPath.substring(n + 1);
    cdpObj["last_click_source"] = lastClick;
    cdpObj["referral_url"] =
      window.location.pathname == prevPath ? "" : prevPath;
    cdpObj["page_template"] = site_section.substring(lastSlash + 1);
    cdpObj["url"] = window.location.href;
    cdpObj["title"] = document.title;
    if (redirect) {
      const uniqueID = getCookie("_grx") + "_" + +new Date();
      cdpObj["unique_subscription_id"] = uniqueID;
    }
    let trafficSource = "direct";
    let dref = document.referrer,
      wlh = window.location.href.toLowerCase();
    if (/google|bing|yahoo/gi.test(prevPath)) {
      trafficSource = "organic";
    } else if (
      /facebook|linkedin|instagram|twitter/gi.test(prevPath) ||
      wlh.indexOf("utm_medium=social") != -1
    ) {
      trafficSource = "social";
    } else if (wlh.indexOf("utm_medium=email") != -1) {
      trafficSource = "newsletter";
    } else if (wlh.indexOf("utm_source=etnotifications") != -1) {
      trafficSource = "notifications";
    }
    cdpObj["source"] = trafficSource;
    cdpObj["loggedin"] = typeof window.objUser.info != "undefined" ? "y" : "n";
    cdpObj["email"] = window?.objUser?.info?.primaryEmail
      ? window?.objUser?.info?.primaryEmail
      : "";
    cdpObj["phone"] =
      typeof window.objUser != "undefined" &&
      window?.objUser?.info?.mobileList &&
      Object.keys(window?.objUser?.info?.mobileList).length > 0
        ? Object.keys(window?.objUser?.info?.mobileList)[0]
        : "";
    cdpObj["login_method"] = window?.objUser?.loginType
      ? window?.objUser?.loginType
      : "";
    const subscription_status =
      typeof window.objUser != "undefined" && window?.objUser?.permissions
        ? getUserType(window.objUser.permissions)
        : "free";
    cdpObj["subscription_status"] =
      subscription_status == "Paid Active" ? "paid" : subscription_status;
    cdpObj["subscription_type"] =
      typeof window.objUser != "undefined" &&
      window?.objUser?.userAcquisitionType
        ? window.objUser.userAcquisitionType
        : "free";
    cdpObj["business"] = "et";
    cdpObj["embedded"] = "";
    cdpObj["paywalled"] = "n";
    cdpObj["product"] = "mercury";
    cdpObj["client_source"] = "cdp";
    cdpObj["dark_mode"] = "n";
    cdpObj["monetizable"] =
      typeof window.objUser != "undefined" && window.objUser.isPrime
        ? "n"
        : "y";
    cdpObj["utm_source"] = getParameterByName("utm_source")
      ? getParameterByName("utm_source")
      : "";
    cdpObj["utm_medium"] = getParameterByName("utm_medium")
      ? getParameterByName("utm_medium")
      : "";
    cdpObj["utm_campaign"] = getParameterByName("utm_campaign")
      ? getParameterByName("utm_campaign")
      : "";
    cdpObj["variant_id"] = getParameterByName("variant_id")
      ? getParameterByName("variant_id")
      : "";
    cdpObj["cohort_id"] = getParameterByName("cohort_id")
      ? getParameterByName("cohort_id")
      : "";
    return cdpObj;
  } catch (e) {
    console.log("Error___" + e);
    return {};
  }
};

export const getParameterByName = (name) => {
  if (name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results == null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  } else {
    return "";
  }
};

// export const generateTrackingObj = (objTracking:any,btnName:any) => {
//   objTracking.cdp["cta_text"] = btnName;
//   return objTracking;
// }
