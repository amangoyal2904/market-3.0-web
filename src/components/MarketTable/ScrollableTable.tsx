import React, { useEffect, useRef } from "react";
import styles from "./MarketTable.module.scss";
import { dateFormat } from "@/utils";
import { goToPlansPage } from "@/utils/ga";
import Image from "next/image";

const ScrollableTable = React.memo((props: any) => {
  const {
    highlightLtp,
    tableHeadersTooltipText,
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
  } = props || {};
  const {
    showFilterInput = true,
    isSorting = true,
    isHeaderSticky = true,
  } = tableConfig || {};
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
    }

    return () => clearTimeout(timer);
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
          "transform 1s ease-in-out";
        // scrollableTableRef.current.scrollLeft = scrollableTableRef.current.scrollWidth;
        scrollableTableRef.current.style.transform = `translateX(-${200}px)`;
      }
      setTimeout(() => {
        if (scrollableTableRef.current) {
          scrollableTableRef.current.style.transition =
            "transform 1s ease-in-out";
          // scrollableTableRef.current.scrollLeft = 0;
          scrollableTableRef.current.style.transform = "translateX(0)";
        }
      }, 1000);
    };
    if (!isShowedScroll && verticalScrollEnabled) {
      scrollTable();
    }
    const intervalId = setInterval(() => {
      if (count < 2 && !isShowedScroll) {
        verticalScrollEnabled && scrollTable();
      } else {
        clearInterval(intervalId);
        sessionStorage.setItem("showedScroll", "1");
      }
    }, 2000);
    return () => clearInterval(intervalId);
  }, [isInViewPort]);

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
                      !!tableHeadersTooltipText[thead.keyId]
                        ? tableHeadersTooltipText[thead.keyId]
                        : thead.keyText
                    }
                    className={`${
                      isSorting &&
                      thead.valueType != "date" &&
                      thead.valueType != "lineGraph" &&
                      thead.valueType != "sparklineGraph" &&
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
              <tr key={index}>
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
                          <span onClick={goToPlansPage}>Upgrade to Prime</span>
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
                                  src={`${tdData.value}&width=140&height=35`}
                                  width={140}
                                  height={35}
                                  loading="lazy"
                                />
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
