import { formatNumber } from "@/utils";
import styles from "./IndicesDetails.module.scss";
import React from "react";

const KeyMetricsIndices = React.memo(({ data }: any) => {
  return (
    <>
      <h2 className={styles.heading}>Key Metrics</h2>
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <p>Open</p>
          <p className="numberFonts">{formatNumber(data.openPrice)}</p>
        </div>
        <div className={styles.metric}>
          <p>Day High</p>
          <p className={`${!!data.highPrice ? styles.up : ""} numberFonts`}>
            {formatNumber(data.highPrice)}
          </p>
        </div>
        <div className={styles.metric}>
          <p>Day Low</p>
          <p className={`${!!data.lowPrice ? styles.down : ""} numberFonts`}>
            {formatNumber(data.lowPrice)}
          </p>
        </div>
        <div className={styles.metric}>
          <p>Prev. Close</p>
          <p className="numberFonts">{formatNumber(data.previousClose)}</p>
        </div>
        <div className={styles.metric}>
          <p>MCap (₹ Cr.)</p>
          <p className="numberFonts">{formatNumber(data.marketCap)}</p>
        </div>
        <div className={styles.metric}>
          <p>P/E Ratio</p>
          <p className="numberFonts">{formatNumber(data.peRatio)}</p>
        </div>
        <div className={styles.metric}>
          <p>P/B Ratio</p>
          <p className="numberFonts">{formatNumber(data.pbRatio)}</p>
        </div>
        <div className={styles.metric}>
          <p>Dividend Yield</p>
          <p className="numberFonts">{formatNumber(data.dividendYield)}</p>
        </div>
      </div>
    </>
  );
});
KeyMetricsIndices.displayName = "KeyMetricsIndices";
export default KeyMetricsIndices;
