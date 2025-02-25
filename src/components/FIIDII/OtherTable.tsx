"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import styles from "./FIIDII.module.scss";
import { formatNumber, getClassAndPercent } from "@/utils";
import Loader from "../Loader";
import { trackingEvent } from "@/utils/ga";
import useDebounce from "@/hooks/useDebounce";

interface FilterTypeOption {
  label: string;
  value: string;
  id: number;
}

interface OtherDataItem {
  datelable: string;
  value1_1: number;
  value1_2: number;
  value2_1: number;
  value2_2: number;
  value3_1: number;
  value3_2: number;
}

interface MaxValues {
  [key: string]: number;
  value1_1: number;
  value1_2: number;
}

interface FiiDiiOtherTableProps {
  otherData: OtherDataItem[];
  type: string;
  handleFilterType: (filter: string) => void;
}

const filterTypeOptions: FilterTypeOption[] = [
  { label: "Daily", value: "daily", id: 11 },
  { label: "Monthly", value: "monthly", id: 12 },
  { label: "Yearly", value: "yearly", id: 13 },
];

const FiiDiiOtherTable: React.FC<FiiDiiOtherTableProps> = ({
  otherData,
  type,
  handleFilterType,
}) => {
  const { debounce } = useDebounce();
  const tableWrapperRef = useRef<HTMLDivElement | null>(null);
  const summaryData = otherData.slice(0, 3);
  const tableData = otherData.slice(3);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("daily");
  const [translateY, setTranslateY] = useState(0);

  const calculateMaxValues = (data: OtherDataItem[]): MaxValues => {
    return data.reduce<MaxValues>(
      (maxValues, item) => {
        (Object.keys(item) as Array<keyof OtherDataItem>).forEach((key) => {
          if (typeof item[key] === "number") {
            const value = Math.abs(item[key] as number);
            if (value > maxValues[key]) {
              maxValues[key] = value;
            }
          }
        });
        return maxValues;
      },
      { value1_1: 0, value1_2: 0 },
    );
  };

  const maxValues = calculateMaxValues(otherData);
  const maxValuesSummary = calculateMaxValues(summaryData);
  const maxValuesOther = calculateMaxValues(tableData);

  const handleFilterClick = useCallback(
    (item: FilterTypeOption) => {
      setIsLoading(true);
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "duration_filter_applied",
        event_label: item.label,
      });
      handleFilterType(item.value);
      setActiveFilter(item.value);
    },
    [handleFilterType],
  );

  const handleWindowScroll = useCallback(
    debounce(() => {
      if (!tableWrapperRef.current) return;

      const tableWrapperTop =
        tableWrapperRef.current.getBoundingClientRect().top + window.scrollY;
      const scrollY = window.scrollY;
      const stickyHeight = 100;

      if (scrollY > tableWrapperTop - 70) {
        setTranslateY(scrollY - tableWrapperTop + stickyHeight);
      } else {
        setTranslateY(0);
      }
    }, 10),
    [debounce],
  );

  useEffect(() => {
    // Add and remove scroll event listener
    window.addEventListener("scroll", handleWindowScroll, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, [handleWindowScroll]);

  useEffect(() => {
    setIsLoading(false);
  }, [otherData]);

  const getBarWidth = (value: number, maxValue: number): string => {
    return `${5 + (Math.abs(value) * 100) / maxValue / 2}%`;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.head}>
          {type === "cash-provisional"
            ? "FII & DII Buy-Sell Activity"
            : type === "fii-cash"
              ? "FII Buy-Sell Activity"
              : type === "fii-fno"
                ? "FII F&O Buy-Sell Activity"
                : "Mutual Fund Buy-Sell Activity"}
        </div>
        <div className={styles.options}>
          <ul className={styles.btnGroup}>
            {filterTypeOptions.map((item) => (
              <li
                key={item.id}
                onClick={() => handleFilterClick(item)}
                className={activeFilter === item.value ? styles.active : ""}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.tableWrapper} id="table" ref={tableWrapperRef}>
        {isLoading && <Loader loaderType={"container"} />}
        <table
          className={`${styles.marketsCustomTable} ${styles.fixedLayout}`}
          cellPadding={0}
          cellSpacing={0}
        >
          <thead
            style={{
              transition: "transform 0.1s ease 0s",
              transform: `translateY(${translateY}px)`,
            }}
          >
            <tr>
              <th rowSpan={2} className={styles.left}>
                {activeFilter === "monthly"
                  ? "Month"
                  : activeFilter === "yearly"
                    ? "Year"
                    : "Date"}
              </th>
              <th colSpan={4} className={styles.center}>
                Equity (Cr.)
              </th>
              <th
                colSpan={4}
                className={`${styles.center} ${styles.noRborder}`}
              >
                Debt (Cr.)
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
              <th
                className={`${styles.center} ${styles.noRborder}`}
                colSpan={2}
              >
                Net Debt Buy/Sell
              </th>
            </tr>
          </thead>
          <tbody>
            {otherData.map((tdData, index) => {
              const upDownTypeValue11 = getClassAndPercent(tdData.value1_1);
              const upDownTypeValue12 = getClassAndPercent(tdData.value1_2);
              const upDownTypeValue21 = getClassAndPercent(tdData.value2_1);
              const upDownTypeValue22 = getClassAndPercent(tdData.value2_2);
              const upDownTypeValue31 = getClassAndPercent(tdData.value3_1);
              const upDownTypeValue32 = getClassAndPercent(tdData.value3_2);
              const barWidthValue1_1 = getBarWidth(
                tdData.value1_1,
                activeFilter !== "daily"
                  ? maxValues.value1_1
                  : index < 3
                    ? maxValuesSummary.value1_1
                    : maxValuesOther.value1_1,
              );
              const barWidthValue1_2 = getBarWidth(
                tdData.value1_2,
                activeFilter !== "daily"
                  ? maxValues.value1_2
                  : index < 3
                    ? maxValuesSummary.value1_2
                    : maxValuesOther.value1_2,
              );

              return (
                <tr
                  key={`scrollable_${index}`}
                  className={
                    activeFilter == "daily" && index == 2
                      ? styles.borderSeparator
                      : ""
                  }
                >
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
                        style={{ width: barWidthValue1_1 }}
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
                  <td
                    className={`${upDownTypeValue12} ${styles.noPadding} ${styles.noRborder}`}
                  >
                    <div className={styles.barCell}>
                      <div
                        className={`${styles.bar} upDownBgBar`}
                        style={{ width: barWidthValue1_2 }}
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
};

FiiDiiOtherTable.displayName = "FiiDiiOtherTable";
export default React.memo(FiiDiiOtherTable);
