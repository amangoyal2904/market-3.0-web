"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MarketTable.module.scss";
import FixedTable from "./FixedTable";
import ScrollableTable from "./ScrollableTable";
import Blocker from "../../components/Blocker";
import Loader from "../Loader";
import Pagination from "./Pagination";
import useDebounce from "@/hooks/useDebounce";
import { formatNumber, requestIdleOrTimeout } from "@/utils";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils/index";
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
  l1NavTracking?: any;
  l2NavTracking?: any;
  l3NavTracking?: any;
  setUpdateDateTime?: any;
  setFallbackWebsocket?: any;
  socketDataType?: any;
  customMessage?: any;
  noSharePriceTitle?: string;
}

const DEBOUNCE_DELAY = 10;

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
    l1NavTracking = "",
    l2NavTracking = "",
    l3NavTracking = "",
    setUpdateDateTime,
    setFallbackWebsocket = false,
    socketDataType = "",
    customMessage = "",
    noSharePriceTitle = "yes",
  } = props || {};

  const wsRef = useRef<WebSocket | null>(null);
  const buffer = useRef<any[]>([]);
  const BUFFER_UPDATE_INTERVAL = 1500;
  const objTracking = {
    category: "Subscription Flow ET",
    action: "SYFT | Flow Started",
    label: "Upgrade to prime click_",
    obj: {
      item_name: !!l3NavTracking ? l3NavTracking : l2NavTracking,
      item_brand: "market_tools",
      item_category: !!l3NavTracking
        ? `${l2NavTracking} - ${l3NavTracking}`
        : l2NavTracking,
      item_category2: !!l3NavTracking ? l3NavTracking : l2NavTracking,
      item_category3: "field name unknown",
      item_category4: "upgrade to prime",
      feature_name: "marketstats",
      site_section: l1NavTracking,
      site_sub_section: !!l3NavTracking
        ? `${l1NavTracking} / ${l2NavTracking} / ${l3NavTracking}`
        : `${l1NavTracking} / ${l2NavTracking}`,
    },
    cdp: {
      event_nature: "click",
      event_category: "subscription",
      event_name: "paywall",
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

  const [websocketFailed, setWebsocketFailed] = useState(false);
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
  const [rightScrollEnabled, setRightScrollEnabled] = useState(false);
  const [leftScrollEnabled, setLeftScrollEnabled] = useState(true);

  const onRowHover = (rowIndex: number, isHovering: boolean) => {
    const fixedTable = fixedTableRef.current;
    const scrollableTable = parentRef.current;

    if (fixedTable && scrollableTable) {
      const fixedTableRow = fixedTable.querySelectorAll("tbody tr")[rowIndex];
      const scrollableTableRow =
        scrollableTable.querySelectorAll("tbody tr")[rowIndex];

      if (isHovering) {
        fixedTableRow.classList.add(styles.highlightedRow);
        scrollableTableRow.classList.add(styles.highlightedRow);
      } else {
        fixedTableRow.classList.remove(styles.highlightedRow);
        scrollableTableRow.classList.remove(styles.highlightedRow);
      }
    }
  };

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
        if (
          (window.scrollY < 10 && window.screen.width < 1950) ||
          (heightDiff < 180 && !isWidget)
        ) {
          customScroll.current.style.display = "none";
        } else if (
          window.scrollY > 0 ||
          isWidget ||
          window.screen.width > 1950
        ) {
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
    if (!!handlePageChange) {
      handlePageChange(pageNumber);
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
    } else if (data?.length == 0) {
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

  useEffect(() => {
    if (!highlightLtp) return;

    const getMappedData = (data: any[], key: string) =>
      data.map((item) => item[key]?.toUpperCase());

    const companies = data?.length
      ? getMappedData(
          data,
          l2NavTracking === "Indices" && l3NavTracking === "nse"
            ? "assetName"
            : "assetSymbol",
        )
      : [];

    if (!companies.length) return;

    const requestBody = {
      action: "subscribe",
      symbols: socketDataType === "stock" ? companies : [],
      indices: socketDataType === "index" ? companies : [],
    };

    const unsubscribeRequestBody = {
      action: "unsubscribe",
      symbols: socketDataType === "stock" ? companies : [],
      indices: socketDataType === "index" ? companies : [],
    };

    const initializeWebSocket = () => {
      if (document.hidden) {
        // If the document is hidden, don't initialize the WebSocket
        return;
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(requestBody));
        setWebsocketFailed(false); // Reset fallback state
        return;
      }

      if (
        wsRef.current &&
        (wsRef.current.readyState === WebSocket.CONNECTING ||
          wsRef.current.readyState === WebSocket.CLOSING)
      ) {
        return;
      }

      const websocketUrl = (APIS_CONFIG as any)?.WEBSOCKET_ENDPOINT[APP_ENV];

      // Check if the app is running on localhost
      const protocol =
        window.location.hostname === "localhost" ? "ws://" : "wss://";

      // Append the correct protocol
      wsRef.current = new WebSocket(`${protocol}${websocketUrl}`);

      wsRef.current.onopen = () => {
        console.log("WebSocket connection opened");
        wsRef.current?.send(JSON.stringify(requestBody));
        setWebsocketFailed(false); // Reset fallback state
      };

      wsRef.current.onmessage = (event) => {
        const { stocks, indices, time } = JSON.parse(event.data);
        if (stocks) buffer.current.push(...stocks);
        if (indices) buffer.current.push(...indices);
        if (setUpdateDateTime && !isNaN(new Date(time).getTime()))
          setUpdateDateTime(new Date(time).getTime());
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket connection closed");
        wsRef.current = null;
        setWebsocketFailed(true); // Set fallback state
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error", error);
        setWebsocketFailed(true); // Set fallback state
      };
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify(unsubscribeRequestBody));
        }
      } else {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify(requestBody));
        } else if (!wsRef.current) {
          requestIdleOrTimeout(initializeWebSocket);
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify(requestBody));
            } else if (!wsRef.current) {
              requestIdleOrTimeout(initializeWebSocket);
            }
          } else {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify(unsubscribeRequestBody));
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initialize WebSocket if the table is in view and document is visible
    if (!document.hidden && tableRef.current) {
      requestIdleOrTimeout(initializeWebSocket);
    }

    const intervalId = setInterval(() => {
      if (buffer.current.length > 0) {
        setTableDataList((prevTableDataList) => {
          const updatedTableData = [...prevTableDataList];

          buffer.current.forEach((stock) => {
            updatedTableData.forEach((asset, index) => {
              if (
                asset.assetSymbol === stock.scripCode ||
                asset.assetSymbol === stock.symbol ||
                asset.assetId === stock.indexId
              ) {
                const updatedData = asset.data.map((data: any) => {
                  switch (data.keyId) {
                    case "lastTradedPrice":
                      return {
                        ...data,
                        value: formatNumber(
                          stock?.lastTradedPrice || stock?.currentIndexValue,
                        ),
                        filterFormatValue:
                          stock?.lastTradedPrice?.toString() ||
                          stock?.currentIndexValue?.toString(),
                        trend: "", // Trend logic not applicable for lastTradedPrice according to the requirement
                      };
                    case "percentChange":
                      let percentChangeValue = stock?.percentChange || 0;
                      let percentChangeTrend =
                        percentChangeValue == 0
                          ? "neutral"
                          : percentChangeValue > 0
                            ? "up"
                            : "down";
                      return {
                        ...data,
                        value: `${stock?.percentChange} %`,
                        filterFormatValue: stock?.percentChange?.toString(),
                        trend: percentChangeTrend,
                      };
                    case "netChange":
                      let netChangeValue = stock?.netChange || 0;
                      let netChangeTrend =
                        netChangeValue == 0
                          ? "neutral"
                          : netChangeValue > 0
                            ? "up"
                            : "down";
                      return {
                        ...data,
                        value: `${stock?.netChange}`,
                        filterFormatValue: stock?.netChange?.toString(),
                        trend: netChangeTrend,
                      };
                    default:
                      return data;
                  }
                });
                updatedTableData[index] = { ...asset, data: updatedData };
              }
            });
          });

          buffer.current = []; // Clear the buffer
          return updatedTableData;
        });
      }
    }, BUFFER_UPDATE_INTERVAL);

    let idleCallbackId: any;

    const idleInitializer = () => {
      idleCallbackId = requestIdleOrTimeout(initializeWebSocket);
    };

    // Schedule idle initializer
    idleInitializer();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      clearInterval(intervalId); // Clear the interval on cleanup
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (tableRef.current) {
        observer.unobserve(tableRef.current);
      }
      if (idleCallbackId) {
        cancelIdleCallback(idleCallbackId);
      }
    };
  }, [data, highlightLtp, l2NavTracking, l3NavTracking]);

  useEffect(() => {
    setFallbackWebsocket(websocketFailed);
  }, [websocketFailed]);

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
                showRemoveCheckbox={showTableCheckBox}
                removeCheckBoxHandle={removeCheckBoxHandleFun}
                tableConfig={tableConfig}
                fixedCol={fixedCol}
                objTracking={objTracking}
                onRowHover={onRowHover}
                noSharePriceTitle={noSharePriceTitle}
              />
            </div>
            <div
              className={`${styles.scrollableWrapper}`}
              onScroll={scrollRightPos}
              ref={parentRef}
            >
              <ScrollableTable
                highlightLtp={highlightLtp}
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
                setLeftScrollEnabled={setLeftScrollEnabled}
                setRightScrollEnabled={setRightScrollEnabled}
                onRowHover={onRowHover}
                noSharePriceTitle={noSharePriceTitle}
              />
            </div>
          </>
        )}
        {verticalScrollEnabled && horizontalScroll ? (
          <div
            id="customScroll"
            ref={customScroll}
            className={`${styles.horizontalCustomScroll} 
            ${isWidget ? styles.widgetCustomScroll : styles.customScroll}
            ${tableDataList.length == 1 ? styles.singleRowDesign : ""}`}
          >
            <button
              id="scrollButton_l"
              onClick={leftClickScroll}
              className={`${styles.scrollButton} ${!leftScrollEnabled ? styles.disableBtn : ""}`}
            >
              &#8592;
            </button>
            <span />
            <button
              id="scrollButton_r"
              onClick={rightClickScroll}
              className={`${styles.scrollButton} ${!!rightScrollEnabled ? styles.disableBtn : ""}`}
            >
              &#8594;
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      {(tableDataList.length == 0 && tableHeaderData.length == 0) ||
      (tableDataList.length == 0 && tableHeaderData.length != 0) ? (
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
                (tableConfig.name === "watchListWidget" ||
                  tableConfig.name === "watchList") &&
                tableHeaderData.length == 0
                  ? "noStocks"
                  : "noDataFound"
              }
              customMessage={customMessage}
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
