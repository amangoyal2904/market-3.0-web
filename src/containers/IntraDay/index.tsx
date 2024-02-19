"use client";

import MarketTabs from "../../components/MarketTabs/index";
import MarketTable from "../../components/MarketTable/index";
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "../../utils/index";
import { getParameterByName } from "../../utils/index";
import { useState } from "react";
const MarketStatsIntraDay = ({ tabsData, tableData }: any) => {
  const [table_data, setTable_data] = useState(tableData);
  const [tabs_data, setTabs_data] = useState(tabsData);
  const tabData = tabs_data.data;
  const activeViewId = tabs_data.activeViewId;
  const showAddStock = tabs_data.showAddStock;
  const showEditStock = tabs_data.showEditStock;
  const showNiftyFilter = tabs_data.showNiftyFilter;
  const tableHeaderData = table_data.tableHeaders;
  const _tableData = table_data.data;
  const showDayFilter = tabs_data.showDayFilter;
  const [niftyFilterData, setNiftyFilterData] = useState({
    name: "nifty50",
    id: 2350,
    slectedTab: "nse",
  });

  const fetchTableData = async (
    type: any,
    duration: any,
    filter: any,
    activeViewId: any,
  ) => {
    const isLocalhost = window.location.origin.includes("localhost");
    const apiUrl = isLocalhost
      ? `${(APIS_CONFIG as any)?.marketStatsIntradayNextJs[APP_ENV]}`
      : `${(APIS_CONFIG as any)?.marketStatsIntraday[APP_ENV]}`;
    const fitlerArrayValue = filter ? [parseFloat(filter)] : [];
    const bodyParams = {
      viewId: activeViewId,
      apiType: type,
      duration: duration,
      filterType: "index",
      filterValue: fitlerArrayValue,
      // sort: [{ field: "R1MonthReturn", order: "DESC" }],
      // pagesize: 100,
      // pageno: 1,
    };
    let sendBodyDataParams = {};
    if (isLocalhost) {
      sendBodyDataParams = {
        bodyParams,
        _authorization: "",
      };
    } else {
      sendBodyDataParams = { ...bodyParams };
    }
    console.log(bodyParams, apiUrl);
    const data = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendBodyDataParams),
    });
    const res = await data.json();
    return res.dataList ? res.dataList : res;
  };
  const tabsViewIdUpdateFun = async (viewId: any) => {
    const type = getParameterByName("type");
    const duration = getParameterByName("duration");
    const filter = getParameterByName("filter");
    const activeViewId = viewId;
    const tableData = await fetchTableData(
      type,
      duration,
      filter,
      activeViewId,
    );
    tableTabDataSethandler(tableData, viewId);
  };
  const tableTabDataSethandler = async (tableData: any, viewId: any) => {
    const filterTableData =
      tableData &&
      tableData.resNextJsData &&
      tableData.resNextJsData.dataList &&
      tableData.resNextJsData.dataList.length > 0
        ? tableData.resNextJsData.dataList
        : tableData && tableData.length > 0
          ? tableData
          : [];
    const tableHeaderData =
      filterTableData &&
      filterTableData.length &&
      filterTableData[0] &&
      filterTableData[0]?.data
        ? filterTableData[0]?.data
        : [];
    const fullTableData = {
      data: filterTableData,
      tableHeaders: tableHeaderData,
    };
    //console.log('fullTableData ',fullTableData)
    setTable_data(fullTableData);
    // tabs data here
    setTabs_data({ ...tabs_data, activeViewId: viewId });
  };
  const filterDataChangeHander = async (
    id: any,
    name: any,
    slectedTab: any,
  ) => {
    const type = getParameterByName("type");
    const duration = getParameterByName("duration");
    const filter = id;
    const tableData = await fetchTableData(
      type,
      duration,
      filter,
      activeViewId,
    );
    tableTabDataSethandler(tableData, activeViewId);
    setNiftyFilterData({
      name,
      id,
      slectedTab,
    });
    const pathname = window.location.pathname;
    const search = window.location.search;
    let modifiedSearchString = search.replace(/(filter=)\d+/, `$1${id}`);
    history.pushState({}, "", modifiedSearchString);
  };
  //console.log('___setTable_data',_tableData)
  return (
    <>
      <MarketTabs
        data={tabData}
        activeViewId={activeViewId}
        showAddStock={showAddStock}
        showEditStock={showEditStock}
        showNiftyFilter={showNiftyFilter}
        tabsViewIdUpdate={tabsViewIdUpdateFun}
        showDayFilter={showDayFilter}
        filterDataChange={filterDataChangeHander}
        niftyFilterData={niftyFilterData}
      />
      <MarketTable data={_tableData} tableHeaders={tableHeaderData} />
    </>
  );
};

export default MarketStatsIntraDay;
