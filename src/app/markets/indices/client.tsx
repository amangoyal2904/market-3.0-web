"use client";
import MarketTable from "@/components/MarketTable";
import { useStateContext } from "@/store/StateContext";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./Indices.module.scss";
import { getAllIndices } from "@/utils/utility";
import refeshConfig from "@/utils/refreshConfig.json";
import { dateFormat } from "@/utils";
import MarketStatus from "@/components/MarketStatus";

const IndicesClient = ({
  tableHeaderData = [],
  tableData = [],
  exchange = "nse",
  tableConfig = {},
  unixDateTime = new Date(),
}: any) => {
  const { state } = useStateContext();
  const { isPrime } = state.login;
  const { currentMarketStatus } = state.marketStatus;
  const [updateDateTime, setUpdateDateTime] = useState(unixDateTime);
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHeaderData, setTableHeaderData] = useState(tableHeaderData);
  const [selectedExchange, setSelectedExchange] = useState(exchange);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [sortData, setSortData] = useState({ field: null, order: "DESC" });

  const onServerSideSort = useCallback(
    async (field: any) => {
      setProcessingLoader(true);
      setSortData((prevSortData) => {
        let newSortConfig;
        if (prevSortData.field === field) {
          newSortConfig = {
            field,
            order: prevSortData.order === "ASC" ? "DESC" : "ASC",
          };
        } else {
          newSortConfig = { field, order: "DESC" };
        }
        return newSortConfig;
      });
    },
    [sortData],
  );

  const nseBseMenuSelect = useCallback((e: any) => {
    setProcessingLoader(true);
    const selectedMenu = e.target.textContent.toLowerCase();
    setSelectedExchange(selectedMenu);
  }, []);

  const updateTableData = async () => {
    const { tableHeaderData, tableData, unixDateTime } = await getAllIndices(
      selectedExchange,
      sortData.field,
      sortData.order,
    );
    setUpdateDateTime(unixDateTime);
    setTableData(tableData);
    setTableHeaderData(tableHeaderData);
    setProcessingLoader(false);
  };

  useEffect(() => {
    setProcessingLoader(true);
    updateTableData();
    const intervalId = setInterval(() => {
      if (currentMarketStatus === "LIVE") {
        updateTableData();
      }
    }, refeshConfig.indicesListing);
    return () => clearInterval(intervalId);
  }, [selectedExchange, sortData, isPrime, currentMarketStatus]);

  return (
    <>
      <div className="dflex align-item-center">
        <h1 className={`${styles.heading} ${styles.withRBorder}`}>Indices</h1>
        <MarketStatus
          currentMarketStatus={currentMarketStatus}
          dateTime={updateDateTime}
          withSpace={true}
        />
      </div>
      <p className={styles.desc}>
        Explore live updates of Indian indices such as Nifty 50 and Sensex on
        our listing page. Get real-time data including the latest prices, daily
        highs/lows, advance/decline counts, and percentage changes. Click on any
        index for detailed technical charts and more information.
      </p>
      <ul className={styles.menuNseBse}>
        <li
          className={selectedExchange === "nse" ? styles.active : ""}
          onClick={nseBseMenuSelect}
        >
          nse
        </li>
        <li
          className={selectedExchange === "bse" ? styles.active : ""}
          onClick={nseBseMenuSelect}
        >
          bse
        </li>
      </ul>
      <div className={styles.marketstatsContainer}>
        <MarketTable
          data={_tableData}
          highlightLtp={
            !!currentMarketStatus && currentMarketStatus != "CLOSED"
          }
          tableHeaders={_tableHeaderData}
          tableConfig={tableConfig}
          handleSortServerSide={onServerSideSort}
          processingLoader={processingLoader}
          isprimeuser={isPrime}
        />
      </div>
    </>
  );
};

export default IndicesClient;
