"use client";
import MarketTabs from "../../components/MarketTabs/index";
import MarketTable from "../../components/MarketTable/index";
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "../../utils/index";
import { getParameterByName } from "../../utils/index";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const MarketStatsIntraDay = ({ tabsData, tableData, ivKey }: any) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
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
    selectedTab: "nse",
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
    const data = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendBodyDataParams),
    });
    // const data:any = await Service.post({
    //   url: apiUrl,
    //   params: {},
    //   payload:{
    //     body:sendBodyDataParams,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     cache: "no-store",
    //   },

    // });

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
    selectedTab: any,
  ) => {
    setNiftyFilterData({
      name,
      id,
      selectedTab,
    });

    const url = `${pathname}?${searchParams}`;
    let newUrl = "";
    if (id !== 0) {
      const newDuration = id.toLowerCase();
      newUrl = url.replace(/filter=[^&]*/, "filter=" + newDuration);
    } else {
      newUrl = url.replace(/filter=[^&]*/, "filter=" + 0);
      //newUrl = url.replace(/&?filter=[^&]*/, '');
    }
    router.push(newUrl, { scroll: false });
  };
  const dayFitlerHanlderChange = (value: any, label: any) => {
    const url = `${pathname}?${searchParams}`;
    const newDuration = value.toLowerCase();
    const newUrl = url.replace(/duration=[^&]*/, "duration=" + newDuration);
    router.push(newUrl, { scroll: false });
  };
  useEffect(() => {
    tabsViewIdUpdateFun(activeViewId);
  }, [searchParams]);
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
        dayFitlerHanlderChange={dayFitlerHanlderChange}
      />
      <MarketTable
        data={_tableData}
        tableHeaders={tableHeaderData}
        ivKey={ivKey}
      />
    </>
  );
};

export default MarketStatsIntraDay;
