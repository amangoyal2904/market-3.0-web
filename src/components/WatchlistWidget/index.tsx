"use client";
import { useState, useEffect, useRef } from "react";
import MarketTable from "../MarketTable";
import { fetchTabsData, fetchTableData } from "@/utils/utility";
import { useStateContext } from "../../store/StateContext";
import tableConfig from "../../utils/tableConfig.json";
import Blocker from "../Blocker";
import ViewAllLink from "../ViewAllLink";
import HeadingHome from "../ViewAllLink/HeadingHome";
import refeshConfig from "@/utils/refreshConfig.json";
import useIntervalApiCall from "@/utils/useIntervalApiCall";

const WatchListWidget = () => {
  const watchlistRef = useRef<HTMLDivElement>(null);
  const [showBlocker, setShowBlocker] = useState(true);
  const [apiSuccess, setAPISuccess] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const { state } = useStateContext();
  const { isLogin, isPrime } = state.login;
  const { currentMarketStatus } = state.marketStatus;
  const config = tableConfig["watchListWidget"];
  const [fallbackWebsocket, setFallbackWebsocket] = useState(false);

  const fetchWatchListData = async (activeViewId: any = "") => {
    const res = await fetchTabsData();
    const viewId = activeViewId || res[0].viewId;
    fetchWatchListTableAPI(viewId);
  };

  const fetchWatchListTableAPI = async (viewId: any) => {
    const params = {
      pagesize: 10,
      pageno: 0,
    };
    const res = await fetchTableData(viewId, params);
    if (res.message == "success") {
      setTableData(res.dataList);
      setAPISuccess(true);
    }
  };

  useIntervalApiCall(
    () => {
      if (
        currentMarketStatus === "LIVE" &&
        isLogin === true &&
        !!fallbackWebsocket
      )
        fetchWatchListData();
    },
    refeshConfig.marketstats,
    [isLogin, isPrime, currentMarketStatus, fallbackWebsocket],
    watchlistRef,
  );

  useEffect(() => {
    if (isLogin === true) {
      fetchWatchListData();
      setShowBlocker(false);
    } else if (isLogin === false) {
      setShowBlocker(true);
    }
  }, [isLogin, isPrime]);

  const tableHeaderData =
    (tableData && tableData.length && tableData[0] && tableData[0]?.data) || [];

  return (
    <div className="sectionWrapper" ref={watchlistRef}>
      <HeadingHome title="My Watchlist" url="/watchlist" />
      {showBlocker ? (
        <Blocker type="loginBlocker" />
      ) : (
        <>
          <MarketTable
            data={tableData}
            tableHeaders={tableHeaderData}
            apiSuccess={apiSuccess}
            tableConfig={config}
            isprimeuser={isPrime}
            l1NavTracking="Markets"
            l2NavTracking="Watchlist Widget"
            setFallbackWebsocket={setFallbackWebsocket}
          />
          <ViewAllLink
            text="View All Stocks In Your Watchlist"
            link="/watchlist"
          />
        </>
      )}
    </div>
  );
};

export default WatchListWidget;
