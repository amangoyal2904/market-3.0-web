import React from "react";
import styles from "./MarketTable.module.scss";
import { getStockUrl } from "@/utils/utility";

const FixedTable = (props: any) => {
  const {
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
    showRemoveCheckbox = false,
    removeCheckBoxHandle
  } = props || {};

  return (
    <div
      id="fixedTable"
      className={styles.fixedWrapper}
      onScroll={scrollLeftPos}
    >
      <table className={styles.watchListTable}>
        <thead
          style={{
            transform: `translateY(${
              headerSticky > topScrollHeight
                ? headerSticky - topScrollHeight
                : 0
            }px)`,
          }}
          className={hideThead && tableDataList.length ? styles.hideThead : ""}
          id="thead"
        >
          <tr className={styles.leftThWrapper}>
            {tableHeaderData.map(
              (thead: any, index: number) =>
                index <= 2 && (
                  <th
                    onClick={() => {
                      handleSort(thead.keyId);
                    }}
                    className={`${thead.keyId == "name" ? styles.firstTh : styles.enableSort}`}
                    key={thead.keyId}
                  >
                    {thead.keyText}
                    {thead.keyId && (
                      <span className={`${styles.sortIcons}`}>
                        <span
                          className={`${
                            sortData[thead.keyId] == "asc" ? styles.asc : ""
                          } eticon_up_arrow`}
                        ></span>
                        <span
                          className={`${
                            sortData[thead.keyId] == "desc" ? styles.desc : ""
                          } eticon_down_arrow`}
                        ></span>
                      </span>
                    )}
                  </th>
                ),
            )}
          </tr>
          <tr>
            {tableHeaderData.map(
              (tdData: any, index: number) =>
                index <= 2 && (
                  <td key={index} className={styles.inputWrapper}>
                    <span className={styles.searchWrapper}>
                      <input
                        className={`${styles.filterInput} ${
                          tdData.keyId == "name" ? styles.filterInputFirst : ""
                        }`}
                        type="text"
                        name={tdData.keyId}
                        data-type={tdData.valueType}
                        value={filters[tdData.keyId] || ""}
                        onChange={handleFilterChange}
                        maxLength={20}
                        placeholder={
                          tdData.keyId == "name" ? "Search Value" : "> #"
                        }
                      ></input>
                      {tdData.keyId == "name" && (
                        <span className="eticon_search"></span>
                      )}
                    </span>
                  </td>
                ),
            )}
          </tr>
        </thead>
        {tableDataList.length > 0 ? (
          <tbody>
            <>
              {tableDataList.map((item: any, index: number) => (
                <tr key={index} className={styles.fixedTr}>
                  {item.data.map(
                    (tdData: any, index: number) =>
                      index <= 2 &&
                      (tdData.keyId == "name" ? (
                        <td key={index} className={styles.fixedTD}>
                          <div className={styles.tdColWrap}>
                            {
                              showRemoveCheckbox ? <div className={styles.formGroup}>
                              <label>
                                <input type="checkbox" onChange={(e)=>removeCheckBoxHandle(e, item.assetId)}/>
                              </label>
                            </div> : ""
                            }
                            <a
                              href={getStockUrl(
                                item.assetId,
                                item.assetSeoName,
                                item.assetType,
                              )}
                              target="_blank"
                              title={tdData.value}
                            >
                              {tdData.value}{" "}
                              {item.assetType != "" &&
                              item.assetType.toLowerCase() != "equity"
                                ? `(${item.assetType.toUpperCase()})`
                                : null}
                            </a>
                          </div>
                        </td>
                      ) : (
                        <td
                          className={`${styles.fixedTD} ${tdData.trend} ${
                            tdData.valueType == "number" ? "numberFonts" : ""
                          }`}
                          key={index}
                        >
                          {tdData.value.replaceAll(" ", "")}
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
                        </td>
                      )),
                  )}
                </tr>
              ))}{" "}
            </>
          </tbody>
        ) : (
          ""
        )}
      </table>
    </div>
  );
};
export default FixedTable;
