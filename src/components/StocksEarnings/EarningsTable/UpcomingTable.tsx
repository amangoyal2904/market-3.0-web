"use client";

import styles from "./styles.module.scss";
import { useState, useEffect, useCallback } from "react";
import MarketTable from "../../MarketTable";
import { useStateContext } from "@/store/StateContext";
import tableConfig from "@/utils/tableConfig.json";
import ViewAllCta from "../ViewAllCta";
import { getCookie, initSSOWidget } from "@/utils";
import { fetchViewTable } from "@/utils/utility";

const UpcomingTable = ({
  processingLoader,
  type = "",
  setProcessingLoader,
  tableData,
  tableHeaderData,
  payload,
  pageSummary,
  unixDateTime = new Date(),
  niftyFiftyDataUpdatePayload,
  tabDateTimeStorePayload,
}: any) => {
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHeaderData, setTableHeaderData] = useState(tableHeaderData);
  const [resetSort, setResetSort] = useState("");
  const [_payload, setPayload] = useState(payload);
  const [_pageSummary, setPageSummary] = useState(pageSummary);
  const [updateDateTime, setUpdateDateTime] = useState(unixDateTime);

  const [fallbackWebsocket, setFallbackWebsocket] = useState(false);
  const [activeItem, setActiveItem] = useState("stocks-earnings-home-page");
  const { state } = useStateContext();
  const { isPrime } = state.login;
  const { currentMarketStatus } = state.marketStatus;
  const _tableConfig = tableConfig["stocksearningsWatchListPageTable"];

  const updateTableData = async () => {
    const isPrimeUser = getCookie("isprimeuser") === "true";
    const ssoid = getCookie("ssoid");

    try {
      const responseData: any = await fetchViewTable(
        _payload,
        "UPCOMING_COMPANIES",
        isPrimeUser,
        ssoid,
      );

      if (responseData && Array.isArray(responseData.dataList)) {
        const {
          dataList,
          pageSummary = {},
          screenerDetail = {},
          unixDateTime = new Date().getTime(),
        } = responseData;

        const newTableData = dataList;
        const newTableHeaderData =
          newTableData.length > 0 && newTableData[0]?.data
            ? newTableData[0].data
            : [];

        setUpdateDateTime(unixDateTime);
        setTableData(newTableData);
        setTableHeaderData(newTableHeaderData);
        setPageSummary(pageSummary);

        if (newTableData.length === 0) {
          setUpdateDateTime(new Date().getTime());
          setTableData([]);
          setTableHeaderData([]);
          setPageSummary({});
        }
      }
    } catch (error) {
      console.error("Error fetching sector table data:", error);
      // Handle error appropriately if needed
    } finally {
      setProcessingLoader(false);
    }
  };
  const onPaginationChange = async (pageNumber: number) => {
    setProcessingLoader(true);
    setPayload({ ..._payload, pageno: pageNumber });
  };
  const onServerSideSort = useCallback(
    async (field: any) => {
      setProcessingLoader(true);
      setPayload((prevPayload: any) => {
        const sortConfig = prevPayload.sort;
        const isFieldSorted = sortConfig.find(
          (config: any) => config.field === field,
        );
        let newSortConfig;

        if (isFieldSorted) {
          newSortConfig = sortConfig.map((config: any) =>
            config.field === field
              ? { ...config, order: config.order === "ASC" ? "DESC" : "ASC" }
              : config,
          );
        } else {
          newSortConfig = [...sortConfig, { field, order: "DESC" }];
        }

        return { ...prevPayload, sort: newSortConfig };
      });
    },
    [_payload],
  );
  useEffect(() => {
    setProcessingLoader(true);
    updateTableData();
    //console.log("_payload", _payload);
  }, [_payload]);
  // useEffect(() => {
  //   setTableData(data?.dataList || []);
  // }, [data]);
  useEffect(() => {
    const newPayload: any = { ..._payload };
    if (newPayload.filterType === "index") {
      newPayload.filterValue =
        niftyFiftyDataUpdatePayload?.indexId !== 0
          ? [niftyFiftyDataUpdatePayload?.indexId]
          : [];
      setPayload(newPayload);
    }
  }, [niftyFiftyDataUpdatePayload]);
  useEffect(() => {
    if (tabDateTimeStorePayload && tabDateTimeStorePayload !== "") {
      const newPayload: any = { ..._payload };
      newPayload.date = tabDateTimeStorePayload;
      setPayload(newPayload);
    }
  }, [tabDateTimeStorePayload]);
  return (
    <>
      <MarketTable
        data={_tableData}
        highlightLtp={!!currentMarketStatus && currentMarketStatus != "CLOSED"}
        tableHeaders={_tableHeaderData}
        tabsViewIdUpdate={resetSort}
        pageSummary={_pageSummary}
        tableConfig={_tableConfig}
        handleSortServerSide={onServerSideSort}
        handlePageChange={onPaginationChange}
        processingLoader={processingLoader}
        isprimeuser={getCookie("isprimeuser") == "true" ? true : false}
        l1NavTracking="earningSector"
        l2NavTracking={""}
        l3NavTracking={"upcomingResultTable"}
        setUpdateDateTime={setUpdateDateTime}
        setFallbackWebsocket={setFallbackWebsocket}
        socketDataType="stock"
      />
    </>
  );
};

export default UpcomingTable;
