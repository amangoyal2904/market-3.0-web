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
  const [activeTab, setActiveTab] = useState(tabNames[0]);
  const [activeSlides, setActiveSlides] = useState<any[]>(srResult.dataList);

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    fetchData(tab.screenerId);
    // console.log('tabName ---> ', tab)
  };

  const getdotsnum = (a: any) => {
    // alert(a);
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
    <div className={styles.wraper}>
      <h1 className={styles.heading1}>Stock Reports Plus</h1>

      <div className={styles.tabMainBox}>
        {/* <ul className={styles.tabs}>
          {tabNames.map((tab) => (
            <li
              key={tab.seoName}
              className={`${styles.tab} ${activeTab.seoName === tab.seoName ? styles.active : ""}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab.name}
            </li>
          ))}
        </ul> */}

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
                dotsNum={getdotsnum}
              />
            ) : (
              <SlickSlider
                slides={activeSlides.map((slide, index) => ({
                  content: <StockReportsType3 datalist={slide} />,
                }))}
                key={`slider${activeTab}`}
                sliderId={`slider${activeTab}`}
                dotsNum={getdotsnum}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockReportsPlus;
