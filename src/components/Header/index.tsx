"use client";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import styles from "./Header.module.scss";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useStateContext } from "../../store/StateContext";
import ETLogo from "../../../public/img/et-markets-logo.svg";
import { goToPlansPage1, trackingEvent } from "@/utils/ga";
import Login from "../Login";
import Search from "../Search";
import useDebounce from "@/hooks/useDebounce";
import { getCurrentMarketStatus } from "@/utils/utility";
import refeshConfig from "@/utils/refreshConfig.json";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import DfpAds from "@/components/Ad/DfpAds";
import { freeTrialElegibilty, activateFreeTrial } from "@/utils/freeTrail";

const CommonNudge = dynamic(() => import("@/components/CommonNudge"), {
  ssr: false,
});
const LiveMarketData = dynamic(() => import("../LiveMarketData"), {
  ssr: false,
});

const Header = () => {
  const { state, dispatch } = useStateContext();
  const { isPrime } = state.login;
  const { debounce } = useDebounce();
  const [shouldRenderComponent, setShouldRenderComponent] = useState(false);

  const [mktStatus, setMktStatus] = useState({
    currentMarketStatus: "",
    marketStatus: "",
  });
  const [lastMarketStatus, setLastMarketStatus] = useState({
    currentMarketStatus: "",
    marketStatus: "",
  });
  const [validAccessPass, setValidAccessPass] = useState(false);

  const handleResize = useCallback(() => {
    setShouldRenderComponent(window.innerWidth >= 1280);
  }, []);

  const redirectToPlanPage = () => {
    try {
      if (validAccessPass) {
        activateFreeTrial();
      } else {
        const pagePathName = window.location.pathname;
        let site_section = pagePathName.split("/");
        let lastSlash = site_section[site_section.length - 1];
        trackingEvent("et_push_event", {
          event_category: "Subscription Flow ET",
          event_action: "SYFT | Flow Started",
          event_label: "ATF - " + window.location.href,
        });
        const obj = {
          item_name: "atf_" + lastSlash,
          item_id: "atf",
          item_brand: "market_tools",
          item_category: "atf_offer_cta",
          item_category2: lastSlash,
          item_category3: "atf_cta",
          item_category4: "Subscribe Now",
        };
        const cdp = {
          event_nature: "click",
          event_category: "subscription",
          event_name: "paywall",
          cta_text: "Subscribe Now",
        };
        goToPlansPage1("select_item", obj, true, cdp);
      }
    } catch (Err) {
      console.log("redirectToPlanPage Err:", Err);
      goToPlansPage1("select_item", {}, true);
    }
  };

  useEffect(() => {
    handleResize(); // Initial check
    const debouncedResize = debounce(handleResize, 300); // Debounce resize event
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, [handleResize]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: number;

    const isValidAccessPass = freeTrialElegibilty();
    setValidAccessPass(isValidAccessPass);

    const getMarketStatus = async () => {
      if (document.visibilityState !== "visible") {
        return;
      }
      try {
        const result = await getCurrentMarketStatus();
        if (isMounted && !!result) {
          if (
            result.currentMarketStatus !== undefined &&
            result.marketStatus !== undefined
          ) {
            setMktStatus({
              currentMarketStatus: result.currentMarketStatus,
              marketStatus: result.marketStatus,
            });
          }
          if (result?.marketStatus === "ON") {
            timeoutId = window.setTimeout(
              getMarketStatus,
              refeshConfig.marketStatus,
            );
          }
        }
      } catch (error) {
        console.error("Error fetching market status:", error);
        // Handle error as needed, e.g., set an error state or retry mechanism
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        getMarketStatus();
      } else {
        clearTimeout(timeoutId);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial call
    if (document.visibilityState === "visible") {
      getMarketStatus();
    }

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (
      mktStatus.currentMarketStatus !== "" &&
      mktStatus.marketStatus !== "" &&
      (mktStatus.currentMarketStatus !== lastMarketStatus.currentMarketStatus ||
        mktStatus.marketStatus !== lastMarketStatus.marketStatus)
    ) {
      dispatch({
        type: "MARKET_STATUS",
        payload: {
          currentMarketStatus: mktStatus.currentMarketStatus.toUpperCase(),
          marketStatus: mktStatus.marketStatus.toUpperCase(),
        },
      });
      setLastMarketStatus({
        currentMarketStatus: mktStatus.currentMarketStatus,
        marketStatus: mktStatus.marketStatus,
      });
    }
  }, [mktStatus, lastMarketStatus, dispatch]);

  return (
    <>
      <DfpAds adInfo={AdInfo.dfp.topad} />
      <header id={styles.pageTopbar}>
        <Suspense fallback="">
          <CommonNudge modalType="showTopNudgePrime" />
        </Suspense>
        <div className={styles.navbarHeader} id="header">
          <div className={`dflex align-item-center ${styles.logoHeader}`}>
            <Link
              href="/markets/live-coverage"
              title="ET Markets"
              onClick={() =>
                trackingEvent("et_push_event", {
                  event_category: "mercury_engagement",
                  event_action: "atf_header_click",
                  event_label: "ETMarketsLogo",
                })
              }
            >
              <Image
                src={ETLogo}
                width={138}
                height={24}
                quality={100}
                alt="ET Markets"
                title="ET Markets"
                priority={true}
              />
            </Link>
          </div>
          <div className={styles.switchToEt}>
            <a
              href="https://economictimes.indiatimes.com/"
              className={styles.switchTxtSec}
              target="_blank"
            >
              Switch To <span>ET</span>
            </a>
          </div>
          <div
            className={`dflex align-item-center ${styles.headerRightContainer}`}
          >
            <div className={styles.headerMidContainer}>
              <Search pos="header" />
            </div>
            <div className={`dflex align-item-center`}>
              {shouldRenderComponent && <LiveMarketData />}
              {/* <Link
                className="default-btn"
                href="/watchlist"
                title="My Watchlist"
                onClick={() =>
                  trackingEvent("et_push_event", {
                    event_category: "mercury_engagement",
                    event_action: "atf_header_click",
                    event_label: "MyWatchList",
                  })
                }
              >
                My Watchlist
              </Link> */}
              {!isPrime && (
                <span
                  className={`default-btn ${styles.subscribeBtn}`}
                  onClick={redirectToPlanPage}
                >
                  <Image
                    src="/marketsweb/img/icon_prime.svg"
                    height="12"
                    width="12"
                    alt="Subscribe"
                    title="Subscribe"
                    className={styles.prime_icon}
                  />
                  {validAccessPass ? "Start Free Trial" : "Subscribe"}
                </span>
              )}
              <Login />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
