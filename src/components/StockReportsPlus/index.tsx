"use client";
import React, { useState } from "react";
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
import HeadingHome from "../ViewAllLink/HeadingHome";
import { redirectToPlanPage, trackingEvent } from "@/utils/ga";

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
    },
  },
  {
    breakpoint: 1921,
    settings: {
      slidesToShow: 4,
    },
  },
  {
    breakpoint: 1601,
    settings: {
      slidesToShow: 3,
    },
  },
  {
    breakpoint: 1281,
    settings: {
      slidesToShow: 2,
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

  const handlePaywallClick = (value: boolean, catName: any) => {
    const objTracking = {
      category: "mercury_engagement",
      action: "card_clicked",
      label: `${catName}`,
      widget_name: "SRPlus_HomePage_Widget",
      tab_name: `${catName}`,
      obj: {
        item_name: "stock_report_plus_stock",
        item_id: "stock_report_plus_stock",
        item_brand: "market_tools",
        item_category: "stock_report_plus",
        item_category2: `stock_report_plus_stock_${catName}`,
        item_category3: "paywall_blocker_cta",
        item_category4: "locked",
      },
      cdp: {
        event_nature: "impression",
        event_category: "subscription",
        event_name: "subscription_feature",
      },
    };
    redirectToPlanPage(objTracking, "view_item_list", false);
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
        <HeadingHome
          title="Stock Reports Plus"
          url={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/markets/benefits/stockreportsplus`}
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
                    slidesToScroll={1}
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
                    slidesToScroll={1}
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
          text={`View Stocks with ${activeTab?.name}`}
          link={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/markets/stockreportsplus/${screenerDetail?.seoName}/stockreportscategory/screenerid-${activeTab?.screenerId}.cms`}
        />
      </div>
      {isModalOpen && (
        <StockSRLoginBlocker
          overlayBlockerData={overlayBlockerData}
          isLoginUser={isLoginUser}
          handleClick={handlePaywallClick}
          srTabActivemenu={activeTab?.name}
        />
      )}
    </>
  );
};

export default StockReportsPlus;
