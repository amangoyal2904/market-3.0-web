"use client";
import { useState, useEffect } from "react";
import MarketTable from "../MarketTable";
import { fetchTabsData, fetchTableData } from "@/utils/utility";
import { useStateContext } from "../../store/StateContext";
import tableConfig from "../../utils/tableConfig.json";
import Blocker from "../Blocker";
import ViewAllLink from "../ViewAllLink";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils/index";
import HeadingHome from "../ViewAllLink/HeadingHome";

const WatchListWidget = () => {
  const [showBlocker, setShowBlocker] = useState(true);
  const [apiSuccess, setAPISuccess] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const { state } = useStateContext();
  const { isLogin, isPrime } = state.login;
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
    <div className="sectionWrapper">
      <HeadingHome
        title="My Watchlist"
        url={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}watchlist`}
      />
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
