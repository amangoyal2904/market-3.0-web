"use client";

import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import MarketTable from "../../MarketTable";
import { useStateContext } from "@/store/StateContext";
import tableConfig from "@/utils/tableConfig.json";
import ViewAllCta from "../ViewAllCta";

const EarningsTable = ({ data, processingLoader, type = "" }: any) => {
  const [tableData, setTableData] = useState(data?.dataList || []);
  const [fallbackWebsocket, setFallbackWebsocket] = useState(false);
  const [activeItem, setActiveItem] = useState("stocks-earnings-home-page");
  const { state } = useStateContext();
  const { isPrime } = state.login;
  const { currentMarketStatus } = state.marketStatus;
  const config =
    type === "tablePage"
      ? tableConfig["stocksearningsWatchListPageTable"]
      : tableConfig["stocksearningsTable"];
  const tableHeaderData =
    (tableData && tableData.length && tableData[0] && tableData[0]?.data) || [];

  useEffect(() => {
    setTableData(data?.dataList || []);
  }, [data]);
  return (
    <>
      <MarketTable
        highlightLtp={!!currentMarketStatus && currentMarketStatus != "CLOSED"}
        data={tableData}
        tableHeaders={tableHeaderData}
        tableConfig={config}
        isprimeuser={isPrime}
        processingLoader={processingLoader}
        l1NavTracking="Markets"
        l2NavTracking="Stocks/earnings"
        l3NavTracking={activeItem}
        setFallbackWebsocket={setFallbackWebsocket}
      />
      {tableData && tableData.length > 0 ? (
        <ViewAllCta
          text="View all Upcoming Calendar"
          urlInternal="yes"
          url="/markets/stocks/upcoming-results"
        />
      ) : (
        ""
      )}
    </>
  );
};

export default EarningsTable;
