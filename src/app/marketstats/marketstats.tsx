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

const Marketstats = ({
  l3Nav,
  metaData,
  tabData,
  activeViewId,
  tableHeaderData,
  tableData,
  ivKey,
  tableConfig,
  tabConfig,
}: any) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo, ssoReady, isPrime } = state.login;
  const [_tabData, setTabData] = useState(tabData);
  const [_l3Nav, setL3Nav] = useState(l3Nav);
  const [_metaData, setMetaData] = useState(metaData);
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHeaderData, setTableHeaderData] = useState(tableHeaderData);
  const [_ivKey, setIvKey] = useState(ivKey);
  const [_activeViewId, setActiveViewId] = useState(activeViewId);
  const [niftyFilterData, setNiftyFilterData] = useState({
    name: "Nifty 50",
    id: 2350,
    slectedTab: "nse",
  });

  const onSearchParamChange = async () => {
    setL3Nav(l3Nav);
    setMetaData(metaData);
    setActiveViewId(activeViewId);
    setTableData(tableData);
    setTableHeaderData(tableHeaderData);
    setIvKey(ivKey);
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

  const filterDataChangeHander = async (
    id: any,
    name: any,
    slectedTab: any,
  ) => {
    setNiftyFilterData({
      name,
      id,
      slectedTab,
    });
    const url = `${pathname}?${searchParams}`;
    let newUrl = "";
    if (id !== 0) {
      const newFilter = id.toLowerCase();
      newUrl = url.replace(/filter=[^&]*/, "filter=" + newFilter);
    } else {
      newUrl = url.replace(/filter=[^&]*/, "filter=" + 0);
    }
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
          <MarketStatsNav leftNavResult={_l3Nav} />
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
