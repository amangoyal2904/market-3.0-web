import { Fragment } from "react";
import styles from "./StockDescription.module.scss";

const StockDescription = ({ patternData }: { patternData: any }) => {
  const getIconClass = (isUp: boolean) =>
    isUp ? "eticon_down_arrow" : "eticon_up_arrow";
  const getColorClass = (value: number) =>
    value < 0 ? styles.red : styles.green;
  const getMovementText = (value: number) => (value < 0 ? "down" : "up");

  return (
    <Fragment>
      {patternData?.ideaFlag === "ideaClosed1" && (
        <div className={styles.stockDesc}>
          Stock price went up by
          <span className={styles.green}>
            <i className="eticon_up_arrow"></i>10%
          </span>
          within {patternData?.ideaClosedDays} days of breakout.
        </div>
      )}

      {patternData?.ideaFlag === "ideaClosed2" && (
        <div className={styles.stockDesc}>
          Stock price was consistently below
          <span className={styles.red}>
            <i className="eticon_down_arrow"></i>2%
          </span>
          for 3 days since breakout.
        </div>
      )}

      {patternData?.ideaFlag === "ideaClosed3" && (
        <div className={styles.stockDesc}>
          Stock price went down by
          <span className={styles.red}>
            <i className="eticon_down_arrow"></i>5%
          </span>
          within {patternData?.ideaClosedDays} days of breakout.
        </div>
      )}

      {patternData?.ideaFlag === "ideaClosed4" && (
        <div className={styles.stockDesc}>
          Stock price closed at
          <span className={getColorClass(patternData?.closedPatternReturns)}>
            <i
              className={getIconClass(patternData?.closedPatternReturns < 0)}
            ></i>
            {patternData?.closedPatternReturns}%
          </span>
          {`${getMovementText(patternData?.closedPatternReturns)} after 10 days post breakout.`}
        </div>
      )}

      {patternData?.ideaFlag === "ideaActive" && (
        <div className={styles.stockDesc}>
          {`Stock price is ${getMovementText(patternData?.stockReturn)}`}
          <span className={getColorClass(patternData?.stockReturn)}>
            <i className={getIconClass(patternData?.stockReturn < 0)}></i>
            {Math.abs(patternData?.stockReturn).toFixed(2)}%
          </span>
          since breakout.
        </div>
      )}
    </Fragment>
  );
};

export default StockDescription;
