"use client";

import { useState, useEffect } from "react";
import MarketTabs from "@/components/MarketTabs";
import MarketTable from "@/components/MarketTable";
import { useStateContext } from "@/store/StateContext";
import { removeMultipleStockInWatchList } from "@/utils/utility";
import Blocker from "@/components/Blocker";
import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import styles from "./Watchlist.module.scss";
import {
  getCustomViewTable,
  getCustomViewsTab,
} from "@/utils/customViewAndTables";

const WatchListClient = () => {
  const [tabData, setTabData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableHeaderData, setTableHeaderData] = useState([]);
  const [activeViewId, setActiveViewId] = useState(null);
  const [_payload, setPayload] = useState({});

  const [showBlocker, setShowBlocker] = useState(false);
  const [apiSuccess, setAPISuccess] = useState(false);

  const [showTableCheckBox, setShowTableCheckBox] = useState(false);
  const [unFollowStocksList, setUnFollowStocksList] = useState([]);
  const { state } = useStateContext();
  const { isLogin, ssoid, isPrime } = state.login;
  const config = tableConfig["watchList"];
  const pageSummary = {};
  const onTabViewUpdate = async (viewId: any) => {
    if (viewId && viewId != activeViewId) {
      setAPISuccess(false);
      setActiveViewId(viewId);
      setPayload({ ..._payload, viewId: viewId });
    }
  };
  const onPersonalizeHandlerfun = async (newActiveId: any = "") => {
    const { tabData, activeViewId } = await getCustomViewsTab({
      type: "watchlist",
      ssoid: ssoid,
    });

    setTabData(tabData);
    if (newActiveId !== "") {
      onTabViewUpdate(newActiveId);
      setActiveViewId(newActiveId);
    } else {
      onTabViewUpdate(activeViewId);
    }
  };
  const updateTableData = async () => {
    const bodyParams = { ..._payload };
    const isprimeuser = !!isPrime ? isPrime : false;
    const { tableHeaderData, tableData, pageSummary, payload } =
      await getCustomViewTable(
        bodyParams,
        isprimeuser,
        ssoid,
        "watchListTable",
      );

    setTableData(tableData);
    setTableHeaderData(tableHeaderData);
    setAPISuccess(true);
  };

  const fetchWatchListData = async () => {
    const { tabData, activeViewId } = await getCustomViewsTab({
      type: "watchlist",
      ssoid: ssoid,
    });

    const bodyParams = { type: "STOCK", viewId: activeViewId, deviceId: "web" };
    const isprimeuser = !!isPrime ? isPrime : false;
    const { tableHeaderData, tableData, pageSummary, payload } =
      await getCustomViewTable(
        bodyParams,
        isprimeuser,
        ssoid,
        "watchListTable",
      );

    setTabData(tabData);
    setActiveViewId(activeViewId);
    setTableData(tableData);
    setTableHeaderData(tableHeaderData);
    setAPISuccess(true);
    setPayload(payload);
  };

  const removeMultipleStockInWathclist = async () => {
    if (unFollowStocksList.length > 0) {
      const userConfirm = confirm(
        "Are you sure you want to remove those stock list in your watchlist?",
      );
      const followData = {
        source: "1",
        userSettings: [...unFollowStocksList],
      };
      if (userConfirm) {
        const removeAllStock = await removeMultipleStockInWatchList(followData);
        if (
          removeAllStock &&
          removeAllStock.nextJsResponse &&
          removeAllStock.nextJsResponse.length > 0
        ) {
          setShowTableCheckBox(false);
          setUnFollowStocksList([]);
          onTabViewUpdate(activeViewId);
        } else if (removeAllStock.length > 0) {
          setShowTableCheckBox(false);
          setUnFollowStocksList([]);
          onTabViewUpdate(activeViewId);
        } else {
          alert("Some api error plesae check now");
        }
      }
    } else {
      setShowTableCheckBox(false);
    }
  };

  const multipleStockCollect = (e: any, companyId: any, assetType: any) => {
    const checkInput = e.target.checked;
    const data = {
      action: checkInput ? 0 : 1, // If checked, action is 0 (add), else 1 (remove)
      userSettingSubType: 11,
      msid: companyId,
      companytype: assetType,
      stype: 2,
    };
    if (checkInput) {
      setUnFollowStocksList((prevList): any => [...prevList, data]);
    } else {
      setUnFollowStocksList((prevList): any =>
        prevList.filter((item: any) => item.msid !== companyId),
      );
    }
  };

  const updateTableHanderFun = () => {
    onTabViewUpdate(activeViewId);
  };

  useEffect(() => {
    if (isLogin === true) {
      fetchWatchListData();
      setShowBlocker(false);
    } else if (isLogin === false) {
      setShowBlocker(true);
    }
  }, [isLogin]);

  useEffect(() => {
    if (!!_payload && Object.keys(_payload).length > 0) updateTableData();
  }, [_payload]);

  return (
    <>
      <h1 className={styles.heading}>Watchlist</h1>
      <p className={styles.desc}>
        My Watchlist: Check you stocks last &amp; recent price on The ET
        Markets. Get all the latest information about your stocks, prev. close,
        stocks price change, stocks percentage change, low &amp; High stocks and
        more.
      </p>
      <div className={styles.watclistContainer}>
        {showBlocker ? (
          <Blocker type="loginBlocker" />
        ) : (
          <>
            <MarketTabs
              data={tabData}
              activeViewId={activeViewId}
              tabsViewIdUpdate={onTabViewUpdate}
              tabsUpdateHandler={onTabViewUpdate}
              setShowTableCheckBox={setShowTableCheckBox}
              showTableCheckBox={showTableCheckBox}
              removeMultipleStockInWathclist={removeMultipleStockInWathclist}
              tabConfig={tabConfig["watchList"]}
              updateTableHander={updateTableHanderFun}
              onPersonalizeHandler={onPersonalizeHandlerfun}
            />
            <MarketTable
              data={tableData}
              tableHeaders={tableHeaderData}
              tabsViewIdUpdate={onTabViewUpdate}
              apiSuccess={apiSuccess}
              showTableCheckBox={showTableCheckBox}
              multipleStockCollect={multipleStockCollect}
              pageSummary={pageSummary}
              tableConfig={config}
            />
          </>
        )}
      </div>
    </>
  );
};

export default WatchListClient;
