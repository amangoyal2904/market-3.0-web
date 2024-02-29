import React, { useState, useEffect } from "react";
import styles from "./StockReportsPlus.module.scss";
import SlickSlider from "../SlickSlider";
import StockScreens from "../StockScreens";

const StockReportsPlus: React.FC = () => {
  const tabNames = ["Stock Scores", "Stock Forecast"];
  const [activeTab, setActiveTab] = useState(tabNames[0]); // Initialize activeTab with the first tab dynamically
  const [activeSlides, setActiveSlides] = useState<Slide[]>([]);
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
      breakpoint: 1361,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ];
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  interface Slide {
    title: string;
    score: number;
    maxScore: number;
    expectedReturns: string;
    target: string;
    recommendation: string;
    currentPrice: string;
  }

  const tabData: Record<string, Slide[]> = {
    "Stock Scores": [
      {
        title: "Dummy Title 1",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 1",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 2",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 2",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 3",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 3",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 4",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 4",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 5",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 5",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 6",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 6",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 1",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 1",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 2",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 2",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 3",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 3",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 4",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 4",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 5",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 5",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 6",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 6",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 1",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 1",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 2",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 2",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 3",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 3",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 4",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 4",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 5",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 5",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 6",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 6",
        recommendation: "Buy",
        currentPrice: "$100",
      },
    ],
    "Stock Forecast": [
      {
        title: "Dummy Title 1",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 1",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 2",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 2",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 3",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 3",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 4",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 4",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 5",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 5",
        recommendation: "Buy",
        currentPrice: "$100",
      },
      {
        title: "Dummy Title 6",
        score: 80,
        maxScore: 100,
        expectedReturns: "10%",
        target: "Dummy Target 6",
        recommendation: "Buy",
        currentPrice: "$100",
      },
    ],
    // Add data for other tabs as needed
  };
  const getdotsnum = (a: any) => {
    // alert(a);
  };
  useEffect(() => {
    setActiveSlides(tabData[activeTab]);
  }, [activeTab]);

  return (
    <div className={styles.wraper}>
      <h1 className={styles.heading1}>Stock Reports Plus</h1>

      <div className={styles.tabMainBox}>
        <ul className={styles.tabs}>
          {tabNames.map((tab) => (
            <li
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>

        <div className={styles.tabContentWraper}>
          <div
            className={`${styles.tabContentBox} ${activeTab === activeTab ? styles.active : ""}`}
          >
            <SlickSlider
              slides={activeSlides.map((slide, index) => ({
                content: <StockScreens key={index} slide={slide} />,
              }))}
              key={`slider${activeTab}`}
              sliderId={`slider${activeTab}`}
              dotsNum={getdotsnum}
              slidesToShow={3}
              slidesToScroll={3}
              rows={2}
              responsive={responsive}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockReportsPlus;
