"use client";
import MarketStatsNav from "@/components/MarketStatsNav";
import MarketTable from "@/components/MarketTable";
import LeftMenuTabs from "@/components/MarketTabs/MenuTabs";
import MarketFiltersTab from "@/components/MarketTabs/MarketFiltersTab";
import styles from "./Marketstats.module.scss";
import { useEffect, useState } from "react";
import { getCookie, getParameterByName } from "@/utils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useStateContext } from "@/store/StateContext";
import {
  fetchViewTable,
  getSelectedFilter,
  updateOrAddParamToPath,
} from "@/utils/utility";
import refeshConfig from "@/utils/refreshConfig.json";
import { getCustomViewsTab } from "@/utils/customViewAndTables";
import TechincalOperands from "@/components/TechincalOperands";
import { getMarketStatsNav } from "@/utils/marketstats";

const MarketStats = ({
  l3Nav = [],
  metaData = {},
  tabData = [],
  activeViewId = null,
  tableHeaderData = [],
  tableData = [],
  pageSummary = {},
  selectedFilter = {},
  isTechnical = false,
  technicalCategory,
  tableConfig = {},
  tabConfig = {},
  payload = {},
  ssoid = null,
  isprimeuser = false,
}: any) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const l3NavType = searchParams.get("type");
  const [dayFilterData, setDayFilterData] = useState({
    value: payload?.duration,
    label: payload?.duration,
  });
  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo, ssoReady, isPrime } = state.login;
  const [_payload, setPayload] = useState(payload);
  const [_tabData, setTabData] = useState(tabData);
  const [_l3Nav, setL3Nav] = useState(l3Nav);
  const [_metaData, setMetaData] = useState(metaData);
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHeaderData, setTableHeaderData] = useState(tableHeaderData);
  const [_technicalCategory, setTechnicalCategory] =
    useState(technicalCategory);
  const [_pageSummary, setPageSummary] = useState(pageSummary);
  const [_activeViewId, setActiveViewId] = useState(activeViewId);
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);

  const updateTableData = async () => {
    const responseData: any = await fetchViewTable(
      { ..._payload },
      isTechnical ? "movingAverages" : "marketStatsIntraday",
      getCookie("isprimeuser") ? true : false,
      getCookie("ssoid"),
    );
    const _pageSummary = !!responseData.pageSummary
      ? responseData.pageSummary
      : {};
    const _tableData = responseData?.dataList ? responseData.dataList : [];

    const _tableHeaderData =
      _tableData && _tableData.length && _tableData[0] && _tableData[0]?.data
        ? _tableData[0]?.data
        : [];
    setTableData(_tableData);
    setTableHeaderData(_tableHeaderData);
    setPageSummary(_pageSummary);
  };

  const updateL3NAV = async (intFilter: any, duration: any) => {
    const type = getParameterByName("type");
    const { l3Nav } = await getMarketStatsNav({
      type,
      intFilter,
      duration,
    });
    setL3Nav(l3Nav);
  };

  const onPaginationChange = async (pageNumber: number) => {
    setPayload({ ..._payload, pageno: pageNumber });
  };

  const onServerSideSort = async (field: any) => {
    let sortConfig = _payload.sort;
    const isFieldSorted = sortConfig.find(
      (config: any) => config.field === field,
    );
    let newSortConfig;

    if (isFieldSorted) {
      newSortConfig = sortConfig.map((config: any) =>
        config.field === field
          ? { ...config, order: config.order === "ASC" ? "DESC" : "ASC" }
          : config,
      );
    } else {
      newSortConfig = [...sortConfig, { field, order: "DESC" }];
    }
    setPayload({ ..._payload, sort: newSortConfig });
  };

  const onTabViewUpdate = async (viewId: any) => {
    setActiveViewId(viewId);
    setPayload({ ..._payload, viewId: viewId });
  };

  const filterDataChangeHander = async (id: any) => {
    const url = `${pathname}?${searchParams}`;
    const newUrl = updateOrAddParamToPath(url, "filter", id);
    const selectedFilter = await getSelectedFilter(id);
    setNiftyFilterData(selectedFilter);
    setPayload({ ..._payload, filterValue: [id] });
    updateL3NAV(id, _payload.duration);
    router.push(newUrl, { scroll: false });
  };

  const dayFitlerHanlderChange = async (value: any, label: any) => {
    const url = `${pathname}?${searchParams}`;
    const newDuration = value.toUpperCase();
    const newUrl = updateOrAddParamToPath(url, "duration", newDuration);
    setPayload({ ..._payload, duration: newDuration });
    updateL3NAV(_payload.filterValue[0], newDuration);
    router.push(newUrl, { scroll: false });
  };

  const TabsAndTableDataChangeHandler = async (tabIdActive: any) => {
    const type = getParameterByName("type");
    const { tabData } = await getCustomViewsTab({
      type,
    });
    setTabData(tabData);
    setActiveViewId(tabIdActive);
  };
  const onPersonalizeHandlerfun = async (newActiveId: any = "") => {
    const type = getParameterByName("type");
    const { tabData, activeViewId } = await getCustomViewsTab({
      type,
      ssoid: getCookie("ssoid"),
    });

    setTabData(tabData);
    if (newActiveId !== "") {
      onTabViewUpdate(newActiveId);
      setActiveViewId(newActiveId);
    } else {
      onTabViewUpdate(activeViewId);
    }
  };
  useEffect(() => {
    updateTableData();
    const intervalId = setInterval(() => {
      updateTableData();
    }, parseInt(refeshConfig.marketstats));
    return () => clearInterval(intervalId);
  }, [_payload]);

  return (
    <>
      <h1
        data-ssoid={ssoid}
        data-prime={isprimeuser}
        className={styles.heading}
      >
        {_metaData.title}
      </h1>
      <p className={styles.desc}>{_metaData.desc}</p>
      <div className={styles.marketstatsContainer}>
        <aside className={styles.lhs}>
          <MarketStatsNav leftNavResult={_l3Nav} type={l3NavType} />
        </aside>
        <div className={styles.rhs}>
          {isTechnical && (
            <TechincalOperands technicalCategory={technicalCategory} />
          )}
          <div className="tabsWrap">
            <LeftMenuTabs
              data={_tabData}
              activeViewId={_activeViewId}
              tabsViewIdUpdate={onTabViewUpdate}
            />
            <MarketFiltersTab
              data={_tabData}
              activeViewId={_activeViewId}
              tabsViewIdUpdate={onTabViewUpdate}
              filterDataChange={filterDataChangeHander}
              niftyFilterData={niftyFilterData}
              dayFitlerHanlderChange={dayFitlerHanlderChange}
              tabsUpdateHandler={TabsAndTableDataChangeHandler}
              tabConfig={tabConfig}
              dayFilterData={dayFilterData}
              setDayFilterData={setDayFilterData}
              onPersonalizeHandler={onPersonalizeHandlerfun}
            />
          </div>
          <MarketTable
            data={_tableData}
            tableHeaders={_tableHeaderData}
            pageSummary={_pageSummary}
            tableConfig={tableConfig}
            handleSortServerSide={onServerSideSort}
            handlePageChange={onPaginationChange}
          />
        </div>
      </div>
    </>
  );
};

export default MarketStats;
