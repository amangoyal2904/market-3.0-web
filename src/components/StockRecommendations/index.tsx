"use client";
import React, { useState } from "react";
import styles from "./StockRecommendations.module.scss";
import StockReco from "../StockReco";
import SlickSlider from "../SlickSlider";
import service from "@/network/service";
import ViewAllLink from "../ViewAllLink";

interface Slide {
  content: JSX.Element;
}
interface Props {
  stockRecoResult: any;
}
const StockRecommendations: React.FC<Props> = ({ stockRecoResult }) => {
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
    // {
    //   type: "recoOnWL",
    //   name: "Recos on Your Watchlist",
    // },
  ];
  const responsive = [
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
  const [stockData, setStockData] = useState<any[]>(stockRecoResult?.recoData);

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
    <div className={styles.wrapper}>
      <h1 className="heading ">
        Stock Recommendations
        <span className={`eticon_caret_right headingIcon`} />
      </h1>

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
                    pageName="homepage_stockRecosWd"
                    urlFilterHandle={undefined}
                  />
                ),
              }))}
              key={`slider${activeTab.type}`}
              sliderId={`slider${activeTab.type}`}
              slidesToShow={3}
              slidesToScroll={3}
              rows={2}
              responsive={responsive}
            />
          </div>
        </div>
      </div>
      <ViewAllLink
        text="See All Stock Recommendations"
        link="/stocksrecos/overview"
      />
    </div>
  );
};

export default StockRecommendations;
