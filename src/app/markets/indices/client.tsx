"use client";
import MarketTable from "@/components/MarketTable";
import { useStateContext } from "@/store/StateContext";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./Indices.module.scss";
import { getAllIndices } from "@/utils/utility";
import refeshConfig from "@/utils/refreshConfig.json";

const IndicesClient = ({
  tableHeaderData = [],
  tableData = [],
  exchange = "nse",
  tableConfig = {},
}: any) => {
  const { state } = useStateContext();
  const { isPrime } = state.login;
  const { currentMarketStatus } = state.marketStatus;
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHeaderData, setTableHeaderData] = useState(tableHeaderData);
  const [selectedExchange, setSelectedExchange] = useState(exchange);
  const [processingLoader, setProcessingLoader] = useState(false);

  const nseBseMenuSelect = useCallback((e: any) => {
    setProcessingLoader(true);
    const selectedMenu = e.target.textContent.toLowerCase();
    setSelectedExchange(selectedMenu);
  }, []);

  const updateTableData = async () => {
    const { tableHeaderData, tableData } =
      await getAllIndices(selectedExchange);
    setTableData(tableData);
    setTableHeaderData(tableHeaderData);
    setProcessingLoader(false);
  };

  useEffect(() => {
    updateTableData();
  }, [selectedExchange, isPrime]);

  useEffect(() => {
    if (currentMarketStatus === "LIVE") {
      const timeoutId = setTimeout(
        updateTableData,
        parseInt(refeshConfig.indicesListing),
      );
      return () => clearTimeout(timeoutId);
    }
  }, [currentMarketStatus]);

  return (
    <>
      <h1 className={styles.heading}>Indices</h1>
      <p className={styles.desc}>
        The NIFTY 50 is a benchmark Indian stock market index that represents
        the weighted average of 50 of the largest Indian companies listed on the
        National Stock Exchange. Nifty 50 is owned and managed by NSE Indices,
        which is a wholly owned subsidiary of the NSE Strategic Investment
        Corporation Limited.
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
          processingLoader={processingLoader}
          isprimeuser={isPrime}
        />
      </div>
    </>
  );
};

export default IndicesClient;
