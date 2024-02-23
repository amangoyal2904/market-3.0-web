import React, { useState, useEffect } from "react";
import styles from "./StockRecommendations.module.scss";
import StockReco from "../StockReco";
import SlickSlider from "../SlickSlider";
import service from "@/network/service";

interface Slide {
  content: JSX.Element;
}

const StockRecommendations: React.FC = () => {
  const tabNames = [
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
    {
      type: "recoOnWL",
      name: "Recos on Your Watchlist",
    },
  ];
  const [activeTab, setActiveTab] = useState(tabNames[0]);
  const [stockData, setStockData] = useState<any[]>([]);

  useEffect(() => {
    fetchData(activeTab.type);
  }, []);

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    fetchData(tab.type);
  };
  const getdotsnum = (a: any) => {
    // alert(a)
  };
  const fetchData = async (type: any) => {
    const stockReportAllTabApi =
      "https://etmarketsapis.indiatimes.com/ET_Stats/getRecosDetail";
    // console.log("@@type --- > " , type)
    const payload = {
      apiType: type,
      filterType: "",
      filterValue: [],
      recoType: "all",
      pageSize: 30,
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
    // console.log("@@fetchData --- > " , data)
  };

  return (
    <div className={styles.wraper}>
      <h1 className={styles.heading1}>Stock Recommendations</h1>

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
            <SlickSlider
              slides={stockData[0]?.data?.map((card: any, index: any) => ({
                content: (
                  <StockReco
                    data={card}
                    key={index}
                    activeTab={activeTab.type}
                  />
                ),
              }))}
              key={`slider${activeTab.type}`}
              sliderId={`slider${activeTab.type}`}
              dotsNum={getdotsnum}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockRecommendations;
