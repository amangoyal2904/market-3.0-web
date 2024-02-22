"use client";
import { useState, useEffect } from "react";
import MarketTable from "../../components/MarketTable";
import { fetchTabsData, fetchTableData } from "@/utils/utility";
import { useStateContext } from "../../store/StateContext";
import tableConfig from "../../utils/tableConfig.json";
import Blocker from "../Blocker";

const WatchlistWidget = () => {
  const [showBlocker, setShowBlocker] = useState(false);
  const [apiSuccess, setAPISuccess] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const { state } = useStateContext();
  const { isLogin, userInfo } = state.login;
  const config = tableConfig["watchListWidget"];

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

  useEffect(() => {
    if (isLogin === true) {
      fetchWatchListData();
      setShowBlocker(false);
    } else if (isLogin === false) {
      setShowBlocker(true);
    }
  }, [isLogin]);
  const tableHeaderData =
    (tableData && tableData.length && tableData[0] && tableData[0]?.data) || [];

  return (
    <>
      <h1 className="heading">My Watchlist</h1>
      {showBlocker ? (
        <Blocker type="loginBlocker" />
      ) : (
        <MarketTable
          data={tableData}
          tableHeaders={tableHeaderData}
          apiSuccess={apiSuccess}
          tableConfig={config}
        />
      )}
    </>
  );
};

export default WatchlistWidget;
