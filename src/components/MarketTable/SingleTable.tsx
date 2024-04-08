import React, { useEffect, useRef } from "react";
import styles from "./MarketTable.module.scss";
import { dateFormat } from "@/utils";
import { goToPlansPage } from "@/utils/ga";
import WatchlistAddition from "../WatchlistAddition";
import { getStockUrl } from "@/utils/utility";

const SingleTable = (props: any) => {
  const {
    highlightLtp,
    tableHeaderData,
    headerSticky,
    topScrollHeight,
    handleSort,
    sortData,
    filters,
    tableDataList,
    handleFilterChange,
    isPrime = false,
    hideThead = false,
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
    <table className={styles.marketsCustomTable} id="scrollableTable">
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
          {tableHeaderData.map((thead: any, index: number) => (
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
                isSorting &&
                thead.valueType != "date" &&
                (!thead.primeFlag || (isPrime && thead.primeFlag))
                  ? styles.enableSort
                  : styles.center
              } ${isPrime && thead.primeFlag ? styles.primeCell : ""} ${index < fixedCol ? styles.stickyCell : ""}`}
              key={index}
            >
              <div className="dflex">
                {isPrime && thead.primeFlag ? (
                  <span className="eticon_prime_logo">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </span>
                ) : null}{" "}
                {thead.keyText}
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
          ))}
          <th
            className={`${styles.fullWidth} ${parentHasScroll ? styles.hide : ""}`}
          ></th>
        </tr>
        {showFilterInput && (
          <tr>
            {tableHeaderData.map((tdData: any, index: number) => (
              <td
                key={index}
                className={`${styles.inputWrapper} ${index < fixedCol ? styles.stickyCell : ""}`}
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
            ))}
            <td
              className={`${styles.fullWidth} ${parentHasScroll ? styles.hide : ""}`}
            ></td>
          </tr>
        )}
      </thead>
      {tableDataList.length > 0 ? (
        <tbody>
          {tableDataList.map((item: any, index: number) => (
            <tr key={index}>
              {item.data.map((tdData: any, tdIndex: number) =>
                tdData.keyId == "name" ||
                tdData.keyId == "shortName" ||
                tdData.keyId == "shortNameKeyword" ? (
                  <td key={tdIndex} className={styles.stickyCell}>
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
                    } ${isPrime && tdData.primeFlag ? styles.primeCell : ""} ${tdIndex < fixedCol ? styles.stickyCell : ""}`}
                    key={tdIndex}
                    title={tdData.valueType == "text" ? tdData.value : null}
                  >
                    {!isPrime && tdData.primeFlag ? (
                      <span onClick={goToPlansPage}>Upgrade to Prime</span>
                    ) : (
                      <>
                        {tdData.valueType == "date" ? (
                          dateFormat(tdData.value, "%d %MMM %Y")
                        ) : tdData.keyId == "lastTradedPrice" ? (
                          <span
                            className={
                              !!highlightLtp &&
                              prevTableDataList[index]?.data[tdIndex]
                                ?.filterFormatValue
                                ? parseFloat(tdData.filterFormatValue) >
                                  parseFloat(
                                    prevTableDataList[index]?.data[tdIndex]
                                      ?.filterFormatValue,
                                  )
                                  ? styles.upBg
                                  : parseFloat(tdData.filterFormatValue) <
                                      parseFloat(
                                        prevTableDataList[index]?.data[tdIndex]
                                          ?.filterFormatValue,
                                      )
                                    ? styles.downBg
                                    : styles.noBg
                                : styles.noBg
                            }
                          >
                            {tdData.value.replaceAll(" ", "")}
                          </span>
                        ) : tdData.valueType == "number" ? (
                          tdData.value.replaceAll(" ", "")
                        ) : (
                          tdData.value
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
                ),
              )}
              <td
                className={`${styles.fullWidth} ${parentHasScroll ? styles.hide : ""}`}
              ></td>
            </tr>
          ))}
        </tbody>
      ) : null}
    </table>
  );
};
export default SingleTable;
