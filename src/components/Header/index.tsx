"use client";
import React, { useEffect, useState, useCallback } from "react";
import styles from "./Header.module.scss";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useStateContext } from "../../store/StateContext";
import ETLogo from "../../../public/et-markets-logo.svg";
import { goToPlansPage1, trackingEvent } from "@/utils/ga";
import Login from "../Login";
import Search from "../Search";
import useDebounce from "@/hooks/useDebounce";
import { getCurrentMarketStatus } from "@/utils/utility";
import refeshConfig from "@/utils/refreshConfig.json";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import DfpAds from "@/components/Ad/DfpAds";

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

  const handleResize = useCallback(() => {
    setShouldRenderComponent(window.innerWidth >= 1280);
  }, []);

  const redirectToPlanPage = () => {
    try {
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
        item_brand: "product_interventions",
        item_category: "atf_offer_cta",
        item_category2: lastSlash,
        item_category3: "atf_cta",
        item_category4: "Subscribe Now",
      };
      goToPlansPage1("select_item", obj);
    } catch (Err) {
      console.log("redirectToPlanPage Err:", Err);

      goToPlansPage1("select_item", {});
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

    const getMarketStatus = async () => {
      const result = await getCurrentMarketStatus();
      if (isMounted && !!result) {
        setMktStatus({
          currentMarketStatus: result?.currentMarketStatus,
          marketStatus: result?.marketStatus,
        });
        if (result.marketStatus === "ON") {
          const timeoutId = setTimeout(
            getMarketStatus,
            refeshConfig.marketStatus,
          );
          return () => clearTimeout(timeoutId);
        }
      }
    };

    getMarketStatus();

    return () => {
      isMounted = false;
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
        <div className={styles.navbarHeader} id="header">
          <div className={`dflex align-item-center ${styles.logoHeader}`}>
            <Link href="/markets/live-coverage" title="ET Markets">
              <Image
                src={ETLogo}
                width={138}
                height={24}
                quality={100}
                alt="ET Markets"
                title="ET Markets"
              />
            </Link>
          </div>

          <div
            className={`dflex align-item-center ${styles.headerRightContainer}`}
          >
            <div className={styles.headerMidContainer}>
              <Search location="header" />
            </div>
            <div className={`dflex align-item-center`}>
              {shouldRenderComponent && <LiveMarketData />}
              <Link
                className="default-btn"
                href="/watchlist"
                title="My Watchlist"
              >
                My Watchlist
              </Link>
              {!isPrime && (
                <span
                  className={`default-btn ${styles.subscribeBtn}`}
                  onClick={redirectToPlanPage}
                >
                  <img
                    src="/prime_icon.svg"
                    height="12"
                    width="12"
                    className={styles.prime_icon}
                  />
                  Subscribe
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
