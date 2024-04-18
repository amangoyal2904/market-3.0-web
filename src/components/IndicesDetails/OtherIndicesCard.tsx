import { formatNumber } from "@/utils";
import styles from "./IndicesDetails.module.scss";
export const OtherIndicesCard = ({ data }: any) => {
  const trend =
    data.percentChange > 0 ? "up" : data.percentChange < 0 ? "down" : "neutral";
  return (
    <div className={styles.otherIndicesCard}>
      <h5 className={styles.title}>
        {data.indexName}
        <i className="eticon_caret_right"></i>
      </h5>
      <p className={styles.ltp}>{formatNumber(data.lastTradedPrice)}</p>
      <div
        className={`${styles.otherStats} ${trend == "up" ? styles.up : trend == "down" ? styles.down : ""}`}
      >
        {trend && (
          <span
            className={`${styles.arrowIcons} ${
              trend == "up"
                ? "eticon_up_arrow"
                : trend == "down"
                  ? "eticon_down_arrow"
                  : ""
            }`}
          />
        )}
        {`${data.netChange} (${data.percentChange}%)`}
      </div>
      <div className={styles.bottom}>
        <div className="dflex align-item-center space-between">
          <p className={styles.head}>{data.advances} Advances</p>
          <p className={styles.head}>{data.declines} Declines</p>
        </div>
        <div className="dflex align-item-center">
          <div
            className={`${styles.bar} ${styles.up}`}
            style={{ width: data.advancesPercentage + "%" }}
          ></div>
          <div
            className={`${styles.bar} ${styles.down}`}
            style={{ width: data.declinesPercentage + "%" }}
          ></div>
        </div>
        <div className="dflex align-item-center space-between">
          <span className={styles.label}>
            {data.advancesPercentage.toFixed(2)}%
          </span>
          <span className={styles.label}>
            {data.declinesPercentage.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};
