import { formatNumber } from "@/utils";
import styles from "./IndicesDetails.module.scss";

const IndicesTechnicalAnalysis = ({ data }: any) => {
  const { maScore, movingAverage, pivotLevel } = data;
  const ma_labels = [""];
  const ma_simple = ["Simple"];
  const ma_exponential = ["Exponential"];

  const pl_labels = [""];
  const pl_classic = ["Classic"];
  const pl_fibonacci = ["Fibonacci"];

  for (const item of movingAverage) {
    ma_labels.push(item.label);
    ma_simple.push(item.simple);
    ma_exponential.push(item.exponential);
  }

  for (const item of pivotLevel) {
    pl_labels.push(item.label);
    pl_classic.push(item.classic);
    pl_fibonacci.push(item.fibonacci);
  }

  const movingAverageData = [ma_simple, ma_exponential];
  const pivotLevelData = [pl_classic, pl_fibonacci];

  return (
    <>
      <h2 className={styles.heading}>Technical Analysis</h2>
      <h3>Moving Average: SMA & EMA</h3>
      <div className="dflex">
        <div></div>
        <div>
          <table className={styles.marketsCustomTable}>
            <thead>
              <tr>
                {ma_labels.map((label, index) => (
                  <th key={index} className={styles.center}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movingAverageData.map((data: any, index: number) => (
                <tr key={index}>
                  {data.map((value: any, i: number) => (
                    <td
                      key={i}
                      className={`${i === 0 ? styles.left : `${styles.center} numberFonts`}`}
                    >
                      {i === 0 ? value : formatNumber(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="dflex">
        <h4>Pivot Levels</h4>
        <table className={styles.marketsCustomTable}>
          <thead>
            <tr>
              {pl_labels.map((label, index) => (
                <th
                  key={index}
                  className={`${styles.center} ${index == 4 ? styles.primeCell : ""}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pivotLevelData.map((data: any, index: number) => (
              <tr key={index}>
                {data.map((value: any, i: number) => (
                  <td
                    key={i}
                    className={`${i === 0 ? styles.left : `${styles.center} numberFonts`} ${i == 4 ? styles.primeCell : ""}`}
                  >
                    {i === 0 ? value : formatNumber(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default IndicesTechnicalAnalysis;
