"use client";
import { useState, useEffect } from "react";
import MarketTable from "../MarketTable";
import { fetchTabsData, fetchTableData } from "@/utils/utility";
import { useStateContext } from "../../store/StateContext";
import tableConfig from "../../utils/tableConfig.json";
import Blocker from "../Blocker";
import ViewAllLink from "../ViewAllLink";
import styles from "./WatchlistWidget.module.scss";
import Link from "next/link";

const WatchListWidget = () => {
  const [showBlocker, setShowBlocker] = useState(true);
  const [apiSuccess, setAPISuccess] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const { state } = useStateContext();
  const [pageSummary, setPageSummary] = useState(false);
  const { isLogin, userInfo, isPrime } = state.login;
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
      setPageSummary(res?.pageSummary);
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
    <div className="sectionWrapper">
      <h2 className="heading">
        <Link href="/watchlist" title="My Watchlist" target="_blank">
          My Watchlist
          <span className={`eticon_caret_right headingIcon`} />
        </Link>
      </h2>
      {showBlocker ? (
        <Blocker type="loginBlocker" />
      ) : (
        <>
          <MarketTable
            data={tableData}
            tableHeaders={tableHeaderData}
            apiSuccess={apiSuccess}
            tableConfig={config}
            // pageSummary={pageSummary}
            isprimeuser={isPrime}
            l1NavTracking="Markets"
            l2NavTracking="Watchlist Widget"
          />
          <ViewAllLink text="View All Watchlisted Stock" link="/watchlist" />
        </>
      )}
    </div>
  );
};

export default WatchListWidget;
