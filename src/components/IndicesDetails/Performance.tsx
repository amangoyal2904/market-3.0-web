import { formatNumber } from "@/utils";
import styles from "./IndicesDetails.module.scss";

const labels = ["", "1D", "1W", "1M", "3M", "1Y", "3Y", "5Y"];

const IndicesPerformance = ({ data, indexName }: any) => {
  return (
    <>
      <h2 className={styles.heading}>
        Performance of {indexName} v/s Other Indices
      </h2>
      <table className={styles.marketsCustomTable}>
        <thead>
          <tr>
            {labels.map((label, index) => (
              <th key={index} className={styles.center}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, index: number) => (
            <tr key={index}>
              <td className={styles.left}>{item.indexName}</td>
              <td className={styles.center}>{item.percentChange}</td>
              <td className={styles.center}>{item.r1Week}</td>
              <td className={styles.center}>{item.r1Month}</td>
              <td className={styles.center}>{item.r3Month}</td>
              <td className={styles.center}>{item.r1Year}</td>
              <td className={styles.center}>{item.r3Year}</td>
              <td className={styles.center}>{item.r5Year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default IndicesPerformance;
