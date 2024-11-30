"use client";
import MarketTable from "@/components/MarketTable";
import { useStateContext } from "@/store/StateContext";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./Indices.module.scss";
import { getAllIndices } from "@/utils/utility";
import refeshConfig from "@/utils/refreshConfig.json";
import MarketStatus from "@/components/MarketStatus";
import { trackingEvent } from "@/utils/ga";
import useIntervalApiCall from "@/utils/useIntervalApiCall";

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
    [sortData]
  );
  const updateTableData = async () => {
    const { tableData, unixDateTime } = await getAllIndices(
      exchange,
      sortData.field,
      sortData.order
    );
    if (!!tableData && tableData.length) {
      setUpdateDateTime(unixDateTime);
      setTableData(tableData);
    }
    setProcessingLoader(false);
  };

  useIntervalApiCall(
    () => {
      if (currentMarketStatus === "LIVE" && !!fallbackWebsocket)
        updateTableData();
    },
    refeshConfig.indicesListing,
    [sortData, isPrime, currentMarketStatus, fallbackWebsocket]
  );

  useEffect(() => {
    setProcessingLoader(true);
    updateTableData();
  }, [sortData, isPrime]);

  return (
    <>
      <div className="dflex align-item-center">
        <h1
          className={`${styles.heading} ${styles.withRBorder}`}
        >{`All Indices ${exchange.toUpperCase()} - Indian Stock Market Index`}</h1>
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
      <div className={styles.menuNseBse}>
        <a
          className={exchange === "nse" ? styles.active : ""}
          href="/markets/indices"
          onClick={() => {
            trackingEvent("et_push_event", {
              event_category: "mercury_engagement",
              event_action: "page_cta_click",
              event_label: "nse",
            });
          }}
          title="NSE"
        >
          NSE
        </a>
        <a
          className={exchange === "bse" ? styles.active : ""}
          href="/markets/indices/bse"
          onClick={() => {
            trackingEvent("et_push_event", {
              event_category: "mercury_engagement",
              event_action: "page_cta_click",
              event_label: "bse",
            });
          }}
          title="BSE"
        >
          BSE
        </a>
      </div>
      <MarketTable
        data={_tableData}
        highlightLtp={!!currentMarketStatus && currentMarketStatus != "CLOSED"}
        tableHeaders={tableHeaderData}
        tableConfig={tableConfig}
        handleSortServerSide={onServerSideSort}
        processingLoader={processingLoader}
        isprimeuser={isPrime}
        l1NavTracking="Markets LIVE"
        l2NavTracking="Indices"
        l3NavTracking={exchange}
        setUpdateDateTime={setUpdateDateTime}
        setFallbackWebsocket={setFallbackWebsocket}
        socketDataType="index"
      />
    </>
  );
};

export default IndicesClient;
