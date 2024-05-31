import Service from "../network/service";
import GLOBAL_CONFIG from "../network/global_config.json";
import APIS_CONFIG from "../network/api_config.json";
import { createPeuuid } from "./utility";
import service from "../network/service";
import { getPageName } from "./ga";

declare global {
  interface Window {
    geolocation: any;
    customDimension: any;
    geoinfo: any;
    opera?: string;
    MSStream?: string;
  }
  interface objUser {
    info: {
      isLogged: boolean;
    };
  }
}

declare var ssoWidget: any;

export const APP_ENV =
  (process.env.NODE_ENV && process.env.NODE_ENV.trim()) || "production";

export const getCookie = (name: string) => {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  } catch (e) {
    console.log("getCookie", e);
  }
};

export const setCookieToSpecificTime = (
  name: string,
  value: string | number | boolean,
  days = 0,
  time = 0,
  seconds = 0,
  domain = ".indiatimes.com",
) => {
  try {
    let cookiestring = `${name}=${encodeURIComponent(value)};`;
    const options = { domain: domain, path: "/" };

    if (days) {
      const expirationDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      cookiestring += `expires=${expirationDate.toUTCString()};`;
    }

    if (time) {
      const date = new Date();
      const [hours, minutes] = (time as any).split(":");
      date.setHours(hours);
      date.setMinutes(minutes);
      cookiestring += `expires=${date.toUTCString()};`;
    }

    if (seconds) {
      const expirationDate = new Date(Date.now() + seconds * 1000);
      cookiestring += `expires=${expirationDate.toUTCString()};`;
    }

    cookiestring += `domain=${options.domain}; path=${options.path};`;

    document.cookie = cookiestring;
  } catch (e) {
    console.log("setCookieToSpecificTime Error:", e);
  }
};

export const delete_cookie = (name: any) => {
  try {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  } catch (err) {
    console.log("delete_cookie Error: ", err);
  }
};

export const getMobileOS = () => {
  const userAgent =
    navigator.userAgent || navigator.vendor || window.opera || "";
  if (/android/i.test(userAgent)) {
    return "Android";
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }
  return "unknown";
};

export const pageType = (pathurl: any) => {
  //console.log(">>>", pathurl);
  if (pathurl.indexOf("watchlist") != -1) {
    return "watchlist";
  } else {
    return "notfound";
  }
};

export const getParameterByName = (name: string) => {
  try {
    if (name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
      return results == null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
    } else {
      return "";
    }
  } catch (e) {
    console.log("getParameterByName", e);
  }
};

export const isBotAgent = () => {
  const ua =
    (navigator && navigator.userAgent && navigator.userAgent.toLowerCase()) ||
    "";
  return ua.indexOf("bot") != -1 ? 1 : 0;
};

export const verifyLogin = () => {
  window?.jsso?.getValidLoggedInUser(function (response: any) {
    if (response.status == "SUCCESS") {
      //console.log("SUCCESS");

      if (typeof window.objUser == "undefined") window.objUser = {};
      //generateFpid(true);
      createPeuuid();
      window.objUser.ticketId = response.data.ticketId;
      setUserData();
    } else {
      console.log("failure");
      //generateFpid(false);
      ssoLoginWidget();
    }

    const verifyLoginStatus = new Event(
      response.status == "SUCCESS" ? "verifyLoginSuccess" : "verifyLoginFail",
    );
    document.dispatchEvent(verifyLoginStatus);
  });
};

export const setUserData = () => {
  window?.jsso?.getUserDetails(function (response: any) {
    if (response.status == "SUCCESS") {
      //console.log("SUCCESS", response);
      window.objUser.info = response.data;
      window.objUser.ssoid = response.data.ssoid;
    } else {
      console.log("failure");
    }

    const getUserDetailsStatus = new Event(
      response.status == "SUCCESS"
        ? "getUserDetailsSuccess"
        : "getUserDetailsFail",
    );
    document.dispatchEvent(getUserDetailsStatus);
  });
};

export const ssoLoginWidget = () => {
  const scriptElements = document.querySelectorAll(
    'script[src*="/widget/main.bundle"]',
  );
  const numberOfScripts = scriptElements.length;
  if (numberOfScripts == 0) {
    (function (w: any, s, el) {
      var sc = document.createElement("script");
      w[el] =
        w[el] ||
        function () {
          w[el] = w[el] || {};
          w[el].ev = w[el].ev || [];
          w[el].ev.push(arguments);
        };
      sc.type = "text/javascript";
      if (sessionStorage.getItem("openLogin_popup") == "true") {
        (sc as any).onload = initSSOWidget();
        sessionStorage.removeItem("openLogin_popup");
      }
      sc.src = s;
      document.getElementsByTagName("head")[0].appendChild(sc);
    })(window, (GLOBAL_CONFIG as any)[APP_ENV]["ssoWidget"], "ssoWidget");
  }
};

export const ssoClose = () => {
  const ssoWidgetElement = document.getElementById("ssoLoginWrap");
  ssoWidgetElement?.classList.add("hide");
  const ssoLoginElm = document.getElementById(
    "ssoLogin",
  ) as HTMLDivElement | null;
  if (ssoLoginElm) ssoLoginElm.innerHTML = "";
};

export const initSSOWidget = () => {
  //console.log("Central SSO initSSOWidget");
  const ssoWidgetElement = document.getElementById("ssoLoginWrap");
  ssoWidgetElement?.classList.remove("hide");
  var centralSSOObj = {
    channelName: "et",
    element: "ssoLogin",
    resendOtpTimer: 160,
    channelLogo: "https://economictimes.indiatimes.com/photo/103927173.cms",
    recaptcha: {
      required: false,
    },
    closeIcon: !0,
    defaultSelected: !0,
    socialLoginRu:
      window.location.protocol +
      "//" +
      window.location.host +
      (window.location.host == "economictimes.indiatimes.com"
        ? "/login_code.cms"
        : "/login_code.html"),
    nonSocialLogin: {
      loginVia: ["email", "mobile"],
      loginWith: ["Password", "otp"],
    },
    socialLogin: [
      {
        type: "Google",
        clientId: "936221589938.apps.googleusercontent.com",
      },
      {
        type: "Facebook",
        clientId: "424450167700259",
      },
      {
        type: "Apple",
        clientId: "com.economictimes.login",
      },
    ],
    gaChannelName: "et",
    last_clicked_lob: "ET",
    signInCallback: function () {
      verifyLogin();
      ssoClose();
      window.location.reload();
    },
    signupForm: {
      defaultFirstName: "Guest",
      signUpFields: {
        Email: {
          placeholder: "enter email",
          required: true,
        },
        MobileNumber: {
          placeholder: "enter mobile number",
          required: true,
        },
        firstName: {
          placeholder: "enter first name",
          required: true,
        },
      },
      signupVia: ["Password"],
      MandatoryVerifyVia: ["email"],
    },
    termsConditionLink: "/terms-conditions",
    privacyPolicyLink: "/privacypolicy.cms",
    //defaultSelected:true,
    closeCallBack: function () {
      //console.log("Central SSO closeCallBack");
      ssoClose();
    },
  };

  ssoWidget("init", centralSSOObj);
};

export const logout = async () => {
  window?.jsso?.signOutUser(async function (response: any) {
    if (response.status == "SUCCESS") {
      delete_cookie("OTR");
      delete_cookie("isprimeuser");
      delete_cookie("pfuuid");
      delete_cookie("peuuid");
      delete_cookie("fpid");

      const url = (APIS_CONFIG as any)["LOGOUT_AUTH_TOKEN"][APP_ENV],
        oauthClientId = (GLOBAL_CONFIG as any)[APP_ENV]["X_CLIENT_ID"],
        deviceId = getCookie("_grx"),
        userSsoId = window?.objUser?.ssoid || getCookie("ssoid"),
        ticketId = getCookie("TicketId");

      const headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "X-CLIENT-ID": oauthClientId,
        "X-DEVICE-ID": deviceId,
        "x-sso-id": userSsoId,
        "x-site-app-code": (GLOBAL_CONFIG as any)[APP_ENV]["X_SITE_CODE"],
      };

      const body = JSON.stringify({ ticketId: ticketId });

      const response = await Service.post({
        url,
        headers,
        payload: {},
        body,
        params: {},
      });

      const logoutSuccess = await response?.json();
      window.location.reload();
    } else {
      console.log("failure");
    }
  });
};

export const loadPrimeApi = async () => {
  try {
    const url = (APIS_CONFIG as any)["AUTH_TOKEN"][APP_ENV],
      oauthClientId = (GLOBAL_CONFIG as any)[APP_ENV]["X_CLIENT_ID"],
      deviceId = getCookie("_grx"),
      ticketId = getCookie("TicketId"),
      userSsoId = window?.objUser?.ssoid || getCookie("ssoid");

    const body = JSON.stringify({
      grantType: "refresh_token",
      ticketId: ticketId,
      deviceDetail: getMobileOS(),
      allMerchant: true,
    });
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      "X-CLIENT-ID": oauthClientId,
      "X-DEVICE-ID": deviceId,
      "x-sso-id": userSsoId,
      "x-site-app-code": (GLOBAL_CONFIG as any)[APP_ENV]["X_SITE_CODE"],
    };

    const response = await Service.post({
      url,
      headers,
      payload: {},
      body,
      params: {},
    });

    return response?.json();
    // Handle the successful response data
  } catch (e) {
    console.log("loadPrimeApi: " + e);
  }
};

export const formatDate = (str: string) => {
  // Parse the original date string
  var originalDate = new Date(str);
  // Get the components of the original date
  var originalDay = originalDate.getDate();
  var originalMonth = originalDate.toLocaleString("default", {
    month: "short",
  });
  var originalYear = originalDate.getFullYear();
  var originalHour = originalDate.getHours();
  var originalMinute = originalDate.getMinutes();

  // Format the date in the desired format (04:02 PM | 30 Jan 2024)
  var formattedDate =
    ("0" + originalDay).slice(-2) + " " + originalMonth + " " + originalYear;
  var formattedTime =
    ((originalHour + 11) % 12) +
    1 +
    ":" +
    ("0" + originalMinute).slice(-2) +
    " " +
    (originalHour >= 12 ? "PM" : "AM");

  // Output the formatted date and time
  //console.log(formattedTime + " | " + formattedDate);
  return formattedTime + " | " + formattedDate;
};

export const filterData = (arr: any, test: string) => {
  const filtered = arr.filter(
    (item: any) => item.entityType.toLowerCase() === test.toLowerCase(),
  );
  return filtered;
};
export const makeBold = (inputText: string, completeText: string) => {
  const matchtext = new RegExp(inputText, "i");
  if (completeText.toLowerCase().indexOf(inputText.toLowerCase()) >= 0) {
    const matched = completeText.substr(
      completeText.search(matchtext),
      inputText.length,
    );
    return completeText.replace(matchtext, "<b>" + matched + "</b>");
  } else {
    return completeText;
  }
};

// Date format
export const appendZero = (num: any) =>
  num >= 0 && num < 10 ? "0" + num : num;
export const dateFormat = (dt: any, format = "%Y-%M-%d") => {
  let objD: any = dt instanceof Date ? dt : new Date(dt);
  let shortMonthName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let fullMonthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let shortDaysName = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
  let fullDaysName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let newDate = "";
  if (objD != "Invalid Date") {
    let hour = objD.getHours();
    let dList = {
      "%ss": objD.getMilliseconds(),
      "%Y": objD.getFullYear(),
      "%y": objD.getFullYear()?.toString().substr(-2),
      "%MMM": shortMonthName[objD.getMonth()],
      "%MM": fullMonthName[objD.getMonth()],
      "%M": objD.getMonth() + 1,
      "%d": objD.getDate(),
      "%h": hour <= 12 ? hour : hour - 12,
      "%H": hour,
      "%m": objD.getMinutes(),
      "%s": objD.getSeconds(),
      "%DD": fullDaysName[objD.getDay() + 1],
      "%D": shortDaysName[objD.getDay() + 1],
      "%p": objD.getHours() > 11 ? "PM" : "AM",
    };
    newDate = format;

    for (let key in dList) {
      let regEx = new RegExp(key, "g");
      let dListVal = (dList as any)[key];
      newDate = newDate.replace(regEx, appendZero(dListVal));
    }
  }
  return newDate;
};
export const dateStringToMilliseconds = (
  dateTimeString: string | number | Date,
) => {
  const date = new Date(dateTimeString);
  const milliseconds = date.getTime();
  return milliseconds;
};
export const setCookies = (
  name: string,
  value: string,
  seconds: number = 0,
) => {
  let dt, expires;
  dt = new Date();
  dt.setTime(dt.getTime() + seconds * 1000);
  expires = "; expires=" + dt?.toString();
  document.cookie =
    name + "=" + value + expires + `; domain=${window.location.host}; path=/;`;
};

export const getFundHouseInfo = (item: any, slug: any) => {
  let fundHouseId = "";
  let fundHounseName = "";
  let isOpenTab = false;
  if (typeof slug?.[1] != "undefined") {
    fundHouseId = slug?.[1].split("-").slice(-1)[0];
    fundHounseName = slug?.[1].split("-").slice(0, -1).join(" ");
    isOpenTab = item && slug?.[1].indexOf(item.omId) != -1 ? true : false;
  }

  return {
    isOpenTab: isOpenTab,
    fundHouseId: fundHouseId,
    fundHounseName: fundHounseName,
  };
};

// =====  Get STOCK_RECOS_DETAIL Data =======
export const getStockRecosDetail = async ({
  getApiType,
  slug,
  ssoid,
  niftyFilterData,
  pageNo,
}: any) => {
  const STOCK_RECOS_DETAIL_Link = (APIS_CONFIG as any)["STOCK_RECOS_DETAIL"][
    APP_ENV
  ];
  const fundHouseInfo = getFundHouseInfo("", slug);
  const headers = {
    "Content-Type": "application/json",
    ssoid: ssoid,
  };

  const overViewFilterArr = [
    { type: "mostBuy", indexid: 2369 },
    { type: "newRecos", indexid: 2369 },
    { type: "mostBuy", indexid: 1913 },
    { type: "newRecos", indexid: 1913 },
    { type: "mostBuy", indexid: 2495 },
    { type: "newRecos", indexid: 2495 },
  ];

  const payload = {
    apiType: getApiType,
    filterType:
      getApiType == "FHDetail" && niftyFilterData?.indexId
        ? "index"
        : getApiType == "FHDetail"
          ? "fundhouse"
          : getApiType != "recoByFH" &&
              getApiType != "overviewFilter" &&
              niftyFilterData?.indexId
            ? "index"
            : "",
    filterValue:
      getApiType != "overviewFilter" && niftyFilterData?.indexId
        ? [niftyFilterData.indexId]
        : getApiType == "FHDetail"
          ? [fundHouseInfo.fundHouseId]
          : [],
    recoType: (getApiType == "FHDetail" ? slug?.[2] : slug?.[1]) || "all",
    pageSize:
      getApiType == "recoByFH"
        ? 100
        : getApiType == "overview" || getApiType == "overviewFilter"
          ? 6
          : 30,
    pageNumber: pageNo || 1,
    ...((getApiType == "overview" ||
      getApiType == "mostBuy" ||
      getApiType == "mostSell" ||
      getApiType == "overviewFilter") && { deviceId: "web", apiVersion: 2 }),
    ...(getApiType == "FHDetail" && { orgId: [fundHouseInfo.fundHouseId] }),
    ...(getApiType == "overviewFilter" && {
      overviewFilter: overViewFilterArr,
    }),
  };

  const recosDetailPromise = await Service.post({
    url: STOCK_RECOS_DETAIL_Link,
    headers: headers,
    body: JSON.stringify(payload),
    params: {},
    cache: true,
  });

  const recosDetailResult = await recosDetailPromise?.json();
  return recosDetailResult;
};

export const formatNumber = (
  number: number,
  uptoDecimal: number = 2,
  noData?: string,
): string => {
  if ((!!number && isNaN(number)) || number == null)
    return !!noData ? noData : "-";
  const isInteger = Number.isInteger(Number(number));
  if (isInteger) {
    return number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "decimal",
      minimumFractionDigits: uptoDecimal, // Ensure at least 2 decimal places
      maximumFractionDigits: uptoDecimal, // Allow maximum of 2 decimal places
    });

    const formattedNumber = formatter.format(number);
    return formattedNumber.replace(/(\d)(?=(\d{3})+\.)/g, "$1,"); // Add commas for thousands separators
  }
};

export const areObjectsNotEqual = (
  obj1: Record<string, any>,
  obj2: Record<string, any>,
): boolean => JSON.stringify(obj1) !== JSON.stringify(obj2);

export const capitalize = (str: string) => {
  return str.toLowerCase().replace(/\b\w/g, function (letter) {
    return letter.toUpperCase();
  });
};

export const getClassAndPercent = (percentChange: any) => {
  if (percentChange > 0) {
    return "up";
  } else if (percentChange < 0) {
    return "down";
  } else {
    return "neutral";
  }
};
export const footerAPIHit = async (pageUrl: string) => {
  const pageName = getPageName(pageUrl).replace("Mercury_", "");
  const footerApi =
    (APIS_CONFIG as any)["FOOTER_LINKS"][APP_ENV] +
    "&pagename=" +
    pageName.toLowerCase();
  const footerPromise = await service.get({
    url: footerApi,
    params: {},
  });
  const footerResult: any = await footerPromise?.json();
  return footerResult;
};

export const replaceWidthHeigh = (url: any, newWidth: any, newHeight: any) => {
  // Regular expression to match width and height parameters
  const regex = /width-(\d+)|height-(\d+)/g;

  // Replace width and height parameters with new values
  const newUrl = url.replace(regex, (match: any, p1: any, p2: any) => {
    if (p1 && p2) {
      // Both width and height are present, replace both
      return `width-${newWidth},height-${newHeight}`;
    } else if (p1) {
      // Only width is present, replace width
      return `width-${newWidth}`;
    } else if (p2) {
      // Only height is present, replace height
      return `height-${newHeight}`;
    }
  });

  return newUrl;
};
