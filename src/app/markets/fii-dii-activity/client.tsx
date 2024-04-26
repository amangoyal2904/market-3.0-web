import React, { useState } from "react";
import styles from "./FiiDii.module.scss";
import { dateFormat, getClassAndPercent } from "@/utils";

const tabData = [
  { label: "Overview", key: "overview" },
  { label: "Cash Provisional", key: "cash-provisional" },
  { label: "FII Cash", key: "fii-cash" },
  { label: "FII F&O", key: "fii-f-and-o" },
  { label: "MF Cash", key: "mf-cash" },
];

const FiiDiiActivityClient = ({ dataWithNiftySensex, otherData }: any) => {
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
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.head}>FII & DII Buy-Sell Activity</div>
        </div>
        <div className={styles.tableWrapper} id="table">
          <div id="fixedTable" className={styles.fixedWrapper}>
            <table className={styles.marketsCustomTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Nifty Closing</th>
                </tr>
              </thead>
              <tbody>
                {dataWithNiftySensex.map((tdData: any, index: number) => {
                  const upDownType = getClassAndPercent(
                    tdData.nifty.percentChange,
                  );

                  return (
                    <tr key={`fixed_${index}`}>
                      <td>{dateFormat(tdData.dateLong, "%d %MMM %y")}</td>
                      <td>
                        {tdData.nifty.ltp}
                        <span className={upDownType}>
                          ({tdData.nifty.percentChange.toFixed(2)}%)
                        </span>
                        <span
                          className={`${upDownType} ${
                            upDownType === "up"
                              ? "eticon_up_arrow"
                              : upDownType === "down"
                                ? "eticon_down_arrow"
                                : ""
                          }`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div id="scrollableTable" className={styles.scrollableWrapper}>
            <table className={styles.marketsCustomTable}>
              <thead>
                <tr>
                  <th>FII Cash (in Rs. Cr.)</th>
                  <th>DII Cash (in Rs. Cr.)</th>
                  <th>FII Index Future (in Rs. Cr.)</th>
                  <th>FII Index Option (in Rs. Cr.)</th>
                  <th>FII Stock Future (in Rs. Cr.)</th>
                  <th>FII Stock Option (in Rs. Cr.)</th>
                </tr>
              </thead>
              <tbody>
                {otherData.map((tdData: any, index: number) => {
                  const maxValue = "";
                  return (
                    <tr key={`scrollable_${index}`}>
                      <td>{tdData.fiiCash}</td>
                      <td>{tdData.diiCash}</td>
                      <td>{tdData.fiiIndexFutures}</td>
                      <td>{tdData.fiiIndexOptions}</td>
                      <td>{tdData.fiiStockFutures}</td>
                      <td>{tdData.fiiStockOptions}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default FiiDiiActivityClient;
