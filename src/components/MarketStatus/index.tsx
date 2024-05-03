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
      <span className={styles.updatetime}>
        {dateFormat(parseInt(dateTime) * 1000, "%h:%m %p | %MMM %d, %Y")}
      </span>
    </div>
  );
};
export default MarketStatus;
