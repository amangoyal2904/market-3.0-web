import { formatNumber } from "@/utils";
import styles from "./SectorsDetails.module.scss";

const Returns = (params: any) => {
  const { data } = params;
  return (
    <div className={styles.returnMain}>
      <div className={styles.returnBox}>
        <p>Market Cap</p>
        <p className="numberFonts">
          {data.marketCap != 0 && <span className={styles.rupees}>₹</span>}
          {formatNumber(data.marketCap)}{" "}
          {data.marketCap != 0 && <span className={styles.crore}>Cr.</span>}
        </p>
      </div>
      <div className={`${styles.returnBox}`}>
        <p>1D Change %</p>
        <p
          className={`numberFonts ${data.r1Day > 0 ? styles.up : data.r1Day < 0 ? styles.down : ""}`}
        >
          {formatNumber(data.r1Day)}%
        </p>
      </div>
      <div className={`${styles.returnBox}`}>
        <p>1W Change %</p>
        <p
          className={`numberFonts ${data.r1Week > 0 ? styles.up : data.r1Week < 0 ? styles.down : ""}`}
        >
          {formatNumber(data.r1Week)}%
        </p>
      </div>
      <div className={`${styles.returnBox}`}>
        <p>1M Change %</p>
        <p
          className={`numberFonts ${data.r1Month > 0 ? styles.up : data.r1Month < 0 ? styles.down : ""}`}
        >
          {formatNumber(data.r1Month)}%
        </p>
      </div>
      <div className={`${styles.returnBox}`}>
        <p>3M Change %</p>
        <p
          className={`numberFonts ${data.r3Month > 0 ? styles.up : data.r3Month < 0 ? styles.down : ""}`}
        >
          {formatNumber(data.r3Month)}%
        </p>
      </div>
      <div className={`${styles.returnBox}`}>
        <p>6M Change %</p>
        <p
          className={`numberFonts ${data.r6Month > 0 ? styles.up : data.r6Month < 0 ? styles.down : ""}`}
        >
          {formatNumber(data.r6Month)}%
        </p>
      </div>
      <div className={`${styles.returnBox}`}>
        <p>1Y Change %</p>
        <p
          className={`numberFonts ${data.r1Year > 0 ? styles.up : data.r1Year < 0 ? styles.down : ""}`}
        >
          {formatNumber(data.r1Year)}%
        </p>
      </div>
      <div className={`${styles.returnBox}`}>
        <p>3Y Change %</p>
        <p
          className={`numberFonts ${data.r3Year > 0 ? styles.up : data.r3Year < 0 ? styles.down : ""}`}
        >
          {formatNumber(data.r3Year)}%
        </p>
      </div>
    </div>
  );
};

export default Returns;
