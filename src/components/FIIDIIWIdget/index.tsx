import { dateFormat } from "@/utils";
import styles from "./FIIDIIWidget.module.scss";

const FIIDIIWIdget = ({ fiiDiiCash, type, fiiCash, diiCash }: any) => {
  const maxValues: any = {
    maxPositive_fiiEquity: 0,
    maxNegative_fiiEquity: 0,
    maxPositive_diiEquity: 0,
    maxNegative_diiEquity: 0,
  };
  const first7Values = fiiDiiCash?.listFiiDiiChartData
    ?.slice(0, 7)
    ?.sort(
      (a: { dateLong: number }, b: { dateLong: number }) =>
        a.dateLong - b.dateLong,
    );
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
        {first7Values?.map((bars: any, index: any) =>
          bars?.[type] > 0 ? (
            <div
              key={`fiidii${index}`}
              className={`${styles.bars} ${bars?.[type] > 0 ? styles.positive : ""}`}
            >
              <div
                className={`${styles.bar} ${bars?.[type] < 0 ? styles.down : styles.up}`}
                style={{
                  paddingBottom: `${bars?.[type] > 0 ? ((Math.abs(bars?.[type]) / Math.abs(maxValues[`maxPositive_${type}`])) * 100) / 2 : 0}%`,
                  paddingTop: `${bars?.[type] < 0 ? ((Math.abs(bars?.[type]) / Math.abs(maxValues[`maxNegative_${type}`])) * 100) / 2 : 0}%`,
                }}
              ></div>
              <p
                className={`numberFonts ${styles.tooltip}`}
              >{`${Math.floor(Math.abs(bars?.[type]))} Cr`}</p>
              <div className={`numberFonts ${styles.bar} ${styles.value}`}>
                {dateFormat(bars.dateLong, "%d")}
              </div>
            </div>
          ) : (
            <div
              key={`fiidii${index}`}
              className={`${styles.bars} ${bars?.[type] < 0 ? styles.negative : ""}`}
            >
              <div className={`numberFonts ${styles.bar} ${styles.value}`}>
                {dateFormat(bars.dateLong, "%d")}
              </div>
              <p
                className={`numberFonts ${styles.tooltip}`}
              >{`${Math.floor(Math.abs(bars?.[type]))} Cr`}</p>
              <div
                className={`${styles.bar} ${bars?.[type] < 0 ? styles.down : styles.up}`}
                style={{
                  paddingBottom: `${bars?.[type] > 0 ? ((Math.abs(bars?.[type]) / Math.abs(maxValues[`maxPositive_${type}`])) * 100) / 2 : 0}%`,
                  paddingTop: `${bars?.[type] < 0 ? ((Math.abs(bars?.[type]) / Math.abs(maxValues[`maxNegative_${type}`])) * 100) / 2 : 0}%`,
                }}
              ></div>
            </div>
          ),
        )}
        <div className={styles.liner}></div>
      </div>
      <p className={styles.label}>
        <span
          className={`numberFonts ${type == "fiiEquity" ? (fiiCash?.netInvestment > 0 ? styles.textGreen : styles.textRed) : diiCash?.netInvestment > 0 ? styles.textGreen : styles.textRed}`}
        >{`${type == "fiiEquity" ? fiiCash?.netInvestment : diiCash?.netInvestment} Cr`}</span>
        <span>
          {dateFormat(
            type == "fiiEquity" ? fiiCash?.date : diiCash?.date,
            " on %d %MMM",
          )}
        </span>
      </p>
    </div>
  ) : (
    ""
  );
};
export default FIIDIIWIdget;
