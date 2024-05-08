"use client";
import React, { useState } from "react";
import styles from "./StockReportsPlus.module.scss";
import SlickSlider from "../SlickSlider";
import APIS_CONFIG from "@/network/api_config.json";
import service from "@/network/service";
import { APP_ENV } from "@/utils";
import StockReportsType2 from "./StockReportsType2";
import StockReportsType3 from "./StockReportsType3";
import StockReportsTab from "./StockReportsTab";
import ViewAllLink from "../ViewAllLink";

interface Slide {
  content: JSX.Element;
}
interface Props {
  srResult: any;
}
const StockReportsPlus: React.FC<Props> = ({ srResult }) => {
  // console.log('@@ -->' ,srResult)
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
  const [activeTab, setActiveTab] = useState(tabNames[0]);
  const [activeSlides, setActiveSlides] = useState<any[]>(srResult.dataList);

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    fetchData(tab.screenerId);
    // console.log('tabName ---> ', tab)
  };

  const fetchData = async (screenerId: any) => {
    const stockReportAllTabApi = `${(APIS_CONFIG as any)?.["SCREENER_BY_SCREENERID"][APP_ENV]}`;
    // console.log("@@type --- > " , type)
    const payload = {
      deviceId: "web",
      pageno: 1,
      pagesize: 20,
      screenerId: screenerId,
      viewId: 5246,
      filterType: "index",
      filterValue: [2365],
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
    // console.log("@@fetchData --- > " , data)
  };
  return (
    <div className={styles.wrapper}>
      <h1 className="heading">
        Stock Reports Plus
        <span className={`eticon_caret_right headingIcon`} />
      </h1>
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
            {activeTab.type === "type-2" ? (
              <SlickSlider
                slides={activeSlides.map((slide, index) => ({
                  content: <StockReportsType2 datalist={slide} />,
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
                  content: <StockReportsType3 datalist={slide} />,
                }))}
                key={`slider${activeTab}`}
                sliderId={`slider${activeTab}`}
                slidesToShow={3}
                slidesToScroll={3}
                rows={2}
                responsive={responsive}
              />
            )}
          </div>
        </div>
      </div>
      <ViewAllLink
        text="See All Stock Reports"
        link="/markets/benefits/stockreportsplus"
      />
    </div>
  );
};

export default StockReportsPlus;
