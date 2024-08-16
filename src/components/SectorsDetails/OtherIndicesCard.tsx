import { formatNumber } from "@/utils";
import styles from "./SectorsDetails.module.scss";
import Link from "next/link";
import React from "react";
import { trackingEvent } from "@/utils/ga";
const OtherIndicesCard = React.memo(({ data }: any) => {
  const trend =
    data.percentChange > 0 ? "up" : data.percentChange < 0 ? "down" : "neutral";
  return (
    <div className={styles.otherIndicesCard}>
      <Link
        className={styles.title}
        href={`/markets/sectors/${data.indexSeoName}`}
        target="_blank"
        title={data.assetName}
        onClick={() => {
          trackingEvent("et_push_event", {
            event_category: "mercury_engagement",
            event_action: "other_sectors_click",
            event_label: data.assetName,
          });
        }}
      >
        <span>{data.assetName}</span>
        <i className="eticon_caret_right"></i>
      </Link>
      <p className={styles.ltp}>{formatNumber(data.marketCap)}</p>
      <div
        className={`${styles.otherStats} ${data.r1Day > 0 ? styles.up : data.r1Day < 0 ? styles.down : ""}`}
      >
        <span
          className={`${styles.arrowIcons} ${
            data.r1Day > 0
              ? "eticon_up_arrow"
              : data.r1Day < 0
                ? "eticon_down_arrow"
                : ""
          }`}
        ></span>
        {`${data.r1Day != 0 ? data.r1Day + "%" : 0}`}
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
