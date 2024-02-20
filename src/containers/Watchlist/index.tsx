"use client";

import { useState, useEffect } from "react";
import MarketTabs from "../../components/MarketTabs";
import MarketTable from "../../components/MarketTable";
import { fetchTabsData, fetchTableData } from "@/utils/utility";
import { useStateContext } from "../../store/StateContext";
import { removeMultipleStockInWatchList } from "../../utils/utility";
import Blocker from "../../components/Blocker";

const Watchlist = () => {
  const [wathcListTab, setWatchListTab] = useState([]);
  const [activeViewId, setActiveViewId] = useState(0);
  const [showBlocker, setShowBlocker] = useState(false);
  const [apiSuccess, setAPISuccess] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const [showTableCheckBox, setShowTableCheckBox] = useState(false);
  const [unFollowStocksList, setUnFollowStocksList] = useState([]);
  const [ivKey, setIvKey] = useState(false);
  const { state } = useStateContext();
  const { isLogin, userInfo } = state.login;

  const tabsViewIdUpdate = (viewId: any) => {
    if (viewId != activeViewId) {
      setActiveViewId(viewId);
      fetchWatchListTableAPI(viewId);
    }
  };

  const fetchWatchListData = async (activeViewId: any = "") => {
    const res = await fetchTabsData();
    const viewId = activeViewId || res[0].viewId;
    setActiveViewId(viewId);
    if (res.length) {
      setWatchListTab(res);
    }
    fetchWatchListTableAPI(viewId);
  };

  const fetchWatchListTableAPI = async (viewId: any) => {
    const res = await fetchTableData(viewId);
    if (res.message == "success") {
      setTableData(res.dataList);
      setIvKey(res?.iv);
      setAPISuccess(true);
    }
  };
  const tabsAndTableDataChangeHandler = (tabIdActive: any) => {
    fetchWatchListData(tabIdActive);
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
        //console.log("removeAllStock", removeAllStock);
        if (
          removeAllStock &&
          removeAllStock.nextJsResponse &&
          removeAllStock.nextJsResponse.length > 0
        ) {
          setShowTableCheckBox(false);
          setUnFollowStocksList([]);
          fetchWatchListTableAPI(activeViewId);
        } else if (removeAllStock.length > 0) {
          setShowTableCheckBox(false);
          setUnFollowStocksList([]);
          fetchWatchListTableAPI(activeViewId);
        } else {
          alert("Some api error plesae check now");
        }
      }
    } else {
      alert("please selected at least one stock");
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
  //console.log("____UnFollowStocksList", unFollowStocksList);
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
      {showBlocker ? (
        <Blocker type="loginBlocker" />
      ) : (
        <>
          <MarketTabs
            data={wathcListTab}
            activeViewId={activeViewId}
            tabsViewIdUpdate={tabsViewIdUpdate}
            tabsUpdateHandler={tabsAndTableDataChangeHandler}
            setShowTableCheckBox={setShowTableCheckBox}
            showTableCheckBox={showTableCheckBox}
            removeMultipleStockInWathclist={removeMultipleStockInWathclist}
          />
          <MarketTable
            data={tableData}
            tableHeaders={tableHeaderData}
            tabsViewIdUpdate={tabsViewIdUpdate}
            apiSuccess={apiSuccess}
            showTableCheckBox={showTableCheckBox}
            multipleStockCollect={multipleStockCollect}
            ivKey={ivKey}
          />
        </>
      )}
    </>
  );
};

export default Watchlist;
