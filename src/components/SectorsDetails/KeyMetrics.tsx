import { formatNumber } from "@/utils";
import styles from "./SectorsDetails.module.scss";
import React from "react";

const SectorsKeyMetrics = React.memo(({ data }: any) => {
  return (
    <>
      <h2 className={styles.heading}>Key Metrics</h2>
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <p>Net Profit Margin</p>
          <p className="numberFonts">{formatNumber(data.netProfitMargin)}</p>
        </div>
        <div className={styles.metric}>
          <p>Return on Equity (ROE)</p>
          <p className={`${!!data.highPrice ? styles.up : ""} numberFonts`}>
            {formatNumber(data.roe)}
          </p>
        </div>
        <div className={styles.metric}>
          <p>ROA</p>
          <p className={`${!!data.lowPrice ? styles.down : ""} numberFonts`}>
            {formatNumber(data.roa)}
          </p>
        </div>
        <div className={styles.metric}>
          <p>ROCE</p>
          <p className="numberFonts">{formatNumber(data.roce)}</p>
        </div>
        <div className={styles.metric}>
          <p>Qtr Sales YoY %</p>
          <p className="numberFonts">
            {formatNumber(data.sectorNetSalesYoyAvg)}
          </p>
        </div>
        <div className={styles.metric}>
          <p>P/E Ratio</p>
          <p className="numberFonts">{formatNumber(data.peRatio)}</p>
        </div>
        <div className={styles.metric}>
          <p>D/E Ratio</p>
          <p className="numberFonts">{formatNumber(data.deRatio)}</p>
        </div>
        <div className={styles.metric}>
          <p>Sales 3Y CAGR</p>
          <p className="numberFonts">{formatNumber(data.sales3yCagr)}</p>
        </div>
        <div className={styles.metric}>
          <p>Profit 3Y CAGR</p>
          <p className="numberFonts">{formatNumber(data.profit3yCagr)}</p>
        </div>
        <div className={styles.metric}>
          <p>Qtr Profit YoY % </p>
          <p className="numberFonts">{formatNumber(data.sectorPATYoyAvg)}</p>
        </div>
      </div>
    </>
  );
});
SectorsKeyMetrics.displayName = "SectorsKeyMetrics";
export default SectorsKeyMetrics;
