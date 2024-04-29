"use client";
import React, { useEffect, useState } from "react";
import styles from "./FIIDII.module.scss";
import { getClassAndPercent } from "@/utils";

interface OtherDataItem {
  value1_1: number;
  value1_2: number;
  value2_1: number;
  value2_2: number;
  value3_1: number;
  value3_2: number;
}

interface FixedDataItem {
  dateLong: number;
  datelable: string;
  dateStr: string;
}

interface MaxOtherDataItem {
  value1_1: number;
  value1_2: number;
}

interface FiiDiiOtherTableProps {
  fixedData: FixedDataItem[];
  otherData: OtherDataItem[];
  metadataMapping: any;
  headerTxt: string;
}

const FiiDiiOtherTable = React.memo(
  ({
    fixedData,
    otherData,
    metadataMapping,
    headerTxt,
  }: FiiDiiOtherTableProps) => {
    const [parentHasScroll, setParentHasScroll] = useState(false);

    const maxValues: MaxOtherDataItem = {
      value1_1: 0,
      value1_2: 0,
    };

    otherData.forEach((data) => {
      Object.keys(data).forEach((key) => {
        const property = key as keyof MaxOtherDataItem;
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
      const hasScroll = parent
        ? parent.scrollWidth > parent.clientWidth
        : false;
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
          <div className={styles.head}>{headerTxt}</div>
        </div>
        <div className={styles.tableWrapper} id="table">
          <div
            id="fixedTable"
            className={`${styles.fixedWrapper} ${!!parentHasScroll ? styles.withShadow : ""}`}
          >
            <table className={`${styles.marketsCustomTable} ${styles.nowrap}`}>
              <thead>
                <tr>
                  <th></th>
                </tr>
                <tr>
                  <th className={styles.left}>Date</th>
                </tr>
              </thead>
              <tbody>
                {fixedData.map((tdData: any, index: number) => {
                  return (
                    <tr key={`fixed_${index}`}>
                      <td className={styles.left}>{tdData.datelable}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div id="scrollableTable" className={styles.scrollableWrapper}>
            <table className={`${styles.marketsCustomTable} ${styles.nowrap}`}>
              <thead>
                <tr>
                  <th colSpan={4} className={styles.center}>
                    Equity (in Rs. Cr.)
                  </th>
                  <th colSpan={4} className={styles.center}>
                    Debt (in Rs. Cr.)
                  </th>
                  <th
                    className={`${styles.fullWidth} ${!!parentHasScroll ? styles.hide : ""}`}
                  ></th>
                </tr>
                <tr>
                  <th className={styles.center}>Gross Equity Buy</th>
                  <th className={styles.center}>Gross Equity Sell</th>
                  <th className={styles.center} colSpan={2}>
                    Net Equity Buy/Sell
                  </th>
                  <th className={styles.center}>Gross Debt Buy</th>
                  <th className={styles.center}>Gross Debt Sell</th>
                  <th className={styles.center} colSpan={2}>
                    Net Debt Buy/Sell
                  </th>
                  <th
                    className={`${styles.fullWidth} ${!!parentHasScroll ? styles.hide : ""}`}
                  ></th>
                </tr>
              </thead>
              <tbody>
                {otherData.map((tdData: any, index: number) => {
                  const upDownTypeValue11 = getClassAndPercent(tdData.value1_1);
                  const upDownTypeValue12 = getClassAndPercent(tdData.value1_2);
                  const upDownTypeValue21 = getClassAndPercent(tdData.value2_1);
                  const upDownTypeValue22 = getClassAndPercent(tdData.value2_2);
                  const upDownTypeValue31 = getClassAndPercent(tdData.value3_1);
                  const upDownTypeValue32 = getClassAndPercent(tdData.value3_2);
                  return (
                    <tr key={`scrollable_${index}`}>
                      <td className={upDownTypeValue21}>{tdData.value2_1}</td>
                      <td className={upDownTypeValue31}>{tdData.value3_1}</td>
                      <td
                        className={`${styles.noRborder} ${upDownTypeValue11}`}
                      >
                        {tdData.value1_1}
                      </td>
                      <td className={upDownTypeValue11}>
                        <div className={styles.barCell}>
                          <div
                            className={`${styles.bar} upDownBgBar`}
                            style={{
                              width:
                                (Math.abs(tdData.value1_1) * 100) /
                                  maxValues.value1_1 /
                                  2 +
                                "%",
                            }}
                          ></div>
                          <div className={styles.separator}></div>
                        </div>
                      </td>

                      <td className={upDownTypeValue22}>{tdData.value2_2}</td>
                      <td className={upDownTypeValue32}>{tdData.value3_2}</td>
                      <td
                        className={`${styles.noRborder} ${upDownTypeValue12}`}
                      >
                        {tdData.value1_2}
                      </td>
                      <td className={upDownTypeValue12}>
                        <div className={styles.barCell}>
                          <div
                            className={`${styles.bar} upDownBgBar`}
                            style={{
                              width:
                                (Math.abs(tdData.value1_2) * 100) /
                                  maxValues.value1_2 /
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
  },
);
FiiDiiOtherTable.displayName = "FiiDiiOtherTable";
export default FiiDiiOtherTable;
