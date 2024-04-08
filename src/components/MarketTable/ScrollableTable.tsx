import React from "react";
import styles from "./MarketTable.module.scss";
import { dateFormat } from "@/utils";
import { goToPlansPage } from "@/utils/ga";
import Image from "next/image";

const ScrollableTable = (props: any) => {
  const {
    tableHeaderData,
    scrollRightPos,
    headerSticky,
    topScrollHeight,
    handleSort,
    sortData,
    filters,
    tableDataList,
    handleFilterChange,
    isPrime = false,
    hideThead = false,
    tableConfig = {},
    fixedCol = 3,
  } = props || {};
  const {
    showFilterInput = true,
    isSorting = true,
    isHeaderSticky = true,
  } = tableConfig || {};
  return (
    <div
      id="scrollableTable"
      className={styles.scrollableWrapper}
      onScroll={scrollRightPos}
    >
      <table className={styles.marketsCustomTable}>
        <thead
          style={{
            transform: `translateY(${isHeaderSticky ? (headerSticky > topScrollHeight ? headerSticky - topScrollHeight : 0) : 0}px)`,
          }}
          className={
            isHeaderSticky && hideThead && tableDataList.length
              ? styles.hideThead
              : ""
          }
        >
          <tr>
            {tableHeaderData.map(
              (thead: any, index: number) =>
                index >= fixedCol && (
                  <th
                    title={thead.keyText}
                    className={`${
                      isSorting &&
                      thead.valueType != "date" &&
                      (!thead.primeFlag || (isPrime && thead.primeFlag))
                        ? styles.enableSort
                        : styles.center
                    } ${isPrime && thead.primeFlag ? styles.primeCell : thead.valueType == "date" || thead.valueType == "text" ? styles.left : ""}`}
                    onClick={() => {
                      isSorting &&
                      thead.valueType != "date" &&
                      (!thead.primeFlag || (isPrime && thead.primeFlag))
                        ? handleSort(thead.keyId)
                        : null;
                    }}
                    key={index}
                  >
                    <div className={styles.thead}>
                      <div className={styles.theading}>
                        {isPrime && thead.primeFlag ? (
                          <Image
                            src="/prime_icon.svg"
                            width={10}
                            height={10}
                            alt="ETPrime"
                            className={styles.primeIcon}
                          />
                        ) : null}
                        {thead.keyText}
                      </div>
                      {isSorting &&
                        thead.valueType != "date" &&
                        (!thead.primeFlag || (isPrime && thead.primeFlag)) && (
                          <span className={`${styles.sortIcons}`}>
                            <span
                              className={`${
                                sortData.field == thead.keyId &&
                                sortData.order == "ASC"
                                  ? styles.asc
                                  : ""
                              } eticon_up_arrow`}
                            ></span>
                            <span
                              className={`${
                                sortData.field == thead.keyId &&
                                sortData.order == "DESC"
                                  ? styles.desc
                                  : ""
                              } eticon_down_arrow`}
                            ></span>
                          </span>
                        )}
                    </div>
                  </th>
                ),
            )}
          </tr>
          {showFilterInput && (
            <tr>
              {tableHeaderData.map(
                (tdData: any, index: number) =>
                  index >= fixedCol && (
                    <td key={index} className={styles.inputWrapper}>
                      <span className={styles.searchWrapper}>
                        <input
                          className={styles.filterInput}
                          type="text"
                          name={tdData.keyId}
                          data-type={tdData.valueType}
                          value={filters[tdData.keyId] || ""}
                          onChange={handleFilterChange}
                          maxLength={20}
                          placeholder="> #"
                          disabled={!isPrime && tdData.primeFlag}
                        ></input>
                        <span className="eticon_search"></span>
                      </span>
                    </td>
                  ),
              )}
            </tr>
          )}
        </thead>
        {tableDataList.length > 0 ? (
          <tbody>
            {tableDataList.map((item: any, index: number) => (
              <tr key={index}>
                {item.data.map(
                  (tdData: any, index: number) =>
                    index >= fixedCol && (
                      <td
                        className={`${!tdData.primeFlag || isPrime ? tdData.trend : ""} ${
                          tdData.valueType == "number" &&
                          (!tdData.primeFlag || isPrime)
                            ? "numberFonts"
                            : tdData.primeFlag
                              ? styles.primeTd
                              : ""
                        } ${isPrime && tdData.primeFlag ? styles.primeCell : tdData.valueType == "date" || tdData.valueType == "text" ? styles.left : ""}`}
                        key={index}
                        title={tdData.valueType == "text" ? tdData.value : null}
                      >
                        {!isPrime && tdData.primeFlag ? (
                          <span onClick={goToPlansPage}>Upgrade to Prime</span>
                        ) : (
                          <>
                            {tdData.valueType == "date"
                              ? dateFormat(tdData.value, "%d %MMM %Y")
                              : tdData.valueType == "number"
                                ? !!tdData.value
                                  ? tdData.value.replaceAll(" ", "")
                                  : "-"
                                : !!tdData.value
                                  ? tdData.value
                                  : "-"}
                            {tdData.trend && (
                              <span
                                className={`${styles.arrowIcons} ${
                                  tdData.trend == "up"
                                    ? "eticon_up_arrow"
                                    : tdData.trend == "down"
                                      ? "eticon_down_arrow"
                                      : ""
                                }`}
                              />
                            )}
                          </>
                        )}
                      </td>
                    ),
                )}
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  );
};
export default ScrollableTable;
