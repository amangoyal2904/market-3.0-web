
import { log } from "console";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { FC, useEffect } from "react";
import { APP_ENV, verifyLogin } from "../utils";
import {GLOBAL_CONFIG} from "../network/global_config"


interface Props {
  isprimeuser?: number | boolean;
  objVc?: object;
}

declare global {
  interface Window {
    ispopup: any;
    jsso?: {
      getValidLoggedInUser?: any;
      getUserDetails?: any;
      signOutUser?: any;
    };
    ssoWidget?: any;
    verifyLoginSuccess?: any; 
    objUser:  {
      ssoid?: any;
      ticketId?: any;
      info?: {
        thumbImageUrl: any;
      };
      isPrime?: any;
      permissions?: any;
      accessibleFeatures?:any;
      primeInfo?: any;
    };
  }
  
}

declare var JssoCrosswalk: any;


const Scripts: FC<Props> = ({ isprimeuser, objVc = {} }) => {

  console.log(APP_ENV);
  const router = useRouter();
  const searchParams = useSearchParams();

  console.log({searchParams});

  const minifyJS = APP_ENV === "development" ? 0 : 1;
  const jsDomain = "https://etdev8243.indiatimes.com"; //APP_ENV === "development" ? "https://etdev8243.indiatimes.com" : "https://js.etimg.com";
  const jsIntsURL = `${jsDomain}/js_ints_web.cms`;

  useEffect(() => {
    
  }, []);

  return (
    <>
      <Script id="main-script">
        {`
          window.__APP = {
              env: "${APP_ENV}"
          }
          window.customDimension = window.customDimension || {};
          window.adDivIds = [];
          window._log = function(){
              let currDate = new Date().toString().split(" GMT")[0];
              let args = Array.prototype.slice.call(arguments);
              console.log(currDate + ' >', args.toString());
          }
          var _comscore = _comscore || [];
          _comscore.push({ c1: "2", c2: "6036484" });
        `}
      </Script>
      <Script
        src={(GLOBAL_CONFIG as any)[APP_ENV]?.jssoSDK}
        onLoad={() => {
          window.jsso = new JssoCrosswalk('et', 'web');
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

            if(value) {
              var comps = value.split(',')
              (function(item) { return item.trim(); });                                              
              var map = {'CC': 'CountryCode', 'RC': 'region_code', 'CT': 'city', 'CO': 'Continent', 'GL': 'geolocation'}
              for(var i=0; i<comps.length; i++) {
                var compSplit = comps[i].split(':');
                info[map[compSplit[0]]] = compSplit[1];
              }
            }

            return info;
          }

          var geoinfo = getGeoInfo();

          if(geoinfo && !geoinfo.CountryCode) {
            var script= document.createElement('script');
            script.type= 'text/javascript';
            script.src= 'https://m.economictimes.com/geoapiet/?cb=et';
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
      {/* <Script
        src={jsIntsURL}
        strategy="afterInteractive"
        onLoad={() => {
          const objIntsLoaded = new Event("objIntsLoaded");
          document.dispatchEvent(objIntsLoaded);
        }}
      /> */}

      {!searchParams?.get('opt') && (
        <>
          <Script
            id="google-analytics"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

              ga('create', 'UA-198011-5', 'auto');
              const gaLoaded = new Event('gaLoaded');
              document.dispatchEvent(gaLoaded);
              `
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
                grx('init', 'gc2744074');
                window.customDimension = { ...window["customDimension"], url: window.location.href };
                //grx('track', 'page_view', {url: window.location.href});
                const grxLoaded = new Event('grxLoaded');
                document.dispatchEvent(grxLoaded);                
              `
            }}
          />
          <Script
            id="tag-manager"
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=GTM-WV452H7`}
          />
          <Script
            id="tag-manager-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', 'GTM-WV452H7', { page_path: window.location.pathname });
              `
            }}
          />
            
        </>
      )}
    </>
  );
};

export default Scripts;
