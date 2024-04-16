import { formatNumber } from "@/utils";
import styles from "./IndicesDetails.module.scss";

const IndicesPerformance = ({ data, indexName }: any) => {
  return (
    <>
      <h2 className={styles.heading}>
        Performance of {indexName} v/s Other Indices
      </h2>
    </>
  );
};

export default IndicesPerformance;
