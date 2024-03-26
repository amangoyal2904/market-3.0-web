import React, { useEffect, useRef } from "react";
import styles from "./MarketTable.module.scss";
import { getStockUrl } from "@/utils/utility";
import Link from "next/link";
import GLOBAL_CONFIG from "@/network/global_config.json";
import { APP_ENV, dateFormat } from "@/utils";
import WatchlistAddition from "../WatchlistAddition";

const FixedTable = (props: any) => {
  const {
    tableHeaderData,
    scrollLeftPos,
    headerSticky,
    topScrollHeight,
    handleSort,
    sortData,
    filters,
    tableDataList,
    handleFilterChange,
    hideThead = false,
    isPrime = false,
    showRemoveCheckbox = false,
    removeCheckBoxHandle,
    tableConfig = {},
    fixedCol = 3,
  } = props || {};
  const {
    showFilterInput = true,
    isSorting = true,
    isHeaderSticky = true,
    showWatchlistIcon = true,
  } = tableConfig || {};
  const prevTableDataListRef = useRef<any>([]);

  useEffect(() => {
    prevTableDataListRef.current = tableDataList;
    const timer = setTimeout(() => {
      const spanElements = document.querySelectorAll("td > span");
      spanElements.forEach((span) => {
        span.classList.remove(styles.upBg, styles.downBg, styles.noBg);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [tableDataList]);

  const prevTableDataList = prevTableDataListRef.current;

  return (
    <div
      id="fixedTable"
      className={styles.fixedWrapper}
      onScroll={scrollLeftPos}
    >
      <table className={styles.marketsCustomTable}>
        <thead
          style={{
            transform: `translateY(${
              isHeaderSticky
                ? headerSticky > topScrollHeight
                  ? headerSticky - topScrollHeight
                  : 0
                : 0
            }px)`,
          }}
          className={
            isHeaderSticky && hideThead && tableDataList.length
              ? styles.hideThead
              : ""
          }
          id="thead"
        >
          <tr className={styles.leftThWrapper}>
            {tableHeaderData.map(
              (thead: any, index: number) =>
                index < fixedCol && (
                  <th
                    title={thead.keyText}
                    onClick={() => {
                      isSorting &&
                      thead.valueType != "date" &&
                      (!thead.primeFlag || (isPrime && thead.primeFlag))
                        ? handleSort(thead.keyId)
                        : null;
                    }}
                    className={`${
                      thead.keyId == "name" ||
                      thead.keyId == "shortName" ||
                      thead.keyId == "shortNameKeyword"
                        ? styles.firstTh
                        : isSorting &&
                            thead.valueType != "date" &&
                            (!thead.primeFlag || (isPrime && thead.primeFlag))
                          ? styles.enableSort
                          : ""
                    }`}
                    key={thead.keyId}
                  >
                    <span className="two-line-ellipsis">{thead.keyText}</span>
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
                  </th>
                ),
            )}
          </tr>
          {showFilterInput && (
            <tr>
              {tableHeaderData.map(
                (tdData: any, index: number) =>
                  index < fixedCol && (
                    <td
                      key={index}
                      className={`${styles.inputWrapper} ${tdData.keyId == "name" || tdData.keyId == "shortName" || tdData.keyId == "shortNameKeyword" ? styles.firstInput : ""}`}
                    >
                      <span className={styles.searchWrapper}>
                        <input
                          className={`${styles.filterInput} ${
                            tdData.keyId == "name" ||
                            tdData.keyId == "shortName" ||
                            tdData.keyId == "shortNameKeyword"
                              ? styles.filterInputFirst
                              : ""
                          }`}
                          type="text"
                          name={tdData.keyId}
                          data-type={tdData.valueType}
                          value={filters[tdData.keyId] || ""}
                          onChange={handleFilterChange}
                          maxLength={20}
                          placeholder={
                            tdData.keyId == "name" ||
                            tdData.keyId == "shortName" ||
                            tdData.keyId == "shortNameKeyword"
                              ? "Search Value"
                              : "> #"
                          }
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
            <>
              {tableDataList.map((item: any, index: number) => (
                <tr key={index} className={styles.fixedTr}>
                  {item.data.map(
                    (tdData: any, tdIndex: number) =>
                      tdIndex < fixedCol &&
                      (tdData.keyId == "name" ||
                      tdData.keyId == "shortName" ||
                      tdData.keyId == "shortNameKeyword" ? (
                        <td key={tdIndex} className={styles.fixedTD}>
                          <div className={styles.tdColWrap}>
                            {showRemoveCheckbox ? (
                              <div className={styles.formGroup}>
                                <label>
                                  <input
                                    type="checkbox"
                                    onChange={(e) =>
                                      removeCheckBoxHandle(
                                        e,
                                        item.assetId,
                                        item.assetType,
                                      )
                                    }
                                  />
                                </label>
                              </div>
                            ) : (
                              ""
                            )}
                            {showWatchlistIcon && (
                              <WatchlistAddition
                                companyName={item.assetName}
                                companyId={item.assetId}
                                companyType={item.assetType}
                                customStyle={{
                                  width: "18px",
                                  height: "18px",
                                  fontSize: "inherit",
                                }}
                              />
                            )}
                            <a
                              className={styles.ellipses}
                              href={getStockUrl(
                                item.assetId,
                                !!item.assetSeoName
                                  ? item.assetSeoName
                                  : item.assetName,
                                item.assetType,
                              )}
                              target="_blank"
                              title={`${tdData?.value} ${
                                item?.assetType?.toLowerCase() != "equity"
                                  ? `(${item?.assetType?.toUpperCase()})`
                                  : ""
                              }`}
                            >
                              {tdData.value}{" "}
                              {item.assetType != "" &&
                              item?.assetType?.toLowerCase() != "equity"
                                ? `(${item?.assetType?.toUpperCase()})`
                                : null}
                            </a>
                          </div>
                        </td>
                      ) : (
                        <td
                          className={`${!tdData.primeFlag || isPrime ? tdData.trend : ""} ${
                            tdData.valueType == "number" &&
                            (!tdData.primeFlag || isPrime)
                              ? "numberFonts"
                              : tdData.primeFlag
                                ? styles.primeTd
                                : ""
                          }`}
                          key={tdIndex}
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
                              {tdData.valueType == "date" ? (
                                dateFormat(tdData.value, "%d %MMM %Y")
                              ) : tdData.keyId == "lastTradedPrice" ? (
                                <span
                                  className={
                                    prevTableDataList[index]?.data[tdIndex]
                                      ?.filterFormatValue
                                      ? parseFloat(tdData.filterFormatValue) >
                                        parseFloat(
                                          prevTableDataList[index]?.data[
                                            tdIndex
                                          ]?.filterFormatValue,
                                        )
                                        ? styles.upBg
                                        : parseFloat(tdData.filterFormatValue) <
                                            parseFloat(
                                              prevTableDataList[index]?.data[
                                                tdIndex
                                              ]?.filterFormatValue,
                                            )
                                          ? styles.downBg
                                          : styles.noBg
                                      : styles.noBg
                                  }
                                >
                                  {tdData.value.replaceAll(" ", "")}
                                </span>
                              ) : (
                                tdData.value.replaceAll(" ", "")
                              )}
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
                      )),
                  )}
                </tr>
              ))}
            </>
          </tbody>
        ) : (
          ""
        )}
      </table>
    </div>
  );
};
export default FixedTable;
