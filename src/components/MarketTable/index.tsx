import React, { useEffect, useState, useRef } from 'react';
import styles from './MarketTable.module.scss';
import { getStockUrl } from '@/utils/utility';
import { useIsInViewport } from '@/hooks/useInViewPort';
import NoDataFound from './NoDataFound';

const MarketTable = ({ data }: any) => {
  const [tableDataList, setTableDataList] = useState(data);
  const [filters, setFilters] = useState<any>({});
  const [sortData, setSortData] = useState<any>({});
  const [headerSticky, setHeaderSticky] = useState(0);
  const ref = useRef(null);
  const isInViewport = useIsInViewport(ref);
  const topScrollHeight = 163;
  function checkIfValidExpression(value: string) {
    return /^[<>=]\d+$/.test(value);
  }

  function handleFilterChange(e: any) {
    const { name, value } = e.target;
    if (name != 'name' && checkIfValidExpression(value.replaceAll(' ', ''))) {
      setFilters({ ...filters, [name]: value.replaceAll(' ', '') });
    } else if (name === 'name') {
      setFilters({ ...filters, [name]: value });
    } else if (value == '') {
      delete filters[name];
      setFilters({ ...filters });
    }
  }

  function handleSort(key: any) {
    if (Object.keys(sortData).includes(key)) {
      if (sortData[key] == 'asc') {
        setSortData({ ...sortData, [key]: 'desc' });
      } else {
        setSortData({ ...sortData, [key]: 'asc' });
      }
    } else {
      setSortData({ ...sortData, [key]: 'desc' });
    }
  }

  function filterTableData() {
    let filterData = data;
    if (Object.keys(filters).length) {
      Object.keys(filters).forEach((keyId) => {
        filterData = filterData.filter((item: any) => {
          const cellValue = filters[keyId];
          if (keyId == 'name') {
            return (
              item &&
              item.data.some(
                (x: { keyId: string; filterFormatValue: string }) =>
                  x.keyId == keyId &&
                  x.filterFormatValue
                    .toLowerCase()
                    .includes(cellValue.toLowerCase())
              )
            );
          } else {
            const [operator, comparisonValue] = cellValue
              .match(/([><=]+)(\d+)/)
              .slice(1);
            switch (operator) {
              case '>':
                return (
                  item &&
                  item.data.some(
                    (x: { keyId: string; filterFormatValue: any }) =>
                      x.keyId == keyId &&
                      parseFloat(x.filterFormatValue) >
                      parseFloat(comparisonValue)
                  )
                );
              case '<':
                return (
                  item &&
                  item.data.some(
                    (x: { keyId: string; filterFormatValue: any }) =>
                      x.keyId == keyId &&
                      parseFloat(x.filterFormatValue) <
                      parseFloat(comparisonValue)
                  )
                );
              case '=':
                return (
                  item &&
                  item.data.some(
                    (x: { keyId: string; filterFormatValue: any }) =>
                      x.keyId == keyId &&
                      parseFloat(x.filterFormatValue) ==
                      parseFloat(comparisonValue)
                  )
                );
              default:
                return true;
            }
          }
        });
        if (!!filterData) {
          console.log('@@Filter Data: ' + JSON.stringify(filterData));
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

          if (keyId != 'name') {
            valueA = parseFloat(valueA);
            valueB = parseFloat(valueB);
          }

          if (sortData[keyId] === 'asc') {
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
          } else if (sortData[keyId] === 'desc') {
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
    setTableDataList(data);
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
    window.addEventListener("scroll", handleScroll, { passive: true });
  }, [])

  const handleScroll = () => {
    if (window.scrollY) {
      setHeaderSticky(window.scrollY);
    }
  }
  const scrollRightPos = () => {
    const leftScroll: any = document.getElementById('fixedTable');
    const rightScroll: any = document.getElementById('scrollableTable');
    const rightScrollPos = rightScroll?.scrollTop;
    leftScroll.scrollTop = rightScrollPos;
  };
  const scrollLeftPos = () => {
    const leftScroll: any = document.getElementById('fixedTable');
    const rightScroll: any = document.getElementById('scrollableTable');
    const leftScrollPos = leftScroll.scrollTop;
    rightScroll.scrollTop = leftScrollPos;
  };

  console.log('@@--->', tableDataList);
  const tableHeaderData =
    (tableDataList &&
      tableDataList.length &&
      tableDataList[0] &&
      tableDataList[0]?.data) ||
    [];
  return (
    <>
      <div className={styles.tableWrapper} ref={ref}>
        {tableHeaderData.length > 0 ? (
          <>
            <div
              id="fixedTable"
              className={styles.fixedWrapper}
              onScroll={scrollLeftPos}
            >
              <table className={styles.watchListTable}>
                <thead
                  style={{
                    transform: `translateY(${headerSticky > topScrollHeight
                      ? headerSticky - topScrollHeight
                      : 0
                      }px)`,
                  }}
                >
                  <tr className={styles.leftThWrapper}>
                    {tableHeaderData.map(
                      (thead: any, index: number) =>
                        index <= 2 && (
                          <th
                            onClick={() => {
                              handleSort(thead.keyId);
                            }}
                            className={`${thead.keyId == "name" ? styles.firstTh : ""
                              }`}
                            key={thead.keyText}
                          >
                            {thead.keyText}
                            {thead.allowSort && (
                              <span
                                className={`${styles.sortIcons} eticon_ic_sorting`}
                              >
                                <span className="path1"></span>
                                <span className="path2"></span>
                              </span>
                            )}
                          </th>
                        )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {tableDataList.length > 0 ? (
                    <>
                      <tr
                        className={styles.stickyRow}
                        style={{
                          transform: `translateY(${headerSticky > topScrollHeight
                            ? headerSticky - (topScrollHeight + 1)
                            : 0
                            }px)`,
                        }}
                      >
                        {tableHeaderData.map(
                          (tdData: any, index: number) =>
                            index <= 2 && (
                              <td key={index} className={styles.inputWrapper}>
                                <span className={styles.searchWrapper}>
                                  <input className={`${styles.filterInput} ${tdData.keyId == "name"
                                      ? styles.filterInputFirst
                                      : ""
                                      }`}
                                    type="text"
                                    name={tdData.keyId}
                                    onChange={handleFilterChange}
                                    placeholder={tdData.keyId == "name" ? "Search Value" : "> #"}
                                    ></input>
                                  {tdData.keyId == "name" && <span className="eticon_ic_search"></span>}
                                </span>
                              </td>
                            )
                        )}
                      </tr>
                      {tableDataList.map((item: any, index: number) => (
                        <tr key={item.assetId} className={styles.fixedTr}>
                          {item.data.map(
                            (tdData: any, index: number) =>
                              index <= 2 &&
                              (tdData.keyId == "name" ? (
                                <td
                                  key={tdData.keyId}
                                  className={styles.fixedTD}
                                >
                                  <a
                                    href={getStockUrl(
                                      item.assetId,
                                      item.assetName,
                                      item.assetType
                                    )}
                                    target="_blank"
                                    title={tdData.value}
                                  >
                                    {tdData.value}
                                  </a>
                                </td>
                              ) : (
                                <td
                                  className={`${styles.fixedTD} ${tdData.trend}`}
                                  key={tdData.keyId}
                                >
                                  {tdData.value.replaceAll(" ", "")}
                                  {tdData.trend && (
                                    <span
                                      className={`${styles.arrowIcons} ${tdData.trend == "up"
                                        ? "eticon_ic_green_arrow"
                                        : tdData.trend == "down"
                                          ? "eticon_ic_red_arrow"
                                          : ""
                                        }`}
                                    />
                                  )}
                                </td>
                              ))

                            // <td className={styles.fixedTD} key={tdData.keyText}>{tdData.value}</td>
                          )}
                        </tr>
                      ))}{" "}
                    </>
                  ) : (
                    ""
                  )}
                </tbody>
              </table>
            </div>
            <div
              id="scrollableTable"
              className={styles.scrollableWrapper}
              onScroll={scrollRightPos}
            >
              <table className={styles.watchListTable}>
                <thead
                  style={{
                    transform: `translateY(${headerSticky > topScrollHeight
                      ? headerSticky - topScrollHeight
                      : 0
                      }px)`,
                  }}
                >
                  <tr>
                    {tableHeaderData.map(
                      (thead: any, index: number) =>
                        index > 2 && (
                          <th
                            onClick={() => {
                              handleSort(thead.keyId);
                            }}
                            key={thead.keyText}
                          >
                            {thead.keyText}
                            {thead.allowSort && (
                              <span
                                className={`${styles.sortIcons} eticon_ic_sorting`}
                              >
                                <span className="path1"></span>
                                <span className="path2"></span>
                              </span>
                            )}
                          </th>
                        )
                    )}
                  </tr>
                </thead>
                {tableDataList.length > 0 ? (
                  <tbody>
                    <tr
                      style={{
                        transform: `translateY(${headerSticky > topScrollHeight
                          ? headerSticky - (topScrollHeight + 1)
                          : 0
                          }px)`,
                      }}
                    >
                      {tableHeaderData.map(
                        (tdData: any, index: number) =>
                          index > 2 && (
                            <td key={index} className={styles.inputWrapper}>
                              <input
                                className={styles.filterInput}
                                type="text"
                                name={tdData.keyId}
                                onChange={handleFilterChange}
                                placeholder="> #"
                              ></input>
                            </td>
                          )
                      )}
                    </tr>
                    {tableDataList.map((item: any, index: number) => (
                      <tr key={item.assetId}>
                        {item.data.map(
                          (tdData: any, index: number) =>
                            index > 2 && (
                              <td className={tdData.trend} key={tdData.keyId}>
                                {tdData.value.replaceAll(" ", "")}
                                {tdData.trend && (
                                  <span
                                    className={`${styles.arrowIcons} ${tdData.trend == "up"
                                      ? "eticon_ic_green_arrow"
                                      : tdData.trend == "down"
                                        ? "eticon_ic_red_arrow"
                                        : ""
                                      }`}
                                  />
                                )}
                              </td>
                            )
                        )}
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  ""
                )}
              </table>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      {tableDataList.length == 0 || tableHeaderData.length == 0 ? (
        <NoDataFound message="No Data Found.." />
      ) : (
        ""
      )}
    </>
  );
};
export default MarketTable;
