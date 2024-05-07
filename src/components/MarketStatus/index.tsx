import { dateFormat } from "@/utils/index";
import styles from "./MarketStatus.module.scss";

interface propType {
  currentMarketStatus: string;
  dateTime: any;
}

const MarketStatus = ({ currentMarketStatus, dateTime }: propType) => {
  return (
    <div className={`dflex align-item-center`}>
      {!!currentMarketStatus && (
        <>
          {currentMarketStatus.toUpperCase() != "CLOSED" && (
            <span className="liveBlinker"></span>
          )}
          <span className={styles.marketStatus}>{currentMarketStatus}</span>
        </>
      )}
      <span className={`numberFonts ${styles.updatetime}`}>
        {dateFormat(parseInt(dateTime), "As on %d %MMM, %Y %H:%m IST")}
      </span>
    </div>
  );
};
export default MarketStatus;
