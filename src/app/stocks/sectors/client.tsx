"use client";
import MarketTable from "@/components/MarketTable";
import { useStateContext } from "@/store/StateContext";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./Sectors.module.scss";
import { getAllSectors } from "@/utils/utility";
import MarketStatus from "@/components/MarketStatus";

const SectorsClient = ({
  tableHeaderData = [],
  tableData = [],
  tableConfig = {},
  unixDateTime = new Date(),
}: any) => {
  const { state } = useStateContext();
  const { isPrime } = state.login;
  const { currentMarketStatus } = state.marketStatus;
  const [updateDateTime, setUpdateDateTime] = useState(unixDateTime);
  const [fallbackWebsocket, setFallbackWebsocket] = useState(false);
  const [_tableData, setTableData] = useState(tableData);
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
  const updateTableData = async () => {
    const { tableData, unixDateTime } = await getAllSectors(
      sortData.field,
      sortData.order,
    );
    if (!!tableData && tableData.length) {
      setUpdateDateTime(unixDateTime);
      setTableData(tableData);
    }
    setProcessingLoader(false);
  };

  useEffect(() => {
    if (sortData.field != null) {
      setProcessingLoader(true);
      updateTableData();
    }
  }, [sortData]);
  return (
    <>
      <div className="dflex align-item-center">
        <h1
          className={`${styles.heading} ${styles.withRBorder}`}
        >{`All Sectors - Indian Stock Market Sectors`}</h1>
        <MarketStatus
          currentMarketStatus={currentMarketStatus}
          dateTime={updateDateTime}
          withSpace={true}
        />
      </div>
      <p className={styles.desc}>
        Analyse the latest trend in major sectors by tracking the change in
        market-cap of individual sectors daily, quarterly, monthly, half-yearly
        and beyond. You can track it with the advance-decline graph of stocks
        plotted according to the change in market-cap contribution in their
        sector along with an absolute count of stocks advancing or declining.
      </p>
      <MarketTable
        data={_tableData}
        highlightLtp={false}
        tableHeaders={tableHeaderData}
        tableConfig={tableConfig}
        handleSortServerSide={onServerSideSort}
        processingLoader={processingLoader}
        isprimeuser={isPrime}
        l1NavTracking="Markets LIVE"
        l2NavTracking="Sectors"
        setUpdateDateTime={setUpdateDateTime}
        setFallbackWebsocket={setFallbackWebsocket}
      />
    </>
  );
};

export default SectorsClient;
