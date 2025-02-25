"use client";
import { useSearchParams, usePathname } from "next/navigation";
import Script from "next/script";
import { FC, useEffect, useState } from "react";
import {
  APP_ENV,
  getCookie,
  verifyLogin,
  loadAudienceDMPScript,
} from "../utils";
import GLOBAL_CONFIG from "../network/global_config.json";
import { getUserType, trackingEvent } from "@/utils/ga";
import { useStateContext } from "@/store/StateContext";
import {
  renderDfpAds,
  loadAndBeyondScript,
  loadAmazonTamScript,
} from "@/components/Ad/AdScript";
import { sendMouseFlowEvent } from "../utils/utility";
import adFreePages from "@/components/Ad/AdInfo/adFree.json";

declare var JssoCrosswalk: any;

const Scripts = () => {
  //console.log(APP_ENV);
  const router = usePathname();
  const [prevPath, setPrevPath] = useState<any>(null);
  const searchParams = useSearchParams();
  const minifyJS = APP_ENV === "development" ? 0 : 1;
  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo, ssoReady, isPrime } = state.login;
  //APP_ENV === "development" ? "https://etdev8243.indiatimes.com" : "https://js.etimg.com";
  const ET_ADS_URL =
    APP_ENV === "development"
      ? "https://toidev.indiatimes.com/etads_v2/minify-1.cms"
      : "https://timesofindia.indiatimes.com/etads_v2/minify-1.cms";
  const ET_TIL_PREBID_URL = "https://assets.toiimg.com/js/til_prebid.js?v=15";
  const adfreeTemplate =
    adFreePages &&
    adFreePages.some(function (v) {
      return router.indexOf(v) > -1;
    });
  let execution = 0;
  const surveyLoad = () => {
    if (window._sva && window._sva.setVisitorTraits) {
      const subscribeStatus =
        typeof window.objUser != "undefined" && window?.objUser?.permissions
          ? getUserType(window.objUser.permissions)
          : "";
      var jString = localStorage.getItem("jStorage"),
        objJstorage = (jString && JSON.parse(jString)) || {};
      var cnt = Object.keys(objJstorage).filter(function (key) {
        return key.indexOf("et_article_") != -1;
      }).length;
      var loyalCount = 15;
      window._sva.setVisitorTraits({
        user_subscription_status: subscribeStatus,
        user_login_status:
          typeof window.objUser != "undefined" ? "logged-in" : "logged-out",
        prime_funnel_last_step: "",
        country_code: (window.geoinfo && window.geoinfo.CountryCode) || "",
        email_id: window?.objUser?.info?.primaryEmail
          ? window?.objUser?.info?.primaryEmail
          : "",
        grx_id: getCookie("_grx"),
        Loyal: cnt >= loyalCount ? "Yes" : "No",
      });
    }
  };
  useEffect(() => {
    try {
      prevPath !== null &&
        trackingEvent("et_push_pageload", {
          url: window.location.href,
          prevPath: prevPath,
        });
      setPrevPath(router || document.referrer);
      if (typeof window.objUser == "undefined") window.objUser = {};
      window.objUser && (window.objUser.prevPath = prevPath);
      window.googletag
        ? !adfreeTemplate && renderDfpAds(isPrime)
        : document.addEventListener("gptLoaded", function () {
            !adfreeTemplate && renderDfpAds(isPrime);
          });
      !adfreeTemplate && loadAndBeyondScript(isPrime);
      !adfreeTemplate && loadAmazonTamScript(isPrime);
      if (window.isSurveyLoad) {
        surveyLoad();
      } else {
        document.addEventListener(
          "surveyLoad",
          () => {
            window.isSurveyLoad = true;
            surveyLoad();
          },
          { once: true },
        );
      }
    } catch (e) {
      console.log("Error-- ", e);
    }
  }, [router, isPrime]);

  useEffect(() => {
    document.addEventListener("visibilitychange", (event) => {
      if (document.visibilityState == "visible" && execution == 0) {
        renderDfpAds(isPrime);
        execution = 1;
      } else {
        execution = 0;
      }
    });
  }, ["", isPrime]);

  useEffect(() => {
    sendMouseFlowEvent();
    loadAudienceDMPScript();
  }, []);

  return (
    <>
      <Script id="main-script">
        {`
          window.dataLayer = window.dataLayer || [];
          window.__APP = {
              env: "${APP_ENV}"
          }
          window.customDimension = window.customDimension || {};
          window.adDivIds = [];
          window._log = function(){
              let currDate = new Date().toString().split(" GMT")[0];
              let args = Array.prototype.slice.call(arguments);
          }
          var _comscore = _comscore || [];
          _comscore.push({ c1: "2", c2: "6036484" });
        `}
      </Script>
      <Script
        src={(GLOBAL_CONFIG as any)[APP_ENV]?.jssoSDK}
        onLoad={() => {
          window.jsso = new JssoCrosswalk("et", "web");
          const jssoLoaded = new Event("jssoLoaded");
          document.dispatchEvent(jssoLoaded);
        }}
      />
      <Script id="geoinfo-call">
        {`
        function getGeoInfo() {    
            var value = "", info = {};               
            var name = "geoinfo=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(let i = 0; i <ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                value = c.substring(name.length, c.length);
              }
            }

            if (value) {
              var comps = value.split(',').map(function(item) {
                return item.trim();
              });            
              var map = {'CC': 'CountryCode','RC': 'region_code','CT': 'city','CO': 'Continent','GL': 'geolocation'};
              var info = {};
              for (var i = 0; i < comps.length; i++) {
                var compSplit = comps[i].split(':');
                if (compSplit.length === 2) {
                  var key = compSplit[0].trim();
                  var value = compSplit[1].trim();
                  if (map[key]) {
                    info[map[key]] = value;
                  }
                }
              }
            }
            return info;
          }

          var geoinfo = getGeoInfo();

          if(geoinfo && !geoinfo.CountryCode) {
            var script= document.createElement('script');
            script.type= 'text/javascript';
            script.src= 'https://economictimes.indiatimes.com/geoapiet?cb=et';
            script.onload = function() {
              const geoLoaded = new Event("geoLoaded");
              document.dispatchEvent(geoLoaded);
            };
            document.head.appendChild(script);
          } else {
            const geoLoaded = new Event("geoLoaded");
            document.dispatchEvent(geoLoaded);
          }
        `}
      </Script>
      <Script
        src="https://cdn.cookielaw.org/consent/9c436ed7-68da-4e62-86c3-bc55a27afd97/otSDKStub.js"
        data-domain-script="9c436ed7-68da-4e62-86c3-bc55a27afd97"
        strategy="lazyOnload"
        onLoad={() => {
          function OptanonWrapper() {}
        }}
      />
      <Script
        src="https://survey.survicate.com/workspaces/0be6ae9845d14a7c8ff08a7a00bd9b21/web_surveys.js"
        strategy="lazyOnload"
        onLoad={() => {
          const surveyLoad = new Event("surveyLoad");
          document.dispatchEvent(surveyLoad);
        }}
      />
      <Script
        id="tag-manager-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GLOBAL_CONFIG.gtmId}');
          `,
        }}
      />
      <Script
        id="growthrx-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
                  (function (g, r, o, w, t, h, rx) {
                  g[t] = g[t] || function () {(g[t].q = g[t].q || []).push(arguments)
                  }, g[t].l = 1 * new Date();
                  g[t] = g[t] || {}, h = r.createElement(o), rx = r.getElementsByTagName(o)[0];
                  h.async = 1;h.src = w;rx.parentNode.insertBefore(h, rx)
              })(window, document, 'script', 'https://static.growthrx.in/js/v2/web-sdk.js', 'grx');
                  grx('init', '${(GLOBAL_CONFIG as any)[APP_ENV]?.grxId}');
                  const grxLoaded = new Event('grxLoaded');
                  document.dispatchEvent(grxLoaded);               
            `,
        }}
      />
      {!searchParams?.get("opt") && (
        <>
          <Script
            id="google-analytics"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
              ga('create', '${GLOBAL_CONFIG.gaId}', 'auto');
              const gaLoaded = new Event('gaLoaded');
              document.dispatchEvent(gaLoaded);
              `,
            }}
          />

          {!isPrime && !searchParams?.get("opt") && !adfreeTemplate && (
            <Script
              src="https://securepubads.g.doubleclick.net/tag/js/gpt.js?network-code=7176"
              onLoad={() => {
                const gptLoaded = new Event("gptLoaded");
                document.dispatchEvent(gptLoaded);
              }}
            />
          )}
          {!isPrime && !searchParams?.get("opt") && !adfreeTemplate && (
            <Script src={ET_ADS_URL} />
          )}
          {!isPrime && !searchParams?.get("opt") && !adfreeTemplate && (
            <Script src={ET_TIL_PREBID_URL} />
          )}

          {/* <Script
            id="tag-manager"
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=GTM-WV452H7`}
          /> */}
        </>
      )}
    </>
  );
};

export default Scripts;
