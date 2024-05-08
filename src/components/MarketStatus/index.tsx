import { dateFormat } from "@/utils/index";
import styles from "./MarketStatus.module.scss";

interface propType {
  currentMarketStatus: string;
  dateTime: any;
  withSeparator?: boolean;
  withSpace?: boolean;
}

const MarketStatus = ({
  currentMarketStatus,
  dateTime,
  withSeparator = false,
  withSpace = false,
}: propType) => {
  return (
    <div className={`dflex align-item-center`}>
      {!!currentMarketStatus && (
        <>
          {currentMarketStatus.toUpperCase() != "CLOSED" && (
            <span className={styles.liveBlinker}></span>
          )}
          <span
            className={`${styles.marketStatus} ${!!withSeparator ? styles.withSeparator : ""} ${!!withSpace ? styles.withSpace : ""}`}
          >
            {currentMarketStatus}
          </span>
        </>
      )}
      <span className={`numberFonts ${styles.updatetime}`}>
        {dateFormat(parseInt(dateTime), "As on %d %MMM, %Y %H:%m IST")}
      </span>
    </div>
  );
};
export default MarketStatus;
