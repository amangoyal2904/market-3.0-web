"use client";
import React, { useEffect, useState } from "react";
import MarketTable from "../MarketTable";
import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import ViewAllLink from "../ViewAllLink";
import { useStateContext } from "@/store/StateContext";
import LeftMenuTabs from "../MarketTabs/MenuTabs";
import {
  fetchSelectedFilter,
  fetchViewTable,
  generateIntradayDurations,
} from "@/utils/utility";
import { getCookie } from "@/utils";
import refeshConfig from "@/utils/refreshConfig.json";
import MarketFiltersTab from "../MarketTabs/MarketFiltersTab";
interface propsType {
  tabsData: any[];
  tableData: any[];
  tableHeaderData: any[];
  activeViewId: any;
  selectedFilter: any;
  bodyparams: any;
  durationOptions: any[];
  shortUrl: string;
  shortUrlMapping: any[];
}
function MarketDashBoard(props: propsType) {
  const {
    tabsData = [],
    tableData = [],
    tableHeaderData = [],
    activeViewId,
    selectedFilter = {},
    bodyparams = {},
    durationOptions = [],
    shortUrl = "",
    shortUrlMapping = [],
  } = props || {};
  const { state } = useStateContext();
  const { isLogin, ssoid, isPrime } = state.login;
  const { currentMarketStatus } = state.marketStatus;
  const [dashBoardTableData, setDashBoardTableData] = useState(tableData || []);
  const [dashBoardHeaderData, setDashBoardHeaderData] = useState(
    tableHeaderData || [],
  );
  const [shortURL, setShortURL] = useState(shortUrl);
  const [activeViewID, setActiveViewID] = useState(activeViewId);
  const [payload, setPayload] = useState(bodyparams);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [dayFilterData, setDayFilterData] = useState({
    value: "1D",
    label: "1 Day",
  });
  const [intradayDurationOptions, setIntradayDurationOptions] =
    useState(durationOptions);
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);

  const getApiType = async (viewId: any) => {
    const response = tabsData.find((item) => item.viewId === viewId);
    return response ? response.viewType : null;
  };

  const getSelectedDuration = (apiType: any, durationOptions: any) => {
    if (durationOptions.length) {
      let label =
        apiType == "hourly-gainers" || apiType == "hourly-losers"
          ? durationOptions[durationOptions.length - 1]?.label
          : durationOptions[0]?.label;
      let value =
        apiType == "hourly-gainers" || apiType == "hourly-losers"
          ? durationOptions[durationOptions.length - 1]?.value
          : durationOptions[0]?.value;
      return { value, label };
    }
    return { value: "", label: "" };
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
      updateShortUrl();
      setDashBoardTableData(tableData);
      setDashBoardHeaderData(tableHeaderData);
      setProcessingLoader(false);
    }
  };

  const filterDataChangeHander = async (id: any) => {
    setProcessingLoader(true);
    const filter =
      id !== undefined && !isNaN(Number(id))
        ? parseInt(id)
        : id !== undefined
          ? id
          : 0;
    const selectedFilter = await fetchSelectedFilter(filter);
    setNiftyFilterData(selectedFilter);
    setPayload({
      ...payload,
      filterValue: [filter],
      filterType:
        filter == undefined || !isNaN(Number(filter)) ? "index" : "marketcap",
    });
  };

  const dayFitlerHanlderChange = async (value: any, label: any) => {
    setProcessingLoader(true);
    const apiType = await getApiType(activeViewID);
    if (apiType == "gainers" || apiType == "losers") {
      const newDuration = value;
      setPayload({
        ...payload,
        duration: !!newDuration ? newDuration.toUpperCase() : null,
        pageno: 1,
      });
    } else if (
      apiType == "volume-shockers" ||
      apiType == "hourly-gainers" ||
      apiType == "hourly-losers"
    ) {
      const newTimespan = value;
      setPayload({
        ...payload,
        timespan: !!newTimespan ? newTimespan.toUpperCase() : null,
        pageno: 1,
      });
    }
  };

  const onTabViewUpdate = async (viewId: any) => {
    const bodyParams = { ...payload };
    delete bodyParams.duration;
    delete bodyParams.timespan;
    const apiType = await getApiType(viewId);
    const durationOptions = await generateIntradayDurations(apiType);
    setIntradayDurationOptions(durationOptions);
    const selectedDuration = await getSelectedDuration(
      apiType,
      durationOptions,
    );
    setDayFilterData(selectedDuration);
    if (apiType == "gainers" || apiType == "losers") {
      bodyParams.duration = selectedDuration.value;
    }

    if (
      (apiType == "volume-shockers" ||
        apiType == "hourly-gainers" ||
        apiType == "hourly-losers") &&
      selectedDuration.value != ""
    ) {
      bodyParams.timespan = selectedDuration.value;
    }
    setProcessingLoader(true);
    setActiveViewID(viewId);
    setPayload({ ...bodyParams, viewId, apiType });
  };

  const updateShortUrl = async () => {
    const pageUrl = `/stocks/marketstats?type=${await getApiType(activeViewID)}${payload.duration ? "&duration=" + payload.duration : ""}${payload.timespan ? "&timespan=" + payload.timespan : ""}&filter=2369`;
    const isExist: any = shortUrlMapping?.find(
      (item: any) => item.longURL == pageUrl,
    );
    const updatedUrl = isExist ? isExist.shortUrl : pageUrl;
    setShortURL(updatedUrl);
  };

  useEffect(() => {
    updateTableData();
  }, [payload, isPrime]);

  return (
    <>
      <div className="tabsWrap">
        <LeftMenuTabs
          data={tabsData}
          activeViewId={activeViewID}
          tabsViewIdUpdate={onTabViewUpdate}
        />
        <MarketFiltersTab
          data={tabsData}
          filterDataChange={filterDataChangeHander}
          niftyFilterData={niftyFilterData}
          dayFitlerHanlderChange={dayFitlerHanlderChange}
          tabConfig={tabConfig["marketDashboard"]}
          dayFilterData={dayFilterData}
          setDayFilterData={setDayFilterData}
          intradayDurationOptions={intradayDurationOptions}
        />
      </div>
      <MarketTable
        data={dashBoardTableData}
        highlightLtp={!!currentMarketStatus && currentMarketStatus != "CLOSED"}
        tableHeaders={dashBoardHeaderData}
        tableConfig={tableConfig["marketDashboard"]}
        isprimeuser={isPrime}
        processingLoader={processingLoader}
        l1NavTracking="Markets"
        l2NavTracking="Market Dashboard Widget"
      />
      {dashBoardTableData.length ? (
        <ViewAllLink text="View All Stocks" link={shortURL} />
      ) : (
        ""
      )}
    </>
  );
}

export default MarketDashBoard;
