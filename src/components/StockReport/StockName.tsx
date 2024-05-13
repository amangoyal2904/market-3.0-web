import React from "react";
import styles from "./StockReport.module.scss";
interface StockNameProps {
  category: string;
  primeUser: boolean;
  tabName: string;
  seoName: string;
  companyID: string;
  name: string;
}

const StockName: React.FC<StockNameProps> = ({
  category,
  primeUser,
  tabName,
  seoName,
  companyID,
  name,
}) => {
  const renderStockName = () => {
    if (primeUser) {
      return (
        <a
          data-ga-onclick={`SR+ ${tabName}#${category} - ${name} name click#href`}
          href={`/${seoName}/stocks/companyid-${companyID}.cms`}
          target="_blank"
          title={name}
        >
          {name}
        </a>
      );
    } else {
      return <span className={styles.blur}></span>;
    }
  };

  return <p className={styles.stname}>{renderStockName()}</p>;
};

export default StockName;
