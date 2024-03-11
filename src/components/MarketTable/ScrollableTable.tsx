import React from "react";
import styles from "./MarketTable.module.scss";
import Link from "next/link";
import GLOBAL_CONFIG from "@/network/global_config.json";
import { APP_ENV } from "@/utils";

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
    parentHasScroll = false,
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
                index > 2 && (
                  <th
                    className={
                      isSorting &&
                      (!thead.primeFlag || (isPrime && thead.primeFlag))
                        ? styles.enableSort
                        : ""
                    }
                    onClick={() => {
                      isSorting &&
                      (!thead.primeFlag || (isPrime && thead.primeFlag))
                        ? handleSort(thead.keyId)
                        : null;
                    }}
                    key={thead.keyId}
                  >
                    {thead.keyText}
                    {isSorting &&
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
                  </th>
                ),
            )}
            <th
              className={`${styles.fullWidth} ${parentHasScroll ? styles.hide : null}`}
            ></th>
          </tr>
          {showFilterInput && (
            <tr>
              {tableHeaderData.map(
                (tdData: any, index: number) =>
                  index > 2 && (
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
              <td
                className={`${styles.fullWidth} ${parentHasScroll ? styles.hide : null}`}
              ></td>
            </tr>
          )}
        </thead>
        {tableDataList.length > 0 ? (
          <tbody>
            {tableDataList.map((item: any, index: number) => (
              <tr key={index}>
                {item.data.map(
                  (tdData: any, index: number) =>
                    index > 2 && (
                      <td
                        className={`${!tdData.primeFlag || isPrime ? tdData.trend : ""} ${
                          tdData.valueType == "number" &&
                          (!tdData.primeFlag || isPrime)
                            ? "numberFonts"
                            : tdData.primeFlag
                              ? styles.primeTd
                              : ""
                        }`}
                        key={index}
                      >
                        {!isPrime && tdData.primeFlag ? (
                          <Link
                            href={`${
                              (GLOBAL_CONFIG as any)[APP_ENV]["Plan_PAGE"]
                            }`}
                            data-ga-onclick="Subscription Flow#Upgrade to Prime#table - url"
                          >
                            Upgrade to Prime
                          </Link>
                        ) : (
                          <>
                            {tdData.value.replaceAll(" ", "")}
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
                <td
                  className={`${styles.fullWidth} ${parentHasScroll ? styles.hide : null}`}
                ></td>
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  );
};
export default ScrollableTable;
