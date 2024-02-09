import React, { useEffect, useState } from 'react';
import styles from './MarketTable.module.scss';
import FixedTable from './FixedTable';
import ScrollableTable from './ScrollableTable';
import Blocker from '../../components/Blocker';
import Loader from '../Loader';

interface propsType{
  data:any[];
  apiSuccess:boolean;
  tableHeaders:any[];
  onFilterChange:any;
}

const MarketTable = (props: propsType) => {
  const { data , apiSuccess = false, tableHeaders = [], onFilterChange} = props || {};
  const [tableDataList, setTableDataList] = useState(data);
  const [tableHeaderData, setTableHeaderData] = useState<any>(tableHeaders);
  const [filters, setFilters] = useState<any>({});
  const [sortData, setSortData] = useState<any>({});
  const [headerSticky, setHeaderSticky] = useState(0);
  const [topScrollHeight, setTopScrollHeight] = useState(162);
  const [loaderOff, setLoaderOff] = useState(false);
  const [isPrime, setPrime] = useState(false);
  const [hideThead, setHideThead] = useState(false);
  function checkIfValidExpression(value: string) {
    return /^[<>=]\d+$/.test(value);
  }

  function handleFilterChange(e: any) {
    const { name, value } = e.target;
    if (name != "name" && checkIfValidExpression(value.replaceAll(" ", ""))) {
      setFilters({ ...filters, [name]: value.replaceAll(" ", "") });
    } else if (name === "name") {
      setFilters({ ...filters, [name]: value });
    } else if (value == "") {
      delete filters[name];
      setFilters({ ...filters });
    }
  }

  function handleSort(key: any) {
    if (Object.keys(sortData).includes(key)) {
      if (sortData[key] == "asc") {
        setSortData({ ...sortData, [key]: "desc" });
      } else {
        setSortData({ ...sortData, [key]: "asc" });
      }
    } else {
      setSortData({ ...sortData, [key]: "desc" });
    }
  }

  function filterTableData() {
    let filterData = data;
    if (Object.keys(filters).length) {
      Object.keys(filters).forEach((keyId) => {
        filterData = filterData.filter((item: any) => {
          const cellValue = filters[keyId];
          if (keyId == "name") {
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
          } else {
            const [operator, comparisonValue] = cellValue
              .match(/([><=]+)(\d+)/)
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
        });
        if (!!filterData) {
          console.log("@@Filter Data: " + JSON.stringify(filterData));
          setTableDataList(filterData);
        }
      });
    } else {
      setTableDataList(data);
    }
  }

  function sortTableData() {
    let tableData = data;
    if (Object.keys(filters).length) {
      tableData = tableDataList;
    }
    if (Object.keys(sortData).length) {
      Object.keys(sortData).forEach((keyId) => {
        tableData = tableData.sort((a: any, b: any) => {
          let valueA = a.data.find((item: any) => {
            return item.keyId == keyId;
          }).filterFormatValue;
          let valueB = b.data.find((item: any) => {
            return item.keyId == keyId;
          }).filterFormatValue;

          if (keyId != "name") {
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
    if (!Object.keys(filters).length) {
      setTableDataList(tableData);
    }
  }

  useEffect(() => {
    if(data.length || apiSuccess){
      setTableDataList(data);
      setTableHeaderData(tableHeaders);
      setLoaderOff(true);
    }
  }, [data]);

  useEffect(() => {
    console.log({ sortData });
    sortTableData();
  }, [sortData]);

  useEffect(() => {
    console.log({ filters });
    filterTableData();
  }, [filters]);

  useEffect(() => {
   const isPrime = typeof window !="undefined" &&  window.objUser && window.objUser.permissions && window.objUser.permissions.indexOf('subscribed') != -1; 
    setPrime(isPrime);
    window.addEventListener("scroll", handleScroll, { passive: true });
  }, [])

  const handleScroll = () => {
    const eleHeader: any = document.getElementById('header');
    const eleTable: any = document.getElementById('table');
    const heightDifference = (eleTable.offsetTop - eleHeader.offsetTop) - eleHeader.offsetHeight;
    const theadBottom: any = document.getElementById('thead')?.getBoundingClientRect().bottom;
    const tableBottom: any = document.getElementById('table')?.getBoundingClientRect().bottom;
    const heightDiff = tableBottom - theadBottom;

    setTopScrollHeight(heightDifference)
    setHideThead(heightDiff < 10);
    if (window.scrollY) {
      setHeaderSticky(window.scrollY);
    }
  }
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

  return (
    <>
      <div className={styles.tableWrapper} id="table">
        {!loaderOff ? <Loader/> : tableHeaderData.length > 0 && (
          <>
            <FixedTable
              tableHeaderData={tableHeaderData}
              tableDataList={tableDataList}
              scrollLeftPos={scrollLeftPos}
              headerSticky={headerSticky}
              topScrollHeight={topScrollHeight}
              handleSort={handleSort}
              sortData={sortData}
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
              handleFilterChange={handleFilterChange}
              isPrime={isPrime}
              hideThead={hideThead}
            />
          </>
        )}
      </div>
      {tableDataList.length == 0 || tableHeaderData.length == 0 ? (
        <Blocker type={tableDataList.length == 0 && tableHeaderData.length == 0 ? "noStocks" :"noDataFound"} />
      ) : (
        ""
      )}
    </>
  );
};
export default MarketTable;
