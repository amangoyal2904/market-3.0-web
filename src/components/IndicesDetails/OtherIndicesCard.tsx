import { formatNumber } from "@/utils";
import styles from "./IndicesDetails.module.scss";
import React from "react";
import { trackingEvent } from "@/utils/ga";
const OtherIndicesCard = React.memo(({ data }: any) => {
  const trend =
    data.percentChange > 0 ? "up" : data.percentChange < 0 ? "down" : "neutral";
  return (
    <div className={styles.otherIndicesCard}>
      <a
        className={styles.title}
        href={`/markets/indices/${data.indexSeoName}`}
        title={data.indexName}
        onClick={() => {
          trackingEvent("et_push_event", {
            event_category: "mercury_engagement",
            event_action: "other_indices_click",
            event_label: data.indexName,
          });
        }}
      >
        <span>{data.indexName}</span>
        <i className="eticon_caret_right"></i>
      </a>
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
          <p className={styles.head}>{`${data.advances} Advances`}</p>
          <p className={styles.head}>{`${data.declines} Declines`}</p>
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
          <span className={styles.label}>{`${data.advancesPercentage}%`}</span>
          <span className={styles.label}>{`${data.declinesPercentage}%`}</span>
        </div>
      </div>
    </div>
  );
});
OtherIndicesCard.displayName = "OtherIndicesCard";
export default OtherIndicesCard;
