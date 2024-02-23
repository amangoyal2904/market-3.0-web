"use client";
import MarketTable from "@/components/MarketTable";
import MarketTabs from "@/components/MarketTabs";
import styles from "./stockScreener.module.scss";
import { useEffect, useState } from "react";
import { getParameterByName } from "@/utils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import useScreenerTab from "./useScreenerTab";
import { useStateContext } from "@/store/StateContext";
import { fetchIntradayTable, fetchTechnicalTable } from "@/utils/utility";
import AsideNavComponets from "./asideNav";
import QueryComponets from "./queryComponents";

const StocksScreener = ({
  l3Nav,
  metaData,
  tabData,
  activeViewId,
  tableHeaderData = [],
  tableData = [],
  ivKey = [],
  selectedFilter,
  tableConfig,
  tabConfig,
  scrid,
  screenerDetail,
}: any) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const l3NavType = searchParams.get("type");

  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo, ssoReady, isPrime } = state.login;
  const [_tabData, setTabData] = useState(tabData);
  const [_l3Nav, setL3Nav] = useState(l3Nav);
  const [_metaData, setMetaData] = useState(metaData);
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHeaderData, setTableHeaderData] = useState(tableHeaderData);
  const [_ivKey, setIvKey] = useState(ivKey);
  const [_activeViewId, setActiveViewId] = useState(activeViewId);
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const onSearchParamChange = async () => {
    setL3Nav(l3Nav);
    setMetaData(metaData);
    setActiveViewId(activeViewId);
    setTableData(tableData);
    setTableHeaderData(tableHeaderData);
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
  const runQueryHandlerFun = async (query: any) => {
    // const API_URL = `${(APIS_CONFIG as any)?.SCREENER?.getScreenerByScreenerId[APP_ENV]}`;
    const API_URL = `https://screener.indiatimes.com/screener/getScreenerByScreenerId`;
    const bodyparams = {
      queryCondition: query.trim(),
      filterValue: [],
      pageno: 1,
      pagesize: 25,
      screenerId: scrid,
    };

    const data = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyparams),
    });
    //return data.json()
    const resData = await data.json();
    console.log("query", query, _tabData);
    console.log("resData", resData);
    if (resData && resData.statusCode === 200) {
      alert("Success Query run");
      //setTabData([])
    } else {
      alert("Error : Incorrect Query");
    }
  };
  const TabsAndTableDataChangeHandler = async (tabIdActive: any) => {
    const type = getParameterByName("type");
    const { tabData, activeViewId } = await useScreenerTab({
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
      <div className={styles.container}>
        <aside className={styles.lhs}>
          <AsideNavComponets data={_l3Nav} activeId={scrid} />
        </aside>
        <div className={styles.rhs}>
          <MarketTabs
            data={_tabData}
            activeViewId={_activeViewId}
            tabsViewIdUpdate={onTabViewUpdate}
            filterDataChange={filterDataChangeHander}
            niftyFilterData={niftyFilterData}
            dayFitlerHanlderChange={dayFitlerHanlderChange}
            tabsUpdateHandler={TabsAndTableDataChangeHandler}
            tabConfig={tabConfig}
            runQueryhandler={runQueryHandlerFun}
          />
          <MarketTable
            data={_tableData}
            tableHeaders={_tableHeaderData}
            ivKey={_ivKey}
            tableConfig={tableConfig}
          />
          <div className="">
            <QueryComponets data={screenerDetail} />
          </div>
        </div>
      </div>
    </>
  );
};

export default StocksScreener;
