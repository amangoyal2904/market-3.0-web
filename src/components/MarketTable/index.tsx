import React, { useEffect, useState } from "react";
import styles from "./MarketTable.module.scss";
import FixedTable from "./FixedTable";
import ScrollableTable from "./ScrollableTable";
import Blocker from "../../components/Blocker";
import Loader from "../Loader";

interface propsType {
  data: any[];
  apiSuccess: boolean;
  tableHeaders: any[];
  tabsViewIdUpdate: any;
}

const MarketTable = (props: propsType) => {
  const {
    data,
    apiSuccess = false,
    tableHeaders = [],
    tabsViewIdUpdate,
  } = props || {};
  const [tableDataList, setTableDataList] = useState(data);
  const [tableHeaderData, setTableHeaderData] = useState<any>(tableHeaders);
  const [filters, setFilters] = useState<any>({});
  const [sortData, setSortData] = useState<any>({});
  const [headerSticky, setHeaderSticky] = useState(0);
  const [topScrollHeight, setTopScrollHeight] = useState(162);
  const [loaderOff, setLoaderOff] = useState(false);
  const [isPrime, setPrime] = useState(false);
  const [hideThead, setHideThead] = useState(false);

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    const inputType = e.target.dataset["type"];
    const textAlphanumericRegex = /^(?:[a-zA-Z0-9]+(?:\s|$))+$/;
    const numericExpressionRegex = /^[><]?=?\s*\d*\.?\d*$/;
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
    console.log({ filters });
  };

  const handleSort = (key: any) => {
    if (Object.keys(sortData).includes(key)) {
      if (sortData[key] == "asc") {
        delete sortData[key];
        setSortData({ ...sortData, [key]: "desc" });
      } else {
        delete sortData[key];
        setSortData({ ...sortData, [key]: "asc" });
      }
    } else {
      setSortData({ ...sortData, [key]: "desc" });
    }
  };

  const filterTableData = (filterData: any) => {
    if (Object.keys(filters).length) {
      Object.keys(filters).forEach((keyId) => {
        filterData = filterData.filter((item: any) => {
          const validExpression = /^[><=]?\d*\.?\d+$/;
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
              .match(/([><=]+)(\d*\.?\d+)/)
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
    if (Object.keys(sortData).length) {
      Object.keys(sortData).forEach((keyId) => {
        tableData = tableData.sort((a: any, b: any) => {
          const inputType = tableData[0].data.find(
            (element: any) => element.keyId == keyId,
          ).valueType;

          let valueA = a.data.find((item: any) => {
            return item.keyId == keyId;
          }).filterFormatValue;
          let valueB = b.data.find((item: any) => {
            return item.keyId == keyId;
          }).filterFormatValue;

          if (inputType != "text") {
            valueA = parseFloat(valueA);
            valueB = parseFloat(valueB);
          }

          if (sortData[keyId] === "asc") {
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
          } else if (sortData[keyId] === "desc") {
            if (valueA > valueB) return -1;
            if (valueA < valueB) return 1;
          }

          return 0; // elements are equal
        });
      });
    }
    return tableData;
  };

  const handleScroll = () => {
    const eleHeader: any = document.getElementById("header");
    const eleTable: any = document.getElementById("table");
    const heightDifference =
      eleTable.offsetTop - eleHeader.offsetTop - eleHeader.offsetHeight;
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

  useEffect(() => {
    setFilters({});
    setSortData({});
  }, [tabsViewIdUpdate]);

  useEffect(() => {
    if (data.length || apiSuccess) {
      const filteredData = filterTableData(data);
      const sortedData = sortTableData(filteredData);
      setTableDataList((tableDataList) => [...sortedData]);
      setTableHeaderData(tableHeaders);
      if (!loaderOff) setLoaderOff(true);
    }

    const isPrime =
      typeof window != "undefined" &&
      window.objUser &&
      window.objUser.permissions &&
      window.objUser.permissions.indexOf("subscribed") != -1;
    setPrime(isPrime);
  }, [apiSuccess, data, sortData, filters, loaderOff]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }, []);

  return (
    <>
      <div className={styles.tableWrapper} id="table">
        {!loaderOff ? (
          <Loader />
        ) : (
          tableHeaderData.length > 0 && (
            <>
              <FixedTable
                tableHeaderData={tableHeaderData}
                tableDataList={tableDataList}
                scrollLeftPos={scrollLeftPos}
                headerSticky={headerSticky}
                topScrollHeight={topScrollHeight}
                handleSort={handleSort}
                sortData={sortData}
                filters={filters}
                handleFilterChange={handleFilterChange}
                hideThead={hideThead}
              />
              <ScrollableTable
                tableHeaderData={tableHeaderData}
                tableDataList={tableDataList}
                scrollRightPos={scrollRightPos}
                headerSticky={headerSticky}
                topScrollHeight={topScrollHeight}
                handleSort={handleSort}
                sortData={sortData}
                filters={filters}
                handleFilterChange={handleFilterChange}
                isPrime={isPrime}
                hideThead={hideThead}
              />
            </>
          )
        )}
      </div>
      {tableDataList.length == 0 || tableHeaderData.length == 0 ? (
        <Blocker
          type={
            tableDataList.length == 0 && tableHeaderData.length == 0
              ? "noStocks"
              : "noDataFound"
          }
        />
      ) : (
        ""
      )}
    </>
  );
};
export default MarketTable;
