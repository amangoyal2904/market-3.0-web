import React from "react";
import styles from "./StockReport.module.scss";
interface RecoBarProps {
  num: number;
  totalNo: number;
}

const RecoBar: React.FC<RecoBarProps> = ({ num, totalNo }) => {
  const calculateHeight = (num: number, totalNo: number) => {
    const heightPercentage = (num / totalNo) * 100 + 5;
    return `${heightPercentage.toFixed(2)}%`;
  };

  return (
    <div
      className={styles.bar}
      style={{ height: calculateHeight(num, totalNo) }}
    ></div>
  );
};

export default RecoBar;
