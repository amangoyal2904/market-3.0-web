"use client";
import MarketStatsNav from "@/components/MarketStatsNav";
import MarketTable from "@/components/MarketTable";
import MarketTabs from "@/components/MarketTabs";
import styles from "./Marketstats.module.scss";
import { useEffect, useState } from "react";
import { getParameterByName } from "@/utils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import useTechnicalTab from "./useTechnicalTab";
import { useStateContext } from "@/store/StateContext";
import { fetchIntradayTable, fetchTechnicalTable } from "@/utils/utility";
import TechnicalFilters from "./technicalFilters";

const Marketstats = ({
  l3Nav,
  metaData,
  tabData,
  activeViewId,
  tableHeaderData,
  tableData,
  ivKey,
  selectedFilter,
  isTechnical,
  technicalCategory,
  tableConfig,
  tabConfig,
  payload,
}: any) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const l3NavType = searchParams.get("type");

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
  const [_ivKey, setIvKey] = useState(ivKey);
  const [_activeViewId, setActiveViewId] = useState(activeViewId);
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);

  const onSearchParamChange = async () => {
    setL3Nav(l3Nav);
    setMetaData(metaData);
    setActiveViewId(activeViewId);
    setTableData(tableData);
    setTableHeaderData(tableHeaderData);
    setTechnicalCategory(technicalCategory);
    setIvKey(ivKey);
    setNiftyFilterData(selectedFilter);
  };

  const onTabViewUpdate = async (viewId: any) => {
    const type = searchParams.get("type");
    const duration = searchParams.get("duration");
    const intFilter = searchParams.get("filter");
    const filter = !!intFilter ? [intFilter] : [];
    const firstOperand = searchParams.get("firstoperand");
    const operationType = searchParams.get("operationtype");
    const secondOperand = searchParams.get("secondoperand");
    const pagesize = 100;
    const pageno = 1;
    const sort: any = [];
    const activeViewId = viewId;
    const responseData = pathname.includes("intraday")
      ? await fetchIntradayTable({
          activeViewId,
          type,
          duration,
          filter,
          sort,
          pagesize,
          pageno,
        })
      : await fetchTechnicalTable({
          activeViewId,
          filter,
          firstOperand,
          operationType,
          secondOperand,
          sort,
          pagesize,
          pageno,
        });

    const ivKey = responseData.iv;
    const tableData = responseData?.dataList
      ? responseData.dataList
      : responseData;

    const tableHeaderData =
      tableData && tableData.length && tableData[0] && tableData[0]?.data
        ? tableData[0]?.data
        : [];

    setActiveViewId(activeViewId);
    setTableData(tableData);
    setTableHeaderData(tableHeaderData);
    setIvKey(ivKey);
  };

  const updateOrAddParamToPath = (pathname: any, param: any, value: any) => {
    const url = new URL(window.location.origin + pathname);
    const searchParams = url.searchParams;

    if (value === 0) {
      searchParams.delete(param);
    } else if (searchParams.has(param)) {
      searchParams.set(param, value);
    } else {
      searchParams.append(param, value);
    }

    return url.pathname + "?" + searchParams.toString();
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
    const newUrl = updateOrAddParamToPath(url, "filter", id);
    router.push(newUrl, { scroll: false });
  };

  const dayFitlerHanlderChange = async (value: any, label: any) => {
    const url = `${pathname}?${searchParams}`;
    const newDuration = value.toUpperCase();
    const newUrl = url.replace(/duration=[^&]*/, "duration=" + newDuration);
    router.push(newUrl, { scroll: false });
  };

  const TabsAndTableDataChangeHandler = async (tabIdActive: any) => {
    const type = getParameterByName("type");
    const { tabData, activeViewId } = await useTechnicalTab({
      type,
    });
    setTabData(tabData);
    setActiveViewId(activeViewId);
  };

  useEffect(() => {
    onSearchParamChange();
  }, [searchParams]);
  return (
    <>
      <h1 className={styles.heading}>{_metaData.title}</h1>
      <p className={styles.desc}>{_metaData.desc}</p>
      <div className={styles.marketstatsContainer}>
        <aside className={styles.lhs}>
          <MarketStatsNav leftNavResult={_l3Nav} type={l3NavType} />
        </aside>
        <div className={styles.rhs}>
          {isTechnical && (
            <TechnicalFilters technicalCategory={technicalCategory} />
          )}
          <MarketTabs
            data={_tabData}
            activeViewId={_activeViewId}
            tabsViewIdUpdate={onTabViewUpdate}
            filterDataChange={filterDataChangeHander}
            niftyFilterData={niftyFilterData}
            dayFitlerHanlderChange={dayFitlerHanlderChange}
            tabsUpdateHandler={TabsAndTableDataChangeHandler}
            tabConfig={tabConfig}
          />
          <MarketTable
            data={_tableData}
            tableHeaders={_tableHeaderData}
            ivKey={_ivKey}
            tableConfig={tableConfig}
          />
        </div>
      </div>
    </>
  );
};

export default Marketstats;
