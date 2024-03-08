"use client";
import React, { useState } from "react";
import service from "@/network/service";
import StockRecosListing from "@/components/StockRecosListing";
import styles from "./StockRecosOverview.module.scss";
import Overview from "./Overviews";

const StockRecosOverview = (props: any) => {
  const { recosNavResult, recosDetailResult, selectedFilter } = props;
  const tabNames = [
    {
      type: "overview",
      name: "overview",
    },
    {
      type: "newRecos",
      name: "New Recos",
    },
    {
      type: "mostBuy",
      name: "Most Buy",
    },
    {
      type: "mostSell",
      name: "Most Sell",
    },
    {
      type: "recoByFH",
      name: "Reocs by Fund Houses",
    },
    // {
    //   type: "recoOnWL",
    //   name: "Recos on Your Watchlist",
    // },
  ];
  const responsive = [
    {
      breakpoint: 1921,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
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
      breakpoint: 1361,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ];

  const [activeTab, setActiveTab] = useState(tabNames[0]);
  const [stockData, setStockData] = useState<any[]>([]);
  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    fetchData(tab.type);
  };
  const fetchData = async (type: any) => {
    const stockReportAllTabApi =
      "https://etmarketsapis.indiatimes.com/ET_Stats/getRecosDetail";
    // console.log("@@type --- > " , type)
    const payload = {
      apiType: type,
      filterType: "",
      filterValue: [],
      pageSize: 10,
      pageNumber: 1,
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
    setStockData(data?.recoData);
    // console.log("@@fetchData --- > ", data);
  };
  return (
    <div className={styles.wraper}>
      {/* <h1 className={styles.heading1}>Stock Recommendations</h1> */}

      <div className={styles.tabMainBox}>
        <ul className={styles.tabs}>
          {tabNames.map((tab) => (
            <li
              key={tab.type}
              className={`${styles.tab} ${activeTab.type === tab.type ? styles.active : ""}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab.name}
            </li>
          ))}
        </ul>

        <div className={styles.tabContentWraper}>
          <div
            className={`${styles.tabContentBox} ${activeTab.type === activeTab.type ? styles.active : ""}`}
          >
            {activeTab.type != "overview" ? (
              <StockRecosListing
                recosNavResult={recosNavResult}
                recosDetailResult={recosDetailResult}
                selectedFilter={selectedFilter}
                data={stockData}
              />
            ) : (
              <Overview data={stockData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default StockRecosOverview;
