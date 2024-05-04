import styles from "./FIIDIIWidget.module.scss";

const FIIDIIWIdget = ({ fiiDiiCash, type }: any) => {
  const maxValues: any = {
    maxPositive_fiiEquity: 0,
    maxNegative_fiiEquity: 0,
    maxPositive_diiEquity: 0,
    maxNegative_diiEquity: 0,
  };
  const first7Values = fiiDiiCash?.listFiiDiiChartData?.slice(0, 7);

  first7Values?.forEach((item: { fiiEquity: number; diiEquity: number }) => {
    maxValues.maxPositive_fiiEquity = Math.max(
      maxValues.maxPositive_fiiEquity,
      item.fiiEquity,
    );
    maxValues.maxNegative_fiiEquity = Math.min(
      maxValues.maxNegative_fiiEquity,
      item.fiiEquity,
    );
    maxValues.maxPositive_diiEquity = Math.max(
      maxValues.maxPositive_diiEquity,
      item.diiEquity,
    );
    maxValues.maxNegative_diiEquity = Math.min(
      maxValues.maxNegative_diiEquity,
      item.diiEquity,
    );
  });

  return first7Values?.length ? (
    <div className={styles.container}>
      <p className={styles.title}>
        {type == "fiiEquity" ? fiiDiiCash.legend1 : fiiDiiCash.legend2}
        <span className={styles.days}>Past 7 days activity</span>
      </p>
      <div className={styles.barsRow}>
        {first7Values?.map((bars: any, index: any) => (
          <div
            key={`fiidii${index}`}
            className={`${styles.bars} ${bars?.[type] > 0 ? styles.positive : ""}`}
          >
            <div className={`${styles.bar} ${styles.value}`}>
              {Math.floor(Math.abs(bars?.[type]))}
            </div>
            <div
              className={`${styles.bar} ${bars?.[type] < 0 ? styles.down : styles.up}`}
              style={{
                paddingBottom: `${bars?.[type] > 0 ? (Math.abs(bars?.[type]) / Math.abs(maxValues[`maxPositive_${type}`])) * 100 : 0}%`,
                paddingTop: `${bars?.[type] < 0 ? (Math.abs(bars?.[type]) / Math.abs(maxValues[`maxNegative_${type}`])) * 100 : 0}%`,
              }}
            ></div>
          </div>
        ))}
        <div className={styles.liner}></div>
      </div>
      <p className={styles.label}>
        Jan 12:{" "}
        <span className={styles[type]}>
          <b>{type == "fiiEquity" ? "Bought" : "Sold"}</b> ₹ 990.90 Cr
        </span>
      </p>
    </div>
  ) : (
    ""
  );
};
export default FIIDIIWIdget;
