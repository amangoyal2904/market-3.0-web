"use client";
import MarketTabs from "../../components/MarketTabs/index";
import MarketTable from "../../components/MarketTable/index";
import APIS_CONFIG from "../../network/api_config.json";
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

  const fetchTableData = async (
    type: any,
    duration: any,
    filter: any,
    activeViewId: any,
  ) => {
    // marketStatsIntradayNextJs
    // marketStatsIntraday
    const apiUrl = (APIS_CONFIG as any)?.marketStatsIntradayNextJs[
      "development"
    ];
    const bodyParams = {
      viewId: activeViewId,
      apiType: type,
      duration: duration,
      filterType: "index",
      filterValue: [parseFloat(filter)],
      sort: [{ field: "R1MonthReturn", order: "DESC" }],
      pagesize: 100,
      pageno: 1,
    };
    console.log(bodyParams, apiUrl);
    const data = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bodyParams, _authorization: "" }),
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

    const filterTableData =
      tableData &&
      tableData.resNextJsData &&
      tableData.resNextJsData.dataList &&
      tableData.resNextJsData.dataList.length > 0
        ? tableData.resNextJsData.dataList
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

    setTable_data(fullTableData);
    // tabs data here
    setTabs_data({ ...tabs_data, activeViewId: viewId });
  };
  //console.log('_____TabsData',tabs_data)
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
      />
      <MarketTable data={_tableData} tableHeaders={tableHeaderData} />
    </>
  );
};

export default MarketStatsIntraDay;
