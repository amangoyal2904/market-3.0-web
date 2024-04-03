// @ts-nocheck

import * as Config from "./common";
import * as utils from ".";
import { useStateContext } from "@/store/StateContext";
import { getCookie } from "@/utils";

declare global {
  interface Window {
    // ga: (eventType: string, event?: string, category?: string, action?: string, label?: string, dimension?: object) => void;
    // eslint-disable-next-line
    //ga: any;
    trackingEvent: (type: string, gaData: object) => void;
    //grx: (grxType: string, action: string, cd?: object) => void;
    //gtag: (event: string, action: string, params: object) => void;
    // eslint-disable-next-line
    // gtag: any;
    dataLayer: [];
    customDimension: any;
  }
}
// export const pageview = (url) => {
//   window["gtag"] &&
//     window["gtag"]("config", Config.GA.GTM_KEY, {
//       page_path: url
//     });
//   const page = window.location.href;
//   window.customDimension = { ...window.customDimension, url: page, page, hitType: "pageview" };
//   // send the page views
//   window.ga && window.ga("send", "pageview", window.customDimension);
//   grxEvent("page_view", window.customDimension);
// };

// export const gaObserverInit = (newImpressionNodes = [], newClickNodes = []) => {
//   function observeNodesImpression(nodeArray) {
//     nodeArray.forEach(function (item) {
//       const observer = new window.IntersectionObserver(
//         ([entry]) => {
//           if (!entry.isIntersecting) {
//             return;
//           }
//           const el = entry.target;
//           if (el) {
//             const gaData = el?.getAttribute("data-ga-impression")?.split("#") || [];
//             gaData[2] =
//               typeof gaData[2] != "undefined" && gaData[2] != ""
//                 ? gaData[2] == "url"
//                   ? window.location.href
//                   : gaData[2]
//                 : "";
//             const href = el.getAttribute("href");
//             if (href) {
//               gaData[2] = gaData[2].replace("href", href);
//             }
//             gaData[2] = gaData[2].replace("url", window.location.href);
//             if (gaData.length > 2) {
//               console.log(gaData);
//               window.ga("set", window.customDimension);
//               window.ga("send", "event", gaData[0], gaData[1], gaData[2]);
//               // Growth RX Event
//               grxEvent("event", {
//                 event_category: gaData[0],
//                 event_action: gaData[1],
//                 event_label: gaData[2]
//               });
//             }
//           }
//           observer.unobserve(item);
//         },
//         {
//           root: null,
//           threshold: 0.1 // set offset 0.1 means trigger if atleast 10% of element in viewport
//         }
//       );
//       observer.observe(item);
//     });
//   }
//   function observeNodesClick(nodeArray) {
//     nodeArray.forEach((item) => {
//       item.addEventListener("click", () => {
//         const trackVal = item.getAttribute("data-ga-onclick").split("#");
//         let track2 = trackVal[2];
//         track2 = track2 ? track2 : "";
//         const href = item.getAttribute("href") || "";
//         track2 = track2.indexOf("href") != -1 ? track2.replace("href", href) : track2;
//         track2 = track2.indexOf("url") != -1 ? track2.replace("url", window.location.href) : track2;
//         if (trackVal.length > 1) {
//           console.log(trackVal);
//           window.ga("send", "event", trackVal[0], trackVal[1], track2, window.customDimension);
//           // Growth RX Event
//           grxEvent("event", {
//             event_category: trackVal[0],
//             event_action: trackVal[1],
//             event_label: track2
//           });
//         } else {
//           console.log("There is some error in firing onclick ga event");
//         }
//       });
//     });
//   }
//   try {
//     if (newImpressionNodes != null) {
//       if (newImpressionNodes?.length > 0) {
//         observeNodesImpression(newImpressionNodes);
//         return;
//       }
//       const nodeList = document.querySelectorAll("[data-ga-impression]");
//       nodeList?.length > 0 && observeNodesImpression(nodeList);
//     }
//   } catch (e) {
//     console.log("Error in intersection observer in data-ga-impression");
//   }
//   try {
//     if (newClickNodes != null) {
//       if (newClickNodes?.length > 0) {
//         observeNodesClick(newClickNodes);
//         return;
//       }
//       const nodeList = document.querySelectorAll("[data-ga-onclick]");
//       nodeList?.length > 0 && observeNodesClick(nodeList);
//     }
//   } catch (e) {
//     console.log("error in on click listener data-ga-onclick");
//   }
// };

// export const growthRxInit = () => {
//   (function (g, r, o, w, t, h, rx) {
//     (g[t] =
//       g[t] ||
//       function (...args) {
//         (g[t].q = g[t].q || []).push(...args);
//       }),
//       (g[t].l = 1 * +new Date());
//     (g[t] = g[t] || {}), (h = r.createElement(o)), (rx = r.getElementsByTagName(o)[0]);
//     h.async = 1;
//     h.src = w;
//     rx.parentNode.insertBefore(h, rx);
//   })(window, document, "script", "https://static.growthrx.in/js/v2/web-sdk.js", "grx");
//   window.grx("init", window.objVc.growthRxId || "gc2744074");
//   // window.grx("init", Config.GA.GRX_ID);
// };

export const trackingEvent = (type, data) => {
  if (window.dataLayer) {
    let _gtmEventDimension = {};
    _gtmEventDimension["feature_name"] = "ET Market";
    _gtmEventDimension["login_status"] =
      typeof window.objUser != "undefined" ? "Yes" : "No";
    _gtmEventDimension["subscription_status"] = "ET Market";
    _gtmEventDimension["user_id"] =
      typeof window.objUser != "undefined" && window.objUser.ssoid
        ? window.objUser.ssoid
        : "";
    _gtmEventDimension["ssoid"] = getCookie("ssoid") ? getCookie("ssoid") : "";
    _gtmEventDimension["user_grx_id"] = getCookie("_grx")
      ? getCookie("_grx")
      : "";
    _gtmEventDimension["platform"] = "web";
    _gtmEventDimension["event"] = type;
    _gtmEventDimension = Object.assign(_gtmEventDimension, data);
    window.dataLayer.push(_gtmEventDimension);
  }
  // if (window.grx && data) {
  //   const grxDimension = data;
  //   const localobjVc = {};
  //   grxDimension["url"] = grxDimension["url"] || window.location.href;
  //   if (window.customDimension && localobjVc["growthRxDimension"]) {
  //     const objDim = localobjVc["growthRxDimension"];
  //     for (const key in window.customDimension) {
  //       const dimId = "d" + key.substr(9, key.length);
  //       if (objDim[dimId] && [key] && typeof window.customDimension[key] !== "undefined") {
  //         grxDimension[objDim[dimId]] = window.customDimension[key];
  //       } else if ([key] && typeof window.customDimension[key] !== "undefined") {
  //         grxDimension[key] = window.customDimension[key];
  //       }
  //     }
  //   }
  //   window.grx("track", type, grxDimension);
  //   if (gaEvent && window.ga && type == "event") {
  //     window.ga("send", "event", data.event_category, data.event_action, data.event_label, window.customDimension);
  //   }
  // }
};
