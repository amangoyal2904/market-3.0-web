import React, { useState } from "react";
import styles from "./FiiDii.module.scss";

const tabData = [
  { label: "Overview", key: "overview" },
  { label: "Cash Provisional", key: "cash-provisional" },
  { label: "FII Cash", key: "fii-cash" },
  { label: "FII F&O", key: "fii-f-and-o" },
  { label: "MF Cash", key: "mf-cash" },
];

const FiiDiiActivityClient = () => {
  return (
    <>
      <h1 className={styles.heading}>FII & DII</h1>
      <p className={styles.desc}>
        Analyse the latest trend in major sectors by tracking the change in
        market-cap of individual sectors daily, quarterly, monthly, half-yearly
        and year-to-date. You can track it with the advance-decline graph of
        stocks plotted according to the change in market-cap contribution in
        their sector along with an absolute count of stocks advancing or
        declining.
      </p>
      <div className={styles.tabsWrap}>
        <ul className={styles.tabsList}>
          {tabData.map((item: any, index: number) => {
            return <li key={item.key}>{item.label}</li>;
          })}
        </ul>
        <span className={`${styles.roundBtn}`}>
          Cash <i className="eticon_caret_down"></i>
        </span>
      </div>
    </>
  );
};

export default FiiDiiActivityClient;
