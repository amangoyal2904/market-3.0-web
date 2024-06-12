import React from "react";
import styles from "./StockReport.module.scss";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils/index";
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
          href={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/${seoName}/stocks/companyid-${companyID}.cms`}
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
