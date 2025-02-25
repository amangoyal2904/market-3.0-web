import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { freeTrialElegibilty, activateFreeTrial } from "@/utils/freeTrail";
import { redirectToPlanPage } from "@/utils/ga";
import styles from "./MarketTable.module.scss";
import { dateFormat } from "@/utils";
import Table7DGraph from "../StocksEarnings/Table7DGraph";
import { renderIconPaths } from "@/utils/iconUtils";

const ScrollableTable = React.memo((props: any) => {
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
    tableConfig = {},
    parentHasScroll = false,
    fixedCol = 3,
    setVerticalScrollEnabled,
    setScrollableTableRef,
    verticalScrollEnabled,
    objTracking,
    setLeftScrollEnabled,
    setRightScrollEnabled,
    onRowHover,
    noSharePriceTitle,
  } = props || {};
  const {
    showFilterInput = true,
    isSorting = true,
    isHeaderSticky = true,
  } = tableConfig || {};
  const validAccessPass = freeTrialElegibilty();
  const prevTableDataListRef = useRef<any>([]);
  const scrollableTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    prevTableDataListRef.current = tableDataList;
    const timer = setTimeout(() => {
      const highlightBgElements =
        document.querySelectorAll("td > .highlightBg");
      highlightBgElements.forEach((elem) => {
        elem.classList.remove("upBg", "downBg");
      });
    }, 500);
    setScrollableTableRef(scrollableTableRef.current);
    if (scrollableTableRef.current) {
      setVerticalScrollEnabled(
        scrollableTableRef.current.scrollWidth >
          scrollableTableRef.current.clientWidth,
      );
      setLeftScrollEnabled(scrollableTableRef.current?.scrollLeft > 0);
    }
    const handleScroll = () => {
      if (scrollableTableRef.current) {
        const isAtEndOfRight =
          Math.floor(scrollableTableRef.current?.scrollLeft) +
            scrollableTableRef.current.clientWidth >=
          scrollableTableRef.current?.scrollWidth - 10;
        setRightScrollEnabled(!!isAtEndOfRight);
        setLeftScrollEnabled(scrollableTableRef.current?.scrollLeft > 0);
      }
    };

    scrollableTableRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      scrollableTableRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [tableDataList]);

  const checkTableInViewport = () => {
    if (scrollableTableRef.current) {
      const rect = scrollableTableRef?.current?.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.bottom <=
          (window.innerHeight || document?.documentElement?.clientHeight)
      );
    }
  };
  const isInViewPort = checkTableInViewport();
  useEffect(() => {
    let count = 0;
    const isShowedScroll = sessionStorage.getItem("showedScroll") || false;
    const scrollTable = () => {
      count = count + 1;
      if (scrollableTableRef.current) {
        scrollableTableRef.current.style.transition =
          "transform 1.2s ease-in-out";
        scrollableTableRef.current.style.transform = `translateX(-${200}px)`;
      }
      setTimeout(() => {
        if (scrollableTableRef.current) {
          scrollableTableRef.current.style.transition =
            "transform 1.2s ease-in-out";
          scrollableTableRef.current.style.transform = "translateX(0)";
        }
      }, 800);
    };
    if (!isShowedScroll && verticalScrollEnabled) {
      scrollTable();
      sessionStorage.setItem("showedScroll", "1");
    }
  }, [isInViewPort]);

  const plansNavigation = (flag: string) => {
    if (validAccessPass) {
      activateFreeTrial();
    } else {
      objTracking.obj.item_category3 = flag;
      objTracking.cdp["cta_text"] = "Upgrade to Prime";
      redirectToPlanPage(objTracking);
    }
  };

  const prevTableDataList = prevTableDataListRef.current;

  return (
    <div
      id="scrollableTable"
      className={styles.scrollableTable}
      ref={scrollableTableRef}
    >
      <table className={styles.marketsCustomTable}>
        <thead
          style={{
            transition: "transform 0.1s ease 0s",
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
                    title={
                      !!thead.toolTipHover
                        ? thead.toolTipHover
                        : !!thead.displayNameHover
                          ? thead.displayNameHover
                          : thead.keyText
                    }
                    className={`${
                      isSorting &&
                      thead.valueType != "date" &&
                      thead.valueType != "lineGraph" &&
                      thead.valueType != "sparklineGraph" &&
                      thead.valueType != "lineGraph7dVolume" &&
                      (!thead.primeFlag || (isPrime && thead.primeFlag))
                        ? styles.enableSort
                        : thead.valueType != "number" ||
                            (thead.valueType == "number" &&
                              !isPrime &&
                              thead.primeFlag)
                          ? styles.center
                          : ""
                    } ${isPrime && thead.primeFlag ? styles.primeCell : thead.valueType == "date" || thead.valueType == "text" ? styles.left : ""}`}
                    onClick={() => {
                      isSorting &&
                      thead.valueType != "date" &&
                      thead.valueType != "lineGraph" &&
                      thead.valueType != "sparklineGraph" &&
                      thead.valueType != "lineGraph7dVolume" &&
                      (!thead.primeFlag || (isPrime && thead.primeFlag))
                        ? handleSort(thead.keyId)
                        : null;
                    }}
                    key={index}
                  >
                    <div className={styles.thead}>
                      <div className={styles.theading}>
                        {isPrime && thead.primeFlag ? (
                          <span className={styles.primeIcon}>
                            <span className="eticon_prime_logo">
                              {renderIconPaths("eticon_prime_logo")}
                            </span>
                          </span>
                        ) : null}
                        {thead.keyText}
                      </div>
                      {isSorting &&
                        thead.valueType != "date" &&
                        thead.valueType != "lineGraph" &&
                        thead.valueType != "sparklineGraph" &&
                        thead.valueType != "lineGraph7dVolume" &&
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
            <th
              className={`${styles.fullWidth} ${!!parentHasScroll ? styles.hide : ""}`}
            ></th>
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
              <td
                className={`${styles.fullWidth} ${!!parentHasScroll ? styles.hide : ""}`}
              ></td>
            </tr>
          )}
        </thead>
        {tableDataList.length > 0 ? (
          <tbody>
            {tableDataList.map((item: any, index: number) => (
              <tr
                key={index}
                onMouseEnter={() => onRowHover(index, true)}
                onMouseLeave={() => onRowHover(index, false)}
              >
                {item.data.map(
                  (tdData: any, tdIndex: number) =>
                    tdIndex >= fixedCol && (
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
                        title={tdData.valueType == "text" ? tdData.value : null}
                      >
                        {!isPrime && tdData.primeFlag ? (
                          <span onClick={() => plansNavigation(tdData.keyText)}>
                            {validAccessPass
                              ? "Start 15 Days Trial"
                              : "Upgrade to Prime"}
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
                                  <div className="dflex align-item-center space-between overH">
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
                                <div className="dflex align-item-center overH">
                                  <img
                                    src={`${tdData.value}&width=115&height=35`}
                                    width={115}
                                    height={35}
                                    loading="lazy"
                                    alt={`${item.assetName} Intraday Chart`}
                                    title={`${item.assetName} Intraday Chart`}
                                  />
                                </div>
                              )
                            ) : tdData.keyId == "lastTradedPrice" ? (
                              <span
                                data-ltp={tdData.assetSymbol}
                                className={`highlightBg ${
                                  !!highlightLtp &&
                                  prevTableDataList[index]?.data[tdIndex]
                                    ?.filterFormatValue
                                    ? parseFloat(tdData.filterFormatValue) >
                                      parseFloat(
                                        prevTableDataList[index]?.data[tdIndex]
                                          ?.filterFormatValue,
                                      )
                                      ? "upBg"
                                      : parseFloat(tdData.filterFormatValue) <
                                          parseFloat(
                                            prevTableDataList[index]?.data[
                                              tdIndex
                                            ]?.filterFormatValue,
                                          )
                                        ? "downBg"
                                        : ""
                                    : ""
                                } ${styles.ltp}`}
                              >
                                {!!tdData.value ? tdData.value : "-"}
                              </span>
                            ) : tdData.valueType == "number" ? (
                              (!!tdData.value &&
                                parseFloat(tdData.filterFormatValue) != 0) ||
                              tdData.keyId == "netChange" ||
                              tdData.keyId == "percentChange" ? (
                                tdData.value.replaceAll(" ", "")
                              ) : (
                                "-"
                              )
                            ) : tdData.keyId == "volume7D" ? (
                              <Table7DGraph data={tdData?.value || ""} />
                            ) : !!tdData.value ? (
                              tdData.value
                            ) : (
                              "-"
                            )}
                            {tdData.trend &&
                              tdData.valueType == "number" &&
                              parseFloat(tdData.filterFormatValue) != 0 &&
                              (tdData.trend == "up" ||
                                tdData.trend == "down") && (
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
                  className={`${styles.fullWidth} ${!!parentHasScroll ? styles.hide : ""}`}
                ></td>
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  );
});
ScrollableTable.displayName = "ScrollableTable";
export default ScrollableTable;
