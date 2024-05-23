import React, { useState } from "react";
import styles from "./StockReportsPlus.module.scss";

const StockReportsTab = (props: any) => {
  const { handleTabClick, tabNames, activeTab } = props;
  return (
    <div>
      <ul className={styles.tabs}>
        {tabNames?.map((tab: any) => (
          <li
            key={tab.seoName}
            className={`${styles.tab} ${activeTab.seoName === tab.seoName ? styles.active : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockReportsTab;
