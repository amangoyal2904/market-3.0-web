"use client";
import React, { useEffect, useState, useMemo } from "react";
import styles from "./FIIDII.module.scss";
import { dateFormat, formatNumber, getClassAndPercent } from "@/utils";

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

  const maxValues = useMemo(() => {
    const maxVals: OtherDataItem = {
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
        if (absoluteValue > maxVals[property]) {
          maxVals[property] = absoluteValue;
        }
      });
    });

    return maxVals;
  }, [otherData]);

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

  const renderTableRow = (
    tdData: OtherDataItem,
    index: number,
    maxValues: OtherDataItem,
  ) => {
    const columns = [
      { key: "fiiCash", upDownType: getClassAndPercent(tdData.fiiCash) },
      { key: "diiCash", upDownType: getClassAndPercent(tdData.diiCash) },
      {
        key: "fiiIndexFutures",
        upDownType: getClassAndPercent(tdData.fiiIndexFutures),
      },
      {
        key: "fiiIndexOptions",
        upDownType: getClassAndPercent(tdData.fiiIndexOptions),
      },
      {
        key: "fiiStockFutures",
        upDownType: getClassAndPercent(tdData.fiiStockFutures),
      },
      {
        key: "fiiStockOptions",
        upDownType: getClassAndPercent(tdData.fiiStockOptions),
      },
    ];

    return (
      <tr key={`scrollable_${index}`}>
        {columns.map(({ key, upDownType }) => (
          <>
            <td className={`${styles.noRborder} ${upDownType}`}>
              {formatNumber(tdData[key as keyof OtherDataItem])}
            </td>
            <td className={upDownType}>
              <div className={styles.barCell}>
                <div
                  className={`${styles.bar} upDownBgBar`}
                  style={{
                    width: `${5 + (Math.abs(tdData[key as keyof OtherDataItem]) * 100) / maxValues[key as keyof OtherDataItem] / 2}%`,
                  }}
                ></div>
                <div className={styles.separator}></div>
              </div>
            </td>
          </>
        ))}
        <td
          className={`${styles.fullWidth} ${!!parentHasScroll ? styles.hide : ""}`}
        ></td>
      </tr>
    );
  };

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
                <th className={styles.left}>Date</th>
                <th className={styles.center}>Nifty Closing</th>
              </tr>
            </thead>
            <tbody>
              {dataWithNiftySensex.map((tdData: any, index: number) => {
                const upDownType = getClassAndPercent(
                  tdData.nifty.percentChange,
                );
                return (
                  <tr key={`fixed_${index}`}>
                    <td className={styles.left}>
                      {dateFormat(tdData.dateLong, "%d %MMM %y")}
                    </td>
                    <td>
                      {formatNumber(tdData.nifty.ltp)}
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
                <th className={styles.center} colSpan={2}>
                  FII Cash (in Rs. Cr.)
                </th>
                <th className={styles.center} colSpan={2}>
                  DII Cash (in Rs. Cr.)
                </th>
                <th className={styles.center} colSpan={2}>
                  FII Index Future (in Rs. Cr.)
                </th>
                <th className={styles.center} colSpan={2}>
                  FII Index Option (in Rs. Cr.)
                </th>
                <th className={styles.center} colSpan={2}>
                  FII Stock Future (in Rs. Cr.)
                </th>
                <th className={styles.center} colSpan={2}>
                  FII Stock Option (in Rs. Cr.)
                </th>
                <th
                  className={`${styles.fullWidth} ${!!parentHasScroll ? styles.hide : ""}`}
                ></th>
              </tr>
            </thead>
            <tbody>
              {otherData.map((tdData, index) =>
                renderTableRow(tdData, index, maxValues),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

FiiDiiActivityOverviewTable.displayName = "FiiDiiActivityOverviewTable";
export default FiiDiiActivityOverviewTable;
