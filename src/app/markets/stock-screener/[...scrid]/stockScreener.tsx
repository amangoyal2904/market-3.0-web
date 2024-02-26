"use client";
import MarketTable from "@/components/MarketTable";
import MarketTabs from "@/components/MarketTabs";
import styles from "./stockScreener.module.scss";
import { useEffect, useState } from "react";
import { getParameterByName } from "@/utils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import useScreenerTab from "./useScreenerTab";
import useScreenerTable from "./useScreenerTable";
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
    console.log("viewId", viewId);
    // const pagesize = 100;
    // const pageno = 1;
    // const sort: any = [];
    // const activeViewId = viewId;
    // const {
    //   tableHeaderData,
    //   tableData,
    //   ivKey,
    //   screenerDetail,
    //   pageSummary,
    //   allowSortFields,
    // } = await useScreenerTable({
    //   scrid,
    //   sort,
    //   pagesize,
    //   pageno,
    //   activeViewId
    // });
    // console.log('___tableDataivKey',ivKey)
    // setActiveViewId(activeViewId);
    // setTableData(tableData);
    // setTableHeaderData(tableHeaderData);
    // setIvKey(ivKey);
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

  const filterDataChangeHander = async (id: any) => {
    const url = `${pathname}?${searchParams}`;
    const newUrl = updateOrAddParamToPath(url, "filter", id);
    router.push(newUrl, { scroll: false });
  };

  const dayFitlerHanlderChange = async (value: any, label: any) => {
    const url = `${pathname}?${searchParams}`;
    const newUrl = updateOrAddParamToPath(url, label, value);
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
    const { tabData, activeViewId } = await useScreenerTab();
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
