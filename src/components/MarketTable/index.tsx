"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MarketTable.module.scss";
import FixedTable from "./FixedTable";
import ScrollableTable from "./ScrollableTable";
import Blocker from "../../components/Blocker";
import Loader from "../Loader";
import Pagination from "./Pagination";
import useDebounce from "@/hooks/useDebounce";

interface propsType {
  data: any[];
  highlightLtp?: boolean;
  apiSuccess?: boolean;
  tableHeaders: any[];
  tabsViewIdUpdate?: any;
  showTableCheckBox?: boolean;
  multipleStockCollect?: any;
  loader?: boolean;
  tableConfig?: any;
  pageSummary?: any;
  handleSortServerSide?: any;
  handlePageChange?: any;
  updateTableHandler?: any;
  processingLoader?: boolean;
  fixedCol?: number;
  isprimeuser?: boolean;
}

const DEBOUNCE_DELAY = 10;

const tableHeadersTooltipText = {
  sr_avgScore: `The Stock Reports Plus Average Score combines a quantitative analysis of five widely-used investment decision making tools - Earnings, Fundamentals, Relative Valuation, Risk, and Momentum. Score 10 means: Most Favorable | 4-7: Neutral | 1-3: Negative`,
  sr_targetVsCurrent: `The Stock Reports Plus Average Score combines a quantitative analysis of five widely-used investment decision making tools - Earnings, Fundamentals, Relative Valuation, Risk, and Momentum. Score 10 means: Most Favorable | 4-7: Neutral | 1-3: Negative`,
  sr_analystScore: `The Earnings Rating is based on a combination of three factors: earnings surprises, estimate revisions and recommendation changes (The number of broker upgrades and downgrades in last 120 days). Score 10 means: Most Favorable | 4-7: Neutral | 1-3: Negative`,
  sr_fundScore: `The Fundamental Rating is based on a combination of four fundamental component factors: Profitability, debt, earnings quality and dividend. Score 10 means: Most Favorable | 4-7: Neutral | 1-3: Negative`,
  sr_techScore: `The Price Momentum Rating is based on a combination of two technical performance factors: relative strength and seasonality (the average return or price performance). Score 10 means: Most Favorable | 4-7: Neutral | 1-3: Negative`,
  sr_rvScore: `The Relative Valuation Rating is based on a combination of three component factors: Price to Sales, Trailing P/E and Forward P/E. Score 10 means: Most Favorable | 4-7: Neutral | 1-3: Negative`,
  sr_riskScore: `The Risk Rating displays stocks on a scale of 1 to 10 with 10 being awarded to the least risky stocks. It is dervied by looking at a series of long-term (5-year) and short-term (90-day) stock performance measures including volatility, magnitude of returns, beta and correlation.`,
};

const MarketTable = React.memo((props: propsType) => {
  const {
    data,
    highlightLtp = true,
    apiSuccess = true,
    tableHeaders = [],
    tabsViewIdUpdate,
    showTableCheckBox = false,
    multipleStockCollect,
    tableConfig = {},
    pageSummary = {},
    handleSortServerSide,
    handlePageChange,
    updateTableHandler,
    processingLoader,
    fixedCol = 3,
    isprimeuser = false,
  } = props || {};

  const objTracking = {
    category: "Subscription Flow ET",
    action: "SYFT | Flow Started",
    label: location.pathname,
    obj: {
      item_name: "gainers",
      item_brand: "market_tools",
      item_category: "l3 - l4",
      item_category2: "gainers",
      item_category3: "field name",
      item_category4: "upgrade to prime",
      feature_name: "marketstats",
      site_section: "l1",
      site_sub_section: "l1/l2/l2",
    },
  };

  const tableRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const fixedTableRef = useRef<HTMLDivElement>(null);
  const customScroll = useRef<HTMLDivElement>(null);
  const { debounce } = useDebounce();
  const {
    loader = false,
    loaderType,
    horizontalScroll,
    isWidget = false,
  } = tableConfig || {};
  const [pageSummaryData, setPageSummaryData] = useState(pageSummary);
  const [tableDataList, setTableDataList] = useState(data);
  const [tableHeaderData, setTableHeaderData] = useState<any>(tableHeaders);
  const [filters, setFilters] = useState<any>({});
  const [sortData, setSortData] = useState({ field: null, order: "DESC" });
  const [_sortData, _setSortData] = useState({ field: null, order: "DESC" });
  const [headerSticky, setHeaderSticky] = useState(0);
  const [topScrollHeight, setTopScrollHeight] = useState(162);
  const [loaderOff, setLoaderOff] = useState(false);
  const [hideThead, setHideThead] = useState(false);
  const [parentHasScroll, setParentHasScroll] = useState(false);
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const [verticalScrollEnabled, setVerticalScrollEnabled] = useState(false);
  const [scrollableTableRef, setScrollableTableRef] = useState({});

  const handleFilterChange = useCallback((e: any) => {
    const { name, value } = e.target;
    const inputType = e.target.dataset["type"];
    const textAlphanumericRegex = /^(?:[a-zA-Z0-9]+(?:\s|$))+$/;
    const numericExpressionRegex = /^[><]?=?\s*-?\d*\.?\d*$/;

    setFilters((prevFilters: any) => {
      let updatedFilters = { ...prevFilters };

      if (inputType == "number" && numericExpressionRegex.test(value)) {
        updatedFilters[name] = value;
      } else if (inputType === "text" && textAlphanumericRegex.test(value)) {
        updatedFilters[name] = value;
      } else if (value == "") {
        delete updatedFilters[name];
      }

      return updatedFilters;
    });
  }, []);

  const sortHandler = useCallback((key: any) => {
    setSortData((prevSortData) => {
      const newOrder =
        prevSortData.field === key
          ? prevSortData.order === "ASC"
            ? "DESC"
            : "ASC"
          : "DESC";
      return { field: key, order: newOrder };
    });
  }, []);

  const filterTableData = useCallback(
    (filterData: any) => {
      if (Object.keys(filters).length) {
        Object.keys(filters).forEach((keyId) => {
          filterData = filterData.filter((item: any) => {
            const validExpression = /^[><=]-?\d*\.?\d+$/;
            const cellValue = filters[keyId];
            const inputType = item.data.find(
              (element: any) => element.keyId == keyId,
            ).valueType;
            if (inputType == "text") {
              return (
                item &&
                item.data.some(
                  (x: { keyId: string; filterFormatValue: string }) =>
                    x.keyId == keyId &&
                    x.filterFormatValue
                      .toLowerCase()
                      .includes(cellValue.toLowerCase()),
                )
              );
            } else if (validExpression.test(cellValue.replaceAll(" ", ""))) {
              const [operator, comparisonValue] = cellValue
                .replaceAll(" ", "")
                .match(/([><=]+)(-?\d*\.?\d+)/)
                .slice(1);
              switch (operator) {
                case ">":
                  return (
                    item &&
                    item.data.some(
                      (x: { keyId: string; filterFormatValue: any }) =>
                        x.keyId == keyId &&
                        parseFloat(x.filterFormatValue) >
                          parseFloat(comparisonValue),
                    )
                  );
                case "<":
                  return (
                    item &&
                    item.data.some(
                      (x: { keyId: string; filterFormatValue: any }) =>
                        x.keyId == keyId &&
                        parseFloat(x.filterFormatValue) <
                          parseFloat(comparisonValue),
                    )
                  );
                case "=":
                  return (
                    item &&
                    item.data.some(
                      (x: { keyId: string; filterFormatValue: any }) =>
                        x.keyId == keyId &&
                        parseFloat(x.filterFormatValue) ==
                          parseFloat(comparisonValue),
                    )
                  );
                default:
                  return true;
              }
            }
            return true;
          });
        });
      }
      return filterData;
    },
    [filters],
  );

  const sortTableData = useCallback(
    (tableData: any) => {
      const { field, order } = sortData;
      if (!!field && field != null) {
        tableData = tableData.sort((a: any, b: any) => {
          const inputType = tableData[0].data.find(
            (element: any) => element.keyId === field,
          ).valueType;

          let valueA = a.data.find(
            (item: any) => item.keyId === field,
          ).filterFormatValue;
          let valueB = b.data.find(
            (item: any) => item.keyId === field,
          ).filterFormatValue;

          // Convert empty strings to appropriate values for numeric comparison
          if (inputType !== "text") {
            if (valueA === "")
              valueA =
                order === "ASC"
                  ? Number.POSITIVE_INFINITY
                  : Number.NEGATIVE_INFINITY;
            if (valueB === "")
              valueB =
                order === "ASC"
                  ? Number.POSITIVE_INFINITY
                  : Number.NEGATIVE_INFINITY;
            valueA = parseFloat(valueA);
            valueB = parseFloat(valueB);
          }

          // Handle sorting order
          if (order === "ASC") {
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
          } else if (order === "DESC") {
            if (valueA > valueB) return -1;
            if (valueA < valueB) return 1;
          }

          return 0; // elements are equal
        });
      }
      return tableData;
    },
    [sortData],
  );
  const rightClickScroll = () => {
    const tableWrapper: any = scrollableTableRef;
    if (
      tableWrapper.scrollLeft <
      tableWrapper.scrollWidth - tableWrapper.clientWidth
    ) {
      tableWrapper.scrollLeft += 50; // Adjust scroll amount as needed
    }
  };
  const leftClickScroll = () => {
    const tableWrapper: any = scrollableTableRef;
    if (tableWrapper.scrollLeft > 0) {
      tableWrapper.scrollLeft -= 50; // Adjust scroll amount as needed
    }
  };

  const handleScroll = useCallback(
    debounce(() => {
      const eleHeader: any = document.getElementById("header");
      const eleTable: any = document.getElementById("table");
      const heightDifference =
        eleTable?.offsetTop - eleHeader?.offsetTop - eleHeader?.offsetHeight;
      const theadBottom: any = document
        .getElementById("thead")
        ?.getBoundingClientRect().bottom;
      const tableBottom: any = document
        .getElementById("table")
        ?.getBoundingClientRect().bottom;
      const heightDiff = tableBottom - theadBottom;

      setTopScrollHeight(heightDifference);
      setHideThead(heightDiff < 25 && heightDiff < -140);
      setHeaderSticky(window.scrollY);
      if (customScroll.current) {
        if (window.scrollY < 100 || (heightDiff < 180 && !isWidget)) {
          customScroll.current.style.display = "none";
        } else if (window.scrollY > 100 || isWidget) {
          customScroll.current.style.display = "flex";
        }
      }
    }, DEBOUNCE_DELAY),
    [debounce],
  );

  const scrollRightPos = () => {
    const leftScroll: any = fixedTableRef.current;
    const rightScroll: any = parentRef.current;
    const rightScrollPos = rightScroll?.scrollTop;
    leftScroll.scrollTop = rightScrollPos;
  };

  const scrollLeftPos = () => {
    const leftScroll: any = fixedTableRef.current;
    const rightScroll: any = parentRef.current;
    const leftScrollPos = leftScroll.scrollTop;
    rightScroll.scrollTop = leftScrollPos;
  };

  const removeCheckBoxHandleFun = (e: any, companyId: any, assetType: any) => {
    multipleStockCollect(e, companyId, assetType);
  };

  const onPageChange = (pageNumber: any) => {
    if (props.handlePageChange) {
      props.handlePageChange(pageNumber);
    }

    if (tableRef.current) {
      const tableRect = tableRef.current.getBoundingClientRect();
      const targetPosition = tableRect.top + window.pageYOffset - 250;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };

  useEffect(() => {
    setFilters({});
    setSortData({ field: null, order: "DESC" });
    _setSortData({ field: null, order: "DESC" });
  }, [tabsViewIdUpdate]);

  useEffect(() => {
    if (tableConfig.serverSideSort && !!sortData.field) {
      handleSortServerSide(sortData.field);
    } else {
      _setSortData(sortData);
    }
  }, [sortData.field, sortData.order]);

  useEffect(() => {
    if (data?.length || apiSuccess) {
      const filteredData = filterTableData(data);
      const sortedData = sortTableData(filteredData);
      setTableDataList((tableDataList) => [...sortedData]);
      setTableHeaderData(tableHeaders);
      setPageSummaryData(pageSummary);
      if (!loaderOff) setLoaderOff(true);
    } else if (data?.length === 0) {
      setTableDataList([]);
      setTableHeaderData([]);
      setPageSummaryData({});
      setHeaderSticky(0);
      if (!loaderOff) setLoaderOff(true);
    }
  }, [apiSuccess, data, _sortData, filters, loaderOff]);

  useEffect(() => {
    const parent = parentRef.current;
    const fixedTable = fixedTableRef.current;

    if (!parent || !fixedTable) return;

    const theadElement = parent.querySelector("thead > tr > th");
    const fixedTheadElement = fixedTable.querySelector("thead > tr > th");

    if (!theadElement || !fixedTheadElement) return;

    // Reset the height of th elements to auto
    parent.querySelectorAll("th").forEach((th) => {
      th.style.height = "54px";
    });

    fixedTable.querySelectorAll("th").forEach((th) => {
      th.style.height = "54px";
    });

    const height_1 = theadElement.getBoundingClientRect().height;
    const height_2 = fixedTheadElement.getBoundingClientRect().height;

    const hasScroll = parent.scrollWidth > parent.clientWidth;
    const thElementsParent = parent.querySelectorAll("th");
    const thElementsFixed = fixedTable.querySelectorAll("th");

    thElementsParent.forEach((th) => {
      th.style.height = `${Math.max(height_1, height_2)}px`;
    });

    thElementsFixed.forEach((th) => {
      th.style.height = `${Math.max(height_1, height_2)}px`;
    });

    setParentHasScroll(hasScroll);
  }, [tableHeaderData, parentHasScroll]);

  useEffect(() => {
    // Add and remove scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (!loaderOff && loader) {
      setShouldShowLoader(true);
    } else {
      setShouldShowLoader(false);
    }
  }, [loaderOff, loader]);

  return (
    <>
      <div className={styles.tableWrapper} id="table" ref={tableRef}>
        {!!processingLoader && (
          <Loader
            loaderType={
              tableConfig.name === "watchList" ? "containerBg" : "container"
            }
          />
        )}
        {tableHeaderData.length > 0 && (
          <>
            <div
              className={`fixedTable ${styles.fixedWrapper} ${verticalScrollEnabled ? styles.withShadow : ""}`}
              onScroll={scrollLeftPos}
              ref={fixedTableRef}
            >
              <FixedTable
                highlightLtp={highlightLtp}
                tableHeadersTooltipText={tableHeadersTooltipText}
                tableHeaderData={tableHeaderData}
                tableDataList={tableDataList}
                scrollLeftPos={scrollLeftPos}
                headerSticky={headerSticky}
                topScrollHeight={topScrollHeight}
                handleSort={sortHandler}
                sortData={sortData}
                filters={filters}
                handleFilterChange={handleFilterChange}
                isPrime={isprimeuser}
                hideThead={hideThead}
                showRemoveCheckbox={showTableCheckBox}
                removeCheckBoxHandle={removeCheckBoxHandleFun}
                tableConfig={tableConfig}
                fixedCol={fixedCol}
                objTracking={objTracking}
              />
            </div>
            <div
              className={`${styles.scrollableWrapper}`}
              onScroll={scrollRightPos}
              ref={parentRef}
            >
              <ScrollableTable
                highlightLtp={highlightLtp}
                tableHeadersTooltipText={tableHeadersTooltipText}
                tableHeaderData={tableHeaderData}
                tableDataList={tableDataList}
                headerSticky={headerSticky}
                topScrollHeight={topScrollHeight}
                handleSort={sortHandler}
                sortData={sortData}
                filters={filters}
                handleFilterChange={handleFilterChange}
                isPrime={isprimeuser}
                hideThead={hideThead}
                tableConfig={tableConfig}
                parentHasScroll={parentHasScroll}
                fixedCol={fixedCol}
                setVerticalScrollEnabled={setVerticalScrollEnabled}
                verticalScrollEnabled={verticalScrollEnabled}
                setScrollableTableRef={setScrollableTableRef}
                objTracking={objTracking}
              />
            </div>
          </>
        )}
        {verticalScrollEnabled && horizontalScroll ? (
          <div
            id="customScroll"
            ref={customScroll}
            className={`${styles.horizontalCustomScroll} ${isWidget ? styles.widgetCustomScroll : styles.customScroll}`}
          >
            <button
              id="scrollButton"
              onClick={leftClickScroll}
              className={styles.scrollButton}
            >
              &#8592;
            </button>
            <span />
            <button
              id="scrollButton"
              onClick={rightClickScroll}
              className={styles.scrollButton}
            >
              &#8594;
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      {(tableDataList.length === 0 && tableHeaderData.length === 0) ||
      (tableDataList.length === 0 && tableHeaderData.length !== 0) ? (
        <div className="prel">
          {processingLoader && (
            <Loader
              loaderType={
                tableConfig.name === "watchList" ? "containerBg" : "container"
              }
            />
          )}
          {apiSuccess && (
            <Blocker
              type={
                tableConfig.name === "watchList" && tableHeaderData.length === 0
                  ? "noStocks"
                  : "noDataFound"
              }
              updateTableHandler={updateTableHandler}
            />
          )}
        </div>
      ) : (
        pageSummaryData &&
        pageSummaryData.totalpages > 1 && (
          <Pagination
            pageSummary={pageSummaryData}
            onPageChange={onPageChange}
          />
        )
      )}
      {shouldShowLoader && <Loader loaderType={loaderType} />}
    </>
  );
});
MarketTable.displayName = "MarketTable";
export default MarketTable;
