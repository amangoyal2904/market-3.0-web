"use client";
import React, { useState } from "react";
import BasicTabs from "../BasicTabs";
import MarketTable from "../MarketTable";
import tableConfig from "@/utils/tableConfig.json";
import { fetchTableData } from "./ApiCalls";
import ViewAllLink from "../ViewAllLink";

interface propsType {
  tabsData: any[];
  tableData: any[];
  activeViewId: any;
  type: string;
  linkClass: string;
}
function MarketDashBoard(props: propsType) {
  const {
    tabsData = [],
    tableData = [],
    activeViewId,
    type,
    linkClass,
  } = props || {};
  const [dashBoardTableData, setDashBoardTableData] = useState(tableData || []);
  const [duration, setDuration] = useState("1M");
  const [activeViewID, setActiveViewID] = useState(activeViewId);
  const [apiType, setApiType] = useState();
  const [niftyFilterData, setNiftyFilterData] = useState({
    name: "Nifty 50",
    id: 2369,
    selectedTab: "nse",
  });
  const filterDataChangeHandler = async (
    id: any,
    name: any,
    selectedTab: any,
  ) => {
    setNiftyFilterData({
      name,
      id,
      selectedTab,
    });
    const tableData = await fetchTableData(apiType, duration, id, activeViewID);
    setDashBoardTableData(tableData || []);
  };
  const dayFilterHandlerChange = async (value: any, label: any) => {
    const newDuration = value.toUpperCase();
    setDuration(newDuration);
    const tableData = await fetchTableData(
      apiType,
      newDuration,
      niftyFilterData.id,
      activeViewID,
    );
    setDashBoardTableData(tableData);
  };
  const config = tableConfig["marketDashboard"];
  const tabsViewIdUpdate = async (viewID: any, apiType: any) => {
    setApiType(apiType);
    setActiveViewID(viewID);
    const tableData = await fetchTableData(
      apiType,
      duration,
      niftyFilterData.id,
      viewID,
    );
    setDashBoardTableData(tableData);
  };

  const tableHeaderData =
    (tableData && tableData.length && tableData[0] && tableData[0]?.data) || [];
  return (
    <>
      <BasicTabs
        data={tabsData}
        activeViewId={activeViewId}
        type={type}
        showNiftyFilter={true}
        showDayFilter={true}
        tabsViewIdUpdate={tabsViewIdUpdate}
        filterDataChange={filterDataChangeHandler}
        niftyFilterData={niftyFilterData}
        dayFilterHandlerChange={dayFilterHandlerChange}
      />
      <MarketTable
        data={dashBoardTableData}
        tableHeaders={tableHeaderData}
        tableConfig={config}
      />
      {dashBoardTableData.length ? (
        <ViewAllLink text="View All Stocks" link="/watchlist" />
      ) : (
        ""
      )}
    </>
  );
}

export default MarketDashBoard;
