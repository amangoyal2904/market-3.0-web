"use client";
import React, { useEffect, useState } from "react";
import styles from "./FIIDII.module.scss";
import { dateFormat, getClassAndPercent } from "@/utils";

interface OtherDataItem {
  fiiCash: number;
  diiCash: number;
  fiiIndexFutures: number;
  fiiIndexOptions: number;
  fiiStockFutures: number;
  fiiStockOptions: number;
}

const FiiDiiActivityOverviewTable: React.FC<{
  dataWithNiftySensex: any[];
  otherData: OtherDataItem[];
}> = ({ dataWithNiftySensex, otherData }) => {
  const [parentHasScroll, setParentHasScroll] = useState(false);

  const maxValues: OtherDataItem = {
    fiiCash: 0,
    diiCash: 0,
    fiiIndexFutures: 0,
    fiiIndexOptions: 0,
    fiiStockFutures: 0,
    fiiStockOptions: 0,
  };

  otherData.forEach((data) => {
    Object.keys(data).forEach((key) => {
      const property = key as keyof OtherDataItem;
      const absoluteValue = Math.abs(data[property]);
      if (absoluteValue > maxValues[property]) {
        maxValues[property] = absoluteValue;
      }
    });
  });

  useEffect(() => {
    const parent = document.querySelector("#scrollableTable");
    const theadElement = parent?.querySelector("thead > tr > th");
    const fixedTable = document.querySelector("#fixedTable");
    const hasScroll = parent ? parent.scrollWidth > parent.clientWidth : false;
    setParentHasScroll(hasScroll);

    if (theadElement) {
      const height = theadElement.getBoundingClientRect().height;
      const thElements = fixedTable?.querySelectorAll("th");
      thElements?.forEach((th) => {
        th.style.height = `${height}px`;
      });
    }
  }, [parentHasScroll]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.head}>FII & DII Buy-Sell Activity</div>
      </div>
      <div className={styles.tableWrapper} id="table">
        <div
          id="fixedTable"
          className={`${styles.fixedWrapper} ${!!parentHasScroll ? styles.withShadow : ""}`}
        >
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
                      <span className={`${upDownType} ${styles.change}`}>
                        ({tdData.nifty.percentChange.toFixed(2)}%)
                      </span>
                      <span
                        className={`${styles.arrow} ${upDownType} ${
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
                <th colSpan={2}>FII Cash (in Rs. Cr.)</th>
                <th colSpan={2}>DII Cash (in Rs. Cr.)</th>
                <th colSpan={2}>FII Index Future (in Rs. Cr.)</th>
                <th colSpan={2}>FII Index Option (in Rs. Cr.)</th>
                <th colSpan={2}>FII Stock Future (in Rs. Cr.)</th>
                <th colSpan={2}>FII Stock Option (in Rs. Cr.)</th>
                <th
                  className={`${styles.fullWidth} ${!!parentHasScroll ? styles.hide : ""}`}
                ></th>
              </tr>
            </thead>
            <tbody>
              {otherData.map((tdData: any, index: number) => {
                const upDownTypeFiiCash = getClassAndPercent(tdData.fiiCash);
                const upDownTypeDiiCash = getClassAndPercent(tdData.diiCash);
                const upDownTypeFiiIndexFutures = getClassAndPercent(
                  tdData.fiiIndexFutures,
                );
                const upDownTypeFiiIndexOptions = getClassAndPercent(
                  tdData.fiiIndexOptions,
                );
                const upDownTypeFiiStockFutures = getClassAndPercent(
                  tdData.fiiStockFutures,
                );
                const upDownTypeFiiStockOptions = getClassAndPercent(
                  tdData.fiiStockOptions,
                );
                return (
                  <tr key={`scrollable_${index}`}>
                    <td className={`${styles.noRborder} ${upDownTypeFiiCash}`}>
                      {tdData.fiiCash}
                    </td>
                    <td className={`${upDownTypeFiiCash}`}>
                      <div className={styles.barCell}>
                        <div
                          className={`${styles.bar} upDownBgBar`}
                          style={{
                            width:
                              (tdData.fiiCash * 100) / maxValues.fiiCash / 2 +
                              "%",
                          }}
                        ></div>
                        <div className={styles.separator}></div>
                      </div>
                    </td>
                    <td className={`${styles.noRborder} ${upDownTypeDiiCash}`}>
                      {tdData.diiCash}
                    </td>
                    <td className={`${upDownTypeDiiCash}`}>
                      <div className={styles.barCell}>
                        <div
                          className={`${styles.bar} upDownBgBar`}
                          style={{
                            width:
                              (tdData.diiCash * 100) / maxValues.diiCash / 2 +
                              "%",
                          }}
                        ></div>
                        <div className={styles.separator}></div>
                      </div>
                    </td>
                    <td
                      className={`${styles.noRborder} ${upDownTypeFiiIndexFutures}`}
                    >
                      {tdData.fiiIndexFutures}
                    </td>
                    <td className={`${upDownTypeFiiIndexFutures}`}>
                      <div className={styles.barCell}>
                        <div
                          className={`${styles.bar} upDownBgBar`}
                          style={{
                            width:
                              (tdData.fiiIndexFutures * 100) /
                                maxValues.fiiIndexFutures /
                                2 +
                              "%",
                          }}
                        ></div>
                        <div className={styles.separator}></div>
                      </div>
                    </td>
                    <td
                      className={`${styles.noRborder} ${upDownTypeFiiIndexOptions}`}
                    >
                      {tdData.fiiIndexOptions}
                    </td>
                    <td className={`${upDownTypeFiiIndexOptions}`}>
                      <div className={styles.barCell}>
                        <div
                          className={`${styles.bar} upDownBgBar`}
                          style={{
                            width:
                              (tdData.fiiIndexOptions * 100) /
                                maxValues.fiiIndexOptions /
                                2 +
                              "%",
                          }}
                        ></div>
                        <div className={styles.separator}></div>
                      </div>
                    </td>
                    <td
                      className={`${styles.noRborder} ${upDownTypeFiiStockFutures}`}
                    >
                      {tdData.fiiStockFutures}
                    </td>
                    <td className={`${upDownTypeFiiStockFutures}`}>
                      <div className={styles.barCell}>
                        <div
                          className={`${styles.bar} upDownBgBar`}
                          style={{
                            width:
                              (tdData.fiiStockFutures * 100) /
                                maxValues.fiiStockFutures /
                                2 +
                              "%",
                          }}
                        ></div>
                        <div className={styles.separator}></div>
                      </div>
                    </td>
                    <td
                      className={`${styles.noRborder} ${upDownTypeFiiStockOptions}`}
                    >
                      {tdData.fiiStockOptions}
                    </td>
                    <td className={`${upDownTypeFiiStockOptions}`}>
                      <div className={styles.barCell}>
                        <div
                          className={`${styles.bar} upDownBgBar`}
                          style={{
                            width:
                              (tdData.fiiStockOptions * 100) /
                                maxValues.fiiStockOptions /
                                2 +
                              "%",
                          }}
                        ></div>
                        <div className={styles.separator}></div>
                      </div>
                    </td>
                    <td
                      className={`${styles.fullWidth} ${!!parentHasScroll ? styles.hide : ""}`}
                    ></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

FiiDiiActivityOverviewTable.displayName = "FiiDiiActivityOverviewTable";
export default FiiDiiActivityOverviewTable;
