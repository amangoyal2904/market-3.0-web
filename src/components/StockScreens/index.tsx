// StockScreens component
import React from "react";
import styles from "./StockScreens.module.scss";

interface StockReport {
  title: string;
  score: number;
  maxScore: number;
  expectedReturns: string;
  target: string;
  recommendation: string;
  currentPrice: string;
}

interface Props {
  slide: StockReport;
}

const StockScreens: React.FC<Props> = ({ slide }) => {
  // console.log("slideData --- > " , slide)
  return (
    <div className={`dflex ${styles.stockScreensMain}`}>
      <h2 className={styles.title}>{slide.title}</h2>
      <div className={`dflex ${styles.stockScreensCnt}`}>
        <div className={`dflex ${styles.stocksScoreBox}`}>
          <h3>
            <span>{slide.score}</span>
            <span>/</span>
            <span>{slide.maxScore}</span>
          </h3>
          <h4>Stock Score</h4>
          <a
            href="javascript:void(0);"
            className={`dflex ${styles.viewReportBox}`}
            title="View Report"
          >
            <span className={`eticon_srplus ${styles.pdfIcon}`}></span>
            <span className={styles.viewReport}>View Report</span>
          </a>
        </div>
        <div className={`dflex ${styles.expectedStockBox}`}>
          <div className={styles.expectedStockCnt}>
            <h2>Expected Returns</h2>
            <h3>{slide.expectedReturns}</h3>
            <h4>Target</h4>
            <h5>{slide.target}</h5>
          </div>
          <div className={styles.expectedStockCnt}>
            <h2>Stock Recommendation</h2>
            <h3>{slide.recommendation}</h3>
            <h4>Current Price</h4>
            <h5>{slide.currentPrice}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockScreens;
