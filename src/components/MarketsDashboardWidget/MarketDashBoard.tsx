"use client";
import React, { useEffect, useState } from "react";
import MarketTable from "../MarketTable";
import tableConfig from "@/utils/tableConfig.json";
import { fetchTableData } from "./ApiCalls";
import ViewAllLink from "../ViewAllLink";
import { useStateContext } from "@/store/StateContext";
import LeftMenuTabs from "../MarketTabs/MenuTabs";
import { fetchViewTable } from "@/utils/utility";
import { getCookie } from "@/utils";
import refeshConfig from "@/utils/refreshConfig.json";
interface propsType {
  tabsData: any[];
  tableData: any[];
  tableHeaderData: any[];
  activeViewId: any;
  selectedFilter: any;
  bodyparams: any;
}
function MarketDashBoard(props: propsType) {
  const {
    tabsData = [],
    tableData = [],
    tableHeaderData = [],
    activeViewId,
    selectedFilter = {},
    bodyparams = {},
  } = props || {};
  const { state } = useStateContext();
  const { isLogin, ssoid, isPrime } = state.login;
  const { currentMarketStatus } = state.marketStatus;
  const [dashBoardTableData, setDashBoardTableData] = useState(tableData || []);
  const [dashBoardHeaderData, setDashBoardHeaderData] = useState(
    tableHeaderData || [],
  );
  const [activeViewID, setActiveViewID] = useState(activeViewId);
  const [payload, setPayload] = useState(bodyparams);
  const [processingLoader, setProcessingLoader] = useState(false);
  const config = tableConfig["marketDashboard"];

  const getApiType = (viewId: any) => {
    const response = tabsData.find((item) => item.viewId === viewId);
    return response ? response.viewType : null;
  };

  const updateTableData = async () => {
    const responseData: any = await fetchViewTable(
      { ...payload },
      "MARKETSTATS_INTRADAY",
      getCookie("isprimeuser") == "true" ? true : false,
      getCookie("ssoid"),
    );
    if (!!responseData) {
      const _pageSummary = !!responseData.pageSummary
        ? responseData.pageSummary
        : {};
      const tableData = responseData?.dataList ? responseData.dataList : [];

      const tableHeaderData =
        tableData && tableData.length && tableData[0] && tableData[0]?.data
          ? tableData[0]?.data
          : [];
      setDashBoardTableData(tableData);
      setDashBoardHeaderData(tableHeaderData);
      setProcessingLoader(false);
    }
  };

  const onTabViewUpdate = async (viewId: any) => {
    const bodyParams = { ...payload };
    const apiType = getApiType(viewId);
    if (apiType != "gainers" && apiType != "losers") {
      delete bodyParams.duration;
    } else {
      if (!bodyParams.duration) {
        bodyParams.duration = "1D";
      }
    }

    if (apiType != "volume-shockers") {
      delete bodyParams.timespan;
    } else if (apiType == "volume-shockers" && !bodyParams.timespan) {
      bodyParams.timespan = "3D";
    }
    setProcessingLoader(true);
    setActiveViewID(viewId);
    setPayload({ ...bodyParams, viewId, apiType });
  };

  useEffect(() => {
    setProcessingLoader(true);
    updateTableData();
    const intervalId = setInterval(() => {
      if (currentMarketStatus === "LIVE") {
        updateTableData();
      }
    }, refeshConfig.marketstats);
    return () => clearInterval(intervalId);
  }, [payload, isPrime, currentMarketStatus]);

  return (
    <>
      <div className="tabsWrap">
        <LeftMenuTabs
          data={tabsData}
          activeViewId={activeViewID}
          tabsViewIdUpdate={onTabViewUpdate}
        />
      </div>
      <MarketTable
        data={dashBoardTableData}
        highlightLtp={!!currentMarketStatus && currentMarketStatus != "CLOSED"}
        tableHeaders={dashBoardHeaderData}
        tableConfig={config}
        isprimeuser={isPrime}
        processingLoader={processingLoader}
      />
      {dashBoardTableData.length ? (
        <ViewAllLink
          text="View All Stocks"
          link={`/stocks/marketstats?type=${getApiType(activeViewID)}&filter=2369`}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default MarketDashBoard;
