import { formatNumber } from "@/utils";
import React from "react";
import styles from "./StockReport.module.scss";
interface RecoBarLabelProps {
  num: number;
  type: string;
}

const RecoBarLabel: React.FC<RecoBarLabelProps> = ({ num, type }) => {
  return (
    <p
      className={`${styles.txtcolor} ${styles[type?.replace(/\s/g, "")?.toLowerCase()]}`}
    >
      {formatNumber(num)}
      <span>{type}</span>
    </p>
  );
};

export default RecoBarLabel;
