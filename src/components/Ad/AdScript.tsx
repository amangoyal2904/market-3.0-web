"use client";
import { returnPPID, loadAssets } from "../../utils";

declare global {
  interface Window {
    googletag: any;
    arrDfpAds: {}[];
    _auds: any;
  }
}

export const loadAndBeyondScript = function (userType = true) {
  try {
    if (!userType) {
      setTimeout(() => {
        console.log("Delayed for 10 second.");
        let isExist = document.querySelector(
          "script[src*='https://rtbcdn.andbeyond.media/prod-global-34387.js']",
        );
        if (!isExist) {
          loadAssets(
            "https://rtbcdn.andbeyond.media/prod-global-34387.js",
            "js",
            "async",
            "head",
            function () {},
            {},
          );
        }
      }, 10000);
    }
  } catch (e) {
    console.log("loadAndBeyondScript::" + e);
  }
};
const getDFPData = async function () {
  try {
    let dfp;
    let pathName = location.pathname;
    if (pathName.indexOf("/markets/live-coverage") > -1) {
      dfp = await import("./AdInfo/homeAds.json");
    }
    return dfp;
  } catch (e) {
    console.log("returnJSONUrl:" + e);
  }
};
const callDfpAd = async function () {
  try {
    let dfp: any;
    let divIds: any;
    divIds = [];
    //dfp = getDFPData();
    let pathName = location.pathname;
    if (pathName.indexOf("/markets/live-coverage") > -1) {
      dfp = await import("./AdInfo/homeAds.json");
    } else if (pathName.indexOf("/indices") > -1) {
      dfp = await import("./AdInfo/indicesAds.json");
    } else if (pathName.indexOf("/stock-recos") > -1) {
      dfp = await import("./AdInfo/stockRecosAds.json");
    } else {
      dfp = await import("./AdInfo/marketstatsAds.json");
    }
    // console.log("Helloooooooooooo", dfp);
    let googleTag: any;
    googleTag = window.googletag || {};
    googleTag.destroySlots();
    let dfpData = dfp.dfp;
    //dfp.forEach(function (data:any, index) {
    // Object.keys(dfpData).forEach((key:string)=>{
    //     console.log(dfpData[key]);
    //     });
    if (dfpData && Object.keys(dfpData).length > 0) {
      Object.keys(dfpData).forEach((key: string) => {
        let adSlot = dfpData[key].slot ? dfpData[key].slot : "";
        let adSize = dfpData[key].size ? dfpData[key].size : "";
        let divId = dfpData[key].id ? dfpData[key].id : "";
        divIds && divIds.push(divId);
        let ad_ref = "";
        if (!adSlot.match(/^7176/) && !adSlot.match(/^\/7176/)) {
          adSlot = "7176/ET_MWeb/" + adSlot;
        }
        adSize =
          adSize && (typeof adSize == "string" ? JSON.parse(adSize) : adSize);
        try {
          window._auds =
            window._auds ||
            JSON.parse(localStorage.getItem("audienceData") || "{}");
        } catch (e) {
          window._auds = "";
        }
        window._auds = window._auds || "";

        const ppid = returnPPID();
        const aud_flag = ppid ? "true" : "false";

        if (adSlot != "" && adSize != "" && divId != "") {
          if (typeof googleTag != "undefined" && googleTag.apiReady) {
            googleTag.cmd.push(function () {
              ad_ref = googleTag
                .defineSlot(adSlot, adSize, divId)
                .addService(googleTag.pubads());
              if (window._auds) {
                googleTag.pubads().setTargeting("sg", window._auds);
              }
              if (ppid) {
                googleTag.pubads().setPublisherProvidedId(ppid);
              }
              googleTag.pubads().setTargeting("aud_flag", aud_flag);
              googleTag.pubads().enableSingleRequest();
              googleTag.enableServices();
            });
          }
        }
      });
      if (divIds && divIds.length > 0) {
        divIds.forEach(function (element: any) {
          let ele = document.getElementById(element);
          if (ele) {
            googleTag.cmd.push(function () {
              googleTag.display(element);
            });
          } else {
            setTimeout(() => {
              let ele = document.getElementById(element);
              if (ele) {
                googleTag.cmd.push(function () {
                  googleTag.display(element);
                });
              }
            }, 2000);
          }
        });
      }
    }
    window.arrDfpAds = [];
  } catch (e) {
    console.log("callDfpAd:" + e);
  }
};
export const renderDfpAds = (userType = true) => {
  try {
    let pathName = location.pathname;
    let showAd = true;
    if (
      pathName.indexOf("/top-india-investors-portfolio") > -1 ||
      pathName.indexOf("/stockreportsplus") > -1 ||
      pathName.indexOf("/stock-market-mood") > -1 ||
      pathName.indexOf("/stocks/chart-patterns") > -1 ||
      pathName.indexOf("/watchlist") > -1
    ) {
      Array.from(document.getElementsByClassName("hideAd")).forEach(
        function (e) {
          e && e.classList.add("displayHide");
        },
      );
      showAd = false;
    } else {
      Array.from(document.getElementsByClassName("hideAd")).forEach(
        function (e) {
          e && e.classList.remove("displayHide");
        },
      );
      showAd = true;
    }
    // if (userType == true) {
    //   document.querySelectorAll(".hideAd").forEach((el) => el.remove());
    // }
    if (!userType && showAd == true) {
      let googleTag: any;
      let maxTry = 20;
      let counter = 1;
      googleTag = window.googletag || {};
      let ref_interval = setInterval(() => {
        if (googleTag.apiReady) {
          callDfpAd();
          clearInterval(ref_interval);
        }
        counter++;
      }, 500);
      if (counter >= maxTry) {
        clearInterval(ref_interval);
      }
    }
  } catch (e) {
    console.log("callDfpAd:" + e);
  }
};

//export default renderDfpAds;
