"use client";
import React, { useEffect, useState } from "react";
import styles from "./StockReportsPlus.module.scss";
import SlickSlider from "../SlickSlider";
import APIS_CONFIG from "@/network/api_config.json";
import service from "@/network/service";
import { APP_ENV } from "@/utils";
import StockReportsTab from "./StockReportsTab";
import ViewAllLink from "../ViewAllLink";
import SRCardTwo from "../StockReport/SRCardTwo";
import SRCardThree from "../StockReport/SRCardThree";
import { useStateContext } from "@/store/StateContext";
import Blocker from "../Blocker";
import Loader from "../Loader";
import StockSRLoginBlocker from "../StockSRLoginBlocker";
import Image from "next/image";
import HeadingHome from "../ViewAllLink/HeadingHome";
import { trackingEvent } from "@/utils/ga";

interface Props {
  srResult: any;
}
const overlayBlockerData = {
  textForData:
    "Exclusive stock reports are accessible for ETPrime members only.",
  ctaText: "Subscribe Now",
  textBenefits: "Become a member & unlock all reports now.",
};
const tabNames = [
  {
    name: "High Upside",
    type: "type-3",
    seoName: "high-upside",
    screenerId: 2554,
  },
  {
    name: "Top Score Companies",
    type: "type-2",
    seoName: "top-score-companies",
    screenerId: 4205,
  },
  {
    name: "Analyst Favs",
    type: "type-3",
    seoName: "analyst-favs",
    screenerId: 2695,
  },
  {
    name: "Upward Momentum",
    type: "type-2",
    seoName: "upward-momentum",
    screenerId: 2694,
  },
  {
    name: "Score Upgrade",
    type: "type-2",
    seoName: "score-upgrade",
    screenerId: 2518,
  },
];
const responsive = [
  {
    breakpoint: 2560,
    settings: {
      slidesToShow: 5,
      slidesToScroll: 5,
    },
  },
  {
    breakpoint: 1921,
    settings: {
      slidesToShow: 4,
      slidesToScroll: 4,
    },
  },
  {
    breakpoint: 1601,
    settings: {
      slidesToShow: 3,
      slidesToScroll: 3,
    },
  },
  {
    breakpoint: 1281,
    settings: {
      slidesToShow: 2,
      slidesToScroll: 2,
    },
  },
];

const StockReportsPlus: React.FC<Props> = ({ srResult }) => {
  const { state } = useStateContext();
  const { isLogin, isPrime } = state.login;
  const isPrimeUser = isPrime || false;
  const isLoginUser = isLogin || false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [activeTab, setActiveTab] = useState<any>(
    tabNames && tabNames?.length ? tabNames[0] : [],
  );
  const [activeSlides, setActiveSlides] = useState<any[]>(srResult?.dataList);
  const [screenerDetail, setScreenerDetail] = useState(
    srResult?.screenerDetail,
  );

  const handleTabClick = (tab: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "tab_selected",
      event_label: `${tab.name} Stock reports plus`,
    });
    setProcessingLoader(true);
    setActiveTab(tab);
    fetchData(tab.screenerId);
  };

  const fetchData = async (screenerId: any) => {
    const stockReportAllTabApi = `${(APIS_CONFIG as any)?.["SCREENER_BY_SCREENERID"][APP_ENV]}`;
    const payload = {
      deviceId: "web",
      pageno: 1,
      pagesize: 20,
      screenerId: screenerId,
      viewId: 5246,
      filterType: "index",
      filterValue: [],
    };

    const headers = {
      "Content-Type": "application/json",
    };
    const stockReportAllTabPromise = await service.post({
      url: stockReportAllTabApi,
      headers: headers,
      body: JSON.stringify(payload),
      params: {},
    });

    const data = await stockReportAllTabPromise?.json();
    setActiveSlides(data.dataList);
    setScreenerDetail(data.screenerDetail);
    setProcessingLoader(false);
  };

  const handlePaywallClick = (value: boolean) => {
    setIsModalOpen(value);
    if (value) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  };

  return (
    <>
      <div className="sectionWrapper">
        {/* <h2 className="heading">
          <div className="dflex align-item-center space-between">
            <a
              target="_blank"
              title="Stock Reports Plus"
              href={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}markets/benefits/stockreportsplus`}
            >
              Stock Reports Plus
              <span className={`eticon_caret_right headingIcon`} />
            </a>
            <p className={styles.powered}>
              Powered By
              <Image
                src="/img/refinitiv.png"
                width={88}
                height={22}
                alt="Refinitiv"
                loading="lazy"
              />
            </p>
          </div>
        </h2> */}
        <HeadingHome
          title="Stock Reports Plus"
          url={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}markets/benefits/stockreportsplus`}
        />
        <div className={styles.tabMainBox}>
          <StockReportsTab
            handleTabClick={handleTabClick}
            tabNames={tabNames}
            activeTab={activeTab}
          />

          <div className={styles.tabContentWraper}>
            <div
              className={`${styles.tabContentBox} ${activeTab.seoName === activeTab.seoName ? styles.active : ""}`}
            >
              {!!processingLoader && <Loader loaderType="container" />}
              {!!activeSlides && activeSlides.length ? (
                activeTab.type === "type-2" ? (
                  <SlickSlider
                    slides={activeSlides.map((slide, index) => ({
                      content: (
                        <SRCardTwo
                          key={index}
                          catName={activeTab?.name}
                          primeUser={isPrimeUser}
                          tabName="MarketLIVECoverage"
                          dataList={slide}
                          handleClick={handlePaywallClick}
                        />
                      ),
                    }))}
                    key={`slider${activeTab}`}
                    sliderId={`slider${activeTab}`}
                    slidesToShow={3}
                    slidesToScroll={3}
                    rows={2}
                    responsive={responsive}
                  />
                ) : (
                  <SlickSlider
                    slides={activeSlides.map((slide, index) => ({
                      content: (
                        <SRCardThree
                          key={index}
                          catName={activeTab?.name}
                          primeUser={isPrimeUser}
                          tabName="MarketLIVECoverage"
                          dataList={slide}
                          handleClick={handlePaywallClick}
                        />
                      ),
                    }))}
                    key={`slider${activeTab}`}
                    sliderId={`slider${activeTab}`}
                    slidesToShow={3}
                    slidesToScroll={3}
                    rows={2}
                    responsive={responsive}
                  />
                )
              ) : (
                <Blocker type={"noDataMinimal"} />
              )}
            </div>
          </div>
        </div>
        <ViewAllLink
          text={`See All ${activeTab?.name}`}
          link={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}markets/stockreportsplus/${screenerDetail?.seoName}/stockreportscategory/screenerid-${activeTab?.screenerId}.cms`}
        />
      </div>
      {isModalOpen && (
        <StockSRLoginBlocker
          overlayBlockerData={overlayBlockerData}
          isLoginUser={isLoginUser}
          handleClick={handlePaywallClick}
        />
      )}
    </>
  );
};

export default StockReportsPlus;
