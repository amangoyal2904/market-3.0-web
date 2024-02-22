import Service from "../network/service";
import GLOBAL_CONFIG from "../network/global_config.json";
import APIS_CONFIG from "../network/api_config.json";
import { generateFpid } from "./utility";

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
  value: any,
  days: number,
  time: string | number,
  seconds: number,
) => {
  try {
    const domain = document.domain;
    let cookiestring = "";
    if (name && value) {
      cookiestring = name + "=" + encodeURIComponent(value) + "; expires=";
      if (days) {
        cookiestring +=
          new Date(
            new Date().getTime() + days * 24 * 60 * 60 * 1000,
          ).toUTCString() +
          "; domain=" +
          domain +
          "; path=/;";
      }
      if (time) {
        cookiestring +=
          new Date(new Date().toDateString() + " " + time).toUTCString() +
          "; domain=" +
          domain +
          "; path=/;";
      }
      if (seconds) {
        const exdate = new Date();
        exdate.setSeconds(exdate.getSeconds() + seconds);
        cookiestring +=
          exdate.toUTCString() + "; domain=" + domain + "; path=/;";
      }
    }

    document.cookie = cookiestring;
  } catch (e) {
    console.log("setCookieToSpecificTime", e);
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
      generateFpid(true);
      window.objUser.ticketId = response.data.ticketId;
      setUserData();
    } else {
      console.log("failure");
      generateFpid(false);
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
    })(
      window,
      "https://jssocdnstg.indiatimes.com/crosswalk/156/widget/main.bundle.js",
      "ssoWidget",
    );
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
      "/login_code.html",
    nonSocialLogin: {
      loginVia: ["email", "mobile"],
      loginWith: ["Password", "otp"],
    },
    socialLogin: [
      {
        type: "Google",
        logoUrl: "",
        label: "",
        clientId:
          "891351984915-kodsh6b9vik3h6ue008fh8jgfstageh6.apps.googleusercontent.com",
      },
      {
        type: "Facebook",
        label: "",
        logoUrl: "",
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
      setCookieToSpecificTime("OTR", "", 0, 0, 0);

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
      "%y": objD.getFullYear().toString().substr(-2),
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
export const setCookies = (
  name: string,
  value: string,
  seconds: number = 0,
) => {
  let dt, expires;
  dt = new Date();
  dt.setTime(dt.getTime() + seconds * 1000);
  expires = "; expires=" + dt.toString();
  document.cookie =
    name + "=" + value + expires + `; domain=${window.location.host}; path=/;`;
};
