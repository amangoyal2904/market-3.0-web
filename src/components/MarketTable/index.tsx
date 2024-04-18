"use client";
import React, { useEffect, useState } from "react";
import styles from "./MarketTable.module.scss";
import FixedTable from "./FixedTable";
import ScrollableTable from "./ScrollableTable";
import Blocker from "../../components/Blocker";
import Loader from "../Loader";
import Pagination from "./Pagination";

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

const MarketTable = (props: propsType) => {
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
  const { loader = false, loaderType } = tableConfig || {};
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
  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    const inputType = e.target.dataset["type"];
    const textAlphanumericRegex = /^(?:[a-zA-Z0-9]+(?:\s|$))+$/;
    const numericExpressionRegex = /^[><]?=?\s*-?\d*\.?\d*$/;
    if (
      inputType == "number" &&
      (numericExpressionRegex.test(value) || value === "")
    ) {
      setFilters({ ...filters, [name]: value });
    } else if (
      inputType === "text" &&
      (textAlphanumericRegex.test(value) || value === "")
    ) {
      setFilters({ ...filters, [name]: value });
    } else if (value == "") {
      delete filters[name];
      setFilters({ ...filters });
    }
  };

  const sortHandler = (key: any) => {
    if (sortData.field === key) {
      setSortData({
        ...sortData,
        order: sortData.order === "ASC" ? "DESC" : "ASC",
      });
    } else {
      setSortData({ field: key, order: "DESC" });
    }

    tableConfig.serverSideSort
      ? handleSortServerSide(key)
      : _setSortData(sortData);
  };

  const filterTableData = (filterData: any) => {
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
  };

  const sortTableData = (tableData: any) => {
    const { field, order } = sortData;
    if (!!field) {
      tableData = tableData.sort((a: any, b: any) => {
        const inputType = tableData[0].data.find(
          (element: any) => element.keyId == field,
        ).valueType;

        let valueA = a.data.find((item: any) => {
          return item.keyId == field;
        }).filterFormatValue;
        let valueB = b.data.find((item: any) => {
          return item.keyId == field;
        }).filterFormatValue;

        if (inputType != "text") {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

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
  };

  const handleScroll = () => {
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
    setHideThead(heightDiff < 25);
    if (window.scrollY) {
      setHeaderSticky(window.scrollY);
    }
  };
  const scrollRightPos = () => {
    const leftScroll: any = document.getElementById("fixedTable");
    const rightScroll: any = document.getElementById("scrollableTable");
    const rightScrollPos = rightScroll?.scrollTop;
    leftScroll.scrollTop = rightScrollPos;
  };
  const scrollLeftPos = () => {
    const leftScroll: any = document.getElementById("fixedTable");
    const rightScroll: any = document.getElementById("scrollableTable");
    const leftScrollPos = leftScroll.scrollTop;
    rightScroll.scrollTop = leftScrollPos;
  };
  const removeCheckBoxHandleFun = (e: any, companyId: any, assetType: any) => {
    multipleStockCollect(e, companyId, assetType);
  };
  useEffect(() => {
    setFilters({});
    setSortData({ field: null, order: "DESC" });
    _setSortData({ field: null, order: "DESC" });
  }, [tabsViewIdUpdate]);

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
    const parent = document.querySelector("#scrollableTable");
    const theadElement = parent?.querySelector("thead > tr > th");
    const fixedTable = document.querySelector("#fixedTable");
    const hasScroll = parent ? parent.scrollWidth > parent.clientWidth : false;
    setParentHasScroll(hasScroll);

    if (theadElement) {
      const height = theadElement.getBoundingClientRect().height;
      const thElements = fixedTable?.querySelectorAll("th");
      thElements?.forEach((th) => {
        th.style.height = `${height}px`;
      });
    }
  }, [tableHeaderData, parentHasScroll]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }, []);

  useEffect(() => {
    if (!loaderOff && loader) {
      setShouldShowLoader(true);
    } else {
      setShouldShowLoader(false);
    }
  }, [loaderOff, loader]);

  return (
    <>
      <div className={styles.tableWrapper} id="table">
        {!!processingLoader && (
          <Loader
            loaderType={
              tableConfig.name === "watchList" ? "containerBg" : "container"
            }
          />
        )}
        {tableHeaderData.length > 0 && (
          <>
            <FixedTable
              highlightLtp={highlightLtp}
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
              parentHasScroll={parentHasScroll}
              fixedCol={fixedCol}
            />
            <ScrollableTable
              tableHeaderData={tableHeaderData}
              tableDataList={tableDataList}
              scrollRightPos={scrollRightPos}
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
            />
          </>
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
            onPageChange={handlePageChange}
          />
        )
      )}
      {shouldShowLoader && <Loader loaderType={loaderType} />}
    </>
  );
};
export default MarketTable;
