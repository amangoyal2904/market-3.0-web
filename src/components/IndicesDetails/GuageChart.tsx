import React from "react";
import styles from "./GuageChart.module.scss";

const GuageChart = React.memo(({ maScore }: any) => {
  let maScoreText, maScoreValue;
  if (maScore >= 4 && maScore <= 5) {
    maScoreText = "Extremely Bullish";
    maScoreValue = 5;
  } else if (maScore >= 3 && maScore < 4) {
    maScoreText = "Bullish";
    maScoreValue = 4;
  } else if (maScore >= 2 && maScore < 3) {
    maScoreText = "Neutral";
    maScoreValue = 3;
  } else if (maScore >= 1 && maScore < 2) {
    maScoreText = "Bearish";
    maScoreValue = 2;
  } else if (maScore >= 0 && maScore < 1) {
    maScoreText = "Extremely Bearish";
    maScoreValue = 1;
  }

  return (
    <>
      <div className={styles.guageWrapper}>
        <div className={styles.innerWrapper}>
          <div className={styles.guageBar} data-i="0"></div>
          <div className={styles.guageBar} data-i="1"></div>
          <div className={styles.guageBar} data-i="2"></div>
          <div className={styles.guageBar} data-i="3"></div>
          <div className={styles.guageBar} data-i="4"></div>
          <div className={styles.guageSeparator} data-i="0"></div>
          <div className={styles.guageSeparator} data-i="1"></div>
          <div className={styles.guageSeparator} data-i="2"></div>
          <div className={styles.guageSeparator} data-i="3"></div>
          <div className={styles.indicator}>
            <div className={styles.targetArrow} data-score={maScoreValue}></div>
          </div>
        </div>
        <div className={styles.guageCircle}></div>
        <div className={`${styles.guageLabels} ${styles.extremelyBearish}`}>
          Extremely Bearish
        </div>
        <div className={`${styles.guageLabels} ${styles.bearish}`}>Bearish</div>
        <div className={`${styles.guageLabels} ${styles.neutral}`}>Neutral</div>
        <div className={`${styles.guageLabels} ${styles.bullish}`}>Bullish</div>
        <div className={`${styles.guageLabels} ${styles.extremelyBullish}`}>
          Extremely Bullish
        </div>
      </div>
      <div className={styles.chartType} data-score={maScoreValue}>
        {maScoreText}
      </div>
    </>
  );
});
GuageChart.displayName = "GuageChart";
export default GuageChart;
