"use client";
import MarketStatsNav from "@/components/MarketStatsNav";
import MarketTable from "@/components/MarketTable";
import MarketTabs from "@/components/MarketTabs";
import styles from "./Marketstats.module.scss";
import { useEffect, useState } from "react";
import useTechnicalTable from "./useTechnicalTable";
import { getParameterByName } from "@/utils";
import tableConfig from "@/utils/tableConfig.json";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import useTechnicalTab from "./useTechnicalTab";

const Marketstats = ({
  l3Nav,
  tabData,
  activeViewId,
  tableHeaderData,
  tableData,
  ivKey,
}: any) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const config = tableConfig["marketStats"];
  const [_tabData, setTabData] = useState(tabData);
  const [_l3Nav, setL3Nav] = useState(l3Nav);
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHeaderData, setTableHeaderData] = useState(tableHeaderData);
  const [_ivKey, setIvKey] = useState(ivKey);
  const [_activeViewId, setActiveViewId] = useState(activeViewId);
  const [niftyFilterData, setNiftyFilterData] = useState({
    name: "Nifty 50",
    id: 2350,
    slectedTab: "nse",
  });

  const TabsViewIdUpdateFun = async (viewId: any) => {
    const activeViewId = viewId;
    const { tableHeaderData, tableData, ivKey } = await useTechnicalTable({
      activeViewId,
      pathname,
      searchParams,
    });
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
    TabsViewIdUpdateFun(activeViewId);
  }, [searchParams]);

  return (
    <>
      <div className={styles.marketstatsContainer}>
        <aside className={styles.lhs}>
          <MarketStatsNav leftNavResult={_l3Nav} />
        </aside>
        <div className={styles.rhs}>
          <MarketTabs
            data={_tabData}
            activeViewId={_activeViewId}
            showAddStock={false}
            showEditStock={false}
            showNiftyFilter={true}
            tabsViewIdUpdate={TabsViewIdUpdateFun}
            showDayFilter={false}
            filterDataChange={filterDataChangeHander}
            niftyFilterData={niftyFilterData}
            dayFitlerHanlderChange={dayFitlerHanlderChange}
            tabsUpdateHandler={TabsAndTableDataChangeHandler}
          />
          <MarketTable
            data={_tableData}
            tableHeaders={_tableHeaderData}
            ivKey={_ivKey}
            tableConfig={config}
          />
        </div>
      </div>
    </>
  );
};

export default Marketstats;
