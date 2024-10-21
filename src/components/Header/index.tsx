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
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import DfpAds from "@/components/Ad/DfpAds";
import { freeTrialElegibilty, activateFreeTrial } from "@/utils/freeTrail";
import { useMarketStatus } from "@/hooks/useMarketStatus";
import { getParameterByName } from "@/utils";
import { renderIconPaths } from "@/utils/iconUtils";

const CommonNudge = dynamic(() => import("@/components/CommonNudge"), {
  ssr: false,
});
const LiveMarketData = dynamic(() => import("../LiveMarketData"), {
  ssr: false,
});

const Header = () => {
  const validAccessPass = freeTrialElegibilty();
  const { state, dispatch } = useStateContext();
  const { isPrime } = state.login;
  const { debounce } = useDebounce();
  useMarketStatus();
  const [shouldRenderComponent, setShouldRenderComponent] = useState(false);

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
          item_brand: "product_interventions",
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

    /* Storing Acq Details in storage if valid for campaign */
    const acqSource = getParameterByName("acqSource");
    const acqSubSource = getParameterByName("acqSubSource");
    if (acqSource || acqSubSource) {
      window.localStorage.setItem(
        "acqDetails",
        JSON.stringify({ acqSource: acqSource, acqSubSource: acqSubSource }),
      );
    }

    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, [handleResize]);

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
              <i className="eticon_switch_to_et"></i>
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
              {!isPrime && (
                <span
                  className={`default-btn ${styles.subscribeBtn}`}
                  onClick={redirectToPlanPage}
                >
                  <span className={styles.prime_icon}>
                    <span className="eticon_prime_logo">
                      {renderIconPaths("eticon_prime_logo")}
                    </span>
                  </span>
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
