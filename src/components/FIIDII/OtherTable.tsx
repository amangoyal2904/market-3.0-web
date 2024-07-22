"use client";
import React, { useEffect, useState } from "react";
import styles from "./FIIDII.module.scss";
import { formatNumber, getClassAndPercent } from "@/utils";
import Loader from "../Loader";
import { trackingEvent } from "@/utils/ga";

const filterTypeOptions = [
  { label: "Daily", value: "daily", id: 11 },
  { label: "Monthly", value: "monthly", id: 12 },
  { label: "Yearly", value: "yearly", id: 13 },
];

const apiTypeOptions = [
  { label: "Index", value: "index", id: 21 },
  { label: "Stock", value: "stock", id: 22 },
];

interface OtherDataItem {
  value1_1: number;
  value1_2: number;
  value2_1: number;
  value2_2: number;
  value3_1: number;
  value3_2: number;
}

interface MaxOtherDataItem {
  value1_1: number;
  value1_2: number;
}

interface FiiDiiOtherTableProps {
  otherData: OtherDataItem[];
  type: string;
  handleFilterType: any;
}

const FiiDiiOtherTable = React.memo(
  ({ otherData, type, handleFilterType }: FiiDiiOtherTableProps) => {
    const summaryData = otherData.slice(0, 3);
    const tableData = otherData.slice(3);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState("daily");

    const maxValues: MaxOtherDataItem = {
      value1_1: 0,
      value1_2: 0,
    };

    const maxValuesSummary: MaxOtherDataItem = {
      value1_1: 0,
      value1_2: 0,
    };

    const maxValuesOther: MaxOtherDataItem = {
      value1_1: 0,
      value1_2: 0,
    };

    otherData.forEach((data: any) => {
      Object.keys(data).forEach((key) => {
        const property = key as keyof MaxOtherDataItem;
        const absoluteValue = Math.abs(data[property]);
        if (absoluteValue > maxValues[property]) {
          maxValues[property] = absoluteValue;
        }
      });
    });

    summaryData.forEach((data: any) => {
      Object.keys(data).forEach((key) => {
        const property = key as keyof MaxOtherDataItem;
        const absoluteValue = Math.abs(data[property]);
        if (absoluteValue > maxValuesSummary[property]) {
          maxValuesSummary[property] = absoluteValue;
        }
      });
    });

    tableData.forEach((data) => {
      Object.keys(data).forEach((key) => {
        const property = key as keyof MaxOtherDataItem;
        const absoluteValue = Math.abs(data[property]);
        if (absoluteValue > maxValuesOther[property]) {
          maxValuesOther[property] = absoluteValue;
        }
      });
    });

    useEffect(() => {
      setIsLoading(false);
    }, [otherData]);

    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.head}>
            {type == "cash-provisional"
              ? "FII & DII Buy-Sell Activity"
              : type == "fii-cash"
                ? "FII Buy-Sell Activity"
                : type == "fii-fno"
                  ? "FII F&O Buy-Sell Activity"
                  : "Mutual Fund Buy-Sell Activity"}
          </div>
          <div className={styles.options}>
            {
              <ul className={styles.btnGroup}>
                {filterTypeOptions.map((item: any) => {
                  return (
                    <li
                      key={item.id}
                      onClick={() => {
                        setIsLoading(true);
                        trackingEvent("et_push_event", {
                          event_category: "mercury_engagement",
                          event_action: "index_filter_applied",
                          event_label: item.label,
                        });
                        handleFilterType(item.value);
                        setActiveFilter(item.value); // Update active filter on click
                      }}
                      className={
                        activeFilter === item.value ? styles.active : ""
                      }
                    >
                      {item.label}
                    </li>
                  );
                })}
              </ul>
            }
          </div>
        </div>
        <div className={styles.tableWrapper} id="table">
          {isLoading && <Loader loaderType={"container"} />}
          <table
            className={`${styles.marketsCustomTable} ${styles.fixedLayout}`}
          >
            <thead>
              <tr>
                <th rowSpan={2} className={styles.left}>
                  Date
                </th>
                <th colSpan={4} className={styles.center}>
                  Equity (in Rs. Cr.)
                </th>
                <th colSpan={4} className={styles.center}>
                  Debt (in Rs. Cr.)
                </th>
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
                    <td className={styles.left} title={tdData.datelable}>
                      {tdData.datelable}
                    </td>
                    <td className={upDownTypeValue21}>
                      {formatNumber(tdData.value2_1)}
                    </td>
                    <td className={upDownTypeValue31}>
                      {formatNumber(tdData.value3_1)}
                    </td>
                    <td className={`${styles.noRborder} ${upDownTypeValue11}`}>
                      {formatNumber(tdData.value1_1)}
                    </td>
                    <td className={`${upDownTypeValue11} ${styles.noPadding}`}>
                      <div className={styles.barCell}>
                        <div
                          className={`${styles.bar} upDownBgBar`}
                          style={{
                            width:
                              activeFilter !== "daily"
                                ? `${(Math.abs(tdData.value1_1) * 100) / maxValues.value1_1 / 2}%`
                                : index < 3
                                  ? `${(Math.abs(tdData.value1_1) * 100) / maxValuesSummary.value1_1 / 2}%`
                                  : `${(Math.abs(tdData.value1_1) * 100) / maxValuesOther.value1_1 / 2}%`,
                          }}
                        ></div>
                        <div className={styles.separator}></div>
                      </div>
                    </td>
                    <td className={upDownTypeValue22}>
                      {formatNumber(tdData.value2_2)}
                    </td>
                    <td className={upDownTypeValue32}>
                      {formatNumber(tdData.value3_2)}
                    </td>
                    <td className={`${styles.noRborder} ${upDownTypeValue12}`}>
                      {formatNumber(tdData.value1_2)}
                    </td>

                    <td className={`${upDownTypeValue12} ${styles.noPadding}`}>
                      <div className={styles.barCell}>
                        <div
                          className={`${styles.bar} upDownBgBar`}
                          style={{
                            width:
                              activeFilter !== "daily"
                                ? `${(Math.abs(tdData.value1_2) * 100) / maxValues.value1_2 / 2}%`
                                : index < 3
                                  ? `${(Math.abs(tdData.value1_2) * 100) / maxValuesSummary.value1_2 / 2}%`
                                  : `${(Math.abs(tdData.value1_2) * 100) / maxValuesOther.value1_2 / 2}%`,
                          }}
                        ></div>
                        <div className={styles.separator}></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
);
FiiDiiOtherTable.displayName = "FiiDiiOtherTable";
export default FiiDiiOtherTable;
