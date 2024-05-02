import React, { useEffect, useRef } from "react";
import styles from "./MarketTable.module.scss";
import { getStockUrl } from "@/utils/utility";
import { dateFormat } from "@/utils";
import WatchlistAddition from "../WatchlistAddition";
import { goToPlansPage } from "@/utils/ga";
import Image from "next/image";

const FixedTable = React.memo((props: any) => {
  const {
    highlightLtp,
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
    parentHasScroll = false,
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
      className={`${styles.fixedWrapper} ${!!parentHasScroll ? styles.withShadow : ""}`}
      onScroll={scrollLeftPos}
    >
      <table className={styles.marketsCustomTable}>
        <thead
          style={{
            transition: "transform 0.1s ease 0s",
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
                      thead.valueType != "lineGraph" &&
                      thead.valueType != "sparklineGraph" &&
                      (!thead.primeFlag || (isPrime && thead.primeFlag))
                        ? handleSort(thead.keyId)
                        : null;
                    }}
                    className={`${
                      thead.keyId == "assetName" ||
                      thead.keyId == "name" ||
                      thead.keyId == "shortName" ||
                      thead.keyId == "shortNameKeyword"
                        ? styles.firstTh
                        : isSorting &&
                            thead.valueType != "date" &&
                            thead.valueType != "lineGraph" &&
                            thead.valueType != "sparklineGraph" &&
                            (!thead.primeFlag || (isPrime && thead.primeFlag))
                          ? styles.enableSort
                          : styles.center
                    } ${isPrime && thead.primeFlag ? styles.primeCell : thead.valueType == "date" || thead.valueType == "text" || index === 0 ? styles.left : ""}`}
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
                        thead.valueType != "lineGraph" &&
                        thead.valueType != "sparklineGraph" &&
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
                  index < fixedCol && (
                    <td
                      key={index}
                      className={`${styles.inputWrapper} ${tdData.keyId == "assetName" || tdData.keyId == "name" || tdData.keyId == "shortName" || tdData.keyId == "shortNameKeyword" ? styles.firstInput : ""}`}
                    >
                      <span className={styles.searchWrapper}>
                        <input
                          className={`${styles.filterInput} ${
                            tdData.keyId == "assetName" ||
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
                            tdData.keyId == "assetName" ||
                            tdData.keyId == "name" ||
                            tdData.keyId == "shortName" ||
                            tdData.keyId == "shortNameKeyword"
                              ? "Search Value"
                              : "> #"
                          }
                          disabled={
                            (!isPrime && tdData.primeFlag) ||
                            tdData.valueType == "date" ||
                            tdData.valueType == "lineGraph" ||
                            tdData.valueType == "sparklineGraph"
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
                      (tdData.keyId == "assetName" ||
                      tdData.keyId == "name" ||
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
                            {showWatchlistIcon && item.assetId && (
                              <WatchlistAddition
                                companyName={item.assetName}
                                companyId={item.assetId}
                                companyType={item.assetType}
                                customStyle={{
                                  width: "18px",
                                  height: "18px",
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
                              title={`${!!tdData.value ? tdData.value : item.assetName}${item.assetType !== "index" ? " Share Price" : ""}`}
                            >
                              {!!tdData.value ? tdData.value : item.assetName}
                            </a>
                          </div>
                        </td>
                      ) : (
                        <td
                          className={`${!tdData.primeFlag || isPrime ? (tdData.valueType == "sparklineGraph" || tdData.valueType == "lineGraph" ? styles.noPadding : tdData.trend) : ""} ${
                            tdData.valueType == "number" &&
                            (!tdData.primeFlag || isPrime)
                              ? "numberFonts"
                              : tdData.primeFlag
                                ? styles.primeTd
                                : ""
                          } ${isPrime && tdData.primeFlag ? styles.primeCell : tdData.valueType == "date" || tdData.valueType == "text" ? styles.left : ""}`}
                          key={tdIndex}
                          title={
                            tdData.valueType == "text" ? tdData.value : null
                          }
                        >
                          {!isPrime && tdData.primeFlag ? (
                            <span onClick={goToPlansPage}>
                              Upgrade to Prime
                            </span>
                          ) : (
                            <>
                              {tdData.valueType == "date" ? (
                                dateFormat(tdData.value, "%d %MMM %Y")
                              ) : tdData.valueType == "lineGraph" ? (
                                !!tdData.value && tdData.value.includes("/") ? (
                                  <div className={styles.lineGraph} key={index}>
                                    <div className="dflex align-item-center space-between">
                                      <p className={styles.head}>
                                        {tdData.value.split("/")[0]}
                                      </p>
                                      <p className={styles.head}>
                                        {tdData.value.split("/")[1]}
                                      </p>
                                    </div>
                                    <div
                                      className={`dflex align-item-center space-between ${styles.gap2}`}
                                    >
                                      <div
                                        className={`${styles.bar} ${styles.up}`}
                                        style={{
                                          width: `${(parseInt(tdData.value.split("/")[0]) * 100) / (parseInt(tdData.value.split("/")[1]) + parseInt(tdData.value.split("/")[0]))}%`,
                                        }}
                                      ></div>
                                      <div
                                        className={`${styles.bar} ${styles.down}`}
                                        style={{
                                          width: `${(parseInt(tdData.value.split("/")[1]) * 100) / (parseInt(tdData.value.split("/")[1]) + parseInt(tdData.value.split("/")[0]))}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )
                              ) : tdData.valueType == "sparklineGraph" ? (
                                !!tdData.value && (
                                  <img
                                    src={`${tdData.value}&width=100&height=35`}
                                    width={140}
                                    height={35}
                                    loading="lazy"
                                  />
                                )
                              ) : tdData.keyId == "lastTradedPrice" ? (
                                <span
                                  className={
                                    !!highlightLtp &&
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
                                  {!!tdData.value
                                    ? tdData.value.replaceAll(" ", "")
                                    : "-"}
                                </span>
                              ) : tdData.valueType == "number" ? (
                                !!tdData.value ? (
                                  tdData.value.replaceAll(" ", "")
                                ) : (
                                  "-"
                                )
                              ) : !!tdData.value ? (
                                tdData.value
                              ) : (
                                "-"
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
});
FixedTable.displayName = "FixedTable";
export default FixedTable;
