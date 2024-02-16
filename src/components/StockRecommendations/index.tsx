"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./Market.module.scss";
import SlickSlider from "../SlickSlider";

interface Slide {
  content: JSX.Element;
}
const StockRecommendations = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const slides1: Slide[] = [
    {
      content: (
        <div className={`${styles.stocksMain} ${styles.buyStock}`}>
          <div className={styles.stocksBox}>
            <div className={styles.stocksCallDates}>
              <span className={styles.buySellTitle}>Buy</span>
              <span className={styles.callDateBox}>
                <span className={styles.callDateTitle}>Call Date:</span>
                <span className={styles.callDate}>Sept 4, 2023</span>
              </span>
            </div>
            <h2 className={styles.stocksTitle}>Tata Steel Pvt. Ltd.</h2>
            <div className={styles.updownTargetBox}>
              <div className={styles.potensialBox}>
                <h3>Potential Upside</h3>
                <h4>22.76%</h4>
              </div>
              <ul className={styles.targetBox}>
                <li>
                  <span>Target</span>
                  <span>1150</span>
                </li>
                <li>
                  <span>Price at Reco</span>
                  <span>1284</span>
                </li>
                <li>
                  <span>Current Price</span>
                  <span>23,950.35</span>
                </li>
              </ul>
            </div>
          </div>
          <a href="javascript:void(0);" className={styles.viewReportBox}>
            <span className={`eticon_srplus ${styles.pdfIcon}`}></span>
            <span className={styles.viewReport}>View Report</span>
          </a>
          <div className={styles.brokerageBox}>
            <span>Brokerage:</span>
            <span>Motilal Oswal</span>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className={`${styles.stocksMain} ${styles.sellStock}`}>
          <div className={styles.stocksBox}>
            <div className={styles.stocksCallDates}>
              <span className={styles.buySellTitle}>Buy</span>
              <span className={styles.callDateBox}>
                <span className={styles.callDateTitle}>Call Date:</span>
                <span className={styles.callDate}>Sept 4, 2023</span>
              </span>
            </div>
            <h2 className={styles.stocksTitle}>Tata Steel Pvt. Ltd.</h2>
            <div className={styles.updownTargetBox}>
              <div className={styles.potensialBox}>
                <h3>Potential Upside</h3>
                <h4>22.76%</h4>
              </div>
              <ul className={styles.targetBox}>
                <li>
                  <span>Target</span>
                  <span>1150</span>
                </li>
                <li>
                  <span>Price at Reco</span>
                  <span>1284</span>
                </li>
                <li>
                  <span>Current Price</span>
                  <span>23,950.35</span>
                </li>
              </ul>
            </div>
          </div>
          <a href="javascript:void(0);" className={styles.viewReportBox}>
            <span className={`eticon_srplus ${styles.pdfIcon}`}></span>
            <span className={styles.viewReport}>View Report</span>
          </a>
          <div className={styles.brokerageBox}>
            <span>Brokerage:</span>
            <span>Motilal Oswal</span>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className={`${styles.stocksMain} ${styles.sellStock}`}>
          <div className={styles.stocksBox}>
            <div className={styles.stocksCallDates}>
              <span className={styles.buySellTitle}>Buy</span>
              <span className={styles.callDateBox}>
                <span className={styles.callDateTitle}>Call Date:</span>
                <span className={styles.callDate}>Sept 4, 2023</span>
              </span>
            </div>
            <h2 className={styles.stocksTitle}>Tata Steel Pvt. Ltd.</h2>
            <div className={styles.updownTargetBox}>
              <div className={styles.potensialBox}>
                <h3>Potential Upside</h3>
                <h4>22.76%</h4>
              </div>
              <ul className={styles.targetBox}>
                <li>
                  <span>Target</span>
                  <span>1150</span>
                </li>
                <li>
                  <span>Price at Reco</span>
                  <span>1284</span>
                </li>
                <li>
                  <span>Current Price</span>
                  <span>23,950.35</span>
                </li>
              </ul>
            </div>
          </div>
          <a href="javascript:void(0);" className={styles.viewReportBox}>
            <span className={`eticon_srplus ${styles.pdfIcon}`}></span>
            <span className={styles.viewReport}>View Report</span>
          </a>
          <div className={styles.brokerageBox}>
            <span>Brokerage:</span>
            <span>Motilal Oswal</span>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className={`${styles.stocksMain} ${styles.buyStock}`}>
          <div className={styles.stocksBox}>
            <div className={styles.stocksCallDates}>
              <span className={styles.buySellTitle}>Buy</span>
              <span className={styles.callDateBox}>
                <span className={styles.callDateTitle}>Call Date:</span>
                <span className={styles.callDate}>Sept 4, 2023</span>
              </span>
            </div>
            <h2 className={styles.stocksTitle}>Tata Steel Pvt. Ltd.</h2>
            <div className={styles.updownTargetBox}>
              <div className={styles.potensialBox}>
                <h3>Potential Upside</h3>
                <h4>22.76%</h4>
              </div>
              <ul className={styles.targetBox}>
                <li>
                  <span>Target</span>
                  <span>1150</span>
                </li>
                <li>
                  <span>Price at Reco</span>
                  <span>1284</span>
                </li>
                <li>
                  <span>Current Price</span>
                  <span>23,950.35</span>
                </li>
              </ul>
            </div>
          </div>
          <a href="javascript:void(0);" className={styles.viewReportBox}>
            <span className={`eticon_srplus ${styles.pdfIcon}`}></span>
            <span className={styles.viewReport}>View Report</span>
          </a>
          <div className={styles.brokerageBox}>
            <span>Brokerage:</span>
            <span>Motilal Oswal</span>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className={`${styles.stocksMain} ${styles.buyStock}`}>
          <div className={styles.stocksBox}>
            <div className={styles.stocksCallDates}>
              <span className={styles.buySellTitle}>Buy</span>
              <span className={styles.callDateBox}>
                <span className={styles.callDateTitle}>Call Date:</span>
                <span className={styles.callDate}>Sept 4, 2023</span>
              </span>
            </div>
            <h2 className={styles.stocksTitle}>Tata Steel Pvt. Ltd.</h2>
            <div className={styles.updownTargetBox}>
              <div className={styles.potensialBox}>
                <h3>Potential Upside</h3>
                <h4>22.76%</h4>
              </div>
              <ul className={styles.targetBox}>
                <li>
                  <span>Target</span>
                  <span>1150</span>
                </li>
                <li>
                  <span>Price at Reco</span>
                  <span>1284</span>
                </li>
                <li>
                  <span>Current Price</span>
                  <span>23,950.35</span>
                </li>
              </ul>
            </div>
          </div>
          <a href="javascript:void(0);" className={styles.viewReportBox}>
            <span className={`eticon_srplus ${styles.pdfIcon}`}></span>
            <span className={styles.viewReport}>View Report</span>
          </a>
          <div className={styles.brokerageBox}>
            <span>Brokerage:</span>
            <span>Motilal Oswal</span>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className={`${styles.stocksMain} ${styles.sellStock}`}>
          <div className={styles.stocksBox}>
            <div className={styles.stocksCallDates}>
              <span className={styles.buySellTitle}>Buy</span>
              <span className={styles.callDateBox}>
                <span className={styles.callDateTitle}>Call Date:</span>
                <span className={styles.callDate}>Sept 4, 2023</span>
              </span>
            </div>
            <h2 className={styles.stocksTitle}>Tata Steel Pvt. Ltd.</h2>
            <div className={styles.updownTargetBox}>
              <div className={styles.potensialBox}>
                <h3>Potential Upside</h3>
                <h4>22.76%</h4>
              </div>
              <ul className={styles.targetBox}>
                <li>
                  <span>Target</span>
                  <span>1150</span>
                </li>
                <li>
                  <span>Price at Reco</span>
                  <span>1284</span>
                </li>
                <li>
                  <span>Current Price</span>
                  <span>23,950.35</span>
                </li>
              </ul>
            </div>
          </div>
          <a href="javascript:void(0);" className={styles.viewReportBox}>
            <span className={`eticon_srplus ${styles.pdfIcon}`}></span>
            <span className={styles.viewReport}>View Report</span>
          </a>
          <div className={styles.brokerageBox}>
            <span>Brokerage:</span>
            <span>Motilal Oswal</span>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className={`${styles.stocksMain} ${styles.sellStock}`}>
          <div className={styles.stocksBox}>
            <div className={styles.stocksCallDates}>
              <span className={styles.buySellTitle}>Buy</span>
              <span className={styles.callDateBox}>
                <span className={styles.callDateTitle}>Call Date:</span>
                <span className={styles.callDate}>Sept 4, 2023</span>
              </span>
            </div>
            <h2 className={styles.stocksTitle}>Tata Steel Pvt. Ltd.</h2>
            <div className={styles.updownTargetBox}>
              <div className={styles.potensialBox}>
                <h3>Potential Upside</h3>
                <h4>22.76%</h4>
              </div>
              <ul className={styles.targetBox}>
                <li>
                  <span>Target</span>
                  <span>1150</span>
                </li>
                <li>
                  <span>Price at Reco</span>
                  <span>1284</span>
                </li>
                <li>
                  <span>Current Price</span>
                  <span>23,950.35</span>
                </li>
              </ul>
            </div>
          </div>
          <a href="javascript:void(0);" className={styles.viewReportBox}>
            <span className={`eticon_srplus ${styles.pdfIcon}`}></span>
            <span className={styles.viewReport}>View Report</span>
          </a>
          <div className={styles.brokerageBox}>
            <span>Brokerage:</span>
            <span>Motilal Oswal</span>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className={`${styles.stocksMain} ${styles.buyStock}`}>
          <div className={styles.stocksBox}>
            <div className={styles.stocksCallDates}>
              <span className={styles.buySellTitle}>Buy</span>
              <span className={styles.callDateBox}>
                <span className={styles.callDateTitle}>Call Date:</span>
                <span className={styles.callDate}>Sept 4, 2023</span>
              </span>
            </div>
            <h2 className={styles.stocksTitle}>Tata Steel Pvt. Ltd.</h2>
            <div className={styles.updownTargetBox}>
              <div className={styles.potensialBox}>
                <h3>Potential Upside</h3>
                <h4>22.76%</h4>
              </div>
              <ul className={styles.targetBox}>
                <li>
                  <span>Target</span>
                  <span>1150</span>
                </li>
                <li>
                  <span>Price at Reco</span>
                  <span>1284</span>
                </li>
                <li>
                  <span>Current Price</span>
                  <span>23,950.35</span>
                </li>
              </ul>
            </div>
          </div>
          <a href="javascript:void(0);" className={styles.viewReportBox}>
            <span className={`eticon_srplus ${styles.pdfIcon}`}></span>
            <span className={styles.viewReport}>View Report</span>
          </a>
          <div className={styles.brokerageBox}>
            <span>Brokerage:</span>
            <span>Motilal Oswal</span>
          </div>
        </div>
      ),
    },
  ];
  const slides2: Slide[] = [
    { content: <div>Slide 1 for Slider 2</div> },
    { content: <div>Slide 2 for Slider 2</div> },
    { content: <div>Slide 3 for Slider 2</div> },
    { content: <div>Slide 4 for Slider 2</div> },
    { content: <div>Slide 5 for Slider 2</div> },
    { content: <div>Slide 6 for Slider 2</div> },
    { content: <div>Slide 7 for Slider 2</div> },
    { content: <div>Slide 8 for Slider 2</div> },
  ];

  return (
    <div className={styles.wraper}>
      <h1 className={styles.heading1}>Stock Recommendations</h1>

      <div className={styles.tabMainBox}>
        <ul className={styles.tabs}>
          <li
            className={`${styles.tab} ${activeTab === "tab1" ? styles.active : ""}`}
            onClick={() => handleTabClick("tab1")}
          >
            Top Gainers
          </li>
          <li
            className={`${styles.tab} ${activeTab === "tab2" ? styles.active : ""}`}
            onClick={() => handleTabClick("tab2")}
          >
            Top Losers
          </li>
          <li
            className={`${styles.tab} ${activeTab === "tab3" ? styles.active : ""}`}
            onClick={() => handleTabClick("tab3")}
          >
            Most Traded
          </li>
        </ul>

        <div className={`${styles.tabContentWraper}`}>
          <div
            className={`${styles.tabContentBox} ${activeTab === "tab1" ? styles.active : ""}`}
          >
            <SlickSlider slides={slides1.map((slide) => slide.content)} />
          </div>
          <div
            className={`${styles.tabContentBox} ${activeTab === "tab2" ? styles.active : ""}`}
          >
            <SlickSlider slides={slides2.map((slide) => slide.content)} />
          </div>
          <div
            className={`${styles.tabContentBox} ${activeTab === "tab3" ? styles.active : ""}`}
          >
            <p>Content for Tab 3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockRecommendations;
