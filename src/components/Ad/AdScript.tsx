"use client";
import React from "react";
declare global {
  interface Window {
    googletag: {};
    arrDfpAds: {}[];
  }
}
const renderDfpAds = (adData = [{}], userType = true) => {
  try {
    if (!userType) {
      if (typeof adData != "undefined" && adData.length > 0) {
        let googleTag: any;
        googleTag = window.googletag || {};
        console.log("adData", adData);
        console.log("userType", userType);
        console.log(window.googletag);

        adData.forEach(function (dfp: any, index) {
          console.log("----------INDISE FOREACH__________");
          console.log(dfp);
          let adSlot = dfp.adslot ? dfp.adslot : "";
          let adSize = dfp.adsize ? dfp.adsize : "";
          let divId = dfp.id ? dfp.id : "";
          let ad_ref = "";
          if (!adSlot.match(/^7176/) && !adSlot.match(/^\/7176/)) {
            adSlot = "/7176/Economictimes/" + adSlot;
          }
          adSize =
            adSize && (typeof adSize == "string" ? JSON.parse(adSize) : adSize);
          adSize.push("fluid");
          if (adSlot != "" && adSize != "" && divId != "") {
            if (typeof googleTag != "undefined" && googleTag.apiReady) {
              googleTag.cmd.push(function () {
                ad_ref = googleTag
                  .defineSlot(adSlot, adSize, divId)
                  .addService(googleTag.pubads());
                googleTag.pubads().enableSingleRequest();
                googleTag.enableServices();
              });
              googleTag.cmd.push(function () {
                googleTag.display(divId);
              });
            }
          }
        });
        window.arrDfpAds = [];
      }
      // for (const prop in objVc.dfp) {
      //   console.log("hello",  objVc.dfp[prop]);
      // }
    }
  } catch (e) {}
};

export default renderDfpAds;
